import { promises as fs } from 'node:fs'
import path from 'node:path'
import mongoose, { type ClientSession, type Types } from 'mongoose'
import {
  SETTINGS_BACKUP_FORMAT,
  SETTINGS_BACKUP_VERSION,
  MAX_RESTORE_BYTES,
  MAX_RESTORE_DOCUMENTS,
  type RestoreCollectionPreview,
} from '~/types/settings'
import { BACKUP_REGISTRY, getBackupRegistryByCollection } from '~/server/utils/backup-registry'
import { connectDB } from '~/server/utils/db'
import { invalidateSettingsCache } from '~/server/utils/settings'
import { BlogPost } from '~/server/models/BlogPost'
import { Category } from '~/server/models/Category'
import { getUploadsRoot } from '~/server/utils/media-storage'

const UPLOAD_BINARY_NOTICE =
  'Manifest hanya mencatat metadata file pada UPLOADS_DIR. Binary upload tidak disertakan atau dipulihkan.'

interface UploadManifestEntry {
  path: string
  size: number
  modifiedAt: Date
}

interface ParsedBackup {
  format: string
  version: number
  createdAt: Date
  collections: Record<string, unknown[]>
  uploads?: {
    binaryIncluded?: boolean
    notice?: string
    files?: UploadManifestEntry[]
  }
}

interface BackupDocument extends Record<string, unknown> {
  _id: Types.ObjectId
}

interface ValidatedCollection {
  collection: string
  model: (typeof BACKUP_REGISTRY)[number]['model']
  documents: BackupDocument[]
  preview: RestoreCollectionPreview
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function uniqueValueSignature(value: unknown): string {
  return mongoose.mongo.BSON.EJSON.stringify(value, { relaxed: false })
}

function chunkArray<T>(values: T[], size = 1_000): T[][] {
  const chunks: T[][] = []
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size))
  }
  return chunks
}

function castValuesWithoutAddingDefaults(input: unknown, normalized: unknown): unknown {
  if (Array.isArray(input)) {
    const normalizedItems = Array.isArray(normalized) ? normalized : []
    return input.map((item, index) =>
      castValuesWithoutAddingDefaults(item, normalizedItems[index]),
    )
  }

  if (isRecord(input)) {
    const normalizedRecord = isRecord(normalized) ? normalized : {}
    return Object.fromEntries(
      Object.keys(input).map((key) => [
        key,
        castValuesWithoutAddingDefaults(input[key], normalizedRecord[key]),
      ]),
    )
  }

  return normalized
}

function hasOwnPath(value: Record<string, unknown>, pathValue: string): boolean {
  let current: unknown = value
  for (const segment of pathValue.split('.')) {
    if (!isRecord(current) || !Object.prototype.hasOwnProperty.call(current, segment)) return false
    current = current[segment]
  }
  return true
}

function assertSafeObject(value: unknown, seen = new WeakSet<object>()) {
  if (!value || typeof value !== 'object') return
  if (seen.has(value as object)) return
  seen.add(value as object)

  if (Array.isArray(value)) {
    value.forEach((item) => assertSafeObject(item, seen))
    return
  }

  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) return

  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (key === '__proto__' || key === 'prototype' || key === 'constructor') {
      throw createError({ statusCode: 400, statusMessage: 'Backup mengandung key berbahaya.' })
    }
    assertSafeObject(child, seen)
  }
}

async function collectUploadManifest() {
  const root = getUploadsRoot()
  const files: UploadManifestEntry[] = []

  async function walk(directory: string) {
    let entries
    try {
      entries = await fs.readdir(directory, { withFileTypes: true })
    } catch (error: any) {
      if (error?.code === 'ENOENT') return
      throw error
    }

    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue
      const absolutePath = path.resolve(directory, entry.name)
      if (absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) continue

      if (entry.isDirectory()) {
        await walk(absolutePath)
        continue
      }
      if (!entry.isFile()) continue

      const stat = await fs.stat(absolutePath)
      files.push({
        path: path.relative(root, absolutePath).split(path.sep).join('/'),
        size: stat.size,
        modifiedAt: stat.mtime,
      })
    }
  }

  await walk(root)
  return files.sort((a, b) => a.path.localeCompare(b.path))
}

