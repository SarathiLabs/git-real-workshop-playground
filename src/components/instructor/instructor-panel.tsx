import { challenges, students, teams, workshop } from '@/data/load'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { ProductionStatus, WorkshopPhase } from '@/types'
import { useInstructorStore } from '@/stores/instructor-store'
import type { GitHubConnectionState } from '@/types'

export function InstructorPanel({
  connection,
  onRefresh,
  isFetching,
}: {
  connection: GitHubConnectionState
  onRefresh: () => void
  isFetching: boolean
}) {
  const instructorMode = useInstructorStore((state) => state.instructorMode)
  const toggleInstructorMode = useInstructorStore((state) => state.toggleInstructorMode)
  const phase = useInstructorStore((state) => state.phase)
  const setPhase = useInstructorStore((state) => state.setPhase)
  const productionStatus = useInstructorStore((state) => state.productionStatus)
  const setProductionStatus = useInstructorStore((state) => state.setProductionStatus)
  const highlightTeamId = useInstructorStore((state) => state.highlightTeamId)
  const setHighlightTeam = useInstructorStore((state) => state.setHighlightTeam)
  const highlightStudent = useInstructorStore((state) => state.highlightStudent)
  const setHighlightStudent = useInstructorStore((state) => state.setHighlightStudent)
  const showOnlyActive = useInstructorStore((state) => state.showOnlyActive)
  const setShowOnlyActive = useInstructorStore((state) => state.setShowOnlyActive)
  const showOnlyFailingCi = useInstructorStore((state) => state.showOnlyFailingCi)
  const setShowOnlyFailingCi = useInstructorStore((state) => state.setShowOnlyFailingCi)
  const showDisconnected = useInstructorStore((state) => state.showDisconnected)
  const setShowDisconnected = useInstructorStore((state) => state.setShowDisconnected)
  const activeChallengeId = useInstructorStore((state) => state.activeChallengeId)
  const setActiveChallenge = useInstructorStore((state) => state.setActiveChallenge)
  const togglePresentationMode = useInstructorStore((state) => state.togglePresentationMode)
  const requestFit = useInstructorStore((state) => state.requestFit)

  return (
    <Sheet open={instructorMode} onOpenChange={toggleInstructorMode}>
      <SheetContent side="left" className="overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Instructor Mode</SheetTitle>
          <SheetDescription>Not an access-control system. Keyboard shortcut: I</SheetDescription>
        </SheetHeader>

        <section className="space-y-2">
          <h4 className="text-sm font-semibold">GitHub Connection</h4>
          <div className="rounded-md border p-3 text-sm">
            <div>Mode: {connection.mode}</div>
            <div>{connection.connected ? 'Connected' : 'Not connected'}</div>
            <div>Last Sync: {connection.lastSync ?? '—'}</div>
            {connection.rateLimitRemaining !== null ? (
              <div>Rate limit remaining: {connection.rateLimitRemaining}</div>
            ) : null}
            {connection.error ? <div className="text-destructive">API Error: {connection.error}</div> : null}
          </div>
          <Button size="sm" onClick={() => void onRefresh()} disabled={isFetching}>
            Refresh Now
          </Button>
        </section>

        <Separator />

        <section className="space-y-2">
          <Label>Select Workshop Phase</Label>
          <Select value={phase} onValueChange={(value) => setPhase(value as WorkshopPhase)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {workshop.phases.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="space-y-2">
          <Label>Highlight Student</Label>
          <Select
            value={highlightStudent ?? 'none'}
            onValueChange={(value) => setHighlightStudent(value === 'none' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.github} value={student.github}>
                  @{student.github}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="space-y-2">
          <Label>Highlight Team</Label>
          <Select
            value={highlightTeamId ?? 'none'}
            onValueChange={(value) => setHighlightTeam(value === 'none' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="space-y-3">
          <label className="flex items-center justify-between gap-2 text-sm">
            Show only active participants
            <Switch checked={showOnlyActive} onCheckedChange={setShowOnlyActive} />
          </label>
          <label className="flex items-center justify-between gap-2 text-sm">
            Show only failing CI
            <Switch checked={showOnlyFailingCi} onCheckedChange={setShowOnlyFailingCi} />
          </label>
          <label className="flex items-center justify-between gap-2 text-sm">
            Show disconnected nodes
            <Switch checked={showDisconnected} onCheckedChange={setShowDisconnected} />
          </label>
        </section>

        <Button size="sm" variant="outline" onClick={requestFit}>
          Focus Network
        </Button>
        <Button size="sm" variant="outline" onClick={togglePresentationMode}>
          Toggle Presentation Mode
        </Button>

        <Separator />

        <section className="space-y-2">
          <Label>Activate Challenge</Label>
          <Select
            value={activeChallengeId ?? 'none'}
            onValueChange={(value) => setActiveChallenge(value === 'none' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {challenges.map((challenge) => (
                <SelectItem key={challenge.id} value={challenge.id}>
                  {challenge.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="space-y-2">
          <Label>Production</Label>
          <div className="flex flex-wrap gap-2">
            {(['HEALTHY', 'DEGRADED', 'INCIDENT'] as ProductionStatus[]).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={productionStatus === status ? 'default' : 'outline'}
                onClick={() => setProductionStatus(status)}
              >
                {status === 'INCIDENT' ? 'Trigger incident' : status === 'HEALTHY' ? 'Resolve incident' : status}
              </Button>
            ))}
          </div>
        </section>
      </SheetContent>
    </Sheet>
  )
}
