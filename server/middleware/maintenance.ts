import { getPublicSettings } from '~/server/utils/settings'
import { requireAdmin } from '~/server/utils/require-admin'

const STATIC_PREFIXES = [
  '/_nuxt/',
  '/_ipx/',
  '/assets/',
  '/uploads/',
  '/favicon',
  '/robots.txt',
  '/sitemap',
]

function isAlwaysAllowedPath(pathname: string, method: string) {
  return (
    pathname === '/maintenance' ||
    pathname.startsWith('/maintenance/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/api/auth' ||
    pathname.startsWith('/api/auth/') ||
    (pathname === '/api/settings' && (method === 'GET' || method === 'HEAD')) ||
    STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  )
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const pathname = getRequestURL(event).pathname
  if (isAlwaysAllowedPath(pathname, method)) return

  let settings: Awaited<ReturnType<typeof getPublicSettings>>
  try {
    settings = await getPublicSettings()
  } catch (error) {
    console.error('[Maintenance] Gagal membaca status; request dilanjutkan (fail-open).', error)
    return
  }

  if (!settings.maintenanceMode.isActive) return

  try {
    await requireAdmin(event)
    return
  } catch {
    // A missing or invalid admin session receives the maintenance response.
  }

  setResponseHeaders(event, {
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  })

  const expectedEndTime = settings.maintenanceMode.expectedEndTime
  if (expectedEndTime) {
    const retryAfter = Math.ceil((new Date(expectedEndTime).getTime() - Date.now()) / 1000)
    if (retryAfter > 0) setResponseHeader(event, 'Retry-After', retryAfter)
  }

  const isApiRequest = pathname === '/api' || pathname.startsWith('/api/')
  if (isApiRequest) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Website sedang dalam pemeliharaan.',
    })
  }

  const accept = getRequestHeader(event, 'accept') || ''
  const destination = getRequestHeader(event, 'sec-fetch-dest')
  const isHtmlNavigation =
    (method === 'GET' || method === 'HEAD') &&
    accept.includes('text/html') &&
    (!destination || destination === 'document')

  if (isHtmlNavigation) {
    return sendRedirect(event, '/maintenance', 302)
  }

  throw createError({ statusCode: 503, statusMessage: 'Website sedang dalam pemeliharaan.' })
})
