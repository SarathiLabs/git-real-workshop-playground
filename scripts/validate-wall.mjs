#!/usr/bin/env node
/**
 * npm run validate:wall
 *
 * The wall is the workshop's deliberate merge-conflict arena. Everybody inserts
 * at the same position in the same list and increments the same counter, so the
 * second pull request onward always conflicts.
 *
 * This check exists so that resolving the conflict badly is not silently fine.
 * "Accept both" leaves the counter wrong. "Accept mine" deletes somebody else's
 * entry. Only reading the change and reconciling it by hand produces a green
 * check, which is the whole lesson stated as a build step.
 */
import { annotate, color, symbol } from './lib/console.mjs'
import { listParticipantFiles, readTeams, readWall } from './lib/workshop-data.mjs'

const WALL_PATH = 'src/data/wall.json'
const problems = []

function problem(message) {
  problems.push(message)
  annotate('error', { file: WALL_PATH, message })
}

let wall
try {
  wall = readWall()
} catch (error) {
  console.log('')
  console.log(`${symbol.fail}  ${color.bold(WALL_PATH)}`)
  console.log(`      ${error.message.split('\n').join('\n      ')}`)
  console.log('')
  console.log(color.gray('If you see <<<<<<< or >>>>>>> in the file, the merge conflict is still unresolved.'))
  console.log('')
  annotate('error', { file: WALL_PATH, message: error.message })
  process.exit(1)
}

const teamIds = new Set(readTeams().map((team) => team.id))
const registered = new Set(listParticipantFiles().map(({ username }) => username.toLowerCase()))

if (!Array.isArray(wall.entries)) {
  problem('"entries" must be an array.')
} else {
  const seen = new Map()

  wall.entries.forEach((entry, index) => {
    const at = `entries[${index}]`

    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      problem(`${at} must be an object with "github", "team", and "shipped".`)
      return
    }

    for (const field of ['github', 'team', 'shipped']) {
      if (typeof entry[field] !== 'string' || entry[field].trim() === '') {
        problem(`${at} is missing a non-empty "${field}".`)
      }
    }

    if (typeof entry.github !== 'string') return

    const key = entry.github.toLowerCase()
    if (seen.has(key)) {
      problem(
        `"${entry.github}" appears twice, at entries[${seen.get(key)}] and ${at}.\n` +
          '  This usually means a merge conflict was resolved by keeping both sides of the same entry.\n' +
          '  Keep one copy.',
      )
    } else {
      seen.set(key, index)
    }

    if (typeof entry.team === 'string' && !teamIds.has(entry.team)) {
      problem(`${at} has team "${entry.team}", which is not a team id in src/data/teams.json.`)
    }

    if (registered.size > 0 && !registered.has(key)) {
      problem(
        `${at} is "${entry.github}", who has no file in src/data/participants/.\n` +
          '  Register first (exercise 01), then sign the wall.',
      )
    }
  })

  if (typeof wall.engineersOnboard !== 'number' || !Number.isInteger(wall.engineersOnboard)) {
    problem('"engineersOnboard" must be a whole number.')
  } else if (wall.engineersOnboard !== wall.entries.length) {
    problem(
      `"engineersOnboard" says ${wall.engineersOnboard} but there are ${wall.entries.length} entries.\n` +
        '  These two numbers describe the same thing, so they have to agree.\n' +
        '  If you just resolved a conflict: Git kept both new entries but could only keep one\n' +
        '  version of the counter. Neither side was right. Count the entries and write that number.',
    )
  }
}

if (typeof wall.lastUpdatedBy !== 'string' || wall.lastUpdatedBy.trim() === '') {
  problem('"lastUpdatedBy" must be the GitHub username of whoever changed this file last.')
} else if (Array.isArray(wall.entries) && wall.entries.length > 0) {
  const newest = wall.entries[0]
  if (typeof newest?.github === 'string' && newest.github.toLowerCase() !== wall.lastUpdatedBy.toLowerCase()) {
    problem(
      `"lastUpdatedBy" is "${wall.lastUpdatedBy}" but the newest entry is "${newest.github}".\n` +
        '  New entries go at the top of the list, so those should match.\n' +
        '  If you resolved a conflict and kept the other person\'s name here, put yours back.',
    )
  }
}

console.log('')
console.log(color.bold('Validating the wall'))

if (problems.length === 0) {
  const count = Array.isArray(wall.entries) ? wall.entries.length : 0
  console.log(`${symbol.pass}  The wall is consistent. ${count} engineer(s) have signed it.`)
  console.log('')
  process.exit(0)
}

console.log('')
for (const message of problems) {
  console.log(`${symbol.fail}  ${message.split('\n').join('\n      ')}`)
}
console.log('')
console.log(color.red(`${problems.length} problem(s) in ${WALL_PATH}.`))
console.log('')
process.exit(1)
