import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from '@/utils/format-relative-time'

const NOW = new Date('2026-08-22T12:00:00.000Z')

function ago(milliseconds: number) {
  return new Date(NOW.getTime() - milliseconds).toISOString()
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * WORKSHOP EXERCISE — sorting out relative timestamps.
 *
 * These tests are real. They are skipped so `main` stays green while the
 * function is still a stub.
 *
 *   1. Change `describe.skip` to `describe`
 *   2. `npm test` — watch it fail, and read what it expected
 *   3. Implement `formatRelativeTime` until it passes
 *
 * Every case below is passed an explicit `now`, so these never depend on when
 * you happen to run them. That is deliberate: a test that behaves differently
 * at 23:59 is worse than no test.
 */
describe.skip('formatRelativeTime', () => {
  it('says "just now" for anything under 45 seconds', () => {
    expect(formatRelativeTime(ago(0), NOW)).toBe('just now')
    expect(formatRelativeTime(ago(20 * SECOND), NOW)).toBe('just now')
    expect(formatRelativeTime(ago(44 * SECOND), NOW)).toBe('just now')
  })

  it('counts minutes, and gets the singular right', () => {
    expect(formatRelativeTime(ago(1 * MINUTE), NOW)).toBe('1 minute ago')
    expect(formatRelativeTime(ago(7 * MINUTE), NOW)).toBe('7 minutes ago')
    expect(formatRelativeTime(ago(59 * MINUTE), NOW)).toBe('59 minutes ago')
  })

  it('counts hours, and gets the singular right', () => {
    expect(formatRelativeTime(ago(1 * HOUR), NOW)).toBe('1 hour ago')
    expect(formatRelativeTime(ago(3 * HOUR), NOW)).toBe('3 hours ago')
    expect(formatRelativeTime(ago(23 * HOUR), NOW)).toBe('23 hours ago')
  })

  it('says "yesterday" rather than "1 day ago"', () => {
    expect(formatRelativeTime(ago(25 * HOUR), NOW)).toBe('yesterday')
    expect(formatRelativeTime(ago(47 * HOUR), NOW)).toBe('yesterday')
  })

  it('counts days up to a week', () => {
    expect(formatRelativeTime(ago(3 * DAY), NOW)).toBe('3 days ago')
    expect(formatRelativeTime(ago(6 * DAY), NOW)).toBe('6 days ago')
  })

  it('falls back to a date once it is more than a week old', () => {
    // 22 August minus 10 days is 12 August.
    const formatted = formatRelativeTime(ago(10 * DAY), NOW)
    expect(formatted).toMatch(/^\d{1,2} [A-Z][a-z]{2}$/)
    expect(formatted).toContain('12')
    expect(formatted).toContain('Aug')
  })

  it('accepts a Date and a numeric timestamp, not just a string', () => {
    expect(formatRelativeTime(new Date(NOW.getTime() - 5 * MINUTE), NOW)).toBe('5 minutes ago')
    expect(formatRelativeTime(NOW.getTime() - 5 * MINUTE, NOW)).toBe('5 minutes ago')
  })

  it('never throws on rubbish input', () => {
    expect(formatRelativeTime('not a date', NOW)).toBe('unknown')
    expect(formatRelativeTime('', NOW)).toBe('unknown')
    expect(formatRelativeTime(Number.NaN, NOW)).toBe('unknown')
  })

  it('treats a future timestamp as "just now" rather than a negative count', () => {
    // Clock skew between GitHub and the browser is real, and "in -3 minutes"
    // on a projector looks like a bug.
    expect(formatRelativeTime(new Date(NOW.getTime() + 30 * SECOND), NOW)).toBe('just now')
    expect(formatRelativeTime(new Date(NOW.getTime() + 2 * HOUR), NOW)).toBe('just now')
  })
})