export async function createLogicalBackup() {
  await connectDB()
  let collections: Record<string, unknown[]> = {}
  let collectionMetadata: Array<{
    collection: string
    documents: number
    containsPersonalData: boolean
    note?: string
  }> = []

  const readCollections = async (session?: ClientSession) => {
    const nextCollections: Record<string, unknown[]> = {}
    const nextMetadata: typeof collectionMetadata = []
    let totalDocuments = 0

    for (const entry of BACKUP_REGISTRY) {
      const collection = entry.model.collection.collectionName
      let query = entry.model.find({}).lean()
      if (session) query = query.session(session)
      const documents = await query.exec()
      totalDocuments += documents.length
      if (totalDocuments > MAX_RESTORE_DOCUMENTS) {
        throw createError({
          statusCode: 413,
          statusMessage: `Backup melebihi batas ${MAX_RESTORE_DOCUMENTS.toLocaleString('id-ID')} dokumen.`,
        })
      }

      nextCollections[collection] = documents
      nextMetadata.push({
        collection,
        documents: documents.length,
        containsPersonalData: Boolean(entry.containsPersonalData),
        ...(entry.note ? { note: entry.note } : {}),
      })
    }

    collections = nextCollections
    collectionMetadata = nextMetadata
  }

  const usesSnapshot = await databaseSupportsTransactions()
  if (usesSnapshot) {
    const session = await mongoose.startSession()
    try {
      await session.withTransaction(async () => readCollections(session), {
        readConcern: { level: 'snapshot' },
      })
    } finally {
      await session.endSession()
    }
  } else {
    await readCollections()
  }

  const uploadFiles = await collectUploadManifest()
  const backup = {
    format: SETTINGS_BACKUP_FORMAT,
    version: SETTINGS_BACKUP_VERSION,
    createdAt: new Date(),
    app: {
      name: 'kjpphjar-cms',
      version: '1.0.0',
      exportType: 'logical-ejson',
      restoreMode: 'merge-only',
      consistency: usesSnapshot ? 'snapshot' : 'best-effort',
    },
    collectionMetadata,
    excludedCollections: [
      {
        collection: 'users',
        reason: 'Credential hashes sengaja tidak disertakan dalam backup melalui browser.',
      },
      {
        collection: 'analyticslogs',
        reason: 'Log analitik mentah bersifat sementara, memiliki TTL 90 hari, dan tidak disertakan dalam backup operasional.',
      },
      {
        collection: 'ratelimitbuckets',
        reason: 'Bucket rate limit bersifat sementara dan dibuat ulang otomatis.',
      },
    ],
    collections,
    uploads: {
      binaryIncluded: false,
      notice: UPLOAD_BINARY_NOTICE,
      files: uploadFiles,
    },
  }

  const serialized = mongoose.mongo.BSON.EJSON.stringify(backup, { relaxed: false })
  if (Buffer.byteLength(serialized) > MAX_RESTORE_BYTES) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Backup melebihi batas 4 MB. Gunakan backup native MongoDB untuk dataset ini.',
    })
  }

  return serialized
}

export function parseLogicalBackup(raw: string): ParsedBackup {
  let parsed: unknown
  try {
    // Relaxed parsing turns the numeric version marker back into a JavaScript
    // number while retaining BSON ObjectId and Date values used by documents.
    parsed = mongoose.mongo.BSON.EJSON.parse(raw, { relaxed: true })
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'File backup bukan Extended JSON yang valid.' })
  }

  assertSafeObject(parsed)
  if (!isRecord(parsed)) {
    throw createError({ statusCode: 400, statusMessage: 'Struktur backup tidak valid.' })
  }
  if (parsed.format !== SETTINGS_BACKUP_FORMAT || parsed.version !== SETTINGS_BACKUP_VERSION) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Format atau versi backup tidak didukung.',
    })
  }
  if (!(parsed.createdAt instanceof Date) || Number.isNaN(parsed.createdAt.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Metadata waktu backup tidak valid.' })
  }
  if (!isRecord(parsed.collections)) {
    throw createError({ statusCode: 400, statusMessage: 'Daftar koleksi backup tidak valid.' })
  }

  return parsed as unknown as ParsedBackup
}

