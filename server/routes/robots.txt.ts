export default defineEventHandler((event) => {
  const siteConfig = useSiteConfig(event)
  const siteUrl = (siteConfig?.url || 'https://kjpp-hjar.co.id')
    .replace('://www.', '://')
    .replace(/\/$/, '')

  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  })

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
})
