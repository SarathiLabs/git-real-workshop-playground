import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps extends React.ComponentProps<'div'> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

/**
 * WORKSHOP EXERCISE — this is a stub.
 *
 * The interface is settled, the implementation is not. Two other teams are
 * building on top of it (the empty Pull Requests page and the empty Activity
 * feed), so the props below are a contract. Changing them is fine, but say so
 * on the pull request first — somebody is importing this right now.
 *
 * Right now it renders unstyled text, which is barely better than nothing.
 * It should look like it belongs next to the other primitives in this folder:
 * centred, muted, with the icon above the title and the action below the
 * description. Check it in both themes.
 */
function EmptyState({ icon: Icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn(className)} {...props}>
      {Icon ? <Icon /> : null}
      <p>{title}</p>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  )
}

export { EmptyState }
