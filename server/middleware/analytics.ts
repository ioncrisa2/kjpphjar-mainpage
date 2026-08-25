import { randomUUID } from 'node:crypto'
import { getPublicSettings } from '~/server/utils/settings'
import { requireAdmin } from '~/server/utils/require-admin'
import {
  createAnalyticsPageView,
  getAnalyticsInitialCookieName,
  hasAnalyticsOptOut,
  isBotUserAgent,
  isDuplicateAnalyticsEvent,
  isTrackablePublicPath,
  normalizeAnalyticsPath,
  persistAnalyticsPageView,
} from '~/server/utils/analytics'
import {
  consumePersistentRequestRateLimit,
  consumeRequestRateLimit,
} from '~/server/utils/request-rate-limit'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET' || hasAnalyticsOptOut(event)) return

  const accept = getRequestHeader(event, 'accept') || ''
  const destination = getRequestHeader(event, 'sec-fetch-dest')
  const purpose = `${getRequestHeader(event, 'purpose') || ''} ${
    getRequestHeader(event, 'sec-purpose') || ''
  }`

  if (!accept.toLowerCase().includes('text/html')) return
  if (destination && destination !== 'document') return
  if (/prefetch|prerender/i.test(purpose)) return

  const userAgent = getRequestHeader(event, 'user-agent')
  if (isBotUserAgent(userAgent)) return

  const path = normalizeAnalyticsPath(getRequestURL(event).pathname)
  if (!path || !isTrackablePublicPath(path)) return

  const rateLimit = consumeRequestRateLimit(event, {
    namespace: 'analytics-page-view',
    limit: 120,
    windowMs: 60_000,
  })
  if (!rateLimit.allowed) return

  // analytics.ts runs before maintenance.ts alphabetically. Mirror its access
  // decision so a public request that will be redirected is never persisted.
  try {
    const settings = await getPublicSettings()
    if (settings.maintenanceMode.isActive) {
      try {
        await requireAdmin(event)
      } catch {
        return
      }
    }
  } catch {
    // Maintenance is fail-open; analytics follows the same behavior here.
  }

  const pageView = createAnalyticsPageView(event, {
    eventId: randomUUID(),
    path,
    referrer: getRequestHeader(event, 'referer'),
    isEntry: true,
  })
  if (!pageView) return

  // A per-path marker avoids cross-tab collisions. It remains readable only long
  // enough for the hydrated client to suppress its duplicate initial event.
  setCookie(event, getAnalyticsInitialCookieName(path), path, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 45,
  })

  const write = (async () => {
    const distributedLimit = await consumePersistentRequestRateLimit(event, {
      namespace: 'analytics-page-view',
      limit: 120,
      windowMs: 60_000,
    })
    if (!distributedLimit.allowed) return
    await persistAnalyticsPageView(pageView)
  })().catch((error) => {
    if (!isDuplicateAnalyticsEvent(error)) {
      const capturedError =
        error instanceof Error ? error : new Error('Unknown analytics persistence error')
      event.captureError(capturedError, { tags: ['analytics', 'initial-page-view'] })
    }
  })

  event.waitUntil(write)
})
