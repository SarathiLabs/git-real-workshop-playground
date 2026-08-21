import { describe, expect, it } from 'vitest'
import { achievements } from '@/data/load'
import { aggregateAllParticipants } from '@/utils/aggregate-participant'
import { aggregateAllTeams } from '@/utils/aggregate-team'
import { sortTeams } from '@/utils/sort-teams'
import { fixtureSnapshot, fixtureStudents, fixtureTeams } from '@/test/fixtures'

describe('sortTeams', () => {
  function teams() {
    const participants = aggregateAllParticipants(fixtureStudents, fixtureSnapshot, achievements)
    return aggregateAllTeams(fixtureTeams, participants)
  }

  it('sorts by team name', () => {
    const sorted = sortTeams(teams(), 'name')
    expect(sorted.map((team) => team.team.name)).toEqual(['Ashes', 'Atlas', 'Beacon', 'Phoenix'])
  })

  it('does not yet sort by commits, PRs, or reviews', () => {
    const original = teams()
    expect(sortTeams(original, 'commits').map((team) => team.team.id)).toEqual(original.map((team) => team.team.id))
    expect(sortTeams(original, 'prs').map((team) => team.team.id)).toEqual(original.map((team) => team.team.id))
    expect(sortTeams(original, 'reviews').map((team) => team.team.id)).toEqual(original.map((team) => team.team.id))
  })

  it.todo('sorts teams by pull request count')
  it.todo('sorts teams by commit count')
  it.todo('sorts teams by review count')
})
