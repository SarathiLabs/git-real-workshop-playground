import type {
  AttentionItem,
  CollaborationHealth,
  GitHubSnapshot,
  GlobalMetrics,
  ParticipantStats,
  TeamStats,
} from '@/types'

export function computeGlobalMetrics(
  participants: ParticipantStats[],
  teams: TeamStats[],
  snapshot: GitHubSnapshot,
): GlobalMetrics {
  const openPrs = snapshot.pullRequests.filter((pr) => pr.state === 'open')
  const mergedPrs = snapshot.pullRequests.filter((pr) => pr.merged)
  const reviews = snapshot.pullRequests.reduce((sum, pr) => sum + pr.reviews.length, 0)
  const issuesClosed = snapshot.issues.filter((issue) => !issue.isPullRequest && issue.state === 'closed').length
  const completedRuns = snapshot.workflowRuns.filter((run) => run.status === 'completed')

  return {
    developers: participants.length,
    teams: teams.length,
    activeDevelopers: participants.filter((participant) => participant.isActive).length,
    commits: snapshot.commits.length,
    branches: snapshot.branches.length,
    openPrs: openPrs.length,
    mergedPrs: mergedPrs.length,
    reviews,
    issuesClosed,
    ciPassing: completedRuns.filter((run) => run.conclusion === 'success').length,
    ciFailing: completedRuns.filter((run) => run.conclusion === 'failure').length,
    releases: snapshot.releases.length,
  }
}

export function computeCollaborationHealth(
  participants: ParticipantStats[],
  teams: TeamStats[],
  snapshot: GitHubSnapshot,
): CollaborationHealth {
  return {
    activeStudents: participants.filter((participant) => participant.isActive).length,
    totalStudents: participants.length,
    teamsActive: teams.filter((team) => team.isActive).length,
    totalTeams: teams.length,
    studentsWithCommit: participants.filter((participant) => participant.commits > 0).length,
    studentsWithPr: participants.filter((participant) => participant.pullRequests > 0).length,
    studentsWithReview: participants.filter((participant) => participant.reviews > 0).length,
    crossTeamReviews: participants.reduce((sum, participant) => sum + participant.crossTeamReviews, 0),
    openPrs: snapshot.pullRequests.filter((pr) => pr.state === 'open').length,
    failingCi: snapshot.pullRequests.filter((pr) => pr.ciStatus === 'fail').length,
  }
}

const ATTENTION_LABELS: Record<AttentionItem['reason'], string> = {
  'no-commits': 'No commits',
  'no-branches': 'No branches',
  'no-pull-requests': 'No PR',
  'no-reviews': 'No Review',
  disconnected: 'Disconnected',
  'failing-ci': 'Failing CI',
  'open-pr-without-review': 'Open PR without review',
}

export function computeNeedsAttention(
  participants: ParticipantStats[],
  snapshot: GitHubSnapshot,
): AttentionItem[] {
  const failingPrs = snapshot.pullRequests
    .filter((pr) => pr.ciStatus === 'fail' && pr.state === 'open')
    .map((pr) => `PR #${pr.number}`)

  const groups: AttentionItem[] = [
    {
      reason: 'no-pull-requests',
      label: ATTENTION_LABELS['no-pull-requests'],
      items: participants
        .filter((participant) => participant.needsAttention.includes('no-pull-requests'))
        .map((participant) => `@${participant.student.github}`),
    },
    {
      reason: 'no-reviews',
      label: ATTENTION_LABELS['no-reviews'],
      items: participants
        .filter((participant) => participant.needsAttention.includes('no-reviews'))
        .map((participant) => `@${participant.student.github}`),
    },
    {
      reason: 'disconnected',
      label: ATTENTION_LABELS.disconnected,
      items: participants
        .filter((participant) => participant.isDisconnected)
        .map((participant) => `@${participant.student.github}`),
    },
    {
      reason: 'no-commits',
      label: ATTENTION_LABELS['no-commits'],
      items: participants
        .filter((participant) => participant.needsAttention.includes('no-commits'))
        .map((participant) => `@${participant.student.github}`),
    },
    {
      reason: 'no-branches',
      label: ATTENTION_LABELS['no-branches'],
      items: participants
        .filter((participant) => participant.needsAttention.includes('no-branches'))
        .map((participant) => `@${participant.student.github}`),
    },
    {
      reason: 'failing-ci',
      label: ATTENTION_LABELS['failing-ci'],
      items: failingPrs,
    },
    {
      reason: 'open-pr-without-review',
      label: ATTENTION_LABELS['open-pr-without-review'],
      items: snapshot.pullRequests
        .filter((pr) => pr.state === 'open' && pr.reviews.length === 0)
        .map((pr) => `PR #${pr.number}`),
    },
  ]

  return groups.filter((group) => group.items.length > 0)
}
