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
import { SERVICE_CONTENT_CATALOG } from '~/shared/service-content'

interface SitemapEntry {
  loc: string
  lastmod: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number | string
}

function maxDate(dates: Array<Date | string | null | undefined>, fallback: Date): string {
  let latest = 0
  for (const d of dates) {
    if (!d) continue
    const t = new Date(d).getTime()
    if (Number.isFinite(t) && t > latest) latest = t
  }
  return new Date(latest || fallback.getTime()).toISOString()
}

export default defineEventHandler(async (): Promise<SitemapEntry[]> => {
  const now = new Date()
  const nowIso = now.toISOString()

  let services: Array<{ slug: string; updatedAt?: Date | string }> = []
  let posts: Array<{ slug: string; updatedAt?: Date | string }> = []
  let leaders: Array<{ name: string; slug?: string; updatedAt?: Date | string }> = []
  let latestFaq: { updatedAt?: Date | string } | null = null
  let latestGallery: { updatedAt?: Date | string } | null = null
  let latestClient: { updatedAt?: Date | string } | null = null
  let latestBranch: { updatedAt?: Date | string } | null = null
  let latestCareer: { updatedAt?: Date | string } | null = null
  let settingDoc: { updatedAt?: Date | string } | null = null

  try {
    await connectDB()

    const [
      dbServices,
      dbPosts,
      dbLeaders,
      dbFaq,
      dbGallery,
      dbClient,
      dbBranch,
      dbCareer,
      dbSetting,
    ] = await Promise.all([
      Service.find({ isActive: true }).select('slug updatedAt').lean(),
      BlogPost.find(getPublicBlogFilter()).select('slug updatedAt').lean(),
      Leader.find({ isActive: true }).select('name slug updatedAt').lean(),
      Faq.findOne({ isActive: true }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
      Gallery.findOne().sort({ updatedAt: -1 }).select('updatedAt').lean(),
      Client.findOne({ isActive: true }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
      Branch.findOne({ isActive: true }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
      Career.findOne({ isActive: true }).sort({ updatedAt: -1 }).select('updatedAt').lean(),
      Setting.findOne({ key: 'global' }).select('updatedAt').lean(),
    ])

    services = dbServices as any
    posts = dbPosts as any
    leaders = dbLeaders as any
    latestFaq = dbFaq as any
    latestGallery = dbGallery as any
    latestClient = dbClient as any
    latestBranch = dbBranch as any
    latestCareer = dbCareer as any
    settingDoc = dbSetting as any
  } catch (error) {
    console.warn('[Sitemap] Gagal memuat data dinamis dari MongoDB; menggunakan fallback rute statis & katalog layanan.', error)
  }

  const servicesLastmod = maxDate(services.map((s) => s.updatedAt), now)
  const postsLastmod = maxDate(posts.map((p) => p.updatedAt), now)
  const leadersLastmod = maxDate(leaders.map((l) => l.updatedAt), now)
  const faqLastmod = maxDate([latestFaq?.updatedAt], now)
  const galleryLastmod = maxDate([latestGallery?.updatedAt], now)
  const clientLastmod = maxDate([latestClient?.updatedAt], now)
  const contactLastmod = maxDate([latestBranch?.updatedAt, settingDoc?.updatedAt], now)
  const careerLastmod = maxDate([latestCareer?.updatedAt, settingDoc?.updatedAt], now)
  const homeLastmod = maxDate(
    [servicesLastmod, postsLastmod, leadersLastmod, clientLastmod, contactLastmod],
    now,
  )

  // Gabungkan sub-halaman layanan dari DB dengan katalog layanan inti sebagai fallback
  const serviceMap = new Map<string, SitemapEntry>()
  for (const item of Object.values(SERVICE_CONTENT_CATALOG)) {
    serviceMap.set(item.slug, {
      loc: `/layanan/${item.slug}`,
      lastmod: servicesLastmod || nowIso,
      changefreq: 'monthly',
      priority: 0.85,
    })
  }
  for (const s of services) {
    if (!s?.slug) continue
    serviceMap.set(s.slug, {
      loc: `/layanan/${s.slug}`,
      lastmod: new Date(s.updatedAt || now).toISOString(),
      changefreq: 'monthly',
      priority: 0.85,
    })
  }
  const serviceUrls = Array.from(serviceMap.values())

  // Artikel blog yang dipublikasikan
  const postUrls: SitemapEntry[] = posts
    .filter((p) => Boolean(p?.slug))
    .map((p) => ({
      loc: `/blog/${p.slug}`,
      lastmod: new Date(p.updatedAt || now).toISOString(),
      changefreq: 'monthly',
      priority: 0.75,
    }))

  // Profil pimpinan aktif (canonical slug)
  const leaderUrls: SitemapEntry[] = leaders
    .map((l) => ({
      slug: toLeaderSlug(l.name, l.slug),
      updatedAt: l.updatedAt,
    }))
    .filter((l) => Boolean(l.slug))
    .map((l) => ({
      loc: `/pimpinan/${l.slug}`,
      lastmod: new Date(l.updatedAt || now).toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
    }))

  const staticUrls: SitemapEntry[] = [
    { loc: '/', lastmod: homeLastmod, changefreq: 'weekly', priority: '1.0' },
    { loc: '/kjpp-palembang', lastmod: servicesLastmod, changefreq: 'weekly', priority: '0.9' },
    { loc: '/kjpp-sumatera-selatan', lastmod: servicesLastmod, changefreq: 'weekly', priority: '0.9' },
    { loc: '/kjpp-sumatera', lastmod: servicesLastmod, changefreq: 'weekly', priority: '0.9' },
    { loc: '/layanan', lastmod: servicesLastmod, changefreq: 'weekly', priority: '0.9' },
    { loc: '/about-us', lastmod: leadersLastmod, changefreq: 'monthly', priority: '0.8' },
    { loc: '/rekan-klien', lastmod: clientLastmod, changefreq: 'monthly', priority: '0.8' },
    { loc: '/gallery', lastmod: galleryLastmod, changefreq: 'weekly', priority: '0.7' },
    { loc: '/blog', lastmod: postsLastmod, changefreq: 'weekly', priority: '0.8' },
    { loc: '/karir', lastmod: careerLastmod, changefreq: 'weekly', priority: '0.7' },
    { loc: '/faq', lastmod: faqLastmod, changefreq: 'monthly', priority: '0.8' },
    { loc: '/contact-us', lastmod: contactLastmod, changefreq: 'monthly', priority: '0.8' },
  ]

  return [...staticUrls, ...serviceUrls, ...postUrls, ...leaderUrls]
})
