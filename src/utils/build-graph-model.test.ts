import { describe, expect, it } from 'vitest'
import { achievements } from '@/data/load'
import { aggregateAllParticipants } from '@/utils/aggregate-participant'
import { aggregateAllTeams } from '@/utils/aggregate-team'
import { buildGraphModel } from '@/utils/build-graph-model'
import { fixtureSnapshot, fixtureStudents, fixtureTeams } from '@/test/fixtures'

describe('buildGraphModel', () => {
  function model() {
    const participants = aggregateAllParticipants(fixtureStudents, fixtureSnapshot, achievements)
    const teams = aggregateAllTeams(fixtureTeams, participants)
    return buildGraphModel(participants, teams, fixtureSnapshot)
  }

  it('creates student, team, PR, and main nodes', () => {
    const graph = model()
    const types = new Set(graph.nodes.map((node) => node.type))
    expect(types.has('student')).toBe(true)
    expect(types.has('team')).toBe(true)
    expect(types.has('pullRequest')).toBe(true)
    expect(types.has('main')).toBe(true)
  })

  it('creates authored, reviewed, and cross-team collaboration edges', () => {
    const graph = model()
    const kinds = graph.edges.map((edge) => edge.data.kind)
    expect(kinds).toContain('authored')
    expect(kinds).toContain('reviewed')
    expect(kinds).toContain('reviewed-author')
    expect(kinds).toContain('targets-main')
    expect(kinds).toContain('collaborated')
  })

  it('links a reviewer on another team to the PR author', () => {
    const graph = model()
    const reviewEdge = graph.edges.find(
      (edge) => edge.source === 'student-lina' && edge.target === 'student-rahul',
    )
    expect(reviewEdge?.data.kind).toBe('reviewed-author')

    const teamEdge = graph.edges.find((edge) => edge.data.kind === 'collaborated')
    expect(teamEdge).toBeTruthy()
    expect([teamEdge?.source, teamEdge?.target].sort()).toEqual(['team-atlas', 'team-phoenix'])
  })

  it('does not create member-of edges so isolated students stay disconnected', () => {
    const graph = model()
    expect(graph.edges.some((edge) => edge.source === 'student-arnav')).toBe(false)
    expect(graph.nodes.some((node) => node.id === 'student-arnav')).toBe(true)
  })
})
