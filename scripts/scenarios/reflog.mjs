export const summary = 'Destroy three commits, then get them back.'

export function build(scenario) {
  const { write, commit, mission } = scenario

  write('README.md', '# Search Service\n')
  commit('chore: initial commit')

  write(
    'index.js',
    `export function search(items, query) {
  return items.filter((item) => item.name.includes(query))
}
`,
  )
  commit('feat: add basic search')

  write(
    'index.js',
    `export function search(items, query) {
  const needle = query.toLowerCase()
  return items.filter((item) => item.name.toLowerCase().includes(needle))
}
`,
  )
  commit('fix: make search case-insensitive')

  write(
    'ranking.js',
    `export function rank(results, query) {
  return [...results].sort((a, b) => {
    const aExact = a.name.toLowerCase() === query.toLowerCase() ? 1 : 0
    const bExact = b.name.toLowerCase() === query.toLowerCase() ? 1 : 0
    return bExact - aExact
  })
}
`,
  )
  commit('feat: rank exact matches first')

  write(
    'synonyms.js',
    `export const SYNONYMS = {
  laptop: ['notebook', 'macbook'],
  phone: ['mobile', 'handset'],
}
`,
  )
  commit('feat: add synonym expansion')

  mission(`# Mission — delete three commits, then get them back

## The situation

Five commits. The last three took you most of an afternoon.

You are about to destroy them, on purpose, with the command that people
actually use when they destroy them by accident.

## Step one — look at what you are about to lose

\`\`\`bash
git log --oneline
\`\`\`

Write down the subject lines of the top three commits. You will want to check
them off later.

## Step two — destroy them

\`\`\`bash
git reset --hard HEAD~3
\`\`\`

Now:

\`\`\`bash
git log --oneline
\`\`\`

Two commits. \`ranking.js\` and \`synonyms.js\` are gone from disk. As far as
every normal Git command is concerned, that work does not exist.

This is the moment people panic and start googling.

## Step three — get them back

The commits were not deleted. Nothing you did removed them from the object
database. What changed is where the branch **points**.

Git keeps a private log of every position \`HEAD\` has been in. That log is
local, it is not part of the repository history, and it does not care what you
did to your branches.

\`\`\`bash
git reflog
\`\`\`

Read it from the top. Each line is a position \`HEAD\` used to be at, most recent
first. One of them is the commit you were on immediately before the reset.

Get back to it. \`git reset --hard <that-sha>\` is the direct route. Some people
prefer to look before they leap with \`git switch --detach <sha>\`, or to keep
the old state alongside the new one with \`git branch rescue <sha>\`.

## Done when

- \`git log --oneline\` shows all five commits again
- \`ranking.js\` and \`synonyms.js\` are back on disk
- You can explain what \`HEAD@{1}\` means

## Worth noticing

\`git reset --hard\` gets its reputation from this exact situation, and the
reputation is mostly undeserved. It moved a pointer. The commits were sitting
there the whole time.

Two caveats that matter in real life:

- The reflog is **local**. It is in your \`.git\` folder and it did not come from
  the clone. Somebody else's reflog cannot rescue you.
- Unreachable commits are eventually garbage collected, typically after about
  90 days. You have plenty of time, but not forever.

Uncommitted changes are the genuinely dangerous case. \`git reset --hard\` throws
those away and the reflog cannot help you, because they were never a commit in
the first place. That is the real lesson: committing early is what makes almost
everything else recoverable.
`)

  return {
    story: [
      'Five commits, three of which represent an afternoon of work.',
      'MISSION.md will ask you to destroy them on purpose, and then get them back.',
    ],
    firstMoves: ['git log --oneline', 'cat MISSION.md'],
  }
}
