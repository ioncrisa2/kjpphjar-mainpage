import { Gallery } from '~/server/models/Gallery'
import { connectDB } from '~/server/utils/db'
import { deleteAsset } from '~/server/utils/media-storage'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')

  const photo = await Gallery.findById(id)
  if (!photo) {
    throw createError({ statusCode: 404, statusMessage: 'Foto tidak ditemukan' })
  }

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
