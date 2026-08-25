import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'
import { deleteAsset } from '~/server/utils/media-storage'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')

  const leader = await Leader.findByIdAndDelete(id)
  if (!leader) {
    throw createError({ statusCode: 404, statusMessage: 'Pimpinan tidak ditemukan' })
  }

  if (leader.photoUrl) {
    await deleteAsset(leader.photoUrl).catch((cleanupError) => {
      console.error('Gagal membersihkan foto pimpinan yang dihapus:', cleanupError)
    })
  }

  return { success: true, message: 'Pimpinan berhasil dihapus' }
})
