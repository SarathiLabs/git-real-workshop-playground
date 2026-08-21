import type {
  AchievementDefinition,
  AttentionReason,
  GitHubSnapshot,
  ParticipantStats,
  Student,
} from '@/types'
import { buildActivityFeed } from './activity-feed'

function avatarFor(login: string, snapshot: GitHubSnapshot) {
  return (
    snapshot.contributors.find((contributor) => contributor.login === login)?.avatarUrl ??
    `https://github.com/${login}.png?size=80`
  )
}

export function aggregateParticipant(
  student: Student,
  snapshot: GitHubSnapshot,
  achievementDefs: AchievementDefinition[] = [],
  roster: Student[] = [student],
): ParticipantStats {
  const rosterByGithub = new Map(roster.map((item) => [item.github, item]))
  const login = student.github
  const authoredCommits = snapshot.commits.filter((commit) => commit.authorLogin === login)
  const authoredPrs = snapshot.pullRequests.filter((pr) => pr.author === login)
  const mergedPrs = authoredPrs.filter((pr) => pr.merged)
  const reviews = snapshot.pullRequests.flatMap((pr) =>
    pr.reviews
      .filter((review) => review.reviewer === login && pr.author !== login)
      .map((review) => ({ pr, review })),
  )
  const crossTeamReviews = reviews.filter((item) => {
    const author = rosterByGithub.get(item.pr.author)
    return Boolean(author && author.team !== student.team)
  })
  const issues = snapshot.issues.filter((issue) => !issue.isPullRequest && issue.author === login)
  const issuesClosed = issues.filter((issue) => issue.state === 'closed')

  const prHeads = new Set(authoredPrs.map((pr) => pr.head))
  const branches = snapshot.branches.filter(
    (branch) => branch.name !== snapshot.repository.defaultBranch && prHeads.has(branch.name),
  )

  const ciFixes = snapshot.workflowRuns.filter(
    (run) =>
      run.conclusion === 'success' &&
      prHeads.has(run.headBranch) &&
      snapshot.workflowRuns.some(
        (other) => other.headBranch === run.headBranch && other.conclusion === 'failure',
      ),
  ).length

  const feed = buildActivityFeed(snapshot).filter((event) => event.actor === login)
  const collaboratedWith = collectCollaborators(login, snapshot)

  const needsAttention: AttentionReason[] = []
  if (authoredCommits.length === 0) needsAttention.push('no-commits')
  if (branches.length === 0) needsAttention.push('no-branches')
  if (authoredPrs.length === 0) needsAttention.push('no-pull-requests')
  if (reviews.length === 0) needsAttention.push('no-reviews')
  if (authoredCommits.length === 0 && authoredPrs.length === 0 && reviews.length === 0) {
    needsAttention.push('disconnected')
  }
  if (authoredPrs.some((pr) => pr.state === 'open' && pr.ciStatus === 'fail')) {
    needsAttention.push('failing-ci')
  }
  if (authoredPrs.some((pr) => pr.state === 'open' && pr.reviews.length === 0)) {
    needsAttention.push('open-pr-without-review')
  }

  const stats = {
    commits: authoredCommits.length,
    pullRequests: authoredPrs.length,
    mergedPullRequests: mergedPrs.length,
    reviews: reviews.length,
    crossTeamReviews: crossTeamReviews.length,
    issuesClosed: issuesClosed.length,
    ciFixes,
  }

  const unlocked = achievementDefs
    .filter((achievement) => matchesRule(achievement.rule, stats))
    .map((achievement) => achievement.id)

  const isActive = authoredCommits.length + authoredPrs.length + reviews.length > 0

  return {
    student,
    avatarUrl: avatarFor(login, snapshot),
    commits: stats.commits,
    pullRequests: stats.pullRequests,
    mergedPullRequests: stats.mergedPullRequests,
    reviews: stats.reviews,
    crossTeamReviews: stats.crossTeamReviews,
    issues: issues.length,
    issuesClosed: stats.issuesClosed,
    branches: branches.length,
    ciFixes,
    recentActivity: feed.slice(0, 8),
    collaboratedWith,
    achievements: unlocked,
    needsAttention,
    isActive,
    isDisconnected: needsAttention.includes('disconnected'),
  }
}

function collectCollaborators(login: string, snapshot: GitHubSnapshot) {
  const names = new Set<string>()
  for (const pr of snapshot.pullRequests) {
    if (pr.author === login) {
      for (const review of pr.reviews) names.add(review.reviewer)
    }
    if (pr.reviews.some((review) => review.reviewer === login) && pr.author !== login) {
      names.add(pr.author)
    }
  }
  names.delete(login)
  return [...names]
}

function matchesRule(
  rule: string,
  stats: Record<string, number>,
) {
  const match = rule.match(/^(\w+)\s*>=\s*(\d+)$/)
  if (!match) return false
  const key = match[1]
  const threshold = Number(match[2])
  return (stats[key] ?? 0) >= threshold
}

export function aggregateAllParticipants(
  students: Student[],
  snapshot: GitHubSnapshot,
  achievementDefs: AchievementDefinition[],
) {
  return students.map((student) => aggregateParticipant(student, snapshot, achievementDefs, students))
}

