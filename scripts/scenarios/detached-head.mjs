export const summary = 'Commit onto nothing, then rescue it.'

export function build(scenario) {
  const { write, commit, mission } = scenario

  write('README.md', '# Reporting Service\n')
  commit('chore: initial commit')

  write('report.js', `export function total(rows) {\n  return rows.length\n}\n`)
  commit('feat: add row total')

  write(
    'report.js',
    `export function total(rows) {
  return rows.length
}

export function sum(rows, key) {
  return rows.reduce((acc, row) => acc + row[key], 0)
}
`,
  )
  commit('feat: add column sum')

  write(
    'report.js',
    `export function total(rows) {
  return rows.length
}

export function sum(rows, key) {
  return rows.reduce((acc, row) => acc + row[key], 0)
}

export function average(rows, key) {
  if (rows.length === 0) return 0
  return sum(rows, key) / rows.length
}
`,
  )
  commit('feat: add column average')

  mission(`# Mission — you are not on a branch

## The situation

You want to check whether something worked two commits ago, so you do the
obvious thing:

\`\`\`bash
git log --oneline
git switch --detach HEAD~2
\`\`\`

Git says something about detached HEAD. You ignore it, as one does.

## Step one — get into trouble

While you are there, you fix something:

\`\`\`bash
echo "export const VERSION = '2.0.0'" >> report.js
git add report.js
git commit -m "feat: add version constant"
\`\`\`

That commit is real. It has a SHA. It has your change in it.

Now go back:

\`\`\`bash
git switch main
\`\`\`

Read the warning Git prints. Then:

\`\`\`bash
git log --oneline
\`\`\`

Your commit is gone. \`report.js\` has no \`VERSION\`. Nothing in any log shows it.

## What actually happened

Normally \`HEAD\` points at a branch, and the branch points at a commit. When you
commit, the branch moves forward and takes you with it.

\`\`\`text
main ──> C1 ──> C2 ──> C3
                        ^
                       HEAD
\`\`\`

Detached means \`HEAD\` points straight at a commit, with no branch in between.
You can still commit. The new commit just has nothing pointing at it, so the
moment you leave, there is no name to find it by.

\`\`\`text
main ──> C1 ──> C2 ──> C3
                 \\
                  C4   <- HEAD was here. Now nothing refers to it.
\`\`\`

## Step two — get it back

The commit still exists. You just need its SHA and a name to attach.

\`\`\`bash
git reflog
\`\`\`

Find the commit you made while detached, then give it a branch:

\`\`\`bash
git branch rescue-version <sha>
\`\`\`

Now it has a name, and it will not be garbage collected.

## Done when

- \`git log --oneline rescue-version\` shows your version commit
- \`git branch\` lists both \`main\` and \`rescue-version\`
- You can explain the difference between \`HEAD\` pointing at a branch and
  \`HEAD\` pointing at a commit

## Worth noticing

Detached HEAD is not an error, and it is not dangerous on its own. Half the
time you get there deliberately: looking at an old commit, checking out a tag,
or in the middle of a bisect.

It is only a problem when you commit and then walk away. If you find yourself
about to work while detached, make a branch first:

\`\`\`bash
git switch -c some-name
\`\`\`

And Git does warn you. That message about leaving commits behind, the one
everybody scrolls past, is precisely this situation, and it hands you the SHA
you need.
`)

  return {
    story: [
      'You are about to check out an old commit, work on it, and lose the result.',
      'Then you are going to get it back. Both halves are the exercise.',
    ],
    firstMoves: ['git log --oneline', 'cat MISSION.md'],
  }
}
