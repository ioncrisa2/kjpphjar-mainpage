import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { hasValue } from '../shared/company-data.ts'

describe('hasValue helper', () => {
  it('returns false for null, undefined, empty, and whitespace-only strings', () => {
    assert.equal(hasValue(null), false)
    assert.equal(hasValue(undefined), false)
    assert.equal(hasValue(''), false)
    assert.equal(hasValue('   '), false)
    assert.equal(hasValue('\n\t'), false)
  })

  it('returns false for placeholder markers containing [PERLU KONFIRMASI]', () => {
    assert.equal(hasValue('[PERLU KONFIRMASI]'), false)
    assert.equal(hasValue('STTD OJK [PERLU KONFIRMASI]'), false)
    assert.equal(hasValue('  [PERLU KONFIRMASI]  '), false)
  })

  it('returns true for real confirmed values', () => {
    assert.equal(hasValue('2.20.0166'), true)
    assert.equal(hasValue('P-1.13.0380 (Henricus Judi Adrianto)'), true)
    assert.equal(hasValue('STTD.KJPP-01/PM.22/2026'), true)
    assert.equal(hasValue('Senin – Jumat: 08.00 – 17.00 WIB'), true)
  })
})
