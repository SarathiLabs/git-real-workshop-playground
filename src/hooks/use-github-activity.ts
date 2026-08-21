import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { env } from '@/config/env'
import { fetchGithubSnapshot, GitHubApiError, isMockMode } from '@/services/github'
import type { GitHubConnectionState, GitHubSnapshot } from '@/types'

export function useGitHubActivity() {
  const query = useQuery<GitHubSnapshot, GitHubApiError>({
    queryKey: ['github-activity', isMockMode() ? 'mock' : 'live'],
    queryFn: fetchGithubSnapshot,
    staleTime: Infinity,
    refetchInterval: env.refreshIntervalMs > 0 ? env.refreshIntervalMs : false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
    retry: 1,
  })

  const connection: GitHubConnectionState = {
    mode: isMockMode() ? 'mock' : 'live',
    connected: Boolean(query.data) && !query.isError,
    lastSync: query.dataUpdatedAt ? new Date(query.dataUpdatedAt).toISOString() : null,
    error: query.error
      ? query.error.message
      : query.data
        ? null
        : query.isLoading
          ? null
          : 'GitHub activity has not loaded yet.',
    rateLimitRemaining: query.data?.rateLimitRemaining ?? query.error?.rateLimitRemaining ?? null,
  }

  return {
    snapshot: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ?? null,
    dataUpdatedAt: query.dataUpdatedAt,
    refetch: query.refetch,
    connection,
  }
}
