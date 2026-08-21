import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { AttentionItem } from '@/types'

export function NeedsAttention({ items }: { items: AttentionItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Needs Attention</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">All clear.</p>
          ) : (
            <div className="space-y-4">
              {items.map((group) => (
                <div key={group.reason}>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {group.items.slice(0, 24).map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                    {group.items.length > 24 ? (
                      <Badge variant="outline">+{group.items.length - 24}</Badge>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
