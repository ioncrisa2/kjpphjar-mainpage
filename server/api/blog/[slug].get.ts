import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const slug = getRouterParam(event, 'slug')

  const post = await BlogPost.findOne({ slug })
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  }

  // Only admins can view drafts
  const isAdmin = event.context.path?.startsWith('/api/admin') || getQuery(event).admin === 'true'
  if (!post.isPublished && !isAdmin) {
     throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  }

  return post
})
