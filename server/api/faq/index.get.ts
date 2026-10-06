import { Faq } from '~/server/models/Faq'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const query = getQuery(event)
  const isAdmin = query.admin === 'true'
  
  // Public users only see active FAQs
  const filter = isAdmin ? {} : { isActive: true }
  
  const faqs = await Faq.find(filter).sort({ order: 1, createdAt: -1 }).lean()
  return faqs
})
