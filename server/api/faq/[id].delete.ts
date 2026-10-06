import { Faq } from '~/server/models/Faq'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const id = getRouterParam(event, 'id')
  
  const faq = await Faq.findByIdAndDelete(id)
  
  if (!faq) {
    throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
  }
  
  return { message: 'FAQ deleted successfully' }
})
