export const appVersion = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.0.0'

export const env = {
  githubToken: import.meta.env.VITE_GITHUB_TOKEN ?? '',
  githubOwner: import.meta.env.VITE_GITHUB_OWNER ?? 'SarathiLabs',
  githubRepo: import.meta.env.VITE_GITHUB_REPO ?? 'git-real-workshop-playground',
  useMockGithub: import.meta.env.VITE_USE_MOCK_GITHUB === 'true',
  refreshIntervalMs: Number(import.meta.env.VITE_REFRESH_INTERVAL_MS ?? 10_000),
}

export function isGithubConfigured() {
  return Boolean(env.githubToken && env.githubOwner && env.githubRepo)
}
