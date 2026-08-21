import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CollaborationHealth } from '@/types'

export function CollaborationHealthCard({ health }: { health: CollaborationHealth }) {
  const rows = [
    ['Active Students', `${health.activeStudents} / ${health.totalStudents}`],
    ['Teams Active', `${health.teamsActive} / ${health.totalTeams}`],
    ['Students with Commit', String(health.studentsWithCommit)],
    ['Students with PR', String(health.studentsWithPr)],
    ['Students with Review', String(health.studentsWithReview)],
    ['Cross-Team Reviews', String(health.crossTeamReviews)],
    ['Open PRs', String(health.openPrs)],
    ['Failing CI', String(health.failingCi)],
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaboration Health</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 rounded-md bg-muted/50 px-2 py-1.5">
            <span className="text-muted-foreground">{label}</span>
            <span className="tabular font-medium">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
