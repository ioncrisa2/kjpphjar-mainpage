import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit
  
  // By default (public), only return published articles
  // For admin, we should be able to get all
  const isAdmin = event.context.path?.startsWith('/api/admin') || query.admin === 'true' // simplified for now
  
  const filter: any = {}
  if (!isAdmin) {
    filter.isPublished = true
  }

  const [items, total] = await Promise.all([
    // Exclude content for list view to save bandwidth
    BlogPost.find(filter).select('-content').sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments(filter)
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
})
