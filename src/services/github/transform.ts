import type {
  BranchInfo,
  CiStatus,
  CommitInfo,
  ContributorInfo,
  IssueInfo,
  PullRequestInfo,
  PullRequestReviewInfo,
  ReleaseInfo,
  RepositoryInfo,
  ReviewState,
  WorkflowRunInfo,
} from '@/types'

interface GithubUser {
  login?: string
  avatar_url?: string
  html_url?: string
}

interface GithubRepo {
  name: string
  full_name: string
  description: string | null
  default_branch: string
  html_url: string
  open_issues_count: number
}

interface GithubContributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

interface GithubBranch {
  name: string
  commit: { sha: string }
  protected?: boolean
}

interface GithubCommit {
  sha: string
  html_url: string
  commit: {
    message: string
    author: { name: string | null; date: string } | null
  }
  author: GithubUser | null
}

interface GithubPull {
  number: number
  title: string
  body: string | null
  state: 'open' | 'closed'
  merged_at: string | null
  draft: boolean
  user: GithubUser | null
  head: { ref: string }
  base: { ref: string }
  created_at: string
  updated_at: string
  html_url: string
  requested_reviewers?: GithubUser[]
  changed_files?: number
  additions?: number
  deletions?: number
}

interface GithubReview {
  id: number
  user: GithubUser | null
  state: string
  submitted_at: string | null
  body: string | null
}

interface GithubIssue {
  number: number
  title: string
  state: 'open' | 'closed'
  user: GithubUser | null
  labels: Array<string | { name: string }>
  created_at: string
  closed_at: string | null
  html_url: string
  pull_request?: unknown
}

interface GithubWorkflowRun {
  id: number
  name: string
  status: string
  conclusion: string | null
  head_branch: string
  event: string
  html_url: string
  created_at: string
  pull_requests?: Array<{ number: number }>
}

interface GithubRelease {
  id: number
  tag_name: string
  name: string | null
  draft: boolean
  prerelease: boolean
  published_at: string | null
  html_url: string
  author: GithubUser | null
}

export function transformRepository(repo: GithubRepo): RepositoryInfo {
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description ?? '',
    defaultBranch: repo.default_branch,
    htmlUrl: repo.html_url,
    openIssues: repo.open_issues_count,
  }
}

export function transformContributor(item: GithubContributor): ContributorInfo {
  return {
    login: item.login,
    avatarUrl: item.avatar_url,
    htmlUrl: item.html_url,
    contributions: item.contributions,
  }
}

export function transformBranch(item: GithubBranch): BranchInfo {
  return {
    name: item.name,
    sha: item.commit.sha,
    protected: Boolean(item.protected),
  }
}

export function transformCommit(item: GithubCommit): CommitInfo {
  return {
    sha: item.sha,
    message: item.commit.message.split('\n')[0] ?? item.commit.message,
    authorLogin: item.author?.login ?? null,
    authorName: item.commit.author?.name ?? null,
    date: item.commit.author?.date ?? '',
    htmlUrl: item.html_url,
  }
}

export function transformReview(item: GithubReview): PullRequestReviewInfo {
  const state = item.state.toUpperCase() as ReviewState
  return {
    id: item.id,
    reviewer: item.user?.login ?? 'unknown',
    state,
    submittedAt: item.submitted_at,
    body: item.body ?? '',
  }
}

export function transformPullRequest(
  item: GithubPull,
  reviews: PullRequestReviewInfo[] = [],
  ciStatus: CiStatus = 'unknown',
): PullRequestInfo {
  return {
    number: item.number,
    title: item.title,
    body: item.body ?? '',
    state: item.state,
    merged: Boolean(item.merged_at),
    draft: item.draft,
    author: item.user?.login ?? 'unknown',
    head: item.head.ref,
    base: item.base.ref,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    mergedAt: item.merged_at,
    htmlUrl: item.html_url,
    requestedReviewers: (item.requested_reviewers ?? []).map((user) => user.login ?? 'unknown'),
    changedFiles: item.changed_files ?? 0,
    additions: item.additions ?? 0,
    deletions: item.deletions ?? 0,
    reviews,
    ciStatus,
  }
}

export function transformIssue(item: GithubIssue): IssueInfo {
  return {
    number: item.number,
    title: item.title,
    state: item.state,
    author: item.user?.login ?? 'unknown',
    labels: item.labels.map((label) => (typeof label === 'string' ? label : label.name)),
    createdAt: item.created_at,
    closedAt: item.closed_at,
    htmlUrl: item.html_url,
    isPullRequest: Boolean(item.pull_request),
  }
}

export function transformWorkflowRun(item: GithubWorkflowRun): WorkflowRunInfo {
  return {
    id: item.id,
    name: item.name,
    status: item.status,
    conclusion: item.conclusion,
    headBranch: item.head_branch,
    event: item.event,
    htmlUrl: item.html_url,
    createdAt: item.created_at,
    pullRequestNumbers: (item.pull_requests ?? []).map((pr) => pr.number),
  }
}

export function transformRelease(item: GithubRelease): ReleaseInfo {
  return {
    id: item.id,
    tagName: item.tag_name,
    name: item.name ?? item.tag_name,
    draft: item.draft,
    prerelease: item.prerelease,
    publishedAt: item.published_at,
    htmlUrl: item.html_url,
    author: item.author?.login ?? 'unknown',
  }
}

export function deriveCiStatus(
  pullRequest: Pick<PullRequestInfo, 'number' | 'head'>,
  runs: WorkflowRunInfo[],
): CiStatus {
  const related = runs.filter(
    (run) => run.pullRequestNumbers.includes(pullRequest.number) || run.headBranch === pullRequest.head,
  )

  if (related.length === 0) return 'unknown'
  if (related.some((run) => run.status !== 'completed')) return 'pending'
  if (related.some((run) => run.conclusion === 'failure' || run.conclusion === 'timed_out')) return 'fail'
  if (related.every((run) => run.conclusion === 'success')) return 'pass'
  return 'unknown'
}
