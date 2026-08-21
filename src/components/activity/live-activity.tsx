import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { ActivityEvent } from '@/types'

export function LiveActivity({ events, large = false }: { events: ActivityEvent[]; large?: boolean }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Live Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={large ? 'h-[420px]' : 'h-[320px]'}>
          <ol className="space-y-2">
            {events.slice(0, 40).map((event) => (
              <li key={event.id} className="rounded-md border px-3 py-2">
                <div className={cn('leading-snug', large ? 'text-base' : 'text-sm')}>{event.summary}</div>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="outline">{event.kind}</Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {event.at.replace('T', ' ').replace('.000Z', ' UTC')}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
