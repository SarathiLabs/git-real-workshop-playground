import studentsData from '@/data/students.json'
import teamsData from '@/data/teams.json'
import challengesData from '@/data/challenges.json'
import achievementsData from '@/data/achievements.json'
import workshopData from '@/data/workshop.json'
import type { AchievementDefinition, Challenge, Student, Team, WorkshopConfig } from '@/types'

export const students = studentsData as Student[]
export const teams = teamsData as Team[]
export const challenges = challengesData as Challenge[]
export const achievements = achievementsData as AchievementDefinition[]
export const workshop = workshopData as WorkshopConfig

export const studentsByGithub = new Map(students.map((student) => [student.github, student]))
export const teamsById = new Map(teams.map((team) => [team.id, team]))

export function teamName(teamId: string) {
  return teamsById.get(teamId)?.name ?? teamId
}
