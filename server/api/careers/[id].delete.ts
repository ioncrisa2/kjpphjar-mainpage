import { Career } from '~/server/models/Career'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')

  const career = await Career.findByIdAndDelete(id)
  if (!career) {
    throw createError({ statusCode: 404, statusMessage: 'Lowongan tidak ditemukan' })
  }

  return { success: true, message: 'Lowongan berhasil dihapus' }
})
