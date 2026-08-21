import type { TeamStats } from '@/types'

export type TeamSortKey = 'name' | 'commits' | 'prs' | 'reviews'

/**
 * Only Name sorting is implemented.
 * Commits / PRs / Reviews are workshop exercises.
 */
export function sortTeams(teams: TeamStats[], sortBy: TeamSortKey) {
  if (sortBy === 'name') {
    return [...teams].sort((a, b) => a.team.name.localeCompare(b.team.name))
  }

  return [...teams]
}
