import teamsData from '@/data/teams.json'
import challengesData from '@/data/challenges.json'
import achievementsData from '@/data/achievements.json'
import workshopData from '@/data/workshop.json'
import wallData from '@/data/wall.json'
import type {
  AchievementDefinition,
  Challenge,
  Student,
  Team,
  Wall,
  WorkshopConfig,
} from '@/types'

/**
 * Participants register by adding `src/data/participants/<github>.json`.
 * One file per person so that sixty registrations do not collide.
 * Files prefixed with `_` are templates, not people.
 */
const participantModules = import.meta.glob<{ default: Student }>('./participants/*.json', {
  eager: true,
})

const registered = Object.entries(participantModules)
  .filter(([path]) => !(path.split('/').pop() ?? '').startsWith('_'))
  .map(([, module]) => module.default)

function dedupeByGithub(all: Student[]) {
  const seen = new Set<string>()
  return all.filter((student) => {
    const key = student.github.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export const students = dedupeByGithub(registered).sort((a, b) => a.name.localeCompare(b.name))

export const teams = teamsData as Team[]
export const challenges = challengesData as Challenge[]
export const achievements = achievementsData as AchievementDefinition[]
export const workshop = workshopData as WorkshopConfig
export const wall = wallData as Wall

export const studentsByGithub = new Map(students.map((student) => [student.github, student]))
export const teamsById = new Map(teams.map((team) => [team.id, team]))

export function teamName(teamId: string) {
  return teamsById.get(teamId)?.name ?? teamId
}
