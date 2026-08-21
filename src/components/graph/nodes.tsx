import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import type { GraphNodeData } from '@/types'

export type AppNode = Node<GraphNodeData>

export function StudentNode({ data, selected }: NodeProps<AppNode>) {
  const active = Boolean(data.meta?.active)
  const disconnected = Boolean(data.meta?.disconnected)
  const highlighted = Boolean(data.meta?.highlighted)
  const avatarUrl = String(data.meta?.avatarUrl ?? '')

  return (
    <div
      className={cn(
        'w-[180px] rounded-xl border bg-card px-3 py-2 shadow-sm',
        selected || highlighted ? 'border-primary ring-2 ring-primary/30' : 'border-border',
        disconnected && 'opacity-70',
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground" />
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground" />
      <div className="flex items-center gap-2">
        <img
          src={avatarUrl}
          alt=""
          className="h-8 w-8 rounded-full bg-muted object-cover"
          onError={(event) => {
            event.currentTarget.src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%2394a3b8"/></svg>'
          }}
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{data.label}</div>
          <div className="truncate text-xs text-muted-foreground">{data.subtitle}</div>
        </div>
        <span
          className={cn(
            'ml-auto h-2.5 w-2.5 shrink-0 rounded-full',
            active ? 'bg-success' : 'bg-muted-foreground/40',
          )}
          title={active ? 'Active' : 'Idle'}
        />
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">{String(data.meta?.teamName ?? '')}</div>
    </div>
  )
}

export function TeamNode({ data, selected }: NodeProps<AppNode>) {
  const highlighted = Boolean(data.meta?.highlighted)
  return (
    <div
      className={cn(
        'min-w-[170px] rounded-lg border bg-secondary px-3 py-2 shadow-sm',
        selected || highlighted ? 'border-primary ring-2 ring-primary/30' : 'border-border',
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground" />
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground" />
      <div className="text-sm font-semibold">{data.label}</div>
      <div className="mt-1 grid grid-cols-2 gap-x-3 text-[11px] text-muted-foreground">
        <span>Members {String(data.meta?.members ?? 0)}</span>
        <span>Commits {String(data.meta?.commits ?? 0)}</span>
        <span>PRs {String(data.meta?.prs ?? 0)}</span>
        <span>Reviews {String(data.meta?.reviews ?? 0)}</span>
      </div>
    </div>
  )
}

export function PullRequestNode({ data }: NodeProps<AppNode>) {
  const ci = String(data.meta?.ciStatus ?? 'unknown')
  return (
    <div className="w-[150px] rounded-md border border-border bg-background px-2.5 py-2 shadow-sm">
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground" />
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground" />
      <div className="text-xs font-semibold">{data.label}</div>
      <div className="truncate text-[11px] text-muted-foreground">{data.subtitle}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        CI {ci}
      </div>
    </div>
  )
}

export function MainBranchNode({ data }: NodeProps<AppNode>) {
  return (
    <div className="rounded-full border border-primary bg-primary px-4 py-2 text-primary-foreground shadow-sm">
      <Handle type="target" position={Position.Left} className="!bg-primary-foreground" />
      <Handle type="source" position={Position.Right} className="!bg-primary-foreground" />
      <div className="text-sm font-semibold">{data.label}</div>
      <div className="text-[10px] uppercase tracking-wide opacity-80">{data.subtitle}</div>
    </div>
  )
}
