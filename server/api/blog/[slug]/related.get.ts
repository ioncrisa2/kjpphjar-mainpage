import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { getPublicBlogFilter, sanitizePlainText, toBlogPostDto } from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  await connectDB()
  const slug = sanitizePlainText(getRouterParam(event, 'slug'), 180)
  const current = await BlogPost.findOne({ $and: [{ slug }, getPublicBlogFilter()] })
    .select('_id categoryId tags')
    .lean()
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })

  const relevance: Record<string, any>[] = []
  if (current.categoryId) relevance.push({ categoryId: current.categoryId })
  if (current.tags?.length) relevance.push({ tags: { $in: current.tags } })

  const filters: Record<string, any>[] = [
    getPublicBlogFilter() as any,
    { _id: { $ne: current._id } },
  ]
  if (relevance.length) filters.push({ $or: relevance })

  const items = await BlogPost.find({ $and: filters })
    .select('-content')
    .populate({
      path: 'categoryId',
      select: 'name slug description isActive createdAt updatedAt',
      match: { isActive: true },
    })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(3)
    .lean()

  return { items: items.map((item) => toBlogPostDto(item as any, false)) }
})
