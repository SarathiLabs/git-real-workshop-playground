import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { GlobalMetrics } from '@/types'
import type { WorkshopPhase } from '@/types'

const METRICS: Array<{ key: keyof GlobalMetrics; label: string; phases: WorkshopPhase[] }> = [
  { key: 'developers', label: 'Developers', phases: ['SETUP', 'COMPLETE'] },
  { key: 'teams', label: 'Teams', phases: ['SETUP', 'COLLABORATION', 'COMPLETE'] },
  { key: 'activeDevelopers', label: 'Active Developers', phases: ['FUNDAMENTALS', 'COLLABORATION'] },
  { key: 'commits', label: 'Commits', phases: ['FUNDAMENTALS', 'ADVANCED_GIT'] },
  { key: 'branches', label: 'Branches', phases: ['BRANCHING'] },
  { key: 'openPrs', label: 'Open PRs', phases: ['COLLABORATION', 'CODE_REVIEW'] },
  { key: 'mergedPrs', label: 'Merged PRs', phases: ['COLLABORATION', 'OPEN_SOURCE'] },
  { key: 'reviews', label: 'Reviews', phases: ['CODE_REVIEW'] },
  { key: 'issuesClosed', label: 'Issues Closed', phases: ['OPEN_SOURCE'] },
  { key: 'ciPassing', label: 'CI Passing', phases: ['CI_CD'] },
  { key: 'ciFailing', label: 'CI Failing', phases: ['CI_CD', 'INCIDENT'] },
  { key: 'releases', label: 'Releases', phases: ['OPEN_SOURCE', 'COMPLETE'] },
]

export function GlobalMetricsGrid({
  metrics,
  phase,
  large = false,
}: {
  metrics: GlobalMetrics
  phase: WorkshopPhase
  large?: boolean
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
      {METRICS.map((metric) => {
        const emphasized = metric.phases.includes(phase)
        return (
          <Card
            key={metric.key}
            className={cn(emphasized && 'border-primary/40 ring-1 ring-primary/20')}
          >
            <CardContent className={cn('p-4', large && 'p-5')}>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</div>
              <div className={cn('tabular mt-1 font-semibold', large ? 'text-3xl' : 'text-2xl')}>
                {metrics[metric.key]}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
