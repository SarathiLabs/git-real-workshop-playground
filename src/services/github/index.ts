import { env } from '@/config/env'
import type { GitHubSnapshot } from '@/types'
import * as mock from './mock'
import * as rest from './rest'

export { GitHubApiError } from './errors'

export function isMockMode() {
  return env.useMockGithub
}

export async function fetchGithubSnapshot(): Promise<GitHubSnapshot> {
  if (env.useMockGithub) {
    return mock.fetchMockSnapshot()
  }
  return rest.fetchLiveSnapshot()
}

export async function getRepository() {
  return env.useMockGithub ? mock.getRepository() : rest.getRepository()
}
export async function getContributors() {
  return env.useMockGithub ? mock.getContributors() : rest.getContributors()
}
export async function getBranches() {
  return env.useMockGithub ? mock.getBranches() : rest.getBranches()
}
export async function getCommits() {
  return env.useMockGithub ? mock.getCommits() : rest.getCommits()
}
export async function getPullRequests() {
  return env.useMockGithub ? mock.getPullRequests() : rest.getPullRequests()
}
export async function getPullRequest(number: number) {
  return env.useMockGithub ? mock.getPullRequest(number) : rest.getPullRequest(number)
}
export async function getPullRequestReviews(number: number) {
  return env.useMockGithub ? mock.getPullRequestReviews(number) : rest.getPullRequestReviews(number)
}
export async function getIssues() {
  return env.useMockGithub ? mock.getIssues() : rest.getIssues()
}
export async function getWorkflowRuns() {
  return env.useMockGithub ? mock.getWorkflowRuns() : rest.getWorkflowRuns()
}
export async function getReleases() {
  return env.useMockGithub ? mock.getReleases() : rest.getReleases()
}
