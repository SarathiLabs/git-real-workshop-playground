import { create } from 'zustand'
import type { ProductionStatus, WorkshopPhase } from '@/types'

interface InstructorState {
  instructorMode: boolean
  presentationMode: boolean
  phase: WorkshopPhase
  productionStatus: ProductionStatus
  highlightTeamId: string | null
  highlightStudent: string | null
  showOnlyActive: boolean
  showOnlyFailingCi: boolean
  showDisconnected: boolean
  showReviewEdges: boolean
  showPrNodes: boolean
  showTeamLabels: boolean
  activeChallengeId: string | null
  selectedStudent: string | null
  selectedTeamId: string | null
  fitToken: number
  resetToken: number
  toggleInstructorMode: () => void
  togglePresentationMode: () => void
  setPhase: (phase: WorkshopPhase) => void
  setProductionStatus: (status: ProductionStatus) => void
  setHighlightTeam: (teamId: string | null) => void
  setHighlightStudent: (github: string | null) => void
  setShowOnlyActive: (value: boolean) => void
  setShowOnlyFailingCi: (value: boolean) => void
  setShowDisconnected: (value: boolean) => void
  setShowReviewEdges: (value: boolean) => void
  setShowPrNodes: (value: boolean) => void
  setShowTeamLabels: (value: boolean) => void
  setActiveChallenge: (id: string | null) => void
  selectStudent: (github: string | null) => void
  selectTeam: (teamId: string | null) => void
  requestFit: () => void
  requestReset: () => void
}

export const useInstructorStore = create<InstructorState>((set) => ({
  instructorMode: false,
  presentationMode: false,
  phase: 'SETUP',
  productionStatus: 'HEALTHY',
  highlightTeamId: null,
  highlightStudent: null,
  showOnlyActive: false,
  showOnlyFailingCi: false,
  showDisconnected: false,
  showReviewEdges: true,
  showPrNodes: true,
  showTeamLabels: true,
  activeChallengeId: null,
  selectedStudent: null,
  selectedTeamId: null,
  fitToken: 0,
  resetToken: 0,
  toggleInstructorMode: () => set((state) => ({ instructorMode: !state.instructorMode })),
  togglePresentationMode: () => set((state) => ({ presentationMode: !state.presentationMode })),
  setPhase: (phase) => set({ phase }),
  setProductionStatus: (productionStatus) => set({ productionStatus }),
  setHighlightTeam: (highlightTeamId) => set({ highlightTeamId }),
  setHighlightStudent: (highlightStudent) => set({ highlightStudent }),
  setShowOnlyActive: (showOnlyActive) => set({ showOnlyActive }),
  setShowOnlyFailingCi: (showOnlyFailingCi) => set({ showOnlyFailingCi }),
  setShowDisconnected: (showDisconnected) => set({ showDisconnected }),
  setShowReviewEdges: (showReviewEdges) => set({ showReviewEdges }),
  setShowPrNodes: (showPrNodes) => set({ showPrNodes }),
  setShowTeamLabels: (showTeamLabels) => set({ showTeamLabels }),
  setActiveChallenge: (activeChallengeId) => set({ activeChallengeId }),
  selectStudent: (selectedStudent) => set({ selectedStudent }),
  selectTeam: (selectedTeamId) =>
    set({
      selectedTeamId,
      highlightTeamId: selectedTeamId,
    }),
  requestFit: () => set((state) => ({ fitToken: state.fitToken + 1 })),
  requestReset: () => set((state) => ({ resetToken: state.resetToken + 1 })),
}))
