import { AnalyticsLog } from '~/server/models/AnalyticsLog'
import {
  ANALYTICS_TIMEZONE,
  aggregationCount,
  createJakartaDateKeys,
  getAnalyticsPeriodBounds,
  parseAnalyticsRange,
  setAnalyticsNoStore,
} from '~/server/utils/analytics'
import { connectDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/require-admin'

interface CountResult {
  value: number
}

interface TrendResult {
  _id: string
  value: number
}

interface OverviewAggregation {
  viewsToday: CountResult[]
  uniqueToday: CountResult[]
  views7Days: CountResult[]
  unique7Days: CountResult[]
  views30Days: CountResult[]
  unique30Days: CountResult[]
  trendViews: TrendResult[]
  trendUnique: TrendResult[]
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  setAnalyticsNoStore(event)
  await connectDB()

  const range = parseAnalyticsRange(getQuery(event).range)
  const now = new Date()
  const bounds = getAnalyticsPeriodBounds(range, now)
  const earliestStart = new Date(
    Math.min(bounds.startRange.getTime(), bounds.start30Days.getTime())
  )
  const dateExpression = {
    $dateToString: {
      format: '%Y-%m-%d',
      date: '$visitedAt',
      timezone: ANALYTICS_TIMEZONE,
    },
  }
  const uniqueIpMatch = { ipHash: { $exists: true, $type: 'string', $ne: '' } }

  const [result] = await AnalyticsLog.aggregate<OverviewAggregation>([
    { $match: { visitedAt: { $gte: earliestStart, $lte: now } } },
    {
      $facet: {
        viewsToday: [{ $match: { visitedAt: { $gte: bounds.startToday } } }, { $count: 'value' }],
        uniqueToday: [
          { $match: { visitedAt: { $gte: bounds.startToday }, ...uniqueIpMatch } },
          { $group: { _id: '$ipHash' } },
          { $count: 'value' },
        ],
        views7Days: [{ $match: { visitedAt: { $gte: bounds.start7Days } } }, { $count: 'value' }],
        unique7Days: [
          { $match: { visitedAt: { $gte: bounds.start7Days }, ...uniqueIpMatch } },
          { $group: { _id: '$ipHash' } },
          { $count: 'value' },
        ],
        views30Days: [
          { $match: { visitedAt: { $gte: bounds.start30Days } } },
          { $count: 'value' },
        ],
        unique30Days: [
          { $match: { visitedAt: { $gte: bounds.start30Days }, ...uniqueIpMatch } },
          { $group: { _id: '$ipHash' } },
          { $count: 'value' },
        ],
        trendViews: [
          { $match: { visitedAt: { $gte: bounds.startRange } } },
          { $group: { _id: dateExpression, value: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        trendUnique: [
          { $match: { visitedAt: { $gte: bounds.startRange }, ...uniqueIpMatch } },
          { $group: { _id: { date: dateExpression, ipHash: '$ipHash' } } },
          { $group: { _id: '$_id.date', value: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ])

  const viewsByDate = new Map((result?.trendViews || []).map((item) => [item._id, item.value]))
  const uniquesByDate = new Map((result?.trendUnique || []).map((item) => [item._id, item.value]))
  const trend = createJakartaDateKeys(range, now).map((date) => ({
    date,
    views: viewsByDate.get(date) || 0,
    uniqueVisitors: uniquesByDate.get(date) || 0,
  }))

  return {
    generatedAt: now.toISOString(),
    timezone: ANALYTICS_TIMEZONE,
    range,
    periods: {
      today: {
        views: aggregationCount(result?.viewsToday),
        uniqueVisitors: aggregationCount(result?.uniqueToday),
      },
      last7Days: {
        views: aggregationCount(result?.views7Days),
        uniqueVisitors: aggregationCount(result?.unique7Days),
      },
      last30Days: {
        views: aggregationCount(result?.views30Days),
        uniqueVisitors: aggregationCount(result?.unique30Days),
      },
    },
    trend,
  }
})
