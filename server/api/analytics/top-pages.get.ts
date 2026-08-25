import { AnalyticsLog } from '~/server/models/AnalyticsLog'
import {
  getAnalyticsPeriodBounds,
  parseAnalyticsRange,
  setAnalyticsNoStore,
} from '~/server/utils/analytics'
import { connectDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/require-admin'

interface PageResult {
  _id: string
  views: number
  uniqueVisitors: number
}

interface TopPagesAggregation {
  items: PageResult[]
  total: Array<{ value: number }>
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  setAnalyticsNoStore(event)
  await connectDB()

  const range = parseAnalyticsRange(getQuery(event).range)
  const { startRange } = getAnalyticsPeriodBounds(range)
  const [result] = await AnalyticsLog.aggregate<TopPagesAggregation>([
    { $match: { visitedAt: { $gte: startRange } } },
    {
      $facet: {
        items: [
          {
            $group: {
              _id: { path: '$path', visitor: { $ifNull: ['$ipHash', null] } },
              views: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.path',
              views: { $sum: '$views' },
              uniqueVisitors: {
                $sum: { $cond: [{ $ne: ['$_id.visitor', null] }, 1, 0] },
              },
            },
          },
          { $sort: { views: -1, _id: 1 } },
          { $limit: 10 },
        ],
        total: [{ $count: 'value' }],
      },
    },
  ])

  const totalViews = result?.total?.[0]?.value || 0
  return {
    range,
    totalViews,
    items: (result?.items || []).map((item) => ({
      path: item._id,
      views: item.views,
      uniqueVisitors: item.uniqueVisitors,
      percentage: totalViews ? Number(((item.views / totalViews) * 100).toFixed(1)) : 0,
    })),
  }
})
