import type { GitHubSnapshot } from '@/types'

function emptySnapshot(): GitHubSnapshot {
  return {
    repository: {
      name: 'git-real-workshop-playground',
      fullName: 'SarathiLabs/git-real-workshop-playground',
      description: '',
      defaultBranch: 'main',
      htmlUrl: 'https://github.com/SarathiLabs/git-real-workshop-playground',
      openIssues: 0,
    },
    contributors: [],
    branches: [],
    commits: [],
    pullRequests: [],
    issues: [],
    workflowRuns: [],
    releases: [],
    fetchedAt: new Date().toISOString(),
    rateLimitRemaining: null,
  }
}

export function fetchMockSnapshot(): GitHubSnapshot {
  return emptySnapshot()
}

export async function getRepository() {
  return emptySnapshot().repository
}
export async function getContributors() {
  return emptySnapshot().contributors
}
export async function getBranches() {
  return emptySnapshot().branches
}
export async function getCommits() {
  return emptySnapshot().commits
}
export async function getPullRequests() {
  return emptySnapshot().pullRequests
}
export async function getPullRequest(number: number) {
  throw new Error(`Mock PR #${number} not found`)
}
export async function getPullRequestReviews(_number: number) {
  return []
}
export async function getIssues() {
  return emptySnapshot().issues
}
export async function getWorkflowRuns() {
  return emptySnapshot().workflowRuns
}
export async function getReleases() {
  return emptySnapshot().releases
}
