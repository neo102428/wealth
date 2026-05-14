import { describe, expect, it } from 'vitest'
import { formatAmount, formatDate } from './format'

describe('formatAmount', () => {
  it('formats yuan amounts with separators and cents', () => {
    expect(formatAmount(1234567.8)).toBe('¥1,234,567.80')
  })

  it('keeps the sign when formatting negative amounts', () => {
    expect(formatAmount(-9876.5)).toBe('¥-9,876.50')
  })
})

describe('formatDate', () => {
  it('returns the stored date string', () => {
    expect(formatDate('2026-05-14')).toBe('2026-05-14')
  })
})
