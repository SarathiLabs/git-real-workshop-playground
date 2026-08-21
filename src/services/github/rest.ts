import { GitHubApiError } from './errors'
import { getLastRateLimitRemaining, githubRequest, repoPath } from './client'
import {
  deriveCiStatus,
  transformBranch,
  transformCommit,
  transformContributor,
  transformIssue,
  transformPullRequest,
  transformRelease,
  transformRepository,
  transformReview,
  transformWorkflowRun,
} from './transform'
import type {
  BranchInfo,
  CommitInfo,
  ContributorInfo,
  IssueInfo,
  PullRequestInfo,
  PullRequestReviewInfo,
  ReleaseInfo,
  RepositoryInfo,
  WorkflowRunInfo,
} from '@/types'

export async function getRepository(): Promise<RepositoryInfo> {
  const { data } = await githubRequest<Parameters<typeof transformRepository>[0]>(repoPath())
  return transformRepository(data)
}

export async function getContributors(): Promise<ContributorInfo[]> {
  const { data } = await githubRequest<Parameters<typeof transformContributor>[0][]>(
    `${repoPath('/contributors')}?per_page=100`,
  )
  return data.map(transformContributor)
}

export async function getBranches(): Promise<BranchInfo[]> {
  const { data } = await githubRequest<Parameters<typeof transformBranch>[0][]>(
    `${repoPath('/branches')}?per_page=100`,
  )
  return data.map(transformBranch)
}

export async function getCommits(): Promise<CommitInfo[]> {
  try {
    const { data } = await githubRequest<Parameters<typeof transformCommit>[0][]>(
      `${repoPath('/commits')}?per_page=100`,
    )
    return data.map(transformCommit)
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 409) return []
    throw error
  }
}

export async function getPullRequests(): Promise<PullRequestInfo[]> {
  const { data } = await githubRequest<Parameters<typeof transformPullRequest>[0][]>(
    `${repoPath('/pulls')}?state=all&per_page=100&sort=updated`,
  )
  return data.map((item) => transformPullRequest(item))
}

export async function getPullRequest(number: number): Promise<PullRequestInfo> {
  const { data } = await githubRequest<Parameters<typeof transformPullRequest>[0]>(
    repoPath(`/pulls/${number}`),
  )
  return transformPullRequest(data)
}

export async function getPullRequestReviews(number: number): Promise<PullRequestReviewInfo[]> {
  const { data } = await githubRequest<Parameters<typeof transformReview>[0][]>(
    repoPath(`/pulls/${number}/reviews`),
  )
  return data.map(transformReview)
}

export async function getIssues(): Promise<IssueInfo[]> {
  const { data } = await githubRequest<Parameters<typeof transformIssue>[0][]>(
    `${repoPath('/issues')}?state=all&per_page=100`,
  )
  return data.map(transformIssue)
}

export async function getWorkflowRuns(): Promise<WorkflowRunInfo[]> {
  const { data } = await githubRequest<{ workflow_runs: Parameters<typeof transformWorkflowRun>[0][] }>(
    `${repoPath('/actions/runs')}?per_page=50`,
  )
  return data.workflow_runs.map(transformWorkflowRun)
}

export async function getReleases(): Promise<ReleaseInfo[]> {
  const { data } = await githubRequest<Parameters<typeof transformRelease>[0][]>(
    `${repoPath('/releases')}?per_page=20`,
  )
  return data.map(transformRelease)
}

export async function fetchLiveSnapshot() {
  const [repository, contributors, branches, commits, pullRequests, issues, workflowRuns, releases] =
    await Promise.all([
      getRepository(),
      getContributors(),
      getBranches(),
      getCommits(),
      getPullRequests(),
      getIssues(),
      getWorkflowRuns(),
      getReleases(),
    ])

  const now = Date.now()
  const reviewTargets = pullRequests.filter((pr) => {
    if (pr.state === 'open') return true
    if (!pr.mergedAt) return false
    return now - new Date(pr.mergedAt).getTime() < 1000 * 60 * 60 * 24 * 3
  })

  const reviewsByNumber = new Map<number, PullRequestReviewInfo[]>()
  await Promise.all(
    reviewTargets.map(async (pr) => {
      reviewsByNumber.set(pr.number, await getPullRequestReviews(pr.number))
    }),
  )

  const hydrated = pullRequests.map((pr) => ({
    ...pr,
    reviews: reviewsByNumber.get(pr.number) ?? pr.reviews,
    ciStatus: deriveCiStatus(pr, workflowRuns),
  }))

  return {
    repository,
    contributors,
    branches,
    commits,
    pullRequests: hydrated,
    issues,
    workflowRuns,
    releases,
    fetchedAt: new Date().toISOString(),
    rateLimitRemaining: getLastRateLimitRemaining(),
  }
}
