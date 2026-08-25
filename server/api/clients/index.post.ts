import path from 'node:path'
import { Client } from '~/server/models/Client'
import { connectDB } from '~/server/utils/db'
import { processUploadedImage } from '~/server/utils/image'
import { deleteAsset, storeAsset } from '~/server/utils/media-storage'
import { receiveSingleImage, removeFileIfExists } from '~/server/utils/upload'

export default defineEventHandler(async (event) => {
  await connectDB()
  const { body, file } = await receiveSingleImage(event)
  let storedLogoUrl = ''
  let didPersist = false

  try {
    if (!file) {
      throw createError({ statusCode: 400, statusMessage: 'Logo klien wajib diunggah.' })
    }

    const filename = `${path.parse(file.filename).name}.webp`
    const buffer = await processUploadedImage(file.path, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 88,
    })
    const stored = await storeAsset({
      pathname: `clients/${filename}`,
      contentType: 'image/webp',
      source: { buffer },
    })
    storedLogoUrl = stored.url

    const client = await Client.create({
      name: body.name,
      category: body.category || '',
      order: body.order || 0,
      isActive: body.isActive === 'true',
      logoUrl: stored.url,
    })
    didPersist = true
    return client
  } catch (error) {
    if (storedLogoUrl && !didPersist) {
      await deleteAsset(storedLogoUrl).catch((rollbackError) => {
        console.error('Gagal membatalkan upload logo klien:', rollbackError)
      })
    }
    throw error
  } finally {
    await removeFileIfExists(file?.path)
  }
})
