import { achievements as achievementDefs } from '@/data/load'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { teamName } from '@/data/load'
import type { ParticipantStats } from '@/types'

export function ParticipantDrawer({
  participant,
  onClose,
}: {
  participant: ParticipantStats | null
  onClose: () => void
}) {
  return (
    <Sheet open={Boolean(participant)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto">
        {participant ? (
          <>
            <SheetHeader>
              <SheetTitle>{participant.student.name}</SheetTitle>
              <SheetDescription>@{participant.student.github}</SheetDescription>
            </SheetHeader>
            <div className="flex items-center gap-3">
              <img src={participant.avatarUrl} alt="" className="h-12 w-12 rounded-full bg-muted" />
              <div>
                <div className="text-sm">{teamName(participant.student.team)}</div>
                <div className="text-xs text-muted-foreground">{participant.student.role}</div>
              </div>
            </div>
            {participant.needsAttention.length > 0 ? (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-destructive">Needs Attention</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {participant.needsAttention.map((reason) => (
                    <Badge key={reason} variant="danger">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Stat label="Commits" value={participant.commits} />
              <Stat label="Pull Requests" value={participant.pullRequests} />
              <Stat label="Merged Pull Requests" value={participant.mergedPullRequests} />
              <Stat label="Reviews" value={participant.reviews} />
              <Stat label="Issues" value={participant.issues} />
              <Stat label="Branches" value={participant.branches} />
            </div>
            <Separator />
            <section>
              <h4 className="text-sm font-semibold">Recent Activity</h4>
              {participant.recentActivity.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No activity.</p>
              ) : (
                <ScrollArea className="mt-2 h-32">
                  <ul className="space-y-1 text-sm">
                    {participant.recentActivity.map((event) => (
                      <li key={event.id}>{event.summary}</li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </section>
            <section>
              <h4 className="text-sm font-semibold">Collaborated With</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {participant.collaboratedWith.length
                  ? participant.collaboratedWith.map((login) => `@${login}`).join(', ')
                  : 'None yet'}
              </p>
            </section>
            <section>
              <h4 className="text-sm font-semibold">Achievements</h4>
              <div className="mt-2 flex flex-wrap gap-1">
                {participant.achievements.length === 0 ? (
                  <span className="text-sm text-muted-foreground">None unlocked</span>
                ) : (
                  participant.achievements.map((id) => {
                    const def = achievementDefs.find((item) => item.id === id)
                    return (
                      <Badge key={id} variant="secondary">
                        {def?.title ?? id}
                      </Badge>
                    )
                  })
                )}
              </div>
            </section>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted/50 px-2 py-1.5">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="tabular font-semibold">{value}</div>
    </div>
  )
}
