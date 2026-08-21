import type { ParticipantStats, Team, TeamStats } from '@/types'

export function aggregateTeam(team: Team, members: ParticipantStats[]): TeamStats {
  return {
    team,
    members,
    commits: members.reduce((sum, member) => sum + member.commits, 0),
    pullRequests: members.reduce((sum, member) => sum + member.pullRequests, 0),
    reviews: members.reduce((sum, member) => sum + member.reviews, 0),
    issuesClosed: members.reduce((sum, member) => sum + member.issuesClosed, 0),
    isActive: members.some((member) => member.isActive),
  }
}

export function aggregateAllTeams(teams: Team[], participants: ParticipantStats[]) {
  return teams.map((team) => {
    const members = participants.filter((participant) => participant.student.team === team.id)
    return aggregateTeam(team, members)
  })
}
