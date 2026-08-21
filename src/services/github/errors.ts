export class GitHubApiError extends Error {
  readonly status: number
  readonly rateLimitRemaining: number | null
  readonly code: 'rate-limit' | 'unauthorized' | 'not-found' | 'http' | 'network'

  constructor(
    message: string,
    options: {
      status: number
      rateLimitRemaining?: number | null
      code?: GitHubApiError['code']
      cause?: unknown
    },
  ) {
    super(message, { cause: options.cause })
    this.name = 'GitHubApiError'
    this.status = options.status
    this.rateLimitRemaining = options.rateLimitRemaining ?? null
    this.code = options.code ?? 'http'
  }
}

export function parseRateLimit(headers: Headers) {
  const remaining = headers.get('X-RateLimit-Remaining')
  return remaining === null ? null : Number(remaining)
}
