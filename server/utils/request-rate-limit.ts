import { createHash, createHmac } from 'node:crypto'
import type { H3Event } from 'h3'
import { RateLimitBucket as PersistentRateLimitBucket } from '~/server/models/RateLimitBucket'
import { connectDB } from '~/server/utils/db'

interface RateLimitOptions {
  namespace: string
  limit: number
  windowMs: number
  discriminator?: string
}

interface RateLimitBucket {
  count: number
  resetAt: number
}

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  retryAfterSeconds: number
}

const buckets = new Map<string, RateLimitBucket>()
const MAX_BUCKETS = 50_000
let nextCleanupAt = 0

export function getTrustedClientAddress(event: H3Event): string {
  if (process.env.TRUST_PROXY === 'true') {
    return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  }

  return getRequestIP(event) || 'unknown'
}

function anonymizedClientKey(event: H3Event): string {
  const address = getTrustedClientAddress(event)
  return createHash('sha256').update(address).digest('hex')
}

function persistentClientKey(event: H3Event, options: RateLimitOptions, windowStart: number) {
  const config = useRuntimeConfig(event)
  const secret = String(config.analyticsHashSecret || config.jwtSecret)
  const discriminator = options.discriminator || 'global'
  return createHmac('sha256', secret)
    .update(`${options.namespace}:${getTrustedClientAddress(event)}:${discriminator}:${windowStart}`)
    .digest('hex')
}

function cleanupExpiredBuckets(now: number) {
  if (now < nextCleanupAt && buckets.size <= MAX_BUCKETS) return

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }

  while (buckets.size > MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value as string | undefined
    if (!oldestKey) break
    buckets.delete(oldestKey)
  }

  nextCleanupAt = now + 60_000
}

export function consumeRequestRateLimit(
  event: H3Event,
  options: RateLimitOptions,
): RateLimitResult {
  const now = Date.now()
  cleanupExpiredBuckets(now)

  const discriminator = options.discriminator
    ? createHash('sha256').update(options.discriminator).digest('hex')
    : 'global'
  const key = `${options.namespace}:${anonymizedClientKey(event)}:${discriminator}`
  let bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + options.windowMs }
    buckets.set(key, bucket)
  }

  const allowed = bucket.count < options.limit
  if (allowed) bucket.count += 1

  return {
    allowed,
    limit: options.limit,
    remaining: Math.max(0, options.limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  }
}

export async function consumePersistentRequestRateLimit(
  event: H3Event,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStart = Math.floor(now / options.windowMs) * options.windowMs
  const resetAt = windowStart + options.windowMs
  const key = persistentClientKey(event, options, windowStart)

  await connectDB()
  const bucket = await PersistentRateLimitBucket.findByIdAndUpdate(
    key,
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt: new Date(resetAt + options.windowMs) },
    },
    { new: true, upsert: true, setDefaultsOnInsert: false },
  ).lean()

  const count = bucket?.count || 1
  return {
    allowed: count <= options.limit,
    limit: options.limit,
    remaining: Math.max(0, options.limit - count),
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  }
}

export async function enforcePersistentRequestRateLimit(
  event: H3Event,
  options: RateLimitOptions,
): Promise<void> {
  const result = await consumePersistentRequestRateLimit(event, options)
  setResponseHeaders(event, {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
  })

  if (!result.allowed) {
    setResponseHeader(event, 'Retry-After', result.retryAfterSeconds)
    throw createError({
      statusCode: 429,
      statusMessage: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
    })
  }
}
