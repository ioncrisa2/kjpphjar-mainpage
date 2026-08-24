import { ContactSubmission } from '~/server/models/ContactSubmission'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const skip = (page - 1) * limit

  const filter: Record<string, unknown> = {}
  if (query.isRead !== undefined) filter.isRead = query.isRead === 'true'

  const [items, total, unread] = await Promise.all([
    ContactSubmission.find(filter).sort({ submittedAt: -1 }).skip(skip).limit(limit).lean(),
    ContactSubmission.countDocuments(filter),
    ContactSubmission.countDocuments({ isRead: false }),
  ])

  return { items, total, unread, page, totalPages: Math.ceil(total / limit) }
})
