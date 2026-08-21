export const summary = 'Two people edited the same lines. Merge them.'

export function build(scenario) {
  const { git, write, commit, mission } = scenario

  write(
    'README.md',
    `# Checkout Service

Handles pricing for the storefront.
`,
  )
  write(
    'pricing.js',
    `export function shippingCost(order) {
  if (order.total > 500) {
    return 0
  }
  return 50
}

export function currency(amount) {
  return \`INR \${amount}\`
}
`,
  )
  commit('feat: add pricing helpers')

  git(['switch', '-c', 'feat/free-shipping-threshold'])
  write(
    'pricing.js',
    `export function shippingCost(order) {
  if (order.total > 1000) {
    return 0
  }
  return 40
}

export function currency(amount) {
  return \`INR \${amount}\`
}
`,
  )
  commit('feat: raise free shipping threshold to 1000')

  git(['switch', 'main'])
  write(
    'pricing.js',
    `export function shippingCost(order) {
  if (order.total > 500) {
    return 0
  }
  if (order.isPrimeMember) {
    return 0
  }
  return 75
}

export function currency(amount) {
  return \`INR \${amount}\`
}
`,
  )
  commit('feat: free shipping for prime members')

  mission(`# Mission — resolve a real merge conflict

## The situation

You and another engineer both changed \`shippingCost\` this week, and neither of
you knew about the other.

- On \`main\`, somebody added free shipping for prime members and put the flat
  rate up to 75.
- On \`feat/free-shipping-threshold\`, somebody raised the free shipping
  threshold to 1000 and put the flat rate down to 40.

Both changes are wanted. Both touch the same lines.

## Your mission

Merge \`feat/free-shipping-threshold\` into \`main\`, and end up with a version
that keeps **both** intentions: the 1000 threshold, prime members shipping
free, and one flat rate that you have decided on deliberately.

\`\`\`bash
git switch main
git merge feat/free-shipping-threshold
\`\`\`

Git will stop and refuse to guess.

## Before you touch the file

\`\`\`bash
git status
\`\`\`

Read that output properly. It tells you which files are conflicted and what
your options are, and it is the single most useful command in this whole
situation.

Then open \`pricing.js\`. You will see this shape:

\`\`\`text
<<<<<<< HEAD
   the version that is already on the branch you are merging INTO
=======
   the version coming FROM the branch you are merging in
>>>>>>> feat/free-shipping-threshold
\`\`\`

## Done when

- \`pricing.js\` contains no \`<<<<<<<\`, \`=======\`, or \`>>>>>>>\` markers
- The prime member rule survived
- The threshold is 1000
- There is exactly one flat rate, and you can say why you picked it
- \`git status\` is clean and \`git log --graph --oneline --all\` shows the merge

## Worth noticing

There is no flat rate that is "correct" here. Git could have picked one at
random and given you a clean merge, and you would never have found out that two
people disagreed about shipping prices.

A merge conflict is not Git failing. It is Git refusing to make a product
decision on your behalf.

## Stuck?

Getting out and starting again costs nothing:

\`\`\`bash
git merge --abort
\`\`\`

You are back to before you started. Try it once on purpose, so you know the
escape hatch exists before you need it.
`)

  return {
    story: [
      'Two engineers changed the same pricing function in the same week, and neither',
      'knew about the other. Both changes are wanted. Git will not choose for you.',
    ],
    firstMoves: ['git log --graph --oneline --all', 'git merge feat/free-shipping-threshold'],
  }
}
