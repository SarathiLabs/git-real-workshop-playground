import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { features } from '@/config/features'
import { teams } from '@/data/load'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import type { useWorkshopData } from '@/hooks/use-workshop-data'
import { useInstructorStore } from '@/stores/instructor-store'
import { filterParticipants } from '@/utils/filter-participants'

export function ParticipantsPage() {
  const data = useOutletContext<ReturnType<typeof useWorkshopData>>()
  const selectStudent = useInstructorStore((state) => state.selectStudent)
  const [query, setQuery] = useState('')
  const [teamId, setTeamId] = useState('')
  const [hasCommits, setHasCommits] = useState(false)
  const [hasPr, setHasPr] = useState(false)
  const [hasReviews, setHasReviews] = useState(false)
  const [noActivity, setNoActivity] = useState(false)
  const [disconnected, setDisconnected] = useState(false)

  const filtered = useMemo(
    () =>
      filterParticipants(data.participants, {
        query: features.participantSearch ? query : '',
        teamId: features.teamFilter ? teamId || null : null,
        hasCommits,
        hasPr,
        hasReviews,
        noActivity,
        disconnected,
      }),
    [data.participants, query, teamId, hasCommits, hasPr, hasReviews, noActivity, disconnected],
  )

  if (data.isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        {features.participantSearch ? (
          <div className="w-64">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
            />
          </div>
        ) : null}
        <div className="w-48">
          <Label htmlFor="team">Team</Label>
          <select
            id="team"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={teamId}
            onChange={(event) => setTeamId(event.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasCommits} onChange={(event) => setHasCommits(event.target.checked)} />
          Has commits
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasPr} onChange={(event) => setHasPr(event.target.checked)} />
          Has PR
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasReviews} onChange={(event) => setHasReviews(event.target.checked)} />
          Has reviews
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={noActivity} onChange={(event) => setNoActivity(event.target.checked)} />
          No activity
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={disconnected} onChange={(event) => setDisconnected(event.target.checked)} />
          Disconnected
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((participant) => (
          <Card
            key={participant.student.github}
            className="cursor-pointer hover:border-primary/40"
            onClick={() => selectStudent(participant.student.github)}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <img src={participant.avatarUrl} alt="" className="h-10 w-10 rounded-full bg-muted" />
              <div className="min-w-0">
                <div className="truncate font-medium">{participant.student.name}</div>
                <div className="truncate text-xs text-muted-foreground">@{participant.student.github}</div>
                <div className="mt-1 flex gap-1">
                  <Badge variant={participant.isActive ? 'success' : 'secondary'}>
                    {participant.isActive ? 'active' : 'idle'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
