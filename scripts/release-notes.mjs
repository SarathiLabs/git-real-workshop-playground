#!/usr/bin/env node
/**
 * npm run release:notes                    since the previous tag
 * npm run release:notes -- --since=v0.1.0
 *
 * Builds release notes from the merged pull requests in a range.
 *
 * This is why commit and pull request titles are worth caring about: the
 * release notes are generated from them, and nobody rewrites forty of them by
 * hand. A commit called "fix" becomes a release note called "fix".
 */
import { execFileSync } from 'node:child_process'
import { color } from './lib/console.mjs'
import { parseArgs } from './lib/gh.mjs'
import { repoRoot } from './lib/workshop-data.mjs'

const { values } = parseArgs(process.argv.slice(2))

const SECTIONS = [
  { key: 'feat', heading: 'Added' },
  { key: 'fix', heading: 'Fixed' },
  { key: 'perf', heading: 'Performance' },
  { key: 'refactor', heading: 'Changed' },
  { key: 'docs', heading: 'Documentation' },
  { key: 'test', heading: 'Tests' },
  { key: 'build', heading: 'Build' },
  { key: 'ci', heading: 'Automation' },
  { key: 'chore', heading: 'Housekeeping' },
]

function git(args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}

function tryGit(args) {
  try {
    return git(args)
  } catch {
    return null
  }
}

const since = values.get('since') ?? tryGit(['describe', '--tags', '--abbrev=0'])
const until = values.get('until') ?? 'HEAD'
const range = since ? `${since}..${until}` : until

const log = tryGit(['log', range, '--no-merges', '--format=%s%x1f%h%x1f%an%x1e'])

if (log === null) {
  console.error(color.red(`Could not read the range "${range}".`))
  console.error('If the tag does not exist locally, run: git fetch --tags')
  process.exit(1)
}

const commits = log
  .split('\x1e')
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => {
    const [subject, sha, author] = entry.split('\x1f')
    return { subject, sha, author }
  })

if (commits.length === 0) {
  console.log(color.gray(`No commits in ${range}.`))
  process.exit(0)
}

const grouped = new Map()
const other = []
const contributors = new Set()

for (const commit of commits) {
  contributors.add(commit.author)

  const match = /^(\w+)(?:\([^)]*\))?!?:\s*(.+)$/.exec(commit.subject)
  const section = match && SECTIONS.find((entry) => entry.key === match[1])

  // "feat: add filtering (#42)" -> keep the PR reference, it links on GitHub.
  const description = match ? match[2] : commit.subject

  if (!section) {
    other.push({ ...commit, description })
    continue
  }

  if (!grouped.has(section.heading)) grouped.set(section.heading, [])
  grouped.get(section.heading).push({ ...commit, description })
}

const lines = []
lines.push(`## ${values.get('version') ?? 'Unreleased'}`)
lines.push('')

for (const { heading } of SECTIONS) {
  const entries = grouped.get(heading)
  if (!entries || entries.length === 0) continue
  lines.push(`### ${heading}`)
  lines.push('')
  for (const entry of entries) {
    lines.push(`- ${entry.description} (${entry.sha})`)
  }
  lines.push('')
}

if (other.length > 0) {
  lines.push('### Uncategorised')
  lines.push('')
  for (const entry of other) {
    lines.push(`- ${entry.description} (${entry.sha})`)
  }
  lines.push('')
  lines.push(
    `> ${other.length} commit(s) did not use a conventional prefix, so they could not be sorted automatically.`,
  )
  lines.push('')
}

lines.push(`**Contributors:** ${[...contributors].sort().join(', ')}`)
lines.push('')
if (since) lines.push(`**Full changelog:** \`${range}\``)

console.log('')
console.log(lines.join('\n'))
