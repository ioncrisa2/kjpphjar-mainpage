import { BlogPost } from '~/server/models/BlogPost'
import { Branch } from '~/server/models/Branch'
import { Career } from '~/server/models/Career'
import { Client } from '~/server/models/Client'
import { Faq } from '~/server/models/Faq'
import { Gallery } from '~/server/models/Gallery'
import { Leader } from '~/server/models/Leader'
import { Service } from '~/server/models/Service'
import { Setting } from '~/server/models/Setting'
import { connectDB } from '~/server/utils/db'
import { getPublicBlogFilter } from '~/server/utils/blog'
import { toLeaderSlug } from '~/server/utils/leader'

function maxDate(dates: Array<Date | string | null | undefined>, fallback: Date): string {
  let latest = 0
  for (const d of dates) {
    if (!d) continue
    const t = new Date(d).getTime()
    if (Number.isFinite(t) && t > latest) latest = t
  }
  return new Date(latest || fallback.getTime()).toISOString()
}

export default defineEventHandler(async () => {
  await connectDB()
  const now = new Date()

  // Fetch all active services
  const services = await Service.find({ isActive: true }).select('slug updatedAt').lean()
  const serviceUrls = services.map((s: any) => ({
    loc: `/layanan/${s.slug}`,
    lastmod: new Date(s.updatedAt || now).toISOString(),
  }))

  // Fetch all published blog posts
  const posts = await BlogPost.find(getPublicBlogFilter()).select('slug updatedAt').lean()
  const postUrls = posts.map((p: any) => ({
    loc: `/blog/${p.slug}`,
    lastmod: new Date(p.updatedAt || now).toISOString(),
  }))

  // Fetch all active leader profiles (using canonical slug URL)
  const leaders = await Leader.find({ isActive: true }).select('name slug updatedAt').lean()
  const leaderUrls = leaders.map((l: any) => ({
    loc: `/pimpinan/${toLeaderSlug(l.name, l.slug)}`,
    lastmod: new Date(l.updatedAt || now).toISOString(),
  }))

  const [latestFaq, latestGallery, latestClient, latestBranch, latestCareer, settingDoc] = await Promise.all([
    Faq.findOne({ isActive: true }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
    Gallery.findOne().sort({ updatedAt: -1 }).select('updatedAt').lean(),
    Client.findOne({ isActive: true }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
    Branch.findOne({ isActive: true }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
    Career.findOne({ isActive: true }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
    Setting.findOne({ key: 'global' }).select('updatedAt').lean(),
  ])

  const servicesLastmod = maxDate(services.map((s: any) => s.updatedAt), now)
  const postsLastmod = maxDate(posts.map((p: any) => p.updatedAt), now)
  const leadersLastmod = maxDate(leaders.map((l: any) => l.updatedAt), now)
  const faqLastmod = maxDate([(latestFaq as any)?.updatedAt], now)
  const galleryLastmod = maxDate([(latestGallery as any)?.updatedAt], now)
  const clientLastmod = maxDate([(latestClient as any)?.updatedAt], now)
  const contactLastmod = maxDate([(latestBranch as any)?.updatedAt, (settingDoc as any)?.updatedAt], now)
  const careerLastmod = maxDate([(latestCareer as any)?.updatedAt, (settingDoc as any)?.updatedAt], now)
  const homeLastmod = maxDate([servicesLastmod, postsLastmod, leadersLastmod, clientLastmod, contactLastmod], now)

  const staticUrls = [
    { loc: '/', lastmod: homeLastmod },
    { loc: '/about-us', lastmod: leadersLastmod },
    { loc: '/layanan', lastmod: servicesLastmod },
    { loc: '/rekan-klien', lastmod: clientLastmod },
    { loc: '/gallery', lastmod: galleryLastmod },
    { loc: '/blog', lastmod: postsLastmod },
    { loc: '/karir', lastmod: careerLastmod },
    { loc: '/faq', lastmod: faqLastmod },
    { loc: '/contact-us', lastmod: contactLastmod },
    { loc: '/kjpp-palembang', lastmod: servicesLastmod },
    { loc: '/kjpp-sumatera-selatan', lastmod: servicesLastmod },
    { loc: '/kjpp-sumatera', lastmod: servicesLastmod },
  ]

  return [...staticUrls, ...serviceUrls, ...postUrls, ...leaderUrls]
})
