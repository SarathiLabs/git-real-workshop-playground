#!/usr/bin/env node
/**
 * npm run check:hygiene
 *
 * Branch naming, commit messages, and pull request size.
 *
 * This runs as a SEPARATE workflow from ci.yml and is deliberately left out of
 * the required checks. A red mark that still lets you merge is a different
 * thing from a red mark that blocks you, and seeing both on the same pull
 * request is the clearest way to explain branch protection.
 */
import { execFileSync } from 'node:child_process'
import { annotate, color, symbol } from './lib/console.mjs'
import { readTeams, repoRoot } from './lib/workshop-data.mjs'

const TYPES = ['feat', 'fix', 'docs', 'test', 'refactor', 'chore', 'hotfix']
const COMMIT_TYPES = [...TYPES, 'style', 'perf', 'build', 'ci', 'revert']

const BRANCH_PATTERN = new RegExp(`^(${TYPES.join('|')})/([a-z0-9]+)-([a-z0-9][a-z0-9-]*)$`)
const COMMIT_PATTERN = new RegExp(`^(${COMMIT_TYPES.join('|')})(\\([a-z0-9 ,._-]+\\))?!?: .{3,}`)
const LOW_EFFORT = /^(update|updates|fix|fixes|fixed|changes|change|final|final2|done|wip|test|temp|asdf|stuff|misc|\.+)$/i

const MAX_FILES = 20
const MAX_LINES = 400

const baseRef = process.env.PR_BASE_REF || 'main'
const branch = process.env.PR_HEAD_REF || currentBranch()

const problems = []
const notes = []

function git(args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim()
}

function tryGit(args) {
  try {
    return git(args)
  } catch {
    return null
  }
}

function currentBranch() {
  return tryGit(['rev-parse', '--abbrev-ref', 'HEAD']) ?? ''
}

function problem(message, hint) {
  problems.push({ message, hint })
  annotate('warning', { message: hint ? `${message} ${hint}` : message })
}

function checkBranchName() {
  if (!branch || branch === 'main' || branch === 'HEAD') {
    notes.push('Not on a feature branch, skipping the branch name check.')
    return
  }

  const match = BRANCH_PATTERN.exec(branch)
  if (!match) {
    problem(
      `Branch "${branch}" does not follow the convention.`,
      `Expected <type>/<team>-<description>, for example feat/phoenix-dark-mode.\n` +
        `  Types: ${TYPES.join(', ')}. Description is lowercase words joined by hyphens.`,
    )
    return
  }

  const [, , team] = match
  const teamIds = new Set(readTeams().map((entry) => entry.id))
  if (!teamIds.has(team)) {
    problem(
      `Branch "${branch}" names team "${team}", which is not a team id in src/data/teams.json.`,
      'Use your team id, for example feat/nova-empty-state.',
    )
  }
}

function commitSubjects() {
  const range = tryGit(['rev-list', '--no-merges', `origin/${baseRef}..HEAD`, '--format=%s'])
  if (range === null) {
    // Local run without the base branch fetched. Fall back to the last few commits.
    const recent = tryGit(['log', '--no-merges', '-5', '--format=%s'])
    notes.push(`Could not compare against origin/${baseRef}, checking the last 5 commits instead.`)
    return recent ? recent.split('\n').filter(Boolean) : []
  }

  return range
    .split('\n')
    .filter((line) => line && !line.startsWith('commit '))
}

function checkCommits() {
  const subjects = commitSubjects()

  if (subjects.length === 0) {
    notes.push('No commits to check.')
    return
  }

  for (const subject of subjects) {
    if (LOW_EFFORT.test(subject.trim())) {
      problem(
        `Commit message "${subject}" does not say anything.`,
        'In six months this is the only explanation anybody will have. Say what changed and why, ' +
          'for example "fix: handle missing avatar when a contributor has no profile image".',
      )
      continue
    }

    if (!COMMIT_PATTERN.test(subject)) {
      problem(
        `Commit message "${subject}" is not in conventional format.`,
        `Expected <type>: <description>, for example "feat: add team filtering".\n` +
          `  Types: ${COMMIT_TYPES.join(', ')}.`,
      )
      continue
    }

    if (subject.length > 72) {
      problem(
        `Commit message is ${subject.length} characters long.`,
        'Keep the subject under 72 characters and put the detail in the body.',
      )
    }
  }
}

function checkSize() {
  const stat = tryGit(['diff', '--numstat', `origin/${baseRef}...HEAD`])
  if (stat === null || stat === '') return

  const rows = stat.split('\n').filter(Boolean)
  let changed = 0
  let files = 0

  for (const row of rows) {
    const [added, removed, path] = row.split('\t')
    if (path === 'package-lock.json') continue
    files += 1
    changed += (Number(added) || 0) + (Number(removed) || 0)
  }

  if (files > MAX_FILES || changed > MAX_LINES) {
    problem(
      `This pull request touches ${files} file(s) and ${changed} line(s).`,
      `Anything over ~${MAX_FILES} files or ~${MAX_LINES} lines stops getting a real review and starts ` +
        'getting an "LGTM". Consider splitting it into separate pull requests.',
    )
  }
}

checkBranchName()
checkCommits()
checkSize()

console.log('')
console.log(color.bold('Pull request hygiene'))

for (const note of notes) {
  console.log(`${symbol.info}  ${color.gray(note)}`)
}

if (problems.length === 0) {
  console.log(`${symbol.pass}  Branch name, commit messages, and size all look good.`)
  console.log('')
  process.exit(0)
}

console.log('')
for (const { message, hint } of problems) {
  console.log(`${symbol.warn}  ${message}`)
  if (hint) console.log(`      ${color.gray(hint.split('\n').join('\n      '))}`)
}

console.log('')
console.log(color.yellow(`${problems.length} suggestion(s).`))
console.log(
  color.gray(
    'This check is advisory. It is not a required check, so it cannot stop you from merging.\n' +
      'It is here because conventions are how forty people read each other\'s work quickly.',
  ),
)
console.log('')
process.exit(1)