export async function validateLogicalBackup(backup: ParsedBackup) {
  await connectDB()
  const registry = getBackupRegistryByCollection()
  const collectionNames = Object.keys(backup.collections)
  const unknownCollections = collectionNames.filter((name) => !registry.has(name))
  if (unknownCollections.length) {
    throw createError({
      statusCode: 400,
      statusMessage: `Koleksi tidak diizinkan: ${unknownCollections.join(', ')}`,
    })
  }

  const validated: ValidatedCollection[] = []
  let totalDocuments = 0

  for (const collection of collectionNames) {
    const entry = registry.get(collection)!
    const uniqueKeys = entry.uniqueKeys || []
    const inputDocuments = backup.collections[collection]
    if (!Array.isArray(inputDocuments)) {
      throw createError({ statusCode: 400, statusMessage: `Koleksi ${collection} harus berupa array.` })
    }

    totalDocuments += inputDocuments.length
    if (totalDocuments > MAX_RESTORE_DOCUMENTS) {
      throw createError({ statusCode: 413, statusMessage: 'Backup berisi terlalu banyak dokumen.' })
    }

    const documents: BackupDocument[] = []
    const ids: Types.ObjectId[] = []
    const seenIds = new Set<string>()
    const seenUniqueValues = new Map<string, Set<string>>()
    uniqueKeys.forEach((key) => seenUniqueValues.set(key, new Set()))

    for (let index = 0; index < inputDocuments.length; index += 1) {
      const input = inputDocuments[index]
      if (!isRecord(input) || !('_id' in input)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Dokumen ${index + 1} pada ${collection} tidak memiliki _id.`,
        })
      }

      const missingRequiredPath = entry.model.schema
        .requiredPaths()
        .find((requiredPath) => !hasOwnPath(input, requiredPath))
      if (missingRequiredPath) {
        throw createError({
          statusCode: 400,
          statusMessage: `Dokumen ${index + 1} pada ${collection} tidak memiliki field wajib ${missingRequiredPath}.`,
        })
      }

      let document
      try {
        document = new entry.model(input, undefined, { strict: 'throw' })
        await document.validate()
      } catch (error: any) {
        throw createError({
          statusCode: 400,
          statusMessage: `Dokumen ${index + 1} pada ${collection} tidak valid: ${error?.message || 'validation error'}`,
        })
      }

      const normalizedWithDefaults = document.toObject({ depopulate: true })
      const normalized = castValuesWithoutAddingDefaults(
        input,
        normalizedWithDefaults,
      ) as Record<string, unknown>
      if (!(normalized._id instanceof mongoose.Types.ObjectId)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Dokumen ${index + 1} pada ${collection} memiliki _id tidak valid.`,
        })
      }

      const backupDocument = normalized as BackupDocument
      const id = String(normalized._id)
      if (seenIds.has(id)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Koleksi ${collection} memiliki _id duplikat.`,
        })
      }
      seenIds.add(id)

      for (const key of uniqueKeys) {
        const value = backupDocument[key]
        if (value === undefined || value === null) continue

        const signature = uniqueValueSignature(value)
        const values = seenUniqueValues.get(key)!
        if (values.has(signature)) {
          throw createError({
            statusCode: 400,
            statusMessage: `Koleksi ${collection} memiliki nilai ${key} duplikat.`,
          })
        }
        values.add(signature)
      }

      ids.push(backupDocument._id)
      documents.push(backupDocument)
    }

    // A merge is keyed by _id. If the target database already has the same
    // logical unique key under another _id, an upsert would fail after earlier
    // collections may already have been written. Reject the whole backup during
    // preview so restore never begins in that ambiguous state.
    if (documents.length && uniqueKeys.length) {
      const targetMaps = new Map<string, Map<string, string>>()
      for (const key of uniqueKeys) {
        const targetValues = new Map<string, string>()
        const values = documents
          .map((document) => document[key])
          .filter((value) => value !== undefined && value !== null)

        for (const batch of chunkArray(values)) {
          const targets = (await entry.model
            .find({ [key]: { $in: batch } })
            .select(`_id ${key}`)
            .lean()) as unknown as Record<string, unknown>[]

          for (const target of targets) {
            const value = target[key]
            if (value === undefined || value === null) continue
            targetValues.set(uniqueValueSignature(value), String(target._id))
          }
        }
        targetMaps.set(key, targetValues)
      }

      for (const document of documents) {
        const incomingId = String(document._id)
        for (const key of uniqueKeys) {
          const value = document[key]
          if (value === undefined || value === null) continue
          const targetId = targetMaps.get(key)?.get(uniqueValueSignature(value))
          if (targetId && targetId !== incomingId) {
            throw createError({
              statusCode: 409,
              statusMessage: `Restore dibatalkan: ${collection}.${key} sudah dipakai oleh dokumen dengan _id berbeda.`,
            })
          }
        }
      }
    }

    let existing = 0
    for (const batch of chunkArray(ids)) {
      existing += await entry.model.countDocuments({ _id: { $in: batch } })
    }

    validated.push({
      collection,
      model: entry.model,
      documents,
      preview: {
        collection,
        incoming: documents.length,
        existing,
        inserts: documents.length - existing,
        updates: existing,
      },
    })
  }

  const blogEntry = validated.find(
    (entry) => entry.collection === BlogPost.collection.collectionName,
  )
  if (blogEntry) {
    const categoryEntry = validated.find(
      (entry) => entry.collection === Category.collection.collectionName,
    )
    const incomingCategoryIds = new Set(
      (categoryEntry?.documents || []).map((document) => String(document._id)),
    )
    const referencedCategoryIds = [
      ...new Set(
        blogEntry.documents
          .map((document) => document.categoryId)
          .filter((value) => value instanceof mongoose.Types.ObjectId)
          .map((value) => String(value)),
      ),
    ]
    const targetCandidates = referencedCategoryIds.filter((id) => !incomingCategoryIds.has(id))
    const existingTargetIds = new Set<string>()

    for (const batch of chunkArray(targetCandidates)) {
      const existingCategories = await Category.find({ _id: { $in: batch } }).select('_id').lean()
      existingCategories.forEach((category) => existingTargetIds.add(String(category._id)))
    }

    const danglingCategory = targetCandidates.find((id) => !existingTargetIds.has(id))
    if (danglingCategory) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Backup blog memiliki referensi kategori yang tidak tersedia.',
      })
    }
  }

  return {
    createdAt: backup.createdAt,
    collections: validated,
    totalDocuments,
    uploadNotice: backup.uploads?.notice || UPLOAD_BINARY_NOTICE,
  }
}

interface MergeCollectionResult {
  collection: string
  incoming: number
  matched: number
  modified: number
  upserted: number
}

async function writeValidatedCollections(
  validated: Awaited<ReturnType<typeof validateLogicalBackup>>,
  session?: ClientSession,
) {
  const results: MergeCollectionResult[] = []

  for (const entry of validated.collections) {
    if (!entry.documents.length) {
      results.push({ collection: entry.collection, incoming: 0, matched: 0, modified: 0, upserted: 0 })
      continue
    }

    const operations = entry.documents.map((document) => ({
      replaceOne: {
        filter: { _id: document._id },
        replacement: document,
        upsert: true,
      },
    }))

    const result = await entry.model.collection.bulkWrite(operations as any, {
      ordered: true,
      ...(session ? { session } : {}),
    })
    results.push({
      collection: entry.collection,
      incoming: entry.documents.length,
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
    })
  }

  return results
}

async function databaseSupportsTransactions() {
  const database = mongoose.connection.db
  if (!database) return false

  try {
    const hello = await database.admin().command({ hello: 1 })
    return Boolean(hello.setName || hello.msg === 'isdbgrid')
  } catch {
    return false
  }
}

export async function mergeLogicalBackup(
  validated: Awaited<ReturnType<typeof validateLogicalBackup>>
) {
  if (!(await databaseSupportsTransactions())) {
    throw createError({
      statusCode: 503,
      statusMessage:
        'Restore commit membutuhkan MongoDB replica set atau cluster yang mendukung transaction.',
    })
  }

  const session = await mongoose.startSession()
  try {
    let results: MergeCollectionResult[] = []
    await session.withTransaction(async () => {
      results = await writeValidatedCollections(validated, session)
    })
    invalidateSettingsCache()
    return { results, safetyMode: 'transaction' as const }
  } finally {
    await session.endSession()
  }
}
