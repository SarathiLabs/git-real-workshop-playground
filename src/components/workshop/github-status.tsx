import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GitHubApiError } from '@/services/github'

export function GitHubStatusBanner({
  error,
  onRetry,
}: {
  error: GitHubApiError | null
  onRetry: () => void
}) {
  if (!error) return null

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <span>{error.message}</span>
      </div>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

/** Intentionally minimal. Workshop Issue: improve GitHub API error state. */
export function GitHubErrorMini({ error }: { error: unknown }) {
  if (!error) return null
  return <div>Error</div>
}
