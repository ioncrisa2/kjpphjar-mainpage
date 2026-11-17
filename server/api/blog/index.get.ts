import { BlogPost } from '~/server/models/BlogPost'
import { Category } from '~/server/models/Category'
import { Leader } from '~/server/models/Leader'
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
    if (!category) return { items: [], total: 0, page, totalPages: 0, activeAuthorName: '' }
    filters.push({ categoryId: category._id })
  }

  const tag = sanitizePlainText(query.tag, 40)
  if (tag) filters.push({ tags: new RegExp(`^${escapeRegex(tag)}$`, 'i') })
  if (String(query.featured) === 'true') filters.push({ isFeatured: true })

  const authorFilter = sanitizePlainText(query.author, 80)
  let activeAuthorName = ''
  if (authorFilter) {
    if (/^[a-f\d]{24}$/i.test(authorFilter)) {
      filters.push({ leaderId: authorFilter })
      const leaderDoc = await Leader.findById(authorFilter).select('name').lean()
      activeAuthorName = leaderDoc?.name || ''
    } else {
      const authorRegex = new RegExp(escapeRegex(authorFilter), 'i')
      filters.push({ author: authorRegex })
      activeAuthorName = authorFilter
    }
  }

  const excludeId = sanitizePlainText(query.exclude, 30)
  if (excludeId && /^[a-f\d]{24}$/i.test(excludeId)) filters.push({ _id: { $ne: excludeId } })

  const sortOrder: Record<string, 1 | -1> = String(query.sort) === 'popular'
    ? { views: -1, publishedAt: -1, createdAt: -1 }
    : { publishedAt: -1, createdAt: -1 }

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
        select: 'name slug position photoUrl bio',
      })
      .sort(sortOrder)
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
    activeAuthorName,
  }
})
