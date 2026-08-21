import { describe, expect, it } from 'vitest'
import { achievements } from '@/data/load'
import { aggregateAllParticipants } from '@/utils/aggregate-participant'
import { aggregateAllTeams } from '@/utils/aggregate-team'
import { sortTeams } from '@/utils/sort-teams'
import { fixtureSnapshot, fixtureStudents, fixtureTeams } from '@/test/fixtures'

function teams() {
  const participants = aggregateAllParticipants(fixtureStudents, fixtureSnapshot, achievements)
  return aggregateAllTeams(fixtureTeams, participants)
}

describe('sortTeams', () => {
  it('sorts by team name', () => {
    const sorted = sortTeams(teams(), 'name')
    expect(sorted.map((team) => team.team.name)).toEqual(['Ashes', 'Atlas', 'Beacon', 'Phoenix'])
  })
})

/**
 * WORKSHOP EXERCISE — sorting the Teams page by activity.
 *
 * These tests are real and they pass once `sortTeams` supports the other keys.
 * They are skipped so that `main` stays green while nobody has picked the
 * Issue up yet.
 *
 * Your job:
 *   1. Change `describe.skip` below to `describe`.
 *   2. Run `npm test` and watch it fail. Read the failure.
 *   3. Implement the sorts in src/utils/sort-teams.ts until it passes.
 *   4. Push. The Test check on your pull request goes from red to green.
 *
 * Highest count first in every case.
 */
describe.skip('sortTeams by activity', () => {
  it('sorts teams by commit count, highest first', () => {
    const sorted = sortTeams(teams(), 'commits')
    expect(sorted.map((team) => team.commits)).toEqual([2, 1, 0, 0])
    expect(sorted[0].team.name).toBe('Phoenix')
  })

  it('sorts teams by pull request count, highest first', () => {
    const sorted = sortTeams(teams(), 'prs')
    expect(sorted.map((team) => team.pullRequests)).toEqual([1, 1, 0, 0])
  })

  it('sorts teams by review count, highest first', () => {
    const sorted = sortTeams(teams(), 'reviews')
    expect(sorted.map((team) => team.reviews)).toEqual([1, 1, 0, 0])
    expect(
      sorted
        .slice(0, 2)
        .map((team) => team.team.name)
        .sort(),
    ).toEqual(['Atlas', 'Phoenix'])
  })

  it('does not modify the array it was given', () => {
    const original = teams()
    const before = original.map((team) => team.team.id)
    sortTeams(original, 'commits')
    expect(original.map((team) => team.team.id)).toEqual(before)
  })
})
