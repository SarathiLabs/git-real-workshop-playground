import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useInstructorStore } from '@/stores/instructor-store'

export function GraphControls() {
  const requestFit = useInstructorStore((state) => state.requestFit)
  const showReviewEdges = useInstructorStore((state) => state.showReviewEdges)
  const setShowReviewEdges = useInstructorStore((state) => state.setShowReviewEdges)
  const showPrNodes = useInstructorStore((state) => state.showPrNodes)
  const setShowPrNodes = useInstructorStore((state) => state.setShowPrNodes)
  const showTeamLabels = useInstructorStore((state) => state.showTeamLabels)
  const setShowTeamLabels = useInstructorStore((state) => state.setShowTeamLabels)

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm" variant="outline" onClick={requestFit}>
        Fit graph
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          // Placeholder: wiring Reset layout is a workshop Issue.
        }}
      >
        Reset layout
      </Button>
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={showReviewEdges} onCheckedChange={setShowReviewEdges} />
        Show review edges
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={showPrNodes} onCheckedChange={setShowPrNodes} />
        Show PR nodes
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={showTeamLabels} onCheckedChange={setShowTeamLabels} />
        <Label>Show team labels</Label>
      </label>
    </div>
  )
}
