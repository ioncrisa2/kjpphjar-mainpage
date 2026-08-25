import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { getPublicBlogFilter, sanitizePlainText, toBlogPostDto } from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  await connectDB()
  const slug = sanitizePlainText(getRouterParam(event, 'slug'), 180)

  const post = await BlogPost.findOne({ $and: [{ slug }, getPublicBlogFilter()] })
    .populate({
      path: 'categoryId',
      select: 'name slug description isActive createdAt updatedAt',
      match: { isActive: true },
    })
    .populate({
      path: 'leaderId',
      select: 'name position photoUrl bio isActive',
    })
    .lean()
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  }

  return toBlogPostDto(post as any)
})
