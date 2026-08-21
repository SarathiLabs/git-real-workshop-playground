/**
 * WORKSHOP EXERCISE — not implemented yet.
 *
 * Two other teams import this the moment it works:
 *   - the live "last refreshed" clock in the header
 *   - timestamps in the activity feed
 *
 * So this is a real dependency, not a private task. If you change the
 * signature, say so on your pull request before you merge, because somebody
 * else is writing code against it right now.
 *
 * Expected behaviour (the skipped tests in format-relative-time.test.ts spell
 * this out precisely):
 *
 *   under 45 seconds   just now
 *   under an hour      7 minutes ago      (1 minute ago, singular)
 *   under a day        3 hours ago        (1 hour ago, singular)
 *   under two days     yesterday
 *   under a week       4 days ago
 *   older              12 Aug
 *   unparseable        unknown
 *   in the future      just now
 */
export function formatRelativeTime(_value: string | number | Date, _now: Date = new Date()): string {
  throw new Error(
    'formatRelativeTime is not implemented yet. See src/utils/format-relative-time.test.ts.',
  )
}
