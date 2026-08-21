import { describe, expect, it } from 'vitest'
import { achievements } from '@/data/load'
import { aggregateAllParticipants } from '@/utils/aggregate-participant'
import { filterParticipants } from '@/utils/filter-participants'
import { fixtureSnapshot, fixtureStudents } from '@/test/fixtures'

describe('filterParticipants', () => {
  const participants = aggregateAllParticipants(fixtureStudents, fixtureSnapshot, achievements)

  it('filters by exact, case-sensitive name', () => {
    expect(filterParticipants(participants, { query: 'Rahul' })).toHaveLength(1)
    expect(filterParticipants(participants, { query: 'rahul' })).toHaveLength(0)
  })

  it('does not match GitHub username until that workshop Issue is implemented', () => {
    expect(filterParticipants(participants, { query: 'om' })).toHaveLength(0)
  })

  it('filters students who have commits, PRs, or no activity', () => {
    expect(filterParticipants(participants, { hasCommits: true }).every((p) => p.commits > 0)).toBe(true)
    expect(filterParticipants(participants, { hasPr: true }).map((p) => p.student.github)).toEqual(['rahul', 'om'])
    expect(filterParticipants(participants, { disconnected: true }).map((p) => p.student.github)).toEqual(['arnav'])
    expect(filterParticipants(participants, { noActivity: true }).map((p) => p.student.github)).toEqual(['arnav'])
  })

  it('filters by team id when provided', () => {
    expect(filterParticipants(participants, { teamId: 'phoenix' }).every((p) => p.student.team === 'phoenix')).toBe(
      true,
    )
  })
})
