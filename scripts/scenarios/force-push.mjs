import { join } from 'node:path'

export const summary = 'Rewrite shared history and watch it hurt somebody else.'

export function build(scenario) {
  const { dir, git, write, commit, mission } = scenario

  const origin = join(dir, 'origin.git')
  const alice = join(dir, 'alice')
  const bob = join(dir, 'bob')

  git(['init', '--bare', '--quiet', '--template=', 'origin.git'])

  git(['clone', '--quiet', '--template=', origin, 'alice'])
  const inAlice = { cwd: alice }

  write('README.md', '# Payments Service\n', inAlice)
  write('charge.js', `export function charge(amount) {\n  return { amount }\n}\n`, inAlice)
  commit('feat: add charge', inAlice)
  git(['push', '--quiet', '-u', 'origin', 'main'], inAlice)

  git(['switch', '-c', 'feat/vega-refunds'], inAlice)
  write(
    'refund.js',
    `export function refund(charge, amount) {
  return { chargeId: charge.id, amount }
}
`,
    inAlice,
  )
  commit('add refund', inAlice)

  write(
    'refund.js',
    `export function refund(charge, amount) {
  if (amount > charge.amount) {
    throw new Error('Refund exceeds the original charge')
  }
  return { chargeId: charge.id, amount }
}
`,
    inAlice,
  )
  commit('fix', inAlice)

  write(
    'refund.js',
    `export function refund(charge, amount) {
  if (amount > charge.amount) {
    throw new Error('Refund exceeds the original charge')
  }
  if (amount <= 0) {
    throw new Error('Refund must be positive')
  }
  return { chargeId: charge.id, amount }
}
`,
    inAlice,
  )
  commit('fix again', inAlice)
  git(['push', '--quiet', '-u', 'origin', 'feat/vega-refunds'], inAlice)

  // Bob clones after the branch is published and starts building on it.
  git(['clone', '--quiet', '--template=', origin, 'bob'])
  const inBob = { cwd: bob }
  git(['switch', 'feat/vega-refunds'], inBob)
  write(
    'refund.test.js',
    `import { refund } from './refund.js'

try {
  refund({ id: 'c1', amount: 100 }, 500)
  throw new Error('should have rejected an over-refund')
} catch (error) {
  if (!/exceeds/.test(error.message)) throw error
}
console.log('OK')
`,
    inBob,
  )
  commit('test: cover refund validation', inBob)
  git(['push', '--quiet'], inBob)

  git(['pull', '--quiet', '--ff-only'], inAlice)

  mission(`# Mission — the one that actually hurts other people

## The situation

Three folders here, standing in for three machines:

- \`origin.git\` — the server, like GitHub
- \`alice/\` — your laptop
- \`bob/\` — your colleague's laptop

You are Alice. You pushed \`feat/vega-refunds\` with three commits, two of which
are called \`fix\` and \`fix again\`. Bob then cloned, checked out your branch, and
pushed a test on top of it.

You are tidying up before review.

\`\`\`bash
cd alice
git log --oneline main..feat/vega-refunds
\`\`\`

Four commits, including Bob's.

## Step one — rewrite history that somebody else has

Squash your three commits into one:

\`\`\`bash
git rebase -i main
\`\`\`

Keep the first, \`squash\` the two \`fix\` commits into it. Bob's commit is on top;
leave it as \`pick\`.

Now try to push:

\`\`\`bash
git push
\`\`\`

Rejected. Your local branch and the remote have genuinely different histories
now — the commits you rewrote have new SHAs, so from the server's point of view
you are trying to remove commits it already has.

Override it:

\`\`\`bash
git push --force
\`\`\`

Done. Your history is clean.

## Step two — find out what you did to Bob

\`\`\`bash
cd ../bob
git status
git pull
\`\`\`

Bob's branch and the rewritten one have no shared recent history. Depending on
his config he gets a conflict, an unwanted merge commit joining two versions of
the same work, or a refusal. His commit now sits on a chain of commits that no
longer exists anywhere except his laptop.

He did nothing wrong. You changed the ground under him.

## Step three — the safer flag

Reset this and try again with the version you should actually use.

\`\`\`bash
cd ../alice
git push --force-with-lease
\`\`\`

\`--force-with-lease\` refuses to push if the remote has moved since you last
fetched. If Bob had pushed something you have not seen, it stops instead of
overwriting him. \`--force\` overwrites unconditionally and does not care.

Make it your default. There is almost no situation where plain \`--force\` is
what you meant.

## Done when

- You have rewritten and force-pushed the branch
- You have seen Bob's clone break, and can describe exactly what broke
- You can explain what \`--force-with-lease\` checks that \`--force\` does not

## The rule

Rewriting history is fine on a branch only you have. It is a problem the moment
somebody else has pulled it.

In practice:

- Tidy your own branch before you open the pull request, not after somebody has
  started reviewing or building on it
- Never rewrite \`main\`, and configure the repository so you cannot
- If you must force-push a shared branch, tell the people on it first, in words,
  before you do it
- To undo something on shared history, use \`git revert\` — it adds a new commit
  and breaks nobody

The branch ruleset on the workshop repository blocks force pushes to \`main\` for
exactly this reason. This folder is where you get to see what it is protecting
you from.
`)

  return {
    story: [
      'A bare "server", your clone, and a colleague\'s clone. You are going to rewrite',
      'a branch you both share, force-push it, and then go and look at their machine.',
    ],
    firstMoves: ['cd alice', 'git log --oneline main..feat/vega-refunds', 'cat ../MISSION.md'],
  }
}
