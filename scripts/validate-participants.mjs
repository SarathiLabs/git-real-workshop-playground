#!/usr/bin/env node
/**
 * npm run validate:participants
 *
 * Runs on every pull request. When a registration is wrong, the participant
 * sees a red check with a message that tells them exactly what to change,
 * which is usually the first CI failure anybody in the room has ever read.
 */
import { annotate, color, symbol } from './lib/console.mjs'
import { listParticipantFiles, readJson, readTeams } from './lib/workshop-data.mjs'

const REQUIRED_FIELDS = ['github', 'name', 'team', 'role']
const VALID_ROLES = ['developer', 'team-lead']
const GITHUB_USERNAME = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/
const SOFT_TEAM_LIMIT = 3

const problems = []
const notes = []

function problem(relativePath, message) {
  problems.push({ relativePath, message })
  annotate('error', { file: relativePath, message })
}

const teams = readTeams()
const teamIds = new Set(teams.map((team) => team.id))
const files = listParticipantFiles()

const claimedBy = new Map()
const teamCounts = new Map()

for (const { file, username, absolutePath, relativePath } of files) {
  let entry
  try {
    entry = readJson(absolutePath, relativePath)
  } catch (error) {
    problem(relativePath, error.message)
    continue
  }

  if (Array.isArray(entry) || typeof entry !== 'object' || entry === null) {
    problem(relativePath, 'This file must contain a single JSON object, not an array or a bare value.')
    continue
  }

  const missing = REQUIRED_FIELDS.filter((field) => entry[field] === undefined || entry[field] === '')
  if (missing.length > 0) {
    problem(relativePath, `Missing required field(s): ${missing.join(', ')}. See src/data/participants/_example.json.`)
    continue
  }

  for (const field of REQUIRED_FIELDS) {
    if (typeof entry[field] !== 'string') {
      problem(relativePath, `"${field}" must be a string, but it is a ${typeof entry[field]}.`)
    }
  }

  if (typeof entry.github !== 'string') continue

  if (entry.github !== username) {
    problem(
      relativePath,
      `The filename and the "github" field disagree. The file is named "${file}" but it says "github": "${entry.github}".\n` +
        `  Either rename the file to ${entry.github}.json, or change "github" to "${username}".`,
    )
  }

  if (!GITHUB_USERNAME.test(entry.github)) {
    problem(
      relativePath,
      `"${entry.github}" is not a valid GitHub username. Use your username from your profile URL, not your display name or email.`,
    )
  }

  const key = entry.github.toLowerCase()
  if (claimedBy.has(key)) {
    problem(relativePath, `"${entry.github}" is already registered in ${claimedBy.get(key)}. Each person registers once.`)
  } else {
    claimedBy.set(key, relativePath)
  }

  if (typeof entry.team === 'string' && !teamIds.has(entry.team)) {
    const suggestion = [...teamIds].find((id) => id.startsWith(entry.team.slice(0, 3).toLowerCase()))
    problem(
      relativePath,
      `"${entry.team}" is not a team id in src/data/teams.json.` +
        (suggestion ? ` Did you mean "${suggestion}"?` : '') +
        '\n  Team ids are lowercase, for example "nova", not "Nova".',
    )
  } else if (typeof entry.team === 'string') {
    teamCounts.set(entry.team, (teamCounts.get(entry.team) ?? 0) + 1)
  }

  if (typeof entry.role === 'string' && !VALID_ROLES.includes(entry.role)) {
    problem(relativePath, `"role" must be one of ${VALID_ROLES.join(' or ')}, not "${entry.role}".`)
  }

  if (entry.interests !== undefined) {
    if (!Array.isArray(entry.interests) || entry.interests.some((item) => typeof item !== 'string')) {
      problem(relativePath, '"interests" must be an array of strings, for example ["React", "Backend"].')
    }
  }
}

// A crowded team is a facilitation problem, not a broken file, so this never fails the build.
for (const [teamId, count] of teamCounts) {
  if (count > SOFT_TEAM_LIMIT) {
    notes.push(`Team "${teamId}" has ${count} members. Teams of 1-3 work best — consider spreading out.`)
  }
}

console.log('')
console.log(color.bold(`Validating ${files.length} participant file(s)`))

for (const note of notes) {
  console.log(`${symbol.warn}  ${note}`)
}

if (problems.length === 0) {
  console.log(`${symbol.pass}  Every registration is valid. ${files.length} engineer(s) on the roster.`)
  console.log('')
  process.exit(0)
}

console.log('')
for (const { relativePath, message } of problems) {
  console.log(`${symbol.fail}  ${color.bold(relativePath)}`)
  console.log(`      ${message.split('\n').join('\n      ')}`)
}

console.log('')
console.log(color.red(`${problems.length} problem(s) found.`))
console.log(color.gray('Fix them, commit, and push. This check runs again automatically.'))
console.log('')
process.exit(1)
