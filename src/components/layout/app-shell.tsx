import { NavLink, Outlet } from 'react-router-dom'
import {
  Activity,
  Flag,
  GitPullRequest,
  LayoutDashboard,
  Network,
  PenLine,
  RefreshCw,
  Rocket,
  Users,
  UsersRound,
} from 'lucide-react'
import { appVersion } from '@/config/env'
import { workshop } from '@/data/load'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InstructorPanel } from '@/components/instructor/instructor-panel'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { ParticipantDrawer } from '@/components/participants/participant-drawer'
import { GitHubStatusBanner } from '@/components/workshop/github-status'
import { NeedsAttention } from '@/components/workshop/needs-attention'
import { ProductionStatusBadge } from '@/components/workshop/production-status'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useWorkshopData } from '@/hooks/use-workshop-data'
import { cn } from '@/lib/utils'
import { useInstructorStore } from '@/stores/instructor-store'

const NAV = [
  { to: '/', label: 'Mission Control', icon: LayoutDashboard },
  { to: '/network', label: 'Network', icon: Network },
  { to: '/participants', label: 'Participants', icon: Users },
  { to: '/teams', label: 'Teams', icon: UsersRound },
  { to: '/wall', label: 'The Wall', icon: PenLine },
  { to: '/pull-requests', label: 'Pull Requests', icon: GitPullRequest },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/challenges', label: 'Challenges', icon: Flag },
  { to: '/production', label: 'Production', icon: Rocket },
]

export function AppShell() {
  useKeyboardShortcuts()
  const data = useWorkshopData()
  const presentationMode = useInstructorStore((state) => state.presentationMode)
  const togglePresentationMode = useInstructorStore((state) => state.togglePresentationMode)
  const toggleInstructorMode = useInstructorStore((state) => state.toggleInstructorMode)
  const phase = useInstructorStore((state) => state.phase)
  const selectedStudent = useInstructorStore((state) => state.selectedStudent)
  const selectStudent = useInstructorStore((state) => state.selectStudent)
  const selected = data.participants.find((participant) => participant.student.github === selectedStudent) ?? null

  const seconds = data.dataUpdatedAt ? Math.max(0, Math.round((Date.now() - data.dataUpdatedAt) / 1000)) : null

  return (
    <div className={cn('flex min-h-screen bg-background', presentationMode && 'presentation')}>
      {!presentationMode ? (
        <aside className="hidden w-56 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
          <div className="px-4 py-5">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{workshop.org}</div>
            <div className="text-lg font-semibold">{workshop.title}</div>
            <div className="text-xs text-muted-foreground">{workshop.subtitle}</div>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-2">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                    isActive ? 'bg-sidebar-foreground/10 font-medium' : 'hover:bg-sidebar-foreground/5',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">{phase.replaceAll('_', ' ')}</Badge>
            <Badge variant="secondary" title="Tag a release to change this">
              v{appVersion}
            </Badge>
            <ProductionStatusBadge large={presentationMode} />
            <span className="text-xs text-muted-foreground">
              {seconds === null ? 'Waiting for first sync' : `Last refreshed ${seconds} seconds ago`}
              {data.connection.rateLimitRemaining !== null
                ? ` · ${data.connection.rateLimitRemaining} API calls left`
                : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => void data.refetch()}
              disabled={data.isFetching}
              title="Fetch GitHub activity now. This is the only time the dashboard hits the API unless you turn polling back on."
            >
              <RefreshCw className={cn('h-4 w-4', data.isFetching && 'animate-spin')} />
              Refresh
            </Button>
            <ThemeToggle />
            {!presentationMode ? (
              <>
                <Button size="sm" variant="outline" onClick={toggleInstructorMode}>
                  Instructor
                </Button>
                <Button size="sm" variant="outline" onClick={togglePresentationMode}>
                  Presentation
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={togglePresentationMode}>
                Exit Presentation
              </Button>
            )}
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-auto p-4">
            <div className="mb-3">
              <GitHubStatusBanner error={data.error} onRetry={() => void data.refetch()} />
            </div>
            <Outlet context={data} />
          </main>
          {!presentationMode ? (
            <aside className="hidden w-72 shrink-0 border-l p-3 xl:block">
              <NeedsAttention items={data.attention} />
            </aside>
          ) : null}
        </div>
      </div>

      <InstructorPanel
        connection={data.connection}
        onRefresh={() => void data.refetch()}
        isFetching={data.isFetching}
      />
      <ParticipantDrawer participant={selected} onClose={() => selectStudent(null)} />
    </div>
  )
}
