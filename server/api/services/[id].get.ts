import { Service } from '~/server/models/Service'
import { connectDB } from '~/server/utils/db'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  await connectDB()
  const slugOrId = getRouterParam(event, 'id')

  let service = null

  if (mongoose.isValidObjectId(slugOrId)) {
    service = await Service.findById(slugOrId)
  }

  if (!service) {
    service = await Service.findOne({ slug: slugOrId })
  }

  if (!service) {
    throw createError({ statusCode: 404, statusMessage: 'Layanan tidak ditemukan' })
  }

  return service
})
