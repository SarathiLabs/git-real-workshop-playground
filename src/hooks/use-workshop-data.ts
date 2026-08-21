import { useMemo } from 'react'
import { achievements, students, teams } from '@/data/load'
import { useGitHubActivity } from '@/hooks/use-github-activity'
import { aggregateAllParticipants } from '@/utils/aggregate-participant'
import { aggregateAllTeams } from '@/utils/aggregate-team'
import { buildActivityFeed } from '@/utils/activity-feed'
import { computeCollaborationHealth, computeGlobalMetrics, computeNeedsAttention } from '@/utils/metrics'

export function useWorkshopData() {
  const github = useGitHubActivity()
  const snapshot = github.snapshot

  const participants = useMemo(
    () => (snapshot ? aggregateAllParticipants(students, snapshot, achievements) : []),
    [snapshot],
  )

  const teamStats = useMemo(
    () => (snapshot ? aggregateAllTeams(teams, participants) : []),
    [participants, snapshot],
  )

  const metrics = useMemo(
    () => (snapshot ? computeGlobalMetrics(participants, teamStats, snapshot) : null),
    [participants, snapshot, teamStats],
  )

  const health = useMemo(
    () => (snapshot ? computeCollaborationHealth(participants, teamStats, snapshot) : null),
    [participants, snapshot, teamStats],
  )

  const attention = useMemo(
    () => (snapshot ? computeNeedsAttention(participants, snapshot) : []),
    [participants, snapshot],
  )

  const activity = useMemo(() => (snapshot ? buildActivityFeed(snapshot) : []), [snapshot])

  return {
    ...github,
    students,
    teams,
    participants,
    teamStats,
    metrics,
    health,
    attention,
    activity,
  }
}
