import { useOutletContext } from 'react-router-dom'
import { CollaborationGraph } from '@/components/graph/collaboration-graph'
import { GraphControls } from '@/components/graph/graph-controls'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { useWorkshopData } from '@/hooks/use-workshop-data'

export function NetworkPage() {
  const data = useOutletContext<ReturnType<typeof useWorkshopData>>()

  if (data.isLoading || !data.snapshot) {
    return <Skeleton className="h-[70vh] w-full" />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Network</CardTitle>
        <GraphControls />
      </CardHeader>
      <CardContent>
        <CollaborationGraph
          participants={data.participants}
          teamStats={data.teamStats}
          snapshot={data.snapshot}
          heightClass="h-[75vh]"
        />
      </CardContent>
    </Card>
  )
}
