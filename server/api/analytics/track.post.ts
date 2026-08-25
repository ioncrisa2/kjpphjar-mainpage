import type { H3Event } from 'h3'
import {
  createAnalyticsPageView,
  hasAnalyticsOptOut,
  isBotUserAgent,
  isDuplicateAnalyticsEvent,
  persistAnalyticsPageView,
  setAnalyticsNoStore,
} from '~/server/utils/analytics'
import { enforcePersistentRequestRateLimit } from '~/server/utils/request-rate-limit'

const MAX_TRACK_BODY_BYTES = 4 * 1024

interface TrackBody {
  eventId?: unknown
  path?: unknown
  referrer?: unknown
  isEntry?: unknown
}

async function readLimitedTrackBody(event: H3Event): Promise<TrackBody> {
  const contentType = getRequestHeader(event, 'content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    throw createError({ statusCode: 415, statusMessage: 'Payload analitik harus berupa JSON.' })
  }

  const contentLength = Number(getRequestHeader(event, 'content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_TRACK_BODY_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Payload analitik terlalu besar.' })
  }

  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of event.node.req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    total += buffer.length
    if (total > MAX_TRACK_BODY_BYTES) {
      throw createError({ statusCode: 413, statusMessage: 'Payload analitik terlalu besar.' })
    }
    chunks.push(buffer)
  }

  if (!chunks.length) {
    throw createError({ statusCode: 400, statusMessage: 'Payload analitik kosong.' })
  }

  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid')
    return parsed as TrackBody
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Payload analitik tidak valid.' })
  }
}

export default defineEventHandler(async (event) => {
  setAnalyticsNoStore(event)

  if (hasAnalyticsOptOut(event) || isBotUserAgent(getRequestHeader(event, 'user-agent'))) {
    setResponseStatus(event, 202)
    return { accepted: false, reason: 'opted-out' }
  }

  const fetchSite = getRequestHeader(event, 'sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin') {
    throw createError({ statusCode: 403, statusMessage: 'Sumber permintaan tidak diizinkan.' })
  }

  const origin = getRequestHeader(event, 'origin')
  const referer = getRequestHeader(event, 'referer')
  const requestHost = getRequestURL(event).host
  try {
    const sourceHost = origin
      ? new URL(origin).host
      : referer
        ? new URL(referer).host
        : ''
    if (!sourceHost || sourceHost !== requestHost) {
      throw createError({ statusCode: 403, statusMessage: 'Origin tidak diizinkan.' })
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    throw createError({ statusCode: 403, statusMessage: 'Origin tidak valid.' })
  }

  await enforcePersistentRequestRateLimit(event, {
    namespace: 'analytics-page-view',
    limit: 120,
    windowMs: 60_000,
  })

  const body = await readLimitedTrackBody(event)
  if (body.isEntry !== true && body.isEntry !== false) {
    throw createError({ statusCode: 400, statusMessage: 'Tipe kunjungan tidak valid.' })
  }

  const pageView = createAnalyticsPageView(event, {
    eventId: typeof body.eventId === 'string' ? body.eventId : undefined,
    path: typeof body.path === 'string' ? body.path : '',
    referrer: typeof body.referrer === 'string' ? body.referrer : undefined,
    isEntry: body.isEntry,
  })

  if (!pageView) {
    throw createError({ statusCode: 400, statusMessage: 'Path kunjungan tidak valid.' })
  }

  try {
    await persistAnalyticsPageView(pageView)
  } catch (error) {
    if (!isDuplicateAnalyticsEvent(error)) {
      const capturedError =
        error instanceof Error ? error : new Error('Unknown analytics persistence error')
      event.captureError(capturedError, { tags: ['analytics', 'client-page-view'] })
      throw createError({ statusCode: 503, statusMessage: 'Pencatatan analitik sedang tidak tersedia.' })
    }
  }

  setResponseStatus(event, 202)
  return { accepted: true }
})
