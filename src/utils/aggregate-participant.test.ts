import { describe, expect, it } from 'vitest'
import { achievements } from '@/data/load'
import { aggregateAllParticipants, aggregateParticipant } from '@/utils/aggregate-participant'
import { fixtureSnapshot, fixtureStudents } from '@/test/fixtures'

describe('aggregateParticipant', () => {
  it('counts commits, PRs, reviews, and collaborators for an active student', () => {
    const rahul = aggregateParticipant(fixtureStudents[0], fixtureSnapshot, achievements, fixtureStudents)

    expect(rahul.commits).toBe(1)
    expect(rahul.pullRequests).toBe(1)
    expect(rahul.mergedPullRequests).toBe(0)
    expect(rahul.reviews).toBe(0)
    expect(rahul.collaboratedWith.sort()).toEqual(['gauri', 'lina'])
    expect(rahul.isActive).toBe(true)
    expect(rahul.isDisconnected).toBe(false)
    expect(rahul.achievements).toContain('first_commit')
    expect(rahul.achievements).toContain('first_pr')
  })

  it('detects cross-team reviews', () => {
    const lina = aggregateParticipant(fixtureStudents[3], fixtureSnapshot, achievements, fixtureStudents)
    expect(lina.reviews).toBe(1)
    expect(lina.crossTeamReviews).toBe(1)
    expect(lina.achievements).toContain('cross_team_review')
  })

  it('marks students with no GitHub activity as disconnected', () => {
    const arnav = aggregateParticipant(fixtureStudents[4], fixtureSnapshot, achievements, fixtureStudents)
    expect(arnav.commits).toBe(0)
    expect(arnav.isDisconnected).toBe(true)
    expect(arnav.needsAttention).toContain('disconnected')
    expect(arnav.needsAttention).toContain('no-commits')
  })

  it('flags failing CI and unreviewed open PRs on the author', () => {
    const om = aggregateParticipant(fixtureStudents[2], fixtureSnapshot, achievements, fixtureStudents)
    expect(om.needsAttention).toContain('failing-ci')
    expect(om.needsAttention).toContain('open-pr-without-review')
  })

  it('aggregates every student in the roster', () => {
    const all = aggregateAllParticipants(fixtureStudents, fixtureSnapshot, achievements)
    expect(all).toHaveLength(5)
  })
})
