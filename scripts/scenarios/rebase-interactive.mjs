export const summary = 'Six embarrassing commits. Turn them into one good one.'

export function build(scenario) {
  const { git, write, commit, mission } = scenario

  write('README.md', '# Export Service\n')
  write(
    'export.js',
    `export function toCsv(rows) {
  return rows.map((row) => row.join(',')).join('\\n')
}
`,
  )
  commit('feat: add csv export')

  git(['switch', '-c', 'feat/nova-quoted-csv'])

  write(
    'export.js',
    `export function toCsv(rows) {
  return rows.map((row) => row.map((cell) => \`"\${cell}"\`).join(',')).join('\\n')
}
`,
  )
  commit('add quoting')

  write(
    'export.js',
    `export function toCsv(rows) {
  return rows
    .map((row) => row.map((cell) => \`"\${String(cell)}"\`).join(','))
    .join('\\n')
}
`,
  )
  commit('fix')

  write(
    'export.js',
    `export function toCsv(rows) {
  return rows
    .map((row) => row.map((cell) => \`"\${String(cell).replace(/"/g, '""')}"\`).join(','))
    .join('\\n')
}
`,
  )
  commit('fix again')

  write(
    'export.js',
    `export function toCsv(rows) {
  return rows
    .map((row) => row.map((cell) => \`"\${String(cell ?? '').replace(/"/g, '""')}"\`).join(','))
    .join('\\n')
}
`,
  )
  commit('oops')

  write('export.test.js', `// TODO: write tests\n`)
  commit('final')

  write(
    'export.test.js',
    `import { toCsv } from './export.js'

const output = toCsv([['a', 'b"c'], [1, null]])
const expected = '"a","b""c"\\n"1",""'

if (output !== expected) {
  throw new Error(\`expected \${JSON.stringify(expected)}, got \${JSON.stringify(output)}\`)
}
console.log('OK')
`)
  commit('actually final')

  mission(`# Mission — clean up before anybody sees this

## The situation

You are on \`feat/nova-quoted-csv\`. The code is right. The history is not:

\`\`\`text
actually final
final
oops
fix again
fix
add quoting
\`\`\`

Every one of those was an honest save while you worked something out. Together
they are useless to anybody reading this branch later, and you are about to
open a pull request.

## Your mission

Turn those six commits into one commit with a message that explains what
changed and why, without changing the code at all.

\`\`\`bash
git log --oneline main..HEAD
git rebase -i main
\`\`\`

Git opens an editor with one line per commit, oldest at the top, each starting
with \`pick\`. The instructions at the bottom of that file are worth reading
once, properly.

You want to keep the first one and fold the rest into it. Change \`pick\` to
\`squash\` (or \`s\`) on the lines you are folding in. Save and close, and Git
gives you a second editor to write the combined message.

If your editor is \`vim\` and you are stuck in it: \`Esc\`, then \`:wq\`, then
Enter. To leave without saving: \`Esc\`, then \`:q!\`.

## A good final message

\`\`\`text
feat: quote and escape CSV cells

Cells containing commas or quotes broke the exported file for anybody
opening it in a spreadsheet. Every cell is now quoted, embedded quotes are
doubled per RFC 4180, and null cells become empty strings rather than the
text "null".
\`\`\`

Subject line says what. Body says why. The reader in six months is the
audience, and it is probably you.

## Done when

- \`git log --oneline main..HEAD\` shows exactly one commit
- \`node export.test.js\` still prints OK
- \`git diff main\` is identical to what it was before you started — you changed
  the history, not the code

## The rule that matters

Rebase rewrites commits. The old ones are replaced by new ones with new SHAs.
That is completely fine here, because this branch is yours and nobody else has
it.

It is not fine on a branch other people have pulled. Their history and yours
stop agreeing, and every one of them has to clean up after you.

The working version of the rule: **tidy your own branch before you share it,
and leave shared history alone.** If something on \`main\` needs undoing, that is
what \`git revert\` is for.

## Stuck?

\`\`\`bash
git rebase --abort
\`\`\`

Straight back to where you started, every time. And if you finish a rebase and
then decide you hated the result, \`git reflog\` still has the old commits.
`)

  return {
    story: [
      'A branch whose history reads "fix", "fix again", "oops", "final", "actually final".',
      'The code is correct. The history is not something you want on a pull request.',
    ],
    firstMoves: ['git log --oneline main..HEAD', 'git rebase -i main'],
  }
}
