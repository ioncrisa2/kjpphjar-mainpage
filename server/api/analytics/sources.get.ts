import { AnalyticsLog } from '~/server/models/AnalyticsLog'
import {
  getAnalyticsPeriodBounds,
  parseAnalyticsRange,
  setAnalyticsNoStore,
} from '~/server/utils/analytics'
import { connectDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/require-admin'

interface BreakdownResult {
  _id: string
  count: number
}

interface SourcesAggregation {
  sources: BreakdownResult[]
  referrers: BreakdownResult[]
  total: Array<{ value: number }>
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  setAnalyticsNoStore(event)
  await connectDB()

  const range = parseAnalyticsRange(getQuery(event).range)
  const { startRange } = getAnalyticsPeriodBounds(range)
  const [result] = await AnalyticsLog.aggregate<SourcesAggregation>([
    { $match: { visitedAt: { $gte: startRange }, isEntry: true } },
    {
      $facet: {
        sources: [
          { $group: { _id: '$source', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
        ],
        referrers: [
          { $match: { referrer: { $exists: true, $ne: '' }, source: { $nin: ['internal'] } } },
          { $group: { _id: '$referrer', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
          { $limit: 8 },
        ],
        total: [{ $count: 'value' }],
      },
    },
  ])

  const totalEntries = result?.total?.[0]?.value || 0
  return {
    range,
    totalEntries,
    items: (result?.sources || []).map((item) => ({
      key: item._id,
      count: item.count,
      percentage: totalEntries ? Number(((item.count / totalEntries) * 100).toFixed(1)) : 0,
    })),
    referrers: (result?.referrers || []).map((item) => ({
      host: item._id,
      count: item.count,
    })),
  }
})
