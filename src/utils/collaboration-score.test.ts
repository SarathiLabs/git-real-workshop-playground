import { describe, expect, it } from 'vitest'
import { calculateCollaborationScore } from '@/utils/collaboration-score'

describe('calculateCollaborationScore', () => {
  it('returns a weighted total using the current (imperfect) formula', () => {
    expect(
      calculateCollaborationScore({
        commits: 2,
        pullRequests: 1,
        reviews: 1,
        crossTeamReviews: 1,
        issuesClosed: 1,
      }),
    ).toBe(2 * 5 + 1 * 3 + 1 * 2 + 1 * 4 + 1 * 2)
  })

  it('returns 0 for a student with no activity', () => {
    expect(
      calculateCollaborationScore({
        commits: 0,
        pullRequests: 0,
        reviews: 0,
        crossTeamReviews: 0,
        issuesClosed: 0,
      }),
    ).toBe(0)
  })
})
