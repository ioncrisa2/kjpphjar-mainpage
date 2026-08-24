import { Gallery } from '~/server/models/Gallery'
import { connectDB } from '~/server/utils/db'
import { deleteFile } from '~/server/utils/image'
import path from 'path'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')

  const photo = await Gallery.findById(id)
  if (!photo) {
    throw createError({ statusCode: 404, statusMessage: 'Foto tidak ditemukan' })
  }

  // Hapus dari database
  await Gallery.findByIdAndDelete(id)

  // Hapus file fisik
  const originalPath = path.join(process.cwd(), 'public', photo.imageUrl)
  const thumbnailPath = path.join(process.cwd(), 'public', photo.thumbnailUrl)
  
  deleteFile(originalPath)
  deleteFile(thumbnailPath)

  return { success: true, message: 'Foto berhasil dihapus' }
})
