import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ITEMS = [
  'Enable dark mode',
  'Make participant search case-insensitive',
  'Add team filtering',
  'Sort teams by PRs / reviews',
  'Implement formatRelativeTime (others are blocked on this)',
  'Build the EmptyState component (others are blocked on this)',
  'Add CI activity filter',
  'Reset graph layout',
]

export function FeatureLab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workshop Feature Lab</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted-foreground">
          Intentionally incomplete pieces of this app. Claim an Issue, branch, and open a Pull Request.
          Cross-team work is labelled <span className="font-medium text-foreground">blocked</span> until
          the foundation Issue merges.
        </p>
        <ul className="grid gap-1 text-sm md:grid-cols-2">
          {ITEMS.map((item) => (
            <li key={item} className="rounded-md bg-muted/60 px-2 py-1.5">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
