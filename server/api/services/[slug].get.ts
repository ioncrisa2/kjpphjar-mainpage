import { Service } from '~/server/models/Service'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const slug = getRouterParam(event, 'slug')

  const service = await Service.findOne({ slug })
  if (!service) {
    throw createError({ statusCode: 404, statusMessage: 'Layanan tidak ditemukan' })
  }

  return service
})
