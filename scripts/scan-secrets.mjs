#!/usr/bin/env node
/**
 * npm run scan:secrets
 *
 * A deliberately small secret scanner, so the workshop can show a credential
 * being caught by automation rather than by a slide.
 *
 * Markdown is skipped on purpose: the exercises and docs need to be able to
 * print realistic-looking tokens as examples. Real scanners do read markdown,
 * and GitHub's own secret scanning (enabled on this repository) covers it.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { annotate, color, symbol } from './lib/console.mjs'
import { repoRoot } from './lib/workshop-data.mjs'

const RULES = [
  {
    name: 'AWS access key id',
    pattern: /\bAKIA[0-9A-Z]{16}\b/g,
    advice: 'Deactivate this key in the AWS IAM console immediately.',
  },
  {
    name: 'GitHub personal access token',
    pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{22,}\b/g,
    advice: 'Revoke it at https://github.com/settings/tokens.',
  },
  {
    name: 'Stripe secret key',
    pattern: /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/g,
    advice: 'Roll the key in the Stripe dashboard.',
  },
  {
    name: 'Google API key',
    pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g,
    advice: 'Regenerate the key in Google Cloud Console.',
  },
  {
    name: 'Slack token',
    pattern: /\bxox[abposr]-[0-9A-Za-z-]{10,}\b/g,
    advice: 'Revoke the token in your Slack app settings.',
  },
  {
    name: 'Private key block',
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g,
    advice: 'Generate a new key pair and remove this one from every machine that trusts it.',
  },
  {
    name: 'Hardcoded credential',
    // Only flags a literal value. process.env.X and import.meta.env.X are the correct pattern
    // and do not match, because the value has to be inside quotes.
    pattern:
      /\b(?:api[_-]?key|apikey|secret|password|passwd|access[_-]?token|auth[_-]?token|client[_-]?secret)\b\s*[:=]\s*['"`]([^'"`\n]{8,})['"`]/gi,
    advice: 'Move the value into an environment variable and rotate it.',
    ignoreValue: /^(?:process\.env|import\.meta|your[_-]|example|placeholder|changeme|xxx+|\.\.\.|<.*>|\$\{)/i,
  },
]

const SKIP_EXTENSIONS = new Set(['.md', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.lock'])
const SKIP_PATHS = new Set(['scripts/scan-secrets.mjs', '.env.example', 'package-lock.json'])
// Facilitator source for the seeded backlog. The trap key lives in an Issue
// body on purpose; scanning this file would fail CI on main before anyone
// has a chance to walk into the trap.
const SKIP_PREFIXES = ['workshop/']
const MAX_BYTES = 512 * 1024

function trackedFiles() {
  const output = execFileSync('git', ['ls-files', '-z'], { cwd: repoRoot, encoding: 'utf8' })
  return output.split('\0').filter(Boolean)
}

function shouldScan(path) {
  if (SKIP_PATHS.has(path)) return false
  if (SKIP_PREFIXES.some((prefix) => path === prefix.slice(0, -1) || path.startsWith(prefix))) return false
  const extension = path.slice(path.lastIndexOf('.'))
  if (SKIP_EXTENSIONS.has(extension)) return false
  return true
}

function redact(value) {
  if (value.length <= 8) return '*'.repeat(value.length)
  return `${value.slice(0, 4)}${'*'.repeat(Math.min(value.length - 8, 20))}${value.slice(-4)}`
}

const findings = []

const files = trackedFiles()

// A committed .env is the single most common way a real secret escapes.
for (const path of files) {
  if (!/(^|\/)\.env(\.local)?$/.test(path)) continue
  findings.push({
    path,
    line: 1,
    rule: 'Committed .env file',
    excerpt: path,
    advice:
      'This file is meant to stay on your machine. It is already in .gitignore, so it was force-added. ' +
      `Remove it from Git with: git rm --cached ${path}`,
  })
}

for (const path of files) {
  if (!shouldScan(path)) continue

  const absolute = join(repoRoot, path)
  let stats
  try {
    stats = statSync(absolute)
  } catch {
    continue
  }
  if (!stats.isFile() || stats.size > MAX_BYTES) continue

  let contents
  try {
    contents = readFileSync(absolute, 'utf8')
  } catch {
    continue
  }
  if (contents.includes('\0')) continue

  const lines = contents.split('\n')

  for (const rule of RULES) {
    for (const [index, line] of lines.entries()) {
      if (line.includes('secret-scan-ignore')) continue

      rule.pattern.lastIndex = 0
      let match
      while ((match = rule.pattern.exec(line)) !== null) {
        const value = match[1] ?? match[0]
        if (rule.ignoreValue?.test(value)) continue

        findings.push({
          path,
          line: index + 1,
          rule: rule.name,
          excerpt: redact(value),
          advice: rule.advice,
        })
      }
    }
  }
}

console.log('')
console.log(color.bold(`Scanning ${files.length} tracked file(s) for credentials`))

if (findings.length === 0) {
  console.log(`${symbol.pass}  No credentials found.`)
  console.log('')
  process.exit(0)
}

console.log('')
for (const finding of findings) {
  const message = `${finding.rule} detected: ${finding.excerpt}. ${finding.advice}`
  console.log(`${symbol.fail}  ${color.bold(`${finding.path}:${finding.line}`)}`)
  console.log(`      ${finding.rule} — ${finding.excerpt}`)
  console.log(`      ${color.cyan('fix:')} ${finding.advice}`)
  annotate('error', { file: finding.path, line: finding.line, message })
}

console.log('')
console.log(color.red(`${findings.length} potential credential(s) found.`))
console.log('')
console.log(color.yellow('Read this part carefully.'))
console.log(
  color.gray(
    '  Deleting the line and committing again does NOT undo this. The old commit still\n' +
      '  contains the value, and anyone with the repository can read it with `git log -p`.\n' +
      '  The only real fix is to revoke the credential and issue a new one.\n' +
      '  Treat any secret that reached a shared branch as already compromised.',
  ),
)
console.log('')
process.exit(1)
