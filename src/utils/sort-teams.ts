import type { TeamStats } from '@/types'

export type TeamSortKey = 'name' | 'commits' | 'prs' | 'reviews'

/**
 * Only Name sorting is implemented.
 *
 * Commits, PRs, and Reviews are a workshop exercise. The tests for them already
 * exist in sort-teams.test.ts inside a `describe.skip` block — unskip it, watch
 * the Test check go red, then make it green.
 */
export function sortTeams(teams: TeamStats[], sortBy: TeamSortKey) {
  if (sortBy === 'name') {
    return [...teams].sort((a, b) => a.team.name.localeCompare(b.team.name))
  }

  return [...teams]
}
