import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { color } from './console.mjs'
import { repoRoot } from './workshop-data.mjs'

export const scenariosRoot = join(repoRoot, '.scenarios')

/**
 * Every generated repository gets its own identity and config, so a scenario
 * behaves the same on a laptop with an exotic ~/.gitconfig as it does on a
 * fresh install. Signing is off because a GPG prompt in the middle of an
 * exercise derails it completely.
 */
const GIT_CONFIG = [
  '-c',
  'user.name=Workshop Bot',
  '-c',
  'user.email=bot@git-real.invalid',
  '-c',
  'commit.gpgsign=false',
  '-c',
  'tag.gpgsign=false',
  '-c',
  'init.defaultBranch=main',
  '-c',
  'advice.detachedHead=false',
]

let clock = new Date('2026-08-01T09:00:00Z').getTime()

function nextTimestamp() {
  // Commits land a few minutes apart so `git log` reads like real work.
  clock += 7 * 60 * 1000
  return new Date(clock).toISOString()
}

export function createScenario(name, { init = true } = {}) {
  const dir = join(scenariosRoot, name)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })

  function git(args, options = {}) {
    return execFileSync('git', [...GIT_CONFIG, ...args], {
      cwd: options.cwd ?? dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...options.env },
    }).trim()
  }

  function write(relativePath, contents, options = {}) {
    const target = join(options.cwd ?? dir, relativePath)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, contents.endsWith('\n') ? contents : `${contents}\n`)
  }

  function commit(message, options = {}) {
    if (options.all !== false) git(['add', '-A'], options)
    const date = nextTimestamp()
    git(['commit', '-m', message], {
      ...options,
      env: { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date, ...options.env },
    })
    return git(['rev-parse', '--short', 'HEAD'], options)
  }

  /**
   * The brief lives inside the repository so it is there when you `cd` in, but
   * it is not part of the exercise. `.git/info/exclude` hides it from
   * `git status` without adding a tracked .gitignore that would change the
   * history these scenarios depend on.
   */
  function mission(contents) {
    write('MISSION.md', contents)
    if (!init) return
    const infoDir = join(dir, '.git', 'info')
    mkdirSync(infoDir, { recursive: true })
    writeFileSync(join(infoDir, 'exclude'), 'MISSION.md\n')
  }

  // An empty template skips the sample hooks, which are pure clutter in a
  // throwaway repo and need filesystem permissions some locked-down machines
  // do not grant.
  if (init) git(['init', '--quiet', '--template='])

  return { name, dir, git, write, commit, mission }
}

export function relativeToCwd(dir) {
  const fromCwd = dir.replace(`${process.cwd()}/`, '')
  return fromCwd === dir ? dir : fromCwd
}

export function briefing({ title, dir, story, firstMoves }) {
  const lines = []
  lines.push('')
  lines.push(color.bold(title))
  lines.push(color.gray('='.repeat(title.length)))
  lines.push('')
  for (const paragraph of story) {
    lines.push(paragraph)
    lines.push('')
  }
  lines.push(color.bold('Start here'))
  lines.push('')
  lines.push(`  cd ${relativeToCwd(dir)}`)
  for (const move of firstMoves) {
    lines.push(`  ${move}`)
  }
  lines.push('')
  lines.push(color.gray('The full brief is in MISSION.md inside that folder.'))
  lines.push(color.gray('Broke it beyond repair? Generate it again. It is disposable.'))
  lines.push('')
  console.log(lines.join('\n'))
}
