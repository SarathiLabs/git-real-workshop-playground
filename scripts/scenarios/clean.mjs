export const summary = 'A working directory full of junk. Some of it matters.'

export function build(scenario) {
  const { write, commit, mission } = scenario

  write(
    '.gitignore',
    `node_modules
dist
.env
*.log
`,
  )
  write('README.md', '# Billing Service\n')
  write('index.js', `export function invoice(order) {\n  return { id: order.id }\n}\n`)
  commit('feat: add invoice builder')

  // Tracked, and modified — clean must not touch this.
  write(
    'index.js',
    `export function invoice(order) {
  return { id: order.id, total: order.total }
}
`,
  )

  // Untracked junk from a debugging session.
  write('debug-output.txt', 'order 1: ok\norder 2: ok\norder 3: NaN\n')
  write('index.js.orig', 'leftover from a merge tool\n')
  write('Untitled-1.js', 'console.log(1)\n')
  write('scratch/notes.txt', 'try recomputing the total before rounding\n')
  write('scratch/attempt-2.js', 'export const x = 1\n')

  // Untracked and ignored — clean leaves these alone unless told otherwise.
  write('dist/bundle.js', '// built output\n')
  write('debug.log', 'noisy\n')
  write('.env', 'BILLING_API_KEY=local-development-only\n')

  // Untracked and genuinely wanted.
  write(
    'invoice.test.js',
    `import { invoice } from './index.js'

const result = invoice({ id: 'a1', total: 250 })
if (result.total !== 250) throw new Error('total missing')
console.log('OK')
`,
  )

  mission(`# Mission — tidy up without deleting anything you need

## The situation

Two hours of debugging have left the working directory in a state:

\`\`\`bash
git status
\`\`\`

In there you have:

- \`index.js\` — **tracked** and modified. This is the fix. Keep it.
- \`invoice.test.js\` — untracked, but it is the test you just wrote. Keep it.
- \`debug-output.txt\`, \`index.js.orig\`, \`Untitled-1.js\`, \`scratch/\` — junk.
- \`dist/\`, \`debug.log\`, \`.env\` — untracked **and ignored**. Build output and
  your local config. Not junk, and not something you want in the repository
  either.

You want the junk gone and everything else exactly where it is.

## Your mission

Delete the junk. Do not touch anything else.

## The rule for this command

\`git clean\` deletes untracked files. There is no undo, because untracked files
were never in Git, so there is nothing to restore from.

Which is why the flag you should learn first is not \`-f\`:

\`\`\`bash
git clean -n
\`\`\`

\`-n\` is a dry run. It lists what *would* be deleted and deletes nothing. Look
at that list before every real run, every time, for the rest of your career.

Then, as you widen the net:

- \`-d\` also considers untracked **directories** (\`scratch/\`)
- \`-x\` also considers **ignored** files (\`dist/\`, \`.env\`, \`debug.log\`)
- \`-i\` steps through interactively and asks about each one
- \`-f\` actually does it

Run \`git clean -nd\` and read it. Then \`git clean -ndx\` and read that.

Look carefully at the second list. \`MISSION.md\` is on it — this file, the one
you are reading. It is ignored, so \`-x\` sweeps it up along with \`.env\` and
\`dist/\`. Run that with \`-f\` and you delete your own instructions.

That is the whole argument for \`-n\` in one line.

## Done when

- The junk files and \`scratch/\` are gone
- \`index.js\` still has your \`total\` change
- \`invoice.test.js\` is still there, and \`node invoice.test.js\` prints OK
- \`.env\`, \`dist/\`, and \`debug.log\` are untouched
- \`git status\` shows one modified file and one untracked test

## Worth noticing

The interesting part is \`invoice.test.js\`. It is untracked, exactly like the
junk, and no flag can tell them apart because Git has never heard of either of
them.

The fix is not a cleverer clean command. It is to commit or stage work you care
about *before* you start deleting things. Untracked is the only state Git
cannot protect you in, and \`git clean -fdx\` is the command most likely to
teach you that the hard way.
`)

  return {
    story: [
      'A working directory with real work, build output, local config, and junk',
      'all sitting next to each other. One of these commands can delete the lot.',
    ],
    firstMoves: ['git status', 'git clean -n', 'cat MISSION.md'],
  }
}
