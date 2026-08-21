import type { ActivityEvent, GitHubSnapshot } from '@/types'

export function buildActivityFeed(snapshot: GitHubSnapshot): ActivityEvent[] {
  const events: ActivityEvent[] = []

  for (const commit of snapshot.commits) {
    events.push({
      id: `commit-${commit.sha}`,
      kind: 'commit',
      at: commit.date,
      actor: commit.authorLogin,
      summary: `@${commit.authorLogin ?? 'unknown'} pushed ${commit.message}`,
      href: commit.htmlUrl,
    })
  }

  for (const pr of snapshot.pullRequests) {
    events.push({
      id: `pr-open-${pr.number}`,
      kind: 'pull-request',
      at: pr.createdAt,
      actor: pr.author,
      summary: `@${pr.author} opened PR #${pr.number}`,
      href: pr.htmlUrl,
    })

    if (pr.merged && pr.mergedAt) {
      events.push({
        id: `pr-merge-${pr.number}`,
        kind: 'merge',
        at: pr.mergedAt,
        actor: pr.author,
        summary: `PR #${pr.number} was merged into ${pr.base}`,
        href: pr.htmlUrl,
        tone: 'success',
      })
    }

    for (const review of pr.reviews) {
      const verb =
        review.state === 'APPROVED'
          ? 'approved'
          : review.state === 'CHANGES_REQUESTED'
            ? 'requested changes on'
            : 'reviewed'
      events.push({
        id: `review-${review.id}`,
        kind: 'review',
        at: review.submittedAt ?? pr.updatedAt,
        actor: review.reviewer,
        summary: `@${review.reviewer} ${verb} PR #${pr.number}`,
        href: pr.htmlUrl,
        tone: review.state === 'CHANGES_REQUESTED' ? 'warning' : 'default',
      })
    }

    if (pr.ciStatus === 'fail') {
      events.push({
        id: `ci-fail-${pr.number}`,
        kind: 'ci',
        at: pr.updatedAt,
        actor: null,
        summary: `CI failed on PR #${pr.number}`,
        href: pr.htmlUrl,
        tone: 'danger',
      })
    }
  }

  for (const issue of snapshot.issues) {
    if (issue.isPullRequest) continue
    events.push({
      id: `issue-${issue.number}-${issue.state}`,
      kind: 'issue',
      at: issue.closedAt ?? issue.createdAt,
      actor: issue.author,
      summary:
        issue.state === 'closed'
          ? `@${issue.author} closed issue #${issue.number}`
          : `@${issue.author} opened issue #${issue.number}`,
      href: issue.htmlUrl,
    })
  }

  return events.sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
}
