import { Service } from '~/server/models/Service'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()

  const body = await readBody(event)
  const { serviceIds } = body

  if (!Array.isArray(serviceIds)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload format' })
  }

  // Update urutan secara bulk
  const operations = serviceIds.map((id: string, index: number) => {
    return {
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } }
      }
    }
  })

  if (operations.length > 0) {
    await Service.bulkWrite(operations)
  }

  return { success: true }
})
