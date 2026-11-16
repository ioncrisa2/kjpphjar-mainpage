export const ANALYTICS_RANGES = [7, 30, 90] as const
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number]

export const ANALYTICS_TIMEZONE = 'Asia/Jakarta'

const DAY_MS = 24 * 60 * 60 * 1000
const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000

export interface AnalyticsPeriodBounds {
  startToday: Date
  start7Days: Date
  start30Days: Date
  startRange: Date
  previousStartRange: Date
  previousEndRange: Date
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
  const startRange = new Date(startToday.getTime() - (range - 1) * DAY_MS)
  const previousStartRange = new Date(startRange.getTime() - range * DAY_MS)
  const previousEndRange = new Date(startRange.getTime() - 1)
  return {
    startToday,
    start7Days: new Date(startToday.getTime() - 6 * DAY_MS),
    start30Days: new Date(startToday.getTime() - 29 * DAY_MS),
    startRange,
    previousStartRange,
    previousEndRange,
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

export function createJakartaDateKeysFromStart(startDate: Date, count: number): string[] {
  return Array.from({ length: count }, (_, index) =>
    toJakartaDateKey(new Date(startDate.getTime() + index * DAY_MS))
  )
}

export function createJakartaDateKeys(range: AnalyticsRange, now = new Date()): string[] {
  const { startRange } = getAnalyticsPeriodBounds(range, now)
  return createJakartaDateKeysFromStart(startRange, range)
}

export function calculatePeriodDeltaPercent(current: number, previous: number): number | null {
  if (previous <= 0) {
    return current <= 0 ? 0 : null
  }
  return Math.round(((current - previous) / previous) * 1000) / 10
}
