import { useEffect, useMemo } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  ReactFlowProvider,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { buildGraphModel } from '@/utils/build-graph-model'
import { useInstructorStore } from '@/stores/instructor-store'
import type { GitHubSnapshot, ParticipantStats, TeamStats } from '@/types'
import { MainBranchNode, PullRequestNode, StudentNode, TeamNode, type AppNode } from './nodes'

const nodeTypes = {
  student: StudentNode,
  team: TeamNode,
  pullRequest: PullRequestNode,
  main: MainBranchNode,
}

function GraphInner({
  participants,
  teamStats,
  snapshot,
  heightClass = 'h-[560px]',
}: {
  participants: ParticipantStats[]
  teamStats: TeamStats[]
  snapshot: GitHubSnapshot
  heightClass?: string
}) {
  const { fitView } = useReactFlow()
  const selectStudent = useInstructorStore((state) => state.selectStudent)
  const selectTeam = useInstructorStore((state) => state.selectTeam)
  const fitToken = useInstructorStore((state) => state.fitToken)
  const showReviewEdges = useInstructorStore((state) => state.showReviewEdges)
  const showPrNodes = useInstructorStore((state) => state.showPrNodes)
  const showOnlyActive = useInstructorStore((state) => state.showOnlyActive)
  const showOnlyFailingCi = useInstructorStore((state) => state.showOnlyFailingCi)
  const showDisconnected = useInstructorStore((state) => state.showDisconnected)
  const highlightTeamId = useInstructorStore((state) => state.highlightTeamId)
  const highlightStudent = useInstructorStore((state) => state.highlightStudent)
  const presentationMode = useInstructorStore((state) => state.presentationMode)

  const model = useMemo(
    () =>
      buildGraphModel(participants, teamStats, snapshot, {
        showReviewEdges,
        showPrNodes,
        showOnlyActive,
        showOnlyFailingCi,
        showDisconnected,
        highlightTeamId,
        highlightStudent,
      }),
    [
      participants,
      teamStats,
      snapshot,
      showReviewEdges,
      showPrNodes,
      showOnlyActive,
      showOnlyFailingCi,
      showDisconnected,
      highlightTeamId,
      highlightStudent,
    ],
  )

  const nodes: AppNode[] = model.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
  }))

  const edges: Edge[] = model.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.data.label,
    animated: edge.data.kind === 'authored' || edge.data.kind === 'reviewed',
    style: {
      stroke:
        edge.data.kind === 'collaborated'
          ? 'var(--color-primary)'
          : edge.data.kind === 'reviewed-author'
            ? 'var(--color-success)'
            : 'var(--color-muted-foreground)',
      strokeDasharray: edge.data.kind === 'collaborated' ? '6 4' : undefined,
    },
  }))

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fitView({ padding: 0.18, duration: 300 })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [fitToken, fitView, nodes.length])

  const onNodeClick: NodeMouseHandler = (_event, node) => {
    if (node.type === 'student') {
      selectStudent(node.id.replace('student-', ''))
    }
    if (node.type === 'team') {
      selectTeam(node.id.replace('team-', ''))
    }
  }

  return (
    <div className={heightClass}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.15}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={22} />
        {!presentationMode && <Controls />}
        {!presentationMode && <MiniMap pannable zoomable />}
      </ReactFlow>
    </div>
  )
}

export function CollaborationGraph(props: {
  participants: ParticipantStats[]
  teamStats: TeamStats[]
  snapshot: GitHubSnapshot
  heightClass?: string
}) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  )
}
