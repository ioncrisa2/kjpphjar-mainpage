import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'
import { deleteFile } from '~/server/utils/image'
import path from 'path'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')

  const leader = await Leader.findByIdAndDelete(id)
  if (!leader) {
    throw createError({ statusCode: 404, statusMessage: 'Pimpinan tidak ditemukan' })
  }

  if (leader.photoUrl) {
    deleteFile(path.join(process.cwd(), 'public', leader.photoUrl))
  }

  return { success: true, message: 'Pimpinan berhasil dihapus' }
})
