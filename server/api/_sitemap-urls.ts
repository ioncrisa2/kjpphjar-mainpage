import { BlogPost } from '~/server/models/BlogPost'
import { Service } from '~/server/models/Service'
import { connectDB } from '~/server/utils/db'
import { getPublicBlogFilter } from '~/server/utils/blog'

export default defineEventHandler(async () => {
  await connectDB()

  // Fetch all active services
  const services = await Service.find({ isActive: true }).select('slug updatedAt').lean()
  const serviceUrls = services.map((s) => ({
    loc: `/layanan/${s.slug}`,
    lastmod: s.updatedAt,
  }))

  // Fetch all published blog posts
  const posts = await BlogPost.find(getPublicBlogFilter()).select('slug updatedAt').lean()
  const postUrls = posts.map((p) => ({
    loc: `/blog/${p.slug}`,
    lastmod: p.updatedAt,
  }))

  return [...serviceUrls, ...postUrls]
})
