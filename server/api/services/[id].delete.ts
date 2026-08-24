import { Service } from '~/server/models/Service'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')

  const service = await Service.findByIdAndDelete(id)
  if (!service) {
    throw createError({ statusCode: 404, statusMessage: 'Layanan tidak ditemukan' })
  }

  return { success: true, message: 'Layanan berhasil dihapus' }
})
