import { describe, expect, it } from 'vitest'
import { achievements } from '@/data/load'
import { aggregateAllParticipants } from '@/utils/aggregate-participant'
import { aggregateAllTeams, aggregateTeam } from '@/utils/aggregate-team'
import { fixtureSnapshot, fixtureStudents, fixtureTeams } from '@/test/fixtures'

describe('aggregateTeam', () => {
  it('sums member statistics', () => {
    const participants = aggregateAllParticipants(fixtureStudents, fixtureSnapshot, achievements)
    const phoenix = aggregateTeam(fixtureTeams[0], participants.filter((p) => p.student.team === 'phoenix'))

    expect(phoenix.members).toHaveLength(2)
    expect(phoenix.commits).toBe(2)
    expect(phoenix.pullRequests).toBe(1)
    expect(phoenix.reviews).toBe(1)
    expect(phoenix.issuesClosed).toBe(1)
    expect(phoenix.isActive).toBe(true)
  })

  it('marks a team with no activity as inactive', () => {
    const participants = aggregateAllParticipants(fixtureStudents, fixtureSnapshot, achievements)
    const teams = aggregateAllTeams(fixtureTeams, participants)
    const beacon = teams.find((team) => team.team.id === 'beacon')
    expect(beacon?.isActive).toBe(false)
    expect(beacon?.commits).toBe(0)
  })
})
