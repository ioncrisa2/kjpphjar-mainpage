import { AnalyticsLog } from '~/server/models/AnalyticsLog'
import {
  ANALYTICS_TIMEZONE,
  aggregationCount,
  calculatePeriodDeltaPercent,
  createJakartaDateKeys,
  createJakartaDateKeysFromStart,
  getAnalyticsPeriodBounds,
  normalizeAnalyticsPath,
  parseAnalyticsRange,
  setAnalyticsNoStore,
} from '~/server/utils/analytics'
import { connectDB } from '~/server/utils/db'
import { requirePermission } from '~/server/utils/require-auth'

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
  prevRangeViews?: CountResult[]
  prevRangeUnique?: CountResult[]
  prevTrendViews?: TrendResult[]
  prevTrendUnique?: TrendResult[]
  pathRangeViews?: CountResult[]
  pathRangeUnique?: CountResult[]
  pathTrendViews?: TrendResult[]
  pathTrendUnique?: TrendResult[]
}

export default defineEventHandler(async (event) => {
  await requirePermission(event, 'analytics.view')
  setAnalyticsNoStore(event)
  await connectDB()

  const query = getQuery(event)
  const range = parseAnalyticsRange(query.range)
  const includeCompare = query.compare === '1' || query.compare === 'true'
  const requestedPath = normalizeAnalyticsPath(query.path)

  const now = new Date()
  const bounds = getAnalyticsPeriodBounds(range, now)
  const earliestTimestamp = includeCompare
    ? Math.min(bounds.previousStartRange.getTime(), bounds.start30Days.getTime())
    : Math.min(bounds.startRange.getTime(), bounds.start30Days.getTime())
  const earliestStart = new Date(earliestTimestamp)

  const dateExpression = {
    $dateToString: {
      format: '%Y-%m-%d',
      date: '$visitedAt',
      timezone: ANALYTICS_TIMEZONE,
    },
  }
  const uniqueIpMatch = { ipHash: { $exists: true, $type: 'string', $ne: '' } }

  const facets: Record<string, any[]> = {
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
  }

  if (includeCompare) {
    const prevDateMatch = {
      visitedAt: { $gte: bounds.previousStartRange, $lte: bounds.previousEndRange },
    }
    facets.prevRangeViews = [{ $match: prevDateMatch }, { $count: 'value' }]
    facets.prevRangeUnique = [
      { $match: { ...prevDateMatch, ...uniqueIpMatch } },
      { $group: { _id: '$ipHash' } },
      { $count: 'value' },
    ]
    facets.prevTrendViews = [
      { $match: prevDateMatch },
      { $group: { _id: dateExpression, value: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]
    facets.prevTrendUnique = [
      { $match: { ...prevDateMatch, ...uniqueIpMatch } },
      { $group: { _id: { date: dateExpression, ipHash: '$ipHash' } } },
      { $group: { _id: '$_id.date', value: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]
  }

  if (requestedPath) {
    const pathMatch = { visitedAt: { $gte: bounds.startRange }, path: requestedPath }
    facets.pathRangeViews = [{ $match: pathMatch }, { $count: 'value' }]
    facets.pathRangeUnique = [
      { $match: { ...pathMatch, ...uniqueIpMatch } },
      { $group: { _id: '$ipHash' } },
      { $count: 'value' },
    ]
    facets.pathTrendViews = [
      { $match: pathMatch },
      { $group: { _id: dateExpression, value: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]
    facets.pathTrendUnique = [
      { $match: { ...pathMatch, ...uniqueIpMatch } },
      { $group: { _id: { date: dateExpression, ipHash: '$ipHash' } } },
      { $group: { _id: '$_id.date', value: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]
  }

  const [result] = await AnalyticsLog.aggregate<OverviewAggregation>([
    { $match: { visitedAt: { $gte: earliestStart, $lte: now } } },
    { $facet: facets },
  ])

  const currentKeys = createJakartaDateKeys(range, now)
  const viewsByDate = new Map((result?.trendViews || []).map((item) => [item._id, item.value]))
  const uniquesByDate = new Map((result?.trendUnique || []).map((item) => [item._id, item.value]))
  const trend = currentKeys.map((date) => ({
    date,
    views: viewsByDate.get(date) || 0,
    uniqueVisitors: uniquesByDate.get(date) || 0,
  }))

  const currentRangeViews = trend.reduce((total, point) => total + point.views, 0)
  const currentRangeUnique = trend.reduce((total, point) => total + point.uniqueVisitors, 0)

  const response: Record<string, unknown> = {
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

  if (includeCompare) {
    const prevViews = aggregationCount(result?.prevRangeViews)
    const prevUnique = aggregationCount(result?.prevRangeUnique)
    const prevViewsByDate = new Map(
      (result?.prevTrendViews || []).map((item) => [item._id, item.value])
    )
    const prevUniquesByDate = new Map(
      (result?.prevTrendUnique || []).map((item) => [item._id, item.value])
    )
    const prevKeys = createJakartaDateKeysFromStart(bounds.previousStartRange, range)

    response.comparison = {
      current: { views: currentRangeViews, uniqueVisitors: currentRangeUnique },
      previous: { views: prevViews, uniqueVisitors: prevUnique },
      deltaPercent: {
        views: calculatePeriodDeltaPercent(currentRangeViews, prevViews),
      },
      trend: prevKeys.map((date) => ({
        date,
        views: prevViewsByDate.get(date) || 0,
        uniqueVisitors: prevUniquesByDate.get(date) || 0,
      })),
    }
  }

  if (requestedPath) {
    const pathViewsByDate = new Map(
      (result?.pathTrendViews || []).map((item) => [item._id, item.value])
    )
    const pathUniquesByDate = new Map(
      (result?.pathTrendUnique || []).map((item) => [item._id, item.value])
    )

    response.selectedPath = {
      path: requestedPath,
      views: aggregationCount(result?.pathRangeViews),
      uniqueVisitors: aggregationCount(result?.pathRangeUnique),
      trend: currentKeys.map((date) => ({
        date,
        views: pathViewsByDate.get(date) || 0,
        uniqueVisitors: pathUniquesByDate.get(date) || 0,
      })),
    }
  }

  return response
})
