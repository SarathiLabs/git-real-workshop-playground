#!/usr/bin/env node
/**
 * npm run seed:labels [-- --dry-run]
 *
 * Creates or updates the labels in workshop/labels.yml. Idempotent, so it is
 * safe to run again after editing the file.
 */
import { color, symbol } from './lib/console.mjs'
import { parseArgs, readWorkshopYaml, requireGh, tryGh } from './lib/gh.mjs'

const { flags } = parseArgs(process.argv.slice(2))
const dryRun = flags.has('dry-run')

const labels = readWorkshopYaml('labels.yml')

if (!Array.isArray(labels)) {
  console.error(color.red('workshop/labels.yml must be a list of labels.'))
  process.exit(1)
}

if (!dryRun) requireGh()

console.log('')
console.log(color.bold(`${dryRun ? 'Would apply' : 'Applying'} ${labels.length} label(s)`))
console.log('')

let created = 0
let updated = 0
let failed = 0

for (const label of labels) {
  if (!label?.name) {
    console.log(`${symbol.fail}  A label entry is missing a "name".`)
    failed += 1
    continue
  }

  if (dryRun) {
    console.log(`${symbol.info}  ${label.name} ${color.gray(`#${label.color ?? 'auto'}`)}`)
    continue
  }

  const args = ['label', 'create', label.name, '--force']
  if (label.color) args.push('--color', label.color)
  if (label.description) args.push('--description', label.description)

  const result = tryGh(args)
  if (result.ok) {
    // `--force` creates or updates, and gh does not distinguish between them.
    if (result.output.includes('Updated')) updated += 1
    else created += 1
    console.log(`${symbol.pass}  ${label.name}`)
  } else {
    failed += 1
    console.log(`${symbol.fail}  ${label.name} — ${result.output.split('\n')[0]}`)
  }
}

console.log('')
if (dryRun) {
  console.log(color.gray('Dry run. Nothing was changed. Re-run without --dry-run to apply.'))
} else {
  console.log(`${created + updated} label(s) applied, ${failed} failed.`)
}
console.log('')
process.exit(failed > 0 ? 1 : 0)
