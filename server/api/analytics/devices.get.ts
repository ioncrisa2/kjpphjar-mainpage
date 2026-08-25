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

interface DevicesAggregation {
  devices: BreakdownResult[]
  browsers: BreakdownResult[]
  total: Array<{ value: number }>
}

function withPercentage(items: BreakdownResult[], total: number) {
  return items.map((item) => ({
    key: item._id,
    count: item.count,
    percentage: total ? Number(((item.count / total) * 100).toFixed(1)) : 0,
  }))
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  setAnalyticsNoStore(event)
  await connectDB()

  const range = parseAnalyticsRange(getQuery(event).range)
  const { startRange } = getAnalyticsPeriodBounds(range)
  const [result] = await AnalyticsLog.aggregate<DevicesAggregation>([
    { $match: { visitedAt: { $gte: startRange } } },
    {
      $facet: {
        devices: [
          { $group: { _id: '$device', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
        ],
        browsers: [
          { $group: { _id: '$browser', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
        ],
        total: [{ $count: 'value' }],
      },
    },
  ])

  const totalViews = result?.total?.[0]?.value || 0
  return {
    range,
    totalViews,
    devices: withPercentage(result?.devices || [], totalViews),
    browsers: withPercentage(result?.browsers || [], totalViews),
  }
})
