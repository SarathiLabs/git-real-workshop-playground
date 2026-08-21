import { useOutletContext } from 'react-router-dom'
import { CollaborationGraph } from '@/components/graph/collaboration-graph'
import { GraphControls } from '@/components/graph/graph-controls'
import { LiveActivity } from '@/components/activity/live-activity'
import { CollaborationHealthCard } from '@/components/workshop/collaboration-health'
import { FeatureLab } from '@/components/workshop/feature-lab'
import { GlobalMetricsGrid } from '@/components/workshop/global-metrics'
import { MostCollaborative } from '@/components/workshop/most-collaborative'
import { TeamSpotlight } from '@/components/workshop/team-spotlight'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { useWorkshopData } from '@/hooks/use-workshop-data'
import { useInstructorStore } from '@/stores/instructor-store'

export function MissionControlPage() {
  const data = useOutletContext<ReturnType<typeof useWorkshopData>>()
  const phase = useInstructorStore((state) => state.phase)
  const presentationMode = useInstructorStore((state) => state.presentationMode)

  if (data.isLoading || !data.snapshot || !data.metrics || !data.health) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <GlobalMetricsGrid metrics={data.metrics} phase={phase} large={presentationMode} />
      <div className={presentationMode ? 'grid gap-4' : 'grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Collaboration Network</CardTitle>
            {!presentationMode ? <GraphControls /> : null}
          </CardHeader>
          <CardContent>
            <CollaborationGraph
              participants={data.participants}
              teamStats={data.teamStats}
              snapshot={data.snapshot}
              heightClass={presentationMode ? 'h-[70vh]' : 'h-[520px]'}
            />
          </CardContent>
        </Card>
        <LiveActivity events={data.activity} large={presentationMode} />
      </div>
      {!presentationMode ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <CollaborationHealthCard health={data.health} />
          <TeamSpotlight teams={data.teamStats} />
          <MostCollaborative participants={data.participants} />
        </div>
      ) : null}
      {!presentationMode ? <FeatureLab /> : null}
    </div>
  )
}
