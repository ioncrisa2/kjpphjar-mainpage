import path from 'node:path'
import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'
import { processUploadedImage } from '~/server/utils/image'
import { deleteAsset, storeAsset } from '~/server/utils/media-storage'
import { receiveSingleImage, removeFileIfExists } from '~/server/utils/upload'

export default defineEventHandler(async (event) => {
  await connectDB()
  const { body, file } = await receiveSingleImage(event)
  let storedPhotoUrl = ''
  let didPersist = false

  try {
    if (!file) {
      throw createError({ statusCode: 400, statusMessage: 'Foto pimpinan wajib diunggah.' })
    }

    const filename = `${path.parse(file.filename).name}.webp`
    const buffer = await processUploadedImage(file.path, {
      maxWidth: 1600,
      maxHeight: 2000,
      quality: 88,
    })
    const stored = await storeAsset({
      pathname: `leaders/${filename}`,
      contentType: 'image/webp',
      source: { buffer },
    })
    storedPhotoUrl = stored.url

    const leader = await Leader.create({
      name: body.name,
      position: body.position,
      bio: body.bio,
      order: body.order || 0,
      isActive: body.isActive === 'true',
      photoUrl: stored.url,
    })
    didPersist = true
    return leader
  } catch (error) {
    if (storedPhotoUrl && !didPersist) {
      await deleteAsset(storedPhotoUrl).catch((rollbackError) => {
        console.error('Gagal membatalkan upload foto pimpinan:', rollbackError)
      })
    }
    throw error
  } finally {
    await removeFileIfExists(file?.path)
  }
})
