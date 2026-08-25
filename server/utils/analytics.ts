import { createHmac, randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'
import {
  AnalyticsLog,
  type AnalyticsBrowser,
  type AnalyticsDevice,
  type AnalyticsSource,
  type IAnalyticsLog,
} from '~/server/models/AnalyticsLog'
import { connectDB } from '~/server/utils/db'
import { getTrustedClientAddress } from '~/server/utils/request-rate-limit'

export const ANALYTICS_RANGES = [7, 30, 90] as const
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number]

export const ANALYTICS_TIMEZONE = 'Asia/Jakarta'
export const ANALYTICS_INITIAL_COOKIE_PREFIX = 'kjpp_analytics_initial_'

const DAY_MS = 24 * 60 * 60 * 1000
const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000
const MAX_PATH_LENGTH = 300
const EVENT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const BOT_PATTERN =
  /bot|crawler|spider|crawling|headless|preview|facebookexternalhit|whatsapp|telegrambot|slurp|bingpreview|lighthouse|pagespeed|uptimerobot|monitoring/i
const STATIC_EXTENSION_PATTERN =
  /\.(?:avif|bmp|css|csv|eot|gif|ico|jpe?g|js|json|map|mjs|mp3|mp4|ogg|otf|pdf|png|svg|txt|webm|webp|woff2?|xml|zip)$/i

const SEARCH_HOST_PATTERNS = [
  /(^|\.)google\./,
  /(^|\.)bing\.com$/,
  /(^|\.)search\.yahoo\.com$/,
  /(^|\.)duckduckgo\.com$/,
  /(^|\.)yandex\./,
  /(^|\.)baidu\.com$/,
]

const SOCIAL_HOST_PATTERNS = [
  /(^|\.)facebook\.com$/,
  /(^|\.)instagram\.com$/,
  /(^|\.)linkedin\.com$/,
  /(^|\.)tiktok\.com$/,
  /(^|\.)threads\.net$/,
  /(^|\.)twitter\.com$/,
  /(^|\.)youtube\.com$/,
  /(^|\.)whatsapp\.com$/,
  /^t\.co$/,
  /^wa\.me$/,
]

interface AnalyticsRuntimeConfig {
  analyticsHashSecret?: string
  jwtSecret?: string
}

export interface AnalyticsPageViewInput {
  eventId?: string
  path: string
  referrer?: string
  isEntry: boolean
}

export interface AnalyticsPageViewDocument {
  eventId: string
  path: string
  referrer: string
  source: AnalyticsSource
  isEntry: boolean
  device: AnalyticsDevice
  browser: AnalyticsBrowser
  ipHash?: string
  visitedAt: Date
}

export interface AnalyticsPeriodBounds {
  startToday: Date
  start7Days: Date
  start30Days: Date
  startRange: Date
}

export function normalizeAnalyticsPath(input: unknown): string | null {
  if (typeof input !== 'string') return null

  const value = input.trim()
  if (!value.startsWith('/') || value.startsWith('//') || value.length > MAX_PATH_LENGTH * 2) {
    return null
  }

  let pathname: string
  try {
    pathname = new URL(value, 'https://analytics.local').pathname
  } catch {
    return null
  }

  pathname = pathname.replace(/\/{2,}/g, '/')
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '')

  return pathname.length <= MAX_PATH_LENGTH ? pathname : null
}

export function isTrackablePublicPath(path: string): boolean {
  if (path === '/admin' || path.startsWith('/admin/')) return false
  if (path === '/api' || path.startsWith('/api/')) return false
  if (path === '/maintenance' || path.startsWith('/maintenance/')) return false
  if (path.startsWith('/_nuxt/') || path.startsWith('/_ipx/')) return false
  if (path.startsWith('/assets/') || path.startsWith('/uploads/')) return false
  if (path === '/robots.txt' || path === '/sitemap.xml' || path.startsWith('/sitemap-')) return false
  if (path.startsWith('/favicon.') || path.startsWith('/__nuxt')) return false
  if (STATIC_EXTENSION_PATTERN.test(path)) return false
  return true
}

export function hasAnalyticsOptOut(event: H3Event): boolean {
  return (
    getRequestHeader(event, 'dnt')?.trim() === '1' ||
    getRequestHeader(event, 'sec-gpc')?.trim() === '1'
  )
}

export function isBotUserAgent(userAgent: string | undefined): boolean {
  return !userAgent || BOT_PATTERN.test(userAgent)
}

