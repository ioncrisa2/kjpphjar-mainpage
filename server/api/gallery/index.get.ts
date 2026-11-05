import { Gallery } from '~/server/models/Gallery'
import { connectDB } from '~/server/utils/db'
import { OWNERSHIP_FIELDS_EXCLUSION, ownedRecordsFilter } from '~/server/utils/ownership'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  await connectDB()

  const query = getQuery(event)
  // ?admin=true adalah varian panel admin (dijaga middleware admin-auth).
  const isAdmin = query.admin === 'true'
  const filter: Record<string, unknown> = {}

  if (isAdmin) {
    Object.assign(filter, ownedRecordsFilter(await requireAuth(event), 'gallery.manage_all'))
  }
  if (query.category) filter.category = query.category
  if (query.featured === 'true') filter.isFeatured = true

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 50
  const skip = (page - 1) * limit

  let itemsQuery = Gallery.find(filter).sort({ order: 1, uploadedAt: -1 }).skip(skip).limit(limit)
  if (!isAdmin) itemsQuery = itemsQuery.select(OWNERSHIP_FIELDS_EXCLUSION)

  const [items, total] = await Promise.all([
    itemsQuery.lean(),
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
