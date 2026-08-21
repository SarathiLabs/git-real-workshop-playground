import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TeamStats } from '@/types'

export function TeamSpotlight({ teams }: { teams: TeamStats[] }) {
  // Intentionally static. Workshop Issue: choose the team with the most recent activity.
  const team = teams.find((item) => item.team.id === 'phoenix') ?? teams[0]

  if (!team) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Spotlight</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-semibold">{team.team.name}</div>
        <p className="mt-1 text-sm text-muted-foreground">
          {team.members.length} members · {team.commits} commits · {team.pullRequests} PRs
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Static selection — replace with activity-based spotlight.</p>
      </CardContent>
    </Card>
  )
}
