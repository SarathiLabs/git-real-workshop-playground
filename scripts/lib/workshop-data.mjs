import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const dataDir = join(repoRoot, 'src', 'data')
export const participantsDir = join(dataDir, 'participants')

/**
 * Reads JSON and turns a parse failure into something a first-timer can act on.
 * The default SyntaxError does not say which file it came from.
 */
export function readJson(path, relativePath) {
  const raw = readFileSync(path, 'utf8')
  try {
    return JSON.parse(raw)
  } catch (error) {
    const position = Number(error.message.match(/position (\d+)/)?.[1] ?? NaN)
    const line = Number.isNaN(position) ? null : raw.slice(0, position).split('\n').length
    const where = line ? ` around line ${line}` : ''
    throw new Error(
      `${relativePath} is not valid JSON${where}.\n` +
        `  ${error.message}\n` +
        '  Common causes: a trailing comma after the last item, a missing comma between items, ' +
        'or unresolved merge conflict markers (<<<<<<<) left in the file.',
    )
  }
}

export function readTeams() {
  return readJson(join(dataDir, 'teams.json'), 'src/data/teams.json')
}

export function readWall() {
  return readJson(join(dataDir, 'wall.json'), 'src/data/wall.json')
}

/** Participant filenames prefixed with `_` are templates, not people. */
export function listParticipantFiles() {
  let entries
  try {
    entries = readdirSync(participantsDir)
  } catch {
    return []
  }

  return entries
    .filter((file) => file.endsWith('.json') && !file.startsWith('_'))
    .sort()
    .map((file) => ({
      file,
      username: file.replace(/\.json$/, ''),
      absolutePath: join(participantsDir, file),
      relativePath: `src/data/participants/${file}`,
    }))
}
