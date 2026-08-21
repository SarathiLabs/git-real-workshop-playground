import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { features } from '@/config/features'
import { Badge } from '@/components/ui/badge'
import type { ActivityKind } from '@/types'
import type { useWorkshopData } from '@/hooks/use-workshop-data'
import { GitHubErrorMini } from '@/components/workshop/github-status'

const FILTERS: ActivityKind[] = ['commit', 'pull-request', 'review', 'ci', 'issue']

export function ActivityPage() {
  const data = useOutletContext<ReturnType<typeof useWorkshopData>>()
  const [enabled, setEnabled] = useState<Record<ActivityKind, boolean>>({
    commit: true,
    'pull-request': true,
    review: true,
    ci: true,
    issue: true,
    merge: true,
  })

  const events = useMemo(() => {
    return data.activity.filter((event) => {
      if (event.kind === 'merge') return enabled['pull-request']
      // CI filter is intentionally unimplemented as a workshop Issue.
      if (event.kind === 'ci') return true
      return enabled[event.kind]
    })
  }, [data.activity, enabled])

  if (data.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <GitHubErrorMini error={data.error} />
      {features.activityFilters ? (
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((kind) => (
            <label key={kind} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={enabled[kind]}
                onChange={(event) => setEnabled((current) => ({ ...current, [kind]: event.target.checked }))}
              />
              {kind}
            </label>
          ))}
        </div>
      ) : null}
      <ol className="space-y-2">
        {events.map((event) => (
          <li key={event.id} className="rounded-md border px-3 py-2">
            <div className="text-sm">{event.summary}</div>
            <div className="mt-1 flex gap-2">
              <Badge variant="outline">{event.kind}</Badge>
              <span className="text-xs text-muted-foreground">{event.at}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
