import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { color } from './console.mjs'
import { repoRoot } from './workshop-data.mjs'

export function readWorkshopYaml(name) {
  const path = join(repoRoot, 'workshop', name)
  return parse(readFileSync(path, 'utf8'))
}

export function requireGh() {
  try {
    execFileSync('gh', ['--version'], { stdio: 'ignore' })
  } catch {
    console.error(color.red('The GitHub CLI (`gh`) is not installed.'))
    console.error('Install it from https://cli.github.com and run `gh auth login`.')
    process.exit(1)
  }

  try {
    execFileSync('gh', ['auth', 'status'], { stdio: 'ignore' })
  } catch {
    console.error(color.red('The GitHub CLI is installed but not signed in.'))
    console.error('Run: gh auth login')
    process.exit(1)
  }
}

export function gh(args) {
  return execFileSync('gh', args, { cwd: repoRoot, encoding: 'utf8' }).trim()
}

export function tryGh(args) {
  try {
    return { ok: true, output: gh(args) }
  } catch (error) {
    return {
      ok: false,
      output: (error.stderr || error.stdout || error.message || '').toString().trim(),
    }
  }
}

export function parseArgs(argv) {
  const flags = new Set()
  const values = new Map()

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue
    const [key, value] = arg.slice(2).split('=')
    if (value === undefined) flags.add(key)
    else values.set(key, value)
  }

  return { flags, values }
}
