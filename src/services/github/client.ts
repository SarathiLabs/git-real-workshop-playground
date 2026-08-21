import { env } from '@/config/env'
import { GitHubApiError, parseRateLimit } from './errors'

const API_BASE = 'https://api.github.com'

export interface GitHubRequestResult<T> {
  data: T
  rateLimitRemaining: number | null
}

let lastRateLimitRemaining: number | null = null

export function getLastRateLimitRemaining() {
  return lastRateLimitRemaining
}

export async function githubRequest<T>(path: string): Promise<GitHubRequestResult<T>> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (env.githubToken) {
    headers.Authorization = `Bearer ${env.githubToken}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, { headers })
  } catch (cause) {
    throw new GitHubApiError('Unable to reach GitHub. Check your network connection.', {
      status: 0,
      code: 'network',
      cause,
    })
  }

  const rateLimitRemaining = parseRateLimit(response.headers)
  lastRateLimitRemaining = rateLimitRemaining

  if (response.status === 204) {
    return { data: [] as T, rateLimitRemaining }
  }

  if (response.status === 403 && rateLimitRemaining === 0) {
    throw new GitHubApiError('GitHub API rate limit exceeded. Wait and retry, or switch to mock data.', {
      status: 403,
      rateLimitRemaining,
      code: 'rate-limit',
    })
  }

  if (response.status === 401) {
    throw new GitHubApiError('GitHub rejected the token. Check VITE_GITHUB_TOKEN.', {
      status: 401,
      rateLimitRemaining,
      code: 'unauthorized',
    })
  }

  if (response.status === 404) {
    throw new GitHubApiError(
      `Repository not found. Check VITE_GITHUB_OWNER and VITE_GITHUB_REPO (${env.githubOwner}/${env.githubRepo}).`,
      { status: 404, rateLimitRemaining, code: 'not-found' },
    )
  }

  if (!response.ok) {
    const body = await response.text()
    throw new GitHubApiError(`GitHub API error (${response.status}): ${body.slice(0, 180)}`, {
      status: response.status,
      rateLimitRemaining,
    })
  }

  return {
    data: (await response.json()) as T,
    rateLimitRemaining,
  }
}

export function repoPath(suffix = '') {
  return `/repos/${env.githubOwner}/${env.githubRepo}${suffix}`
}
