import mongoose from 'mongoose'
import { Gallery } from '~/server/models/Gallery'
import { connectDB } from '~/server/utils/db'
import { deleteAsset } from '~/server/utils/media-storage'
import { assertCanManageRecord } from '~/server/utils/ownership'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  await connectDB()
  const id = getRouterParam(event, 'id')
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Foto tidak ditemukan' })
  }

  const photo = await Gallery.findById(id)
  if (!photo) {
    throw createError({ statusCode: 404, statusMessage: 'Foto tidak ditemukan' })
  }
  assertCanManageRecord(user, photo, 'gallery.manage_all', 'Anda hanya dapat menghapus foto milik sendiri.')

  await Gallery.findByIdAndDelete(id)

  const deletionResults = await Promise.allSettled([
    deleteAsset(photo.imageUrl),
    deleteAsset(photo.thumbnailUrl),
  ])
  for (const result of deletionResults) {
    if (result.status === 'rejected') {
      console.error('Gagal membersihkan aset galeri yang dihapus:', result.reason)
    }
  }

  return { success: true, message: 'Foto berhasil dihapus' }
})
