import path from 'node:path'
import { Gallery } from '~/server/models/Gallery'
import { connectDB } from '~/server/utils/db'
import { generateThumbnail, processUploadedImage } from '~/server/utils/image'
import { deleteAsset, storeAsset } from '~/server/utils/media-storage'
import { receiveSingleImage, removeFileIfExists } from '~/server/utils/upload'

export default defineEventHandler(async (event) => {
  await connectDB()
  const { body, file } = await receiveSingleImage(event)
  const storedUrls: string[] = []
  let didPersist = false

  try {
    if (!file) {
      throw createError({ statusCode: 400, statusMessage: 'File gambar wajib diunggah.' })
    }

    const baseName = path.parse(file.filename).name
    const originalFilename = `${baseName}.webp`
    const thumbnailFilename = `thumb-${baseName}.webp`
    const originalBuffer = await processUploadedImage(file.path, {
      maxWidth: 2400,
      maxHeight: 2400,
      quality: 88,
    })
    const thumbnailBuffer = await generateThumbnail(originalBuffer, { width: 600, height: 600, quality: 80 })

    const original = await storeAsset({
      pathname: `gallery/original/${originalFilename}`,
      contentType: 'image/webp',
      source: { buffer: originalBuffer },
    })
    storedUrls.push(original.url)

    const thumbnail = await storeAsset({
      pathname: `gallery/thumbnails/${thumbnailFilename}`,
      contentType: 'image/webp',
      source: { buffer: thumbnailBuffer },
    })
    storedUrls.push(thumbnail.url)

    const gallery = await Gallery.create({
      filename: originalFilename,
      imageUrl: original.url,
      thumbnailUrl: thumbnail.url,
      title: body.title || '',
      category: body.category || '',
      isFeatured: body.isFeatured === 'true',
    })
    didPersist = true
    return gallery
  } catch (error) {
    if (!didPersist) {
      for (const url of storedUrls.reverse()) {
        await deleteAsset(url).catch((rollbackError) => {
          console.error('Gagal membatalkan upload galeri:', rollbackError)
        })
      }
    }
    throw error
  } finally {
    await removeFileIfExists(file?.path)
  }
})
