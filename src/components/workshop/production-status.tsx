import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ProductionStatus } from '@/types'
import { useInstructorStore } from '@/stores/instructor-store'

const CHECKS = ['Build', 'Tests', 'Lint', 'Security'] as const

function checksFor(status: ProductionStatus) {
  if (status === 'HEALTHY') return CHECKS.map((name) => ({ name, pass: true }))
  if (status === 'DEGRADED') {
    return CHECKS.map((name) => ({ name, pass: name !== 'Tests' }))
  }
  return CHECKS.map((name) => ({ name, pass: name === 'Lint' }))
}

export function ProductionStatusBadge({ large = false }: { large?: boolean }) {
  const status = useInstructorStore((state) => state.productionStatus)
  return (
    <div className={cn('flex items-center gap-2', large && 'text-lg')}>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Production</span>
      <Badge
        variant={status === 'HEALTHY' ? 'success' : status === 'DEGRADED' ? 'warning' : 'danger'}
      >
        {status}
      </Badge>
    </div>
  )
}

export function ProductionChecks() {
  const status = useInstructorStore((state) => state.productionStatus)
  const checks = checksFor(status)

  return (
    <Card>
      <CardHeader>
        <CardTitle>CI Indicators</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        {checks.map((check) => (
          <div key={check.name} className="flex items-center justify-between rounded-md border px-3 py-2">
            <span>{check.name}</span>
            <Badge variant={check.pass ? 'success' : 'danger'}>{check.pass ? 'PASS' : 'FAIL'}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
