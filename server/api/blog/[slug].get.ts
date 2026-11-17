import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { getPublicBlogFilter, sanitizePlainText, toBlogPostDto } from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  await connectDB()
  const slug = sanitizePlainText(getRouterParam(event, 'slug'), 180).toLowerCase()
  const publicFilter = getPublicBlogFilter()

  const populateFields = [
    {
      path: 'categoryId',
      select: 'name slug description isActive createdAt updatedAt',
      match: { isActive: true },
    },
    {
      path: 'leaderId',
      select: 'name slug position photoUrl bio isActive',
    },
  ]

  let post = await BlogPost.findOne({ $and: [{ slug }, publicFilter] })
    .populate(populateFields)
    .lean()
  let redirectedFromSlug = ''

  if (!post && slug) {
    post = await BlogPost.findOne({ $and: [{ previousSlugs: slug }, publicFilter] })
      .populate(populateFields)
      .lean()
    if (post) redirectedFromSlug = slug
  }

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  }

  const dto = toBlogPostDto(post as any)
  if (redirectedFromSlug) dto.redirectedFromSlug = redirectedFromSlug
  return dto
})
