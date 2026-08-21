export const summary = 'Half-finished work, and production just broke.'

export function build(scenario) {
  const { write, commit, mission } = scenario

  write(
    'README.md',
    `# Notifications Service
`,
  )
  write(
    'send.js',
    `export function subjectFor(user) {
  return \`Hello \${user.firstName}\`
}

export function send(user, body) {
  return { to: user.email, subject: subjectFor(user), body }
}
`,
  )
  commit('feat: add notification sending')

  write(
    'digest.js',
    `// Weekly digest — work in progress, do not ship
export function buildDigest(events) {
  const grouped = {}
  for (const event of events) {
    grouped[event.kind] = grouped[event.kind] || []
    grouped[event.kind].push(event)
  }
  // TODO: sort each group, render the template, handle the empty case
  return grouped
}
`,
  )
  write(
    'send.js',
    `export function subjectFor(user) {
  return \`Hello \${user.firstName}\`
}

export function send(user, body) {
  return { to: user.email, subject: subjectFor(user), body }
}

// TODO: half-written, digest sending is not finished
export function sendDigest(user, events) {
  const digest = buildDigest(events)
  return send(user, digest)
}
`,
  )

  mission(`# Mission — an interruption you cannot commit your way out of

## The situation

You are halfway through the weekly digest feature. \`digest.js\` is new and
unfinished, \`send.js\` is half-edited, and none of it works yet. Committing it
would put broken code into the history for no reason.

Then this arrives:

> **Production is broken.** \`subjectFor\` crashes for every user who signed up
> without a first name, and nobody is receiving any email at all. Fix it now.

The fix belongs on its own branch, off \`main\`, clean. Your working tree is
anything but clean.

## Your mission

1. Put your unfinished work somewhere safe, without committing it
2. Get to a clean \`main\`
3. Create \`hotfix/missing-first-name\` and fix \`subjectFor\` so a user with no
   \`firstName\` gets something sensible instead of \`Hello undefined\`
4. Commit the fix
5. Come back to your digest work exactly as you left it

## Start by looking

\`\`\`bash
git status
\`\`\`

One file modified, one file untracked. Try switching branches and see what Git
says about it.

## You may need

\`git stash\`, and its friends: \`git stash list\`, \`git stash show -p\`,
\`git stash pop\`.

One catch worth discovering rather than being told: by default \`git stash\`
does not take untracked files with it. \`digest.js\` has never been committed.
Check \`git status\` after you stash and see what is still sitting there, then
look up how to include it.

## Done when

- \`git log\` on \`hotfix/missing-first-name\` shows exactly one clean commit
- That commit contains **only** the \`subjectFor\` fix, with no digest code in it
- Back on your feature work, both \`digest.js\` and your \`send.js\` edits are
  present and unchanged
- \`git stash list\` is empty

## Worth noticing

The interruption is the normal case, not the exception. The reason \`stash\`
exists is that "finish what you are doing first" is not always an option, and
committing half-done work just to move branches pollutes the history that
somebody will read later.
`)

  return {
    story: [
      'You are mid-feature with a dirty working tree. Production just broke and the',
      'fix has to go out from a clean branch. You cannot commit what you have.',
    ],
    firstMoves: ['git status', 'git switch -c hotfix/missing-first-name   # watch what happens'],
  }
}
