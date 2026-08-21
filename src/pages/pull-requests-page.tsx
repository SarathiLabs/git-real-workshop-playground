import { useOutletContext } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { useWorkshopData } from '@/hooks/use-workshop-data'

export function PullRequestsPage() {
  const data = useOutletContext<ReturnType<typeof useWorkshopData>>()

  if (data.isLoading) {
    return <Skeleton className="h-64 w-full" />
  }

  const pullRequests = data.snapshot?.pullRequests ?? []

  if (pullRequests.length === 0) {
    return <p>No pull requests.</p>
  }

  return (
    <div className="space-y-3">
      {pullRequests.map((pr) => (
        <Card key={pr.number}>
          <CardContent className="space-y-2 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">#{pr.number}</span>
              <span>{pr.title}</span>
              <Badge variant={pr.merged ? 'success' : pr.state === 'open' ? 'secondary' : 'outline'}>
                {pr.merged ? 'merged' : pr.state}
              </Badge>
              <Badge variant={pr.ciStatus === 'fail' ? 'danger' : pr.ciStatus === 'pass' ? 'success' : 'outline'}>
                CI {pr.ciStatus}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              @{pr.author} · {pr.head} → {pr.base}
              {pr.changedFiles ? ` · ${pr.changedFiles} files` : ''}
            </div>
            <div className="text-sm">
              Reviewers:{' '}
              {pr.reviews.length
                ? pr.reviews.map((review) => `@${review.reviewer} (${review.state})`).join(', ')
                : 'none'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
