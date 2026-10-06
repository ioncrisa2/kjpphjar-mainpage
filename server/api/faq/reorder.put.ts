import { Faq } from '~/server/models/Faq'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const { items } = await readBody(event)
  
  if (!Array.isArray(items)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }
  
  // Update order for each item
  const bulkOps = items.map((item, index) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $set: { order: index } }
    }
  }))
  
  if (bulkOps.length > 0) {
    await Faq.bulkWrite(bulkOps)
  }
  
  return { message: 'Reordered successfully' }
})
