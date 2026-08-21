import type {
  GitHubSnapshot,
  GraphFilters,
  GraphModel,
  ParticipantStats,
  TeamStats,
} from '@/types'

const DEFAULT_FILTERS: GraphFilters = {
  showTeamLabels: true,
  showReviewEdges: true,
  showPrNodes: true,
  showOnlyActive: false,
  showOnlyFailingCi: false,
  showDisconnected: false,
  highlightTeamId: null,
  highlightStudent: null,
}

export function buildGraphModel(
  participants: ParticipantStats[],
  teams: TeamStats[],
  snapshot: GitHubSnapshot,
  filters: Partial<GraphFilters> = {},
): GraphModel {
  const resolved = { ...emptyGraphFilters(), ...filters }

  const visibleParticipants = participants.filter((participant) => {
    if (resolved.showOnlyActive && !participant.isActive) return false
    if (resolved.showDisconnected && !participant.isDisconnected) return false
    return true
  })

  const layoutTeams = teams.filter(
    (teamStats) =>
      visibleParticipants.some((participant) => participant.student.team === teamStats.team.id) ||
      resolved.highlightTeamId === teamStats.team.id,
  )
  const cols = Math.max(1, Math.ceil(Math.sqrt(Math.max(layoutTeams.length, 1))))
  const cellW = 420
  const cellH = 340

  const visibleLogins = new Set(visibleParticipants.map((participant) => participant.student.github))

  const nodes: GraphModel['nodes'] = [
    {
      id: 'main',
      type: 'main',
      position: { x: -280, y: 40 },
      data: { kind: 'main', label: snapshot.repository.defaultBranch || 'main', subtitle: 'protected' },
    },
  ]

  layoutTeams.forEach((teamStats, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    const originX = col * cellW
    const originY = row * cellH
    const members = visibleParticipants.filter((participant) => participant.student.team === teamStats.team.id)

    nodes.push({
      id: `team-${teamStats.team.id}`,
      type: 'team',
      position: { x: originX, y: originY },
      data: {
        kind: 'team',
        label: teamStats.team.name,
        subtitle: `${members.length} members`,
        meta: {
          members: teamStats.members.length,
          commits: teamStats.commits,
          prs: teamStats.pullRequests,
          reviews: teamStats.reviews,
          issuesClosed: teamStats.issuesClosed,
          highlighted: resolved.highlightTeamId === teamStats.team.id,
        },
      },
    })

    members.forEach((member, memberIndex) => {
      const angle = (memberIndex / Math.max(members.length, 1)) * Math.PI * 1.4 - 0.4
      const radius = 110 + memberIndex * 12
      nodes.push({
        id: `student-${member.student.github}`,
        type: 'student',
        position: {
          x: originX + Math.cos(angle) * radius,
          y: originY + 130 + Math.sin(angle) * 36,
        },
        data: {
          kind: 'student',
          label: member.student.name,
          subtitle: `@${member.student.github}`,
          meta: {
            team: member.student.team,
            teamName: teamStats.team.name,
            active: member.isActive,
            disconnected: member.isDisconnected,
            commits: member.commits,
            highlighted: resolved.highlightStudent === member.student.github,
            avatarUrl: member.avatarUrl,
          },
        },
      })
    })
  })

  const prs = snapshot.pullRequests.filter((pr) => {
    if (resolved.showOnlyFailingCi) return pr.ciStatus === 'fail'
    if (!resolved.showPrNodes) return false
    return pr.state === 'open' || pr.merged
  })

  for (const pr of prs) {
    if (!visibleLogins.has(pr.author) && resolved.showOnlyActive) continue
    const authorNode = nodes.find((node) => node.id === `student-${pr.author}`)
    nodes.push({
      id: `pr-${pr.number}`,
      type: 'pullRequest',
      position: {
        x: (authorNode?.position.x ?? 0) + 160,
        y: (authorNode?.position.y ?? 0) - 40,
      },
      data: {
        kind: 'pullRequest',
        label: `PR #${pr.number}`,
        subtitle: pr.title,
        meta: {
          author: pr.author,
          ciStatus: pr.ciStatus,
          merged: pr.merged,
          state: pr.state,
        },
      },
    })
  }

  const edges: GraphModel['edges'] = []

  for (const pr of prs) {
    const prId = `pr-${pr.number}`
    if (!nodes.some((node) => node.id === prId)) continue

    if (visibleLogins.has(pr.author)) {
      edges.push({
        id: `authored-${pr.number}`,
        source: `student-${pr.author}`,
        target: prId,
        data: { kind: 'authored', label: 'authored' },
      })
    }

    edges.push({
      id: `targets-main-${pr.number}`,
      source: prId,
      target: 'main',
      data: { kind: 'targets-main', label: `into ${pr.base}` },
    })

    if (resolved.showReviewEdges) {
      for (const review of pr.reviews) {
        if (!visibleLogins.has(review.reviewer)) continue
        edges.push({
          id: `reviewed-pr-${pr.number}-${review.reviewer}`,
          source: `student-${review.reviewer}`,
          target: prId,
          data: { kind: 'reviewed', label: review.state === 'APPROVED' ? 'approved' : 'reviewed' },
        })
        if (visibleLogins.has(pr.author) && review.reviewer !== pr.author) {
          edges.push({
            id: `reviewed-author-${pr.number}-${review.reviewer}`,
            source: `student-${review.reviewer}`,
            target: `student-${pr.author}`,
            data: { kind: 'reviewed-author', label: 'reviewed' },
          })
        }
      }
    }
  }

  const teamByLogin = new Map(
    participants.map((participant) => [participant.student.github, participant.student.team]),
  )

  const teamPairs = new Set<string>()
  for (const pr of snapshot.pullRequests) {
    const authorTeam = teamByLogin.get(pr.author)
    if (!authorTeam) continue
    for (const review of pr.reviews) {
      const reviewerTeam = teamByLogin.get(review.reviewer)
      if (!reviewerTeam || reviewerTeam === authorTeam) continue
      const key = [authorTeam, reviewerTeam].sort().join('::')
      if (teamPairs.has(key)) continue
      teamPairs.add(key)
      edges.push({
        id: `collab-${key}`,
        source: `team-${authorTeam}`,
        target: `team-${reviewerTeam}`,
        data: {
          kind: 'collaborated',
          label: 'collaborated with',
        },
      })
    }
  }

  return { nodes, edges }
}

export function emptyGraphFilters(): GraphFilters {
  return { ...DEFAULT_FILTERS }
}
