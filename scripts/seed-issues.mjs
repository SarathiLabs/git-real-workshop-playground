#!/usr/bin/env node
/**
 * npm run seed:issues -- --dry-run
 * npm run seed:issues
 *
 * Creates the workshop backlog from workshop/issues.yml.
 *
 * Issues are created in dependency order so that a blocked issue can name the
 * real issue number that blocks it. The blocking issue also gets a comment
 * pointing forward, so the relationship is visible from both directions.
 * That cross-link is what makes two teams find each other.
 */
import { color, symbol } from './lib/console.mjs'
import { parseArgs, readWorkshopYaml, requireGh, tryGh } from './lib/gh.mjs'

const { flags, values } = parseArgs(process.argv.slice(2))
const dryRun = flags.has('dry-run')
const limit = values.has('limit') ? Number(values.get('limit')) : Infinity

const issues = readWorkshopYaml('issues.yml')

if (!Array.isArray(issues)) {
  console.error(color.red('workshop/issues.yml must be a list of issues.'))
  process.exit(1)
}

const byKey = new Map()
const problems = []

for (const [index, issue] of issues.entries()) {
  const where = issue?.key ? `"${issue.key}"` : `entry ${index + 1}`
  if (!issue?.key) problems.push(`${where} is missing a "key".`)
  else if (byKey.has(issue.key)) problems.push(`Duplicate key "${issue.key}".`)
  else byKey.set(issue.key, issue)

  if (!issue?.title) problems.push(`${where} is missing a "title".`)
  if (!issue?.body) problems.push(`${where} is missing a "body".`)
}

for (const issue of issues) {
  for (const dependency of issue?.dependsOn ?? []) {
    if (!byKey.has(dependency)) {
      problems.push(`"${issue.key}" depends on "${dependency}", which is not defined.`)
    }
  }
}

if (problems.length > 0) {
  console.error('')
  for (const message of problems) console.error(`${symbol.fail}  ${message}`)
  console.error('')
  process.exit(1)
}

/** Depth-first topological sort so blockers are always created first. */
function order() {
  const sorted = []
  const state = new Map()

  function visit(key, trail) {
    const current = state.get(key)
    if (current === 'done') return
    if (current === 'visiting') {
      console.error(color.red(`Dependency cycle: ${[...trail, key].join(' -> ')}`))
      process.exit(1)
    }

    state.set(key, 'visiting')
    for (const dependency of byKey.get(key).dependsOn ?? []) {
      visit(dependency, [...trail, key])
    }
    state.set(key, 'done')
    sorted.push(byKey.get(key))
  }

  for (const issue of issues) visit(issue.key, [])
  return sorted
}

const planned = order().slice(0, limit)

if (!dryRun) requireGh()

console.log('')
console.log(color.bold(`${dryRun ? 'Would create' : 'Creating'} ${planned.length} issue(s)`))
console.log('')

const numbers = new Map()
let failed = 0

for (const issue of planned) {
  const dependencies = issue.dependsOn ?? []
  const labels = [...(issue.labels ?? [])]
  if (dependencies.length > 0 && !labels.includes('blocked')) labels.push('blocked')

  let body = issue.body.trimEnd()

  if (dependencies.length > 0) {
    const references = dependencies.map((key) => (numbers.has(key) ? `#${numbers.get(key)}` : `\`${key}\``))
    body +=
      '\n\n---\n\n' +
      `**Blocked by ${references.join(' and ')}.**\n\n` +
      'Do not wait quietly. Go and find the team working on it, agree on the shape of the\n' +
      'thing you both need, and say so on their pull request. Two teams discovering they\n' +
      'disagree about an interface at merge time is the expensive version of this.'
  }

  if (dryRun) {
    console.log(`${symbol.info}  ${issue.title}`)
    console.log(`      ${color.gray(labels.join(', ') || 'no labels')}`)
    if (dependencies.length > 0) console.log(`      ${color.gray(`blocked by: ${dependencies.join(', ')}`)}`)
    continue
  }

  const args = ['issue', 'create', '--title', issue.title, '--body', body]
  for (const label of labels) args.push('--label', label)

  const result = tryGh(args)
  if (!result.ok) {
    failed += 1
    console.log(`${symbol.fail}  ${issue.title}`)
    console.log(`      ${color.gray(result.output.split('\n').slice(0, 2).join(' '))}`)
    continue
  }

  const number = Number(result.output.trim().split('/').pop())
  numbers.set(issue.key, number)
  console.log(`${symbol.pass}  #${number}  ${issue.title}`)

  // Link back from each blocker, so the team unblocking others can see who is waiting.
  for (const dependency of dependencies) {
    const blocker = numbers.get(dependency)
    if (!blocker) continue
    tryGh([
      'issue',
      'comment',
      String(blocker),
      '--body',
      `Blocks #${number}. Another team is waiting on this one, so it is worth picking up early.`,
    ])
  }
}

console.log('')
if (dryRun) {
  console.log(color.gray('Dry run. Nothing was created. Re-run without --dry-run to apply.'))
} else {
  console.log(`${numbers.size} issue(s) created, ${failed} failed.`)
  console.log(color.gray('Next: assign the foundation issues first — other teams are blocked on them.'))
}
console.log('')
process.exit(failed > 0 ? 1 : 0)
