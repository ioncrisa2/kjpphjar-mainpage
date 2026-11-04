import { BlogPost } from '~/server/models/BlogPost'
import { Leader } from '~/server/models/Leader'
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

  // Fetch all active leader profiles
  const leaders = await Leader.find({ isActive: true }).select('_id updatedAt').lean()
  const leaderUrls = leaders.map((l) => ({
    loc: `/pimpinan/${l._id}`,
    lastmod: l.updatedAt,
  }))

  return [...serviceUrls, ...postUrls, ...leaderUrls]
})
