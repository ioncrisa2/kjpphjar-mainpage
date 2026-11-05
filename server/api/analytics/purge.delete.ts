import { AnalyticsLog } from '~/server/models/AnalyticsLog'
import { setAnalyticsNoStore } from '~/server/utils/analytics'
import { connectDB } from '~/server/utils/db'
import { requirePermission } from '~/server/utils/require-auth'

const RETENTION_DAYS = 90

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'analytics.purge')
  setAnalyticsNoStore(event)

  const body = (await readBody<{ confirmation?: unknown }>(event)) || {}
  if (body.confirmation !== 'PURGE_ANALYTICS_90_DAYS') {
    throw createError({ statusCode: 400, statusMessage: 'Konfirmasi purge tidak valid.' })
  }

  await connectDB()
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
  const result = await AnalyticsLog.deleteMany({ visitedAt: { $lt: cutoff } })

  return {
    success: true,
    retentionDays: RETENTION_DAYS,
    cutoff: cutoff.toISOString(),
    deletedCount: result.deletedCount,
  }
})
