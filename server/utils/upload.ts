import multer from 'multer'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { randomUUID } from 'node:crypto'
import { createError, type H3Event } from 'h3'
import { assertMediaStorageAvailable } from '~/server/utils/media-storage'

export const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxSize = 4 * 1024 * 1024
const maxMultipartBodySize = 4_500_000

const extensionByMimeType: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Uploaded bytes are untrusted. Stage them outside the application tree,
    // then validate and re-encode with Sharp before making them public.
    const stagingPath = path.join(os.tmpdir(), 'kjpphjar-media-staging')
    if (!fs.existsSync(stagingPath)) {
      fs.mkdirSync(stagingPath, { recursive: true })
    }
    cb(null, stagingPath)
  },
  filename: (req, file, cb) => {
    // Never trust the original extension. A spoofed SVG extension could be
    // served as active same-origin content even when its multipart MIME says PNG.
    const ext = extensionByMimeType[file.mimetype] || '.bin'
    const uniqueName = `${Date.now()}-${randomUUID()}${ext}`
    cb(null, uniqueName)
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: maxSize, files: 1, fields: 30, fieldSize: 512 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'))
    }
  }
})

export async function removeFileIfExists(filePath?: string | null) {
  if (!filePath) return
  try {
    await fs.promises.unlink(filePath)
  } catch (error: any) {
    if (error?.code !== 'ENOENT') throw error
  }
}

export async function receiveSingleImage(event: H3Event, fieldName = 'image') {
  assertMediaStorageAvailable()
  const req = event.node.req as any
  const res = event.node.res as any
  const contentLength = Number(req.headers['content-length'] || 0)
  if (Number.isFinite(contentLength) && contentLength > maxMultipartBodySize) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Total data formulir maksimal 4,5 MB.',
    })
  }

  try {
    await new Promise<void>((resolve, reject) => {
      upload.single(fieldName)(req, res, (error: any) => error ? reject(error) : resolve())
    })
  } catch (error: any) {
    await removeFileIfExists(req.file?.path)
    const isTooLarge = error?.code === 'LIMIT_FILE_SIZE'
    throw createError({
      statusCode: isTooLarge ? 413 : 400,
      statusMessage: isTooLarge
        ? 'Ukuran gambar maksimal 4 MB.'
        : error?.message || 'Gambar gagal diunggah.',
    })
  }

  return { body: req.body || {}, file: req.file as Express.Multer.File | undefined }
}
