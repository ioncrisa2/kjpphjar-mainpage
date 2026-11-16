import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  calculatePeriodDeltaPercent,
  createJakartaDateKeys,
  createJakartaDateKeysFromStart,
  getAnalyticsPeriodBounds,
  parseAnalyticsRange,
} from '../shared/analytics.ts'

describe('analytics period comparison helpers', () => {
  it('parses valid analytics ranges and falls back to 30', () => {
    assert.equal(parseAnalyticsRange(7), 7)
    assert.equal(parseAnalyticsRange('30'), 30)
    assert.equal(parseAnalyticsRange('90'), 90)
    assert.equal(parseAnalyticsRange('14'), 30)
  })

  it('creates non-overlapping current and previous bounds of equal length', () => {
    const now = new Date('2026-11-16T10:00:00.000Z') // 17:00 WIB
    const bounds = getAnalyticsPeriodBounds(7, now)

    const currentKeys = createJakartaDateKeys(7, now)
    const previousKeys = createJakartaDateKeysFromStart(bounds.previousStartRange, 7)

    assert.equal(currentKeys.length, 7)
    assert.equal(previousKeys.length, 7)
    assert.equal(currentKeys[0], '2026-11-10')
    assert.equal(currentKeys[6], '2026-11-16')
    assert.equal(previousKeys[0], '2026-11-03')
    assert.equal(previousKeys[6], '2026-11-09')
    assert.ok(bounds.previousEndRange.getTime() < bounds.startRange.getTime())
  })

  it('calculates rounded percentage delta safely', () => {
    assert.equal(calculatePeriodDeltaPercent(120, 100), 20)
    assert.equal(calculatePeriodDeltaPercent(75, 100), -25)
    assert.equal(calculatePeriodDeltaPercent(112, 99), 13.1)
    assert.equal(calculatePeriodDeltaPercent(0, 0), 0)
    assert.equal(calculatePeriodDeltaPercent(25, 0), null)
  })
})
