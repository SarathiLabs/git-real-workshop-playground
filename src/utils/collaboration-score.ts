import type { CollaborationScoreInput } from '@/types'

/**
 * Simple, readable scoring for the workshop Feature Lab.
 *
 * Intentionally imperfect: commits are weighted higher than reviews.
 * A good Issue is to rebalance this toward reviews and cross-team work.
 */
export function calculateCollaborationScore(input: CollaborationScoreInput) {
  const { commits, pullRequests, reviews, crossTeamReviews, issuesClosed } = input

  return (
    commits * 5 +
    pullRequests * 3 +
    reviews * 2 +
    crossTeamReviews * 4 +
    issuesClosed * 2
  )
}
