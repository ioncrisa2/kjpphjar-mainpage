import path from 'node:path'
import mongoose from 'mongoose'
import { Client } from '~/server/models/Client'
import { connectDB } from '~/server/utils/db'
import { processUploadedImage } from '~/server/utils/image'
import { deleteAsset, storeAsset } from '~/server/utils/media-storage'
import { assertCanManageRecord } from '~/server/utils/ownership'
import { hasPermission, requireAuth } from '~/server/utils/require-auth'
import { receiveSingleImage, removeFileIfExists } from '~/server/utils/upload'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  await connectDB()
  const id = getRouterParam(event, 'id')
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Klien tidak ditemukan' })
  }
  const { body, file } = await receiveSingleImage(event)
  let newLogoUrl = ''
  let didPersistUpdate = false

  try {
    const existing = await Client.findById(id)
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Klien tidak ditemukan' })
    }
    assertCanManageRecord(user, existing, 'clients.manage_all', 'Anda hanya dapat mengubah klien milik sendiri.')

    const updates: Record<string, any> = {
      name: body.name,
      category: body.category,
      updatedBy: user.id,
    }
    // Urutan tampil memengaruhi semua klien, jadi khusus manage_all.
    if (hasPermission(user, 'clients.manage_all')) updates.order = body.order
    if (body.isActive !== undefined) updates.isActive = body.isActive === 'true'

    if (file) {
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
      newLogoUrl = stored.url
      updates.logoUrl = stored.url
    }

    const updated = await Client.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    if (!updated) {
      throw createError({ statusCode: 404, statusMessage: 'Klien tidak ditemukan' })
    }
    didPersistUpdate = true

    if (newLogoUrl && existing.logoUrl) {
      await deleteAsset(existing.logoUrl).catch((cleanupError) => {
        console.error('Gagal membersihkan logo klien lama:', cleanupError)
      })
    }
    return updated
  } catch (error) {
    if (newLogoUrl && !didPersistUpdate) {
      await deleteAsset(newLogoUrl).catch((rollbackError) => {
        console.error('Gagal membatalkan upload logo klien:', rollbackError)
      })
    }
    throw error
  } finally {
    await removeFileIfExists(file?.path)
  }
})
