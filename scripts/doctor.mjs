#!/usr/bin/env node
/**
 * npm run doctor
 *
 * Checks that this machine can actually take part in the workshop before the
 * workshop starts. Every failure prints the exact command that fixes it, so a
 * room of 60 people can unblock themselves without queueing at the front.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { color, heading, symbol } from './lib/console.mjs'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

const results = []

function record(status, title, detail, fix) {
  results.push({ status, title, detail, fix })
}

function pass(title, detail) {
  record('pass', title, detail)
}

function warn(title, detail, fix) {
  record('warn', title, detail, fix)
}

function fail(title, detail, fix) {
  record('fail', title, detail, fix)
}

function run(command, args) {
  return execFileSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}

function tryRun(command, args) {
  try {
    return { ok: true, output: run(command, args) }
  } catch (error) {
    return { ok: false, output: (error.stderr || error.stdout || error.message || '').toString().trim() }
  }
}

function checkNode() {
  const major = Number(process.versions.node.split('.')[0])
  if (Number.isNaN(major) || major < 20) {
    fail(
      'Node.js version',
      `Found v${process.versions.node}. This project needs Node 20 or newer.`,
      'Install the current LTS from https://nodejs.org and reopen your terminal.',
    )
    return
  }
  pass('Node.js version', `v${process.versions.node}`)
}

function checkGitInstalled() {
  const result = tryRun('git', ['--version'])
  if (!result.ok) {
    fail(
      'Git installed',
      'The `git` command was not found on your PATH.',
      'Install Git from https://git-scm.com/downloads, then close and reopen your terminal.',
    )
    return false
  }

  const version = result.output.replace('git version ', '')
  const [major, minor] = version.split('.').map(Number)
  if (major < 2 || (major === 2 && minor < 23)) {
    warn(
      'Git version',
      `Found ${version}. Some workshop commands (git switch, git restore) need 2.23 or newer.`,
      'Update Git from https://git-scm.com/downloads.',
    )
    return true
  }

  pass('Git version', version)
  return true
}

function checkIdentity() {
  const name = tryRun('git', ['config', '--get', 'user.name'])
  const email = tryRun('git', ['config', '--get', 'user.email'])

  if (!name.ok || !name.output) {
    fail(
      'Git user.name',
      'Git does not know your name, so your commits cannot be attributed to you.',
      'git config --global user.name "Your Name"',
    )
  } else {
    pass('Git user.name', name.output)
  }

  if (!email.ok || !email.output) {
    fail(
      'Git user.email',
      'Git does not know your email, so GitHub cannot link commits to your account.',
      'git config --global user.email "you@example.com"',
    )
    return
  }

  if (!email.output.includes('@')) {
    fail('Git user.email', `"${email.output}" does not look like an email address.`, 'git config --global user.email "you@example.com"')
    return
  }

  pass('Git user.email', email.output)

  if (email.output.endsWith('users.noreply.github.com')) return

  warn(
    'Email must match GitHub',
    `Commits will be attributed to ${email.output}.`,
    'This must be an email listed at https://github.com/settings/emails, or GitHub cannot link your commits to you.',
  )
}

function checkLineEndings() {
  const autocrlf = tryRun('git', ['config', '--get', 'core.autocrlf'])
  const value = autocrlf.ok ? autocrlf.output : ''

  if (process.platform === 'win32' && value === 'true') {
    warn(
      'Line endings',
      'core.autocrlf is true on Windows.',
      'This repo ships a .gitattributes that handles line endings. Run: git config --global core.autocrlf input',
    )
    return
  }

  pass('Line endings', value ? `core.autocrlf=${value}` : 'handled by .gitattributes')
}

function checkRemote() {
  const inRepo = tryRun('git', ['rev-parse', '--is-inside-work-tree'])
  if (!inRepo.ok) {
    fail(
      'Inside a Git repository',
      'This folder is not a Git repository, so you probably downloaded a ZIP instead of cloning.',
      'Delete this folder and run: git clone <repo-url>',
    )
    return null
  }

  const remote = tryRun('git', ['remote', 'get-url', 'origin'])
  if (!remote.ok || !remote.output) {
    fail('Remote "origin"', 'No remote named origin is configured.', 'git remote add origin <repo-url>')
    return null
  }

  pass('Remote "origin"', remote.output)
  return remote.output
}

function checkGitHubAuth(remoteUrl) {
  if (!remoteUrl) return

  if (remoteUrl.startsWith('http')) {
    const gh = tryRun('gh', ['auth', 'status'])
    if (gh.ok) {
      pass('GitHub authentication', 'GitHub CLI is signed in (HTTPS remote).')
      return
    }
    warn(
      'GitHub authentication',
      'You are using an HTTPS remote and the GitHub CLI is not signed in.',
      'Either run `gh auth login`, or create a Personal Access Token at https://github.com/settings/tokens and paste it when Git asks for a password.',
    )
    return
  }

  // The host may be an alias from ~/.ssh/config rather than github.com,
  // which is common for people juggling several GitHub accounts.
  const host = remoteUrl.match(/^(?:ssh:\/\/)?git@([^:/]+)/)?.[1] ?? 'github.com'

  // ssh -T exits 1 on success for GitHub, so inspect the message rather than the code.
  const ssh = tryRun('ssh', ['-o', 'StrictHostKeyChecking=accept-new', '-o', 'BatchMode=yes', '-T', `git@${host}`])
  const message = ssh.output

  if (message.includes('successfully authenticated')) {
    const who = message.match(/Hi ([^!]+)!/)
    pass('GitHub authentication', who ? `SSH works, signed in as ${who[1]}` : 'SSH key accepted by GitHub')
    return
  }

  if (/could not resolve hostname|network is unreachable|timed out|connection refused/i.test(message)) {
    warn(
      'GitHub authentication',
      `Could not reach ${host} to test your SSH key.`,
      'Check your internet connection, then re-run: npm run doctor',
    )
    return
  }

  fail(
    'GitHub authentication',
    `GitHub did not accept your SSH key over ${host}.`,
    `Follow https://docs.github.com/en/authentication/connecting-to-github-with-ssh, then re-run: ssh -T git@${host}`,
  )
}

function checkDependencies() {
  if (!existsSync(join(repoRoot, 'node_modules'))) {
    fail('Dependencies installed', 'node_modules is missing.', 'npm install')
    return
  }
  pass('Dependencies installed', 'node_modules is present')
}

function checkEnvFile() {
  if (!existsSync(join(repoRoot, '.env'))) {
    warn(
      'Local .env',
      'No .env file yet. The dashboard will fall back to unauthenticated GitHub requests and rate-limit quickly.',
      'Copy .env.example to .env and add a read-only token.',
    )
    return
  }
  pass('Local .env', 'present (and ignored by Git)')
}

function currentGithubLogin() {
  const gh = tryRun('gh', ['api', 'user', '--jq', '.login'])
  if (gh.ok && gh.output) return gh.output

  const ssh = tryRun('ssh', ['-o', 'BatchMode=yes', '-T', 'git@github.com'])
  const match = ssh.output.match(/Hi ([^!]+)!/)
  return match ? match[1] : null
}

function checkRegistration() {
  const dir = join(repoRoot, 'src', 'data', 'participants')
  if (!existsSync(dir)) {
    warn('Workshop registration', 'The participants folder does not exist yet.', 'Pull the latest main: git pull')
    return
  }

  const files = readdirSync(dir).filter((file) => file.endsWith('.json') && !file.startsWith('.'))
  const login = currentGithubLogin()

  if (!login) {
    warn(
      'Workshop registration',
      `${files.length} participant file(s) found, but your GitHub username could not be detected.`,
      'Check manually that src/data/participants/<your-username>.json exists.',
    )
    return
  }

  const expected = `${login}.json`
  if (files.includes(expected)) {
    const entry = JSON.parse(readFileSync(join(dir, expected), 'utf8'))
    pass('Workshop registration', `Registered as ${login} on team "${entry.team}"`)
    return
  }

  warn(
    'Workshop registration',
    `You (${login}) have not registered yet. That is Exercise 01.`,
    `Create src/data/participants/${expected} — see exercises/01-setup-and-register.md`,
  )
}

function report() {
  heading('Git Real — workshop doctor')

  for (const result of results) {
    const label = symbol[result.status]
    console.log(`${label}  ${color.bold(result.title)}${result.detail ? color.gray(` — ${result.detail}`) : ''}`)
    if (result.fix) {
      console.log(`      ${color.cyan('fix:')} ${result.fix}`)
    }
  }

  const failures = results.filter((result) => result.status === 'fail')
  const warnings = results.filter((result) => result.status === 'warn')

  console.log('')
  if (failures.length === 0 && warnings.length === 0) {
    console.log(color.green('Everything is ready. See you at the workshop.'))
  } else if (failures.length === 0) {
    console.log(color.yellow(`Ready to start, with ${warnings.length} thing(s) worth reading above.`))
  } else {
    console.log(color.red(`${failures.length} blocking problem(s). Fix those before the workshop starts.`))
  }
  console.log('')

  process.exit(failures.length > 0 ? 1 : 0)
}

checkNode()
if (checkGitInstalled()) {
  checkIdentity()
  checkLineEndings()
  const remote = checkRemote()
  checkGitHubAuth(remote)
}
checkDependencies()
checkEnvFile()
checkRegistration()
report()
