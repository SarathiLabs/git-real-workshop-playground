import { teamName, wall } from '@/data/load'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInstructorStore } from '@/stores/instructor-store'
import { cn } from '@/lib/utils'

export function WallPage() {
  const highlightStudent = useInstructorStore((state) => state.selectedStudent)
  const selectStudent = useInstructorStore((state) => state.selectStudent)
  const consistent = wall.engineersOnboard === wall.entries.length

  return (
    <div className="grid gap-3">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>The Wall</CardTitle>
            <Badge variant={consistent ? 'success' : 'danger'}>
              {consistent ? 'consistent' : 'counter does not match entries'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-6">
            <div>
              <div className="text-5xl font-semibold tabular-nums">{wall.engineersOnboard}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">engineers onboard</div>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated by <span className="font-medium text-foreground">{wall.lastUpdatedBy}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Everyone signs the same file, at the same position, and increments the same counter. That is not an
            accident. It is the one place in this repository where we want your change to collide with somebody
            else&apos;s, so you can resolve it yourself.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signatures, newest first</CardTitle>
        </CardHeader>
        <CardContent>
          {wall.entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nobody has signed the wall yet.</p>
          ) : (
            <ol className="grid gap-1">
              {wall.entries.map((entry, index) => (
                <li key={entry.github}>
                  <button
                    type="button"
                    onClick={() => selectStudent(entry.github)}
                    className={cn(
                      'flex w-full flex-wrap items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted',
                      highlightStudent === entry.github && 'bg-muted ring-1 ring-primary/40',
                    )}
                  >
                    <span className="w-8 shrink-0 text-xs tabular-nums text-muted-foreground">
                      {wall.entries.length - index}
                    </span>
                    <span className="font-medium">{entry.github}</span>
                    <Badge variant="outline">{teamName(entry.team)}</Badge>
                    <span className="text-muted-foreground">shipped {entry.shipped}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
