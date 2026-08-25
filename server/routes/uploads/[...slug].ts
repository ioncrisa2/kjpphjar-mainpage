import { defineEventHandler, setResponseHeader, sendStream, createError } from 'h3'
import fs from 'node:fs'
import path from 'path'
import { resolveExistingLocalAssetPath } from '~/server/utils/media-storage'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  const rawPath = Array.isArray(slug) ? slug.join('/') : String(slug)
  let pathname = ''
  try {
    pathname = decodeURIComponent(rawPath)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  const realPath = await resolveExistingLocalAssetPath(pathname)
  const stat = await fs.promises.stat(realPath)
  if (!stat.isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'File Not Found' })
  }

  const ext = path.extname(realPath).toLowerCase()
  let mimeType = ''
  if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg'
  else if (ext === '.png') mimeType = 'image/png'
  else if (ext === '.webp') mimeType = 'image/webp'
  else throw createError({ statusCode: 415, statusMessage: 'Unsupported Media Type' })

  setResponseHeader(event, 'Content-Type', mimeType)
  setResponseHeader(event, 'Content-Length', stat.size)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
  setResponseHeader(event, 'Cross-Origin-Resource-Policy', 'same-origin')
  setResponseHeader(event, 'Content-Security-Policy', "default-src 'none'; sandbox")

  const stream = fs.createReadStream(realPath)
  return sendStream(event, stream)
})
