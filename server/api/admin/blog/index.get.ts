import mongoose from 'mongoose'
import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import {
  clampPagination,
  escapeRegex,
  getPublicBlogFilter,
  normalizeStatus,
  sanitizePlainText,
  toBlogPostDto,
} from '~/server/utils/blog'
import { ownedRecordsFilter } from '~/server/utils/ownership'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  await connectDB()
  const query = getQuery(event)
  const { page, limit, skip } = clampPagination(query.page, query.limit)
  const filters: Record<string, any>[] = []

  const ownership = ownedRecordsFilter(user, 'blog.manage_all')
  if (Object.keys(ownership).length) filters.push(ownership)

  const search = sanitizePlainText(query.q || query.search, 80)
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i')
    filters.push({ $or: [{ title: regex }, { excerpt: regex }, { tags: regex }, { author: regex }] })
  }

  const requestedStatus = sanitizePlainText(query.status, 20)
  if (requestedStatus) {
    const status = normalizeStatus(requestedStatus)
    if (status === 'published') {
      filters.push({ $or: [{ status: 'published' }, { status: { $exists: false }, isPublished: true }] })
    } else if (status === 'in_review') {
      filters.push({ status: 'in_review' })
    } else if (status === 'draft') {
      filters.push({ $or: [{ status: 'draft' }, { status: { $exists: false }, isPublished: { $ne: true } }] })
    } else {
      filters.push({ status: 'scheduled' })
    }
  }

  const categoryId = sanitizePlainText(query.categoryId, 30)
  if (categoryId && mongoose.isValidObjectId(categoryId)) filters.push({ categoryId })
  if (String(query.featured) === 'true') filters.push({ isFeatured: true })
  else if (String(query.featured) === 'false') filters.push({ isFeatured: { $ne: true } })

  const sortParam = sanitizePlainText(query.sort, 20)
  const sortOrder: Record<string, 1 | -1> = sortParam === 'views'
    ? { views: -1, updatedAt: -1 }
    : sortParam === 'oldest'
      ? { updatedAt: 1 }
      : { updatedAt: -1 }

  const filter = filters.length ? { $and: filters } : {}
  const baseFilter = Object.keys(ownership).length ? ownership : {}

  const [items, total, summaryAgg, activeFeatured] = await Promise.all([
    BlogPost.find(filter)
      .select('-content')
      .populate('categoryId', 'name slug description isActive createdAt updatedAt')
      .populate('leaderId', 'name position photoUrl bio')
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(filter),
    BlogPost.aggregate([
      { $match: baseFilter },
      {
        $project: {
          resolvedStatus: {
            $cond: [
              { $in: ['$status', ['draft', 'in_review', 'published', 'scheduled']] },
              '$status',
              { $cond: ['$isPublished', 'published', 'draft'] },
            ],
          },
          isFeatured: { $ifNull: ['$isFeatured', false] },
          views: { $ifNull: ['$views', 0] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: { $sum: { $cond: [{ $eq: ['$resolvedStatus', 'published'] }, 1, 0] } },
          inReview: { $sum: { $cond: [{ $eq: ['$resolvedStatus', 'in_review'] }, 1, 0] } },
          draft: { $sum: { $cond: [{ $eq: ['$resolvedStatus', 'draft'] }, 1, 0] } },
          scheduled: { $sum: { $cond: [{ $eq: ['$resolvedStatus', 'scheduled'] }, 1, 0] } },
          featured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          totalViews: { $sum: '$views' },
        },
      },
    ]),
    BlogPost.findOne({ $and: [{ isFeatured: true }, getPublicBlogFilter() as any] })
      .sort({ publishedAt: -1, createdAt: -1 })
      .select('_id title slug')
      .lean(),
  ])

  const summary = summaryAgg[0]
    ? {
        total: summaryAgg[0].total || 0,
        published: summaryAgg[0].published || 0,
        inReview: summaryAgg[0].inReview || 0,
        draft: summaryAgg[0].draft || 0,
        scheduled: summaryAgg[0].scheduled || 0,
        featured: summaryAgg[0].featured || 0,
        totalViews: summaryAgg[0].totalViews || 0,
      }
    : { total: 0, published: 0, inReview: 0, draft: 0, scheduled: 0, featured: 0, totalViews: 0 }

  return {
    items: items.map((item) => toBlogPostDto(item as any, false)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    summary,
    activeFeatured: activeFeatured
      ? { _id: String(activeFeatured._id), title: activeFeatured.title, slug: activeFeatured.slug }
      : null,
  }
})
