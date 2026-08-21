import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import type { useWorkshopData } from '@/hooks/use-workshop-data'
import { useInstructorStore } from '@/stores/instructor-store'
import { sortTeams, type TeamSortKey } from '@/utils/sort-teams'

export function TeamsPage() {
  const data = useOutletContext<ReturnType<typeof useWorkshopData>>()
  const selectTeam = useInstructorStore((state) => state.selectTeam)
  const [sortBy, setSortBy] = useState<TeamSortKey>('name')
  const sorted = useMemo(() => sortTeams(data.teamStats, sortBy), [data.teamStats, sortBy])

  if (data.isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="w-56">
        <Label htmlFor="sort">Sort by</Label>
        <select
          id="sort"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as TeamSortKey)}
        >
          <option value="name">Name</option>
          <option value="commits">Commits</option>
          <option value="prs">PRs</option>
          <option value="reviews">Reviews</option>
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((team) => (
          <Card
            key={team.team.id}
            className="cursor-pointer hover:border-primary/40"
            onClick={() => selectTeam(team.team.id)}
          >
            <CardHeader>
              <CardTitle>{team.team.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <span>Members {team.members.length}</span>
              <span>Commits {team.commits}</span>
              <span>PRs {team.pullRequests}</span>
              <span>Reviews {team.reviews}</span>
              <span>Issues Closed {team.issuesClosed}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
