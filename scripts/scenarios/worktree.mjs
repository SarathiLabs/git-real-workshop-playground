export const summary = 'Two branches checked out at once, no stashing.'

export function build(scenario) {
  const { git, write, commit, mission } = scenario

  write('README.md', '# Search Service\n')
  write('index.js', `export function search(items, q) {\n  return items.filter((i) => i.name.includes(q))\n}\n`)
  commit('feat: add search')

  git(['switch', '-c', 'feat/atlas-fuzzy-search'])
  write(
    'fuzzy.js',
    `// Work in progress. Nowhere near done.
export function fuzzyScore(candidate, query) {
  let score = 0
  let cursor = 0
  for (const character of query) {
    const found = candidate.indexOf(character, cursor)
    if (found === -1) return 0
    score += 1 / (found - cursor + 1)
    cursor = found + 1
  }
  return score
}
`,
  )
  commit('wip: fuzzy scoring, not wired up yet')

  write(
    'fuzzy.js',
    `// Work in progress. Nowhere near done.
export function fuzzyScore(candidate, query) {
  let score = 0
  let cursor = 0
  for (const character of query) {
    const found = candidate.indexOf(character, cursor)
    if (found === -1) return 0
    score += 1 / (found - cursor + 1)
    cursor = found + 1
  }
  return score
}

// TODO: normalise, handle case, decide on a cutoff
export function fuzzySearch(items, query) {
  return items
}
`,
  )

  mission(`# Mission — work on two branches at the same time

## The situation

You are deep in \`feat/atlas-fuzzy-search\`. There is uncommitted work in
\`fuzzy.js\` and your head is full of it.

Somebody asks you to review a pull request. To review it properly you want to
check the branch out and run it. You have already met the two usual options:

1. \`git stash\`, switch, review, switch back, \`git stash pop\` — and lose your
   place
2. commit half-finished work just to move — and pollute the history

There is a third option that most people never find.

## Your mission

Get a second working directory, on a different branch, without disturbing this
one at all.

\`\`\`bash
git worktree add ../review-copy main
\`\`\`

That creates a whole second checkout in a sibling folder, on \`main\`, sharing
the same \`.git\` data. Two folders, two branches, one repository.

\`\`\`bash
cd ../review-copy
git status        # on main, clean
ls                # no fuzzy.js, because it does not exist on main
\`\`\`

Now go back:

\`\`\`bash
cd -
git status        # your uncommitted fuzzy.js work, exactly as you left it
\`\`\`

## Then try this

From \`review-copy\`, try to check out the branch that is already open in the
other worktree:

\`\`\`bash
git switch feat/atlas-fuzzy-search
\`\`\`

Git refuses. Read the message. Two worktrees on the same branch would be two
directories fighting over one pointer, so Git will not let you.

## Tidying up

\`\`\`bash
git worktree list
git worktree remove ../review-copy
\`\`\`

Deleting the folder by hand leaves Git's bookkeeping stale. \`git worktree
prune\` cleans up after that if it happens.

## Done when

- \`git worktree list\` showed two entries
- You saw \`fuzzy.js\` in one and not the other
- Your uncommitted work survived the whole thing untouched
- You have removed the second worktree

## Worth noticing

This is not a replacement for branches or for \`stash\`. It earns its place in
specific situations:

- reviewing somebody's branch while your own work is half-finished
- running a long build on one branch while writing code on another
- comparing two versions side by side in two editor windows
- keeping a permanent \`main\` checkout for quick hotfixes

The cost is disk space and remembering which folder you are in. For a quick
context switch, \`stash\` is still less ceremony.
`)

  return {
    story: [
      'Uncommitted work on a feature branch, and somebody wants you to review a',
      'pull request. There is a way to do both at once without stashing anything.',
    ],
    firstMoves: ['git status', 'git worktree add ../review-copy main'],
  }
}
