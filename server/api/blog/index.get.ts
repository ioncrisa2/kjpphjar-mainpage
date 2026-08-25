import { BlogPost } from '~/server/models/BlogPost'
import { Category } from '~/server/models/Category'
import { connectDB } from '~/server/utils/db'
import {
  clampPagination,
  escapeRegex,
  getPublicBlogFilter,
  sanitizePlainText,
  toBlogPostDto,
} from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  await connectDB()
  const query = getQuery(event)
  const { page, limit, skip } = clampPagination(query.page, query.limit)
  const filters: Record<string, any>[] = [getPublicBlogFilter() as any]

  const search = sanitizePlainText(query.q || query.search, 80)
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i')
    filters.push({ $or: [{ title: regex }, { excerpt: regex }, { tags: regex }] })
  }

  const categorySlug = sanitizePlainText(query.category, 100)
  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug, isActive: true }).select('_id').lean()
    if (!category) return { items: [], total: 0, page, totalPages: 0 }
    filters.push({ categoryId: category._id })
  }

  const tag = sanitizePlainText(query.tag, 40)
  if (tag) filters.push({ tags: new RegExp(`^${escapeRegex(tag)}$`, 'i') })
  if (String(query.featured) === 'true') filters.push({ isFeatured: true })

  const authorFilter = sanitizePlainText(query.author, 80)
  if (authorFilter) {
    if (/^[a-f\d]{24}$/i.test(authorFilter)) {
      filters.push({ leaderId: authorFilter })
    } else {
      const authorRegex = new RegExp(escapeRegex(authorFilter), 'i')
      filters.push({ author: authorRegex })
    }
  }

  const excludeId = sanitizePlainText(query.exclude, 30)
  if (excludeId && /^[a-f\d]{24}$/i.test(excludeId)) filters.push({ _id: { $ne: excludeId } })

  const filter = { $and: filters }

  const [items, total] = await Promise.all([
    BlogPost.find(filter)
      .select('-content')
      .populate({
        path: 'categoryId',
        select: 'name slug description isActive createdAt updatedAt',
        match: { isActive: true },
      })
      .populate({
        path: 'leaderId',
        select: 'name position photoUrl bio',
      })
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(filter),
  ])

  return {
    items: items.map((item) => toBlogPostDto(item as any, false)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
})
