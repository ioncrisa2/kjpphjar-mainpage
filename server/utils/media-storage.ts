import { constants as fsConstants, promises as fs } from 'node:fs'
import path from 'node:path'
import { createError } from 'h3'

export type PublicImageContentType = 'image/jpeg' | 'image/png' | 'image/webp'

export type AssetSource =
  | { buffer: Buffer }
  | { tempPath: string }

export interface StoreAssetInput {
  pathname: string
  contentType: PublicImageContentType
  source: AssetSource
}

export interface StoredAsset {
  provider: 'local'
  url: string
  pathname: string
}

const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

export function assertMediaStorageAvailable() {
  const configuredRoot = process.env.UPLOADS_DIR?.trim()
  if (process.env.NODE_ENV === 'production' && (!configuredRoot || !path.isAbsolute(configuredRoot))) {
    throw createError({
      statusCode: 503,
      statusMessage: 'UPLOADS_DIR absolut wajib dikonfigurasi untuk penyimpanan media production.',
    })
  }

  if (configuredRoot) {
    const resolvedRoot = path.resolve(configuredRoot)
    if (resolvedRoot === path.parse(resolvedRoot).root) {
      throw createError({
        statusCode: 503,
        statusMessage: 'UPLOADS_DIR tidak boleh menunjuk ke root filesystem.',
      })
    }
  }
}

export function getUploadsRoot() {
  assertMediaStorageAvailable()
  const configuredRoot = process.env.UPLOADS_DIR?.trim()
  return path.resolve(configuredRoot || path.join(process.cwd(), 'uploads'))
}

export function normalizeAssetPathname(value: string) {
  if (
    !value
    || value.startsWith('/')
    || value.includes('\\')
    || value.includes('\0')
    || value.includes('?')
    || value.includes('#')
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Lokasi media tidak valid.' })
  }

  const segments = value.split('/')
  if (
    segments.some((segment) => !segment || segment === '.' || segment === '..')
    || path.posix.normalize(value) !== value
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Lokasi media tidak valid.' })
  }

  const extension = path.posix.extname(value).toLowerCase()
  if (!ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    throw createError({ statusCode: 400, statusMessage: 'Ekstensi media tidak didukung.' })
  }

  return value
}

export function resolveLocalAssetPath(pathname: string) {
  const normalized = normalizeAssetPathname(pathname)
  const uploadsRoot = getUploadsRoot()
  const resolvedPath = path.resolve(uploadsRoot, ...normalized.split('/'))

  if (!resolvedPath.startsWith(`${uploadsRoot}${path.sep}`)) {
    throw createError({ statusCode: 400, statusMessage: 'Lokasi media tidak valid.' })
  }

  return resolvedPath
}

function isWithinRoot(root: string, candidate: string) {
  return candidate.startsWith(`${root}${path.sep}`)
}

export async function resolveExistingLocalAssetPath(pathname: string) {
  const candidate = resolveLocalAssetPath(pathname)
  try {
    const [realRoot, realCandidate] = await Promise.all([
      fs.realpath(getUploadsRoot()),
      fs.realpath(candidate),
    ])
    if (!isWithinRoot(realRoot, realCandidate)) {
      throw createError({ statusCode: 400, statusMessage: 'Lokasi media tidak valid.' })
    }
    return realCandidate
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      throw createError({ statusCode: 404, statusMessage: 'Media tidak ditemukan.' })
    }
    throw error
  }
}

async function removeTempFile(tempPath: string) {
  try {
    await fs.unlink(tempPath)
  } catch (error: any) {
    if (error?.code !== 'ENOENT') throw error
  }
}

export async function storeAsset(input: StoreAssetInput): Promise<StoredAsset> {
  assertMediaStorageAvailable()
  const pathname = normalizeAssetPathname(input.pathname)
  const sourceTempPath = 'tempPath' in input.source ? input.source.tempPath : null
  const sourceBuffer = 'buffer' in input.source ? input.source.buffer : null
  if (!sourceTempPath && !sourceBuffer) {
    throw createError({ statusCode: 400, statusMessage: 'Sumber media tidak valid.' })
  }

  try {
    const uploadsRoot = getUploadsRoot()
    const destination = resolveLocalAssetPath(pathname)
    const destinationDirectory = path.dirname(destination)
    await fs.mkdir(uploadsRoot, { recursive: true })
    await fs.mkdir(destinationDirectory, { recursive: true })

    const [realRoot, realDestinationDirectory] = await Promise.all([
      fs.realpath(uploadsRoot),
      fs.realpath(destinationDirectory),
    ])
    if (realDestinationDirectory !== realRoot && !isWithinRoot(realRoot, realDestinationDirectory)) {
      throw createError({ statusCode: 400, statusMessage: 'Lokasi media tidak valid.' })
    }
    const safeDestination = path.join(realDestinationDirectory, path.basename(destination))

    try {
      if (sourceTempPath) {
        await fs.copyFile(sourceTempPath, safeDestination, fsConstants.COPYFILE_EXCL)
      } else {
        await fs.writeFile(safeDestination, sourceBuffer!, { flag: 'wx' })
      }
    } catch (error: any) {
      if (error?.code === 'EEXIST') {
        throw createError({ statusCode: 409, statusMessage: 'Nama media sudah digunakan.' })
      }
      if (error?.code === 'EACCES' || error?.code === 'EPERM' || error?.code === 'EROFS') {
        throw createError({
          statusCode: 503,
          statusMessage: 'Direktori penyimpanan media tidak dapat ditulis.',
        })
      }
      throw error
    }

    return {
      provider: 'local',
      url: `/uploads/${pathname}`,
      pathname,
    }
  } catch (error: any) {
    if (error?.code === 'EACCES' || error?.code === 'EPERM' || error?.code === 'EROFS') {
      throw createError({
        statusCode: 503,
        statusMessage: 'Direktori penyimpanan media tidak dapat ditulis.',
      })
    }
    throw error
  } finally {
    if (sourceTempPath) await removeTempFile(sourceTempPath)
  }
}

function getLocalPathnameFromUrl(value: string) {
  if (!value.startsWith('/uploads/')) return null

  try {
    const url = new URL(value, 'http://local.invalid')
    if (url.origin !== 'http://local.invalid') return null
    const pathname = decodeURIComponent(url.pathname.slice('/uploads/'.length))
    return normalizeAssetPathname(pathname)
  } catch {
    return null
  }
}

export async function deleteAsset(assetUrl?: string | null): Promise<boolean> {
  if (!assetUrl) return false

  const localPathname = getLocalPathnameFromUrl(assetUrl)
  if (localPathname) {
    try {
      await fs.unlink(await resolveExistingLocalAssetPath(localPathname))
      return true
    } catch (error: any) {
      if (error?.statusCode === 404) return false
      throw error
    }
  }

  return false
}
