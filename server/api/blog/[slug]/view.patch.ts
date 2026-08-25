import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { getPublicBlogFilter, sanitizePlainText } from '~/server/utils/blog'
import { enforcePersistentRequestRateLimit } from '~/server/utils/request-rate-limit'

export default defineEventHandler(async (event) => {
  await connectDB()
  const slug = sanitizePlainText(getRouterParam(event, 'slug'), 180)
  setResponseHeader(event, 'Cache-Control', 'no-store')

  await enforcePersistentRequestRateLimit(event, {
    namespace: 'blog-view-global',
    limit: 60,
    windowMs: 60_000,
  })
  await enforcePersistentRequestRateLimit(event, {
    namespace: 'blog-view-article',
    discriminator: slug,
    limit: 2,
    windowMs: 60 * 60 * 1000,
  })

  const post = await BlogPost.findOneAndUpdate(
    { $and: [{ slug }, getPublicBlogFilter()] },
    { $inc: { views: 1 } },
    { new: true, projection: { views: 1 } },
  ).lean()

  if (!post) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })
  return { views: Number(post.views) || 0 }
})
