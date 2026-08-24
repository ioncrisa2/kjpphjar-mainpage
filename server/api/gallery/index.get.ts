import { Gallery } from '~/server/models/Gallery'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()

  const query = getQuery(event)
  const filter: Record<string, unknown> = {}

  if (query.category) filter.category = query.category
  if (query.featured === 'true') filter.isFeatured = true

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 50
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    Gallery.find(filter).sort({ order: 1, uploadedAt: -1 }).skip(skip).limit(limit).lean(),
    Gallery.countDocuments(filter),
  ])

  // Get unique categories
  const categories = await Gallery.distinct('category', { category: { $exists: true, $ne: '' } })

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    categories,
  }
})
