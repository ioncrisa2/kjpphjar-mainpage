import type { H3Event } from 'h3'
import { MAX_RESTORE_BYTES } from '~/types/settings'
import {
  mergeLogicalBackup,
  parseLogicalBackup,
  validateLogicalBackup,
} from '~/server/utils/database-backup'
import { requireAdmin } from '~/server/utils/require-admin'

async function readLimitedBody(event: H3Event) {
  const contentLength = Number(getRequestHeader(event, 'content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_RESTORE_BYTES) {
    throw createError({
      statusCode: 413,
      statusMessage: 'File backup melebihi batas 4 MB.',
    })
  }

  const chunks: Buffer[] = []
  let total = 0

  for await (const chunk of event.node.req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    total += buffer.length
    if (total > MAX_RESTORE_BYTES) {
      throw createError({
        statusCode: 413,
        statusMessage: 'File backup melebihi batas 4 MB.',
      })
    }
    chunks.push(buffer)
  }

  if (!chunks.length) {
    throw createError({ statusCode: 400, statusMessage: 'File backup kosong.' })
  }

  return Buffer.concat(chunks).toString('utf8').replace(/^\uFEFF/, '')
}

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const contentType = getRequestHeader(event, 'content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    throw createError({
      statusCode: 415,
      statusMessage: 'Restore hanya menerima file JSON hasil backup aplikasi.',
    })
  }

  const raw = await readLimitedBody(event)
  const backup = parseLogicalBackup(raw)
  const validated = await validateLogicalBackup(backup)
  const query = getQuery(event)
  const dryRun = query.dryRun !== 'false'

  const baseResponse = {
    success: true as const,
    dryRun,
    mode: 'merge' as const,
    backupCreatedAt: validated.createdAt.toISOString(),
    collections: validated.collections.map((entry) => entry.preview),
    totalDocuments: validated.totalDocuments,
    uploadNotice: validated.uploadNotice,
  }

  setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
  if (dryRun) return baseResponse

  if (getRequestHeader(event, 'x-restore-confirmation') !== 'MERGE') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Konfirmasi restore tidak valid. Jalankan preview terlebih dahulu.',
    })
  }

  const outcome = await mergeLogicalBackup(validated)
  return {
    ...baseResponse,
    restoredBy: admin.username,
    results: outcome.results,
    safetyMode: outcome.safetyMode,
    message: 'Data backup berhasil digabungkan tanpa menghapus data yang sudah ada.',
  }
})
