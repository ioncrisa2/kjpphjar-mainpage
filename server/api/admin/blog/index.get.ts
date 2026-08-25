import mongoose from 'mongoose'
import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import {
  clampPagination,
  escapeRegex,
  normalizeStatus,
  sanitizePlainText,
  toBlogPostDto,
} from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  await connectDB()
  const query = getQuery(event)
  const { page, limit, skip } = clampPagination(query.page, query.limit)
  const filters: Record<string, any>[] = []

  const search = sanitizePlainText(query.q || query.search, 80)
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i')
    filters.push({ $or: [{ title: regex }, { excerpt: regex }, { tags: regex }] })
  }

  const requestedStatus = sanitizePlainText(query.status, 20)
  if (requestedStatus) {
    const status = normalizeStatus(requestedStatus)
    if (status === 'published') {
      filters.push({ $or: [{ status: 'published' }, { status: { $exists: false }, isPublished: true }] })
    } else if (status === 'draft') {
      filters.push({ $or: [{ status: 'draft' }, { status: { $exists: false }, isPublished: { $ne: true } }] })
    } else {
      filters.push({ status: 'scheduled' })
    }
  }

  const categoryId = sanitizePlainText(query.categoryId, 30)
  if (categoryId && mongoose.isValidObjectId(categoryId)) filters.push({ categoryId })
  if (String(query.featured) === 'true') filters.push({ isFeatured: true })

  const filter = filters.length ? { $and: filters } : {}
  const [items, total] = await Promise.all([
    BlogPost.find(filter)
      .select('-content')
      .populate('categoryId', 'name slug description isActive createdAt updatedAt')
      .populate('leaderId', 'name position photoUrl bio')
      .sort({ updatedAt: -1 })
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