export function parseUserAgent(userAgent: string): {
  device: AnalyticsDevice
  browser: AnalyticsBrowser
} {
  const ua = userAgent.toLowerCase()

  let device: AnalyticsDevice = 'desktop'
  if (/ipad|tablet|kindle|silk/.test(ua) || (/android/.test(ua) && !/mobile/.test(ua))) {
    device = 'tablet'
  } else if (/mobile|iphone|ipod|android|windows phone/.test(ua)) {
    device = 'mobile'
  } else if (!/windows|macintosh|mac os|linux|cros/.test(ua)) {
    device = 'other'
  }

  let browser: AnalyticsBrowser = 'other'
  if (/edg(?:e|a|ios)?\//.test(ua)) browser = 'edge'
  else if (/opr\/|opera/.test(ua)) browser = 'opera'
  else if (/samsungbrowser\//.test(ua)) browser = 'samsung-internet'
  else if (/firefox\/|fxios\//.test(ua)) browser = 'firefox'
  else if (/chrome\/|crios\//.test(ua)) browser = 'chrome'
  else if (/safari\//.test(ua)) browser = 'safari'

  return { device, browser }
}

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, '').replace(/:\d+$/, '').slice(0, 253)
}

export function classifyReferrer(
  rawReferrer: string | undefined,
  ownHost: string
): { referrer: string; source: AnalyticsSource } {
  if (!rawReferrer || rawReferrer.length > 2048) {
    return { referrer: '', source: 'direct' }
  }

  let referrerHost: string
  try {
    const parsed = new URL(rawReferrer)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { referrer: '', source: 'direct' }
    }
    referrerHost = normalizeHost(parsed.hostname)
  } catch {
    return { referrer: '', source: 'direct' }
  }

  if (!referrerHost) return { referrer: '', source: 'direct' }

  const normalizedOwnHost = normalizeHost(ownHost)
  if (referrerHost === normalizedOwnHost) {
    return { referrer: referrerHost, source: 'internal' }
  }
  if (SEARCH_HOST_PATTERNS.some((pattern) => pattern.test(referrerHost))) {
    return { referrer: referrerHost, source: 'organic' }
  }
  if (SOCIAL_HOST_PATTERNS.some((pattern) => pattern.test(referrerHost))) {
    return { referrer: referrerHost, source: 'social' }
  }
  return { referrer: referrerHost, source: 'referral' }
}

function normalizeIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined
  return ip.trim().replace(/^::ffff:/i, '').replace(/^\[|\]$/g, '').split('%')[0] || undefined
}

function hashIp(event: H3Event): string | undefined {
  const ip = normalizeIp(getTrustedClientAddress(event))
  if (!ip) return undefined

  const runtimeConfig = useRuntimeConfig(event) as unknown as AnalyticsRuntimeConfig
  const secret = runtimeConfig.analyticsHashSecret || runtimeConfig.jwtSecret
  if (!secret) return undefined

  return createHmac('sha256', secret).update(`analytics-ip:${ip}`).digest('hex')
}

export function createAnalyticsPageView(
  event: H3Event,
  input: AnalyticsPageViewInput
): AnalyticsPageViewDocument | null {
  const path = normalizeAnalyticsPath(input.path)
  if (!path || !isTrackablePublicPath(path)) return null

  const userAgent = getRequestHeader(event, 'user-agent')
  if (isBotUserAgent(userAgent)) return null

  const { device, browser } = parseUserAgent(userAgent as string)
  const referrerData = input.isEntry
    ? classifyReferrer(input.referrer, getRequestURL(event).hostname)
    : { referrer: '', source: 'internal' as const }

  const eventId =
    typeof input.eventId === 'string' && EVENT_ID_PATTERN.test(input.eventId)
      ? input.eventId
      : randomUUID()

  return {
    eventId,
    path,
    referrer: referrerData.referrer,
    source: referrerData.source,
    isEntry: input.isEntry,
    device,
    browser,
    ipHash: hashIp(event),
    visitedAt: new Date(),
  }
}

export async function persistAnalyticsPageView(
  document: AnalyticsPageViewDocument
): Promise<IAnalyticsLog> {
  await connectDB()
  return AnalyticsLog.create(document)
}

export function isDuplicateAnalyticsEvent(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: number }).code === 11000
  )
}

export function parseAnalyticsRange(value: unknown): AnalyticsRange {
  const parsed = Number(value)
  return ANALYTICS_RANGES.includes(parsed as AnalyticsRange) ? (parsed as AnalyticsRange) : 30
}

export function getJakartaStartOfDay(date = new Date()): Date {
  const shifted = new Date(date.getTime() + JAKARTA_OFFSET_MS)
  return new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) -
      JAKARTA_OFFSET_MS
  )
}

export function getAnalyticsPeriodBounds(
  range: AnalyticsRange,
  now = new Date()
): AnalyticsPeriodBounds {
  const startToday = getJakartaStartOfDay(now)
  return {
    startToday,
    start7Days: new Date(startToday.getTime() - 6 * DAY_MS),
    start30Days: new Date(startToday.getTime() - 29 * DAY_MS),
    startRange: new Date(startToday.getTime() - (range - 1) * DAY_MS),
  }
}

function toJakartaDateKey(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ANALYTICS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function createJakartaDateKeys(range: AnalyticsRange, now = new Date()): string[] {
  const { startRange } = getAnalyticsPeriodBounds(range, now)
  return Array.from({ length: range }, (_, index) =>
    toJakartaDateKey(new Date(startRange.getTime() + index * DAY_MS))
  )
}

export function getAnalyticsInitialCookieName(path: string): string {
  // Synchronous FNV-1a keeps the same tiny implementation available in the
  // browser plugin without exposing the path in the cookie name.
  let hash = 0x811c9dc5
  for (let index = 0; index < path.length; index += 1) {
    hash ^= path.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return `${ANALYTICS_INITIAL_COOKIE_PREFIX}${(hash >>> 0).toString(16)}`
}

export function setAnalyticsNoStore(event: H3Event): void {
  setResponseHeaders(event, {
    'Cache-Control': 'private, no-store, max-age=0',
    Pragma: 'no-cache',
    Vary: 'Cookie',
  })
}

export function aggregationCount(result: Array<{ value?: number }> | undefined): number {
  return result?.[0]?.value ?? 0
}
