import path from 'node:path'
import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'
import { processUploadedImage } from '~/server/utils/image'
import { deleteAsset, storeAsset } from '~/server/utils/media-storage'
import { receiveSingleImage, removeFileIfExists } from '~/server/utils/upload'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  const { body, file } = await receiveSingleImage(event)
  let newPhotoUrl = ''
  let didPersistUpdate = false

  try {
    const existing = await Leader.findById(id)
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Pimpinan tidak ditemukan' })
    }

    const updates: Record<string, any> = {
      name: body.name,
      position: body.position,
      bio: body.bio,
      order: body.order,
    }
    if (body.isActive !== undefined) updates.isActive = body.isActive === 'true'

    if (file) {
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
      newPhotoUrl = stored.url
      updates.photoUrl = stored.url
    }

    const updated = await Leader.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    if (!updated) {
      throw createError({ statusCode: 404, statusMessage: 'Pimpinan tidak ditemukan' })
    }
    didPersistUpdate = true

    if (newPhotoUrl && existing.photoUrl) {
      await deleteAsset(existing.photoUrl).catch((cleanupError) => {
        console.error('Gagal membersihkan foto pimpinan lama:', cleanupError)
      })
    }
    return updated
  } catch (error) {
    if (newPhotoUrl && !didPersistUpdate) {
      await deleteAsset(newPhotoUrl).catch((rollbackError) => {
        console.error('Gagal membatalkan upload foto pimpinan:', rollbackError)
      })
    }
    throw error
  } finally {
    await removeFileIfExists(file?.path)
  }
})
