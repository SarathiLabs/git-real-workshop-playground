import { useOutletContext } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductionChecks, ProductionStatusBadge } from '@/components/workshop/production-status'
import type { useWorkshopData } from '@/hooks/use-workshop-data'

export function ProductionPage() {
  const data = useOutletContext<ReturnType<typeof useWorkshopData>>()
  const latestRelease = data.snapshot?.releases[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Production</h2>
        <ProductionStatusBadge large />
      </div>
      <ProductionChecks />
      <Card>
        <CardHeader>
          <CardTitle>Repository</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>{data.snapshot?.repository.fullName ?? '—'}</div>
          <div className="text-muted-foreground">{data.snapshot?.repository.description}</div>
          <div>
            Default branch <Badge variant="outline">{data.snapshot?.repository.defaultBranch ?? 'main'}</Badge>
          </div>
          {latestRelease ? (
            <div>
              Latest release <Badge variant="secondary">{latestRelease.tagName}</Badge> {latestRelease.name}
            </div>
          ) : (
            <div className="text-muted-foreground">No releases yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
