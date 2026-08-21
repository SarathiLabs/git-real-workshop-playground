import type { ParticipantStats } from '@/types'

export type ParticipantFilter = {
  query?: string
  teamId?: string | null
  hasCommits?: boolean
  hasPr?: boolean
  hasReviews?: boolean
  noActivity?: boolean
  disconnected?: boolean
}

/**
 * Search is intentionally case-sensitive and name-only.
 * Workshop Issues: make it case-insensitive and include GitHub username.
 */
export function filterParticipants(
  participants: ParticipantStats[],
  filters: ParticipantFilter = {},
) {
  return participants.filter((participant) => {
    if (filters.query) {
      if (!participant.student.name.includes(filters.query)) return false
    }

    if (filters.teamId) {
      if (participant.student.team !== filters.teamId) return false
    }

    if (filters.hasCommits && participant.commits === 0) return false
    if (filters.hasPr && participant.pullRequests === 0) return false
    if (filters.hasReviews && participant.reviews === 0) return false
    if (filters.noActivity && participant.isActive) return false
    if (filters.disconnected && !participant.isDisconnected) return false

    return true
  })
}
