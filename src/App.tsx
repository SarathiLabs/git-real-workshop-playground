import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppShell } from '@/components/layout/app-shell'
import { ThemeProvider } from '@/hooks/use-theme'
import { ActivityPage } from '@/pages/activity-page'
import { ChallengesPage } from '@/pages/challenges-page'
import { MissionControlPage } from '@/pages/mission-control-page'
import { NetworkPage } from '@/pages/network-page'
import { ParticipantsPage } from '@/pages/participants-page'
import { ProductionPage } from '@/pages/production-page'
import { PullRequestsPage } from '@/pages/pull-requests-page'
import { TeamsPage } from '@/pages/teams-page'
import { WallPage } from '@/pages/wall-page'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<MissionControlPage />} />
                <Route path="network" element={<NetworkPage />} />
                <Route path="participants" element={<ParticipantsPage />} />
                <Route path="teams" element={<TeamsPage />} />
                <Route path="wall" element={<WallPage />} />
                <Route path="pull-requests" element={<PullRequestsPage />} />
                <Route path="activity" element={<ActivityPage />} />
                <Route path="challenges" element={<ChallengesPage />} />
                <Route path="production" element={<ProductionPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
