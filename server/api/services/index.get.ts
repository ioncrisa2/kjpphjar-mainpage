import { Service } from '~/server/models/Service'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const services = await Service.find({ isActive: true }).sort({ order: 1 }).lean()
  return services
})
