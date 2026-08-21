export const summary = 'One good commit on a branch you cannot merge.'

export function build(scenario) {
  const { git, write, commit, mission } = scenario

  write('README.md', '# Auth Service\n')
  write(
    'session.js',
    `export function expiresAt(issuedAt) {
  return issuedAt + 3600
}

export function isExpired(session, now) {
  return expiresAt(session.issuedAt) < now
}
`,
  )
  commit('feat: add session expiry')

  git(['switch', '-c', 'experiment/passwordless-login'])

  write(
    'magic-link.js',
    `// Experimental. Not reviewed. Do not ship.
export function createMagicLink(email) {
  return \`https://example.com/magic?email=\${email}\`
}
`,
  )
  commit('feat: prototype magic link login')

  write(
    'session.js',
    `export function expiresAt(issuedAt) {
  return issuedAt + 3600
}

export function isExpired(session, now) {
  if (!session || typeof session.issuedAt !== 'number') {
    return true
  }
  return expiresAt(session.issuedAt) < now
}
`,
  )
  commit('fix: treat a malformed session as expired')

  write(
    'magic-link.js',
    `// Experimental. Not reviewed. Do not ship.
export function createMagicLink(email) {
  const token = Math.random().toString(36).slice(2)
  return \`https://example.com/magic?email=\${email}&token=\${token}\`
}

export function verifyMagicLink() {
  return true // TODO: literally anything
}
`,
  )
  commit('feat: add magic link token')

  write(
    'debug.js',
    `export const BYPASS_AUTH = true // remove before merging, obviously
`,
  )
  commit('chore: add local auth bypass for testing')

  git(['switch', 'main'])

  mission(`# Mission — take one commit and leave the rest

## The situation

\`experiment/passwordless-login\` is somebody's prototype branch. It contains an
unreviewed login flow, a \`verifyMagicLink\` that returns \`true\` unconditionally,
and a file that turns authentication off entirely.

It is nowhere near shippable.

Buried in the middle of it is this:

\`\`\`text
fix: treat a malformed session as expired
\`\`\`

That is a genuine security fix. A session object with no \`issuedAt\` currently
reads as valid forever. It has nothing to do with magic links — it just happens
to have been written on that branch.

You need that one commit on \`main\` today. You cannot merge the branch.

## Your mission

Get exactly that commit onto \`main\`, and nothing else.

\`\`\`bash
git log --oneline main..experiment/passwordless-login
\`\`\`

Find its SHA, then look at it before you take it:

\`\`\`bash
git show <sha>
\`\`\`

## You may need

\`git cherry-pick <sha>\` — takes the *change* that commit made and applies it as
a new commit on your current branch.

## Done when

- \`main\` contains the malformed-session fix
- \`main\` has no \`magic-link.js\` and no \`debug.js\`
- \`git log --oneline\` on \`main\` shows one new commit
- The experiment branch is untouched

## Worth noticing

Compare the SHA on \`main\` with the SHA on the experiment branch. They are
different, and that is the important part. A cherry-pick does not move a
commit, it replays the change as a brand new commit with a new identity.

So the same change now exists twice in the repository, in two places, under two
SHAs. That is fine, and Git usually copes when the branch is eventually merged
or dropped. But it is why cherry-picking is a targeted tool and not a general
way to move work around. Reach for it when you need one specific change out of
a branch that is not going anywhere — a hotfix onto a release branch is the
classic case.
`)

  return {
    story: [
      'A prototype branch full of things that must never ship, containing exactly one',
      'genuine security fix that is needed on main today.',
    ],
    firstMoves: ['git log --oneline main..experiment/passwordless-login', 'cat MISSION.md'],
  }
}
