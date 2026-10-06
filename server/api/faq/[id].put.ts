import { Faq } from '~/server/models/Faq'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  const faq = await Faq.findByIdAndUpdate(id, body, { new: true })
  
  if (!faq) {
    throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
  }
  
  return faq
})
