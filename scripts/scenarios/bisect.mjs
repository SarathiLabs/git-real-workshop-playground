export const summary = 'A regression somewhere in 18 commits. Find it by halving.'

const FEATURES = [
  ['feat: add currency formatting', 'formatCurrency'],
  ['feat: add cart subtotal', 'subtotal'],
  ['feat: add tax calculation', 'taxFor'],
  ['feat: add gift wrap option', 'giftWrapCost'],
  ['feat: add loyalty points', 'loyaltyPoints'],
  ['feat: add bulk pricing tiers', 'bulkTier'],
  ['feat: add coupon validation', 'isCouponValid'],
  ['feat: add shipping estimate', 'shippingEstimate'],
  ['feat: add express shipping', 'expressSurcharge'],
  ['feat: add regional pricing', 'regionMultiplier'],
  ['feat: add cart item count', 'itemCount'],
  ['feat: add minimum order check', 'meetsMinimum'],
  ['feat: add rounding helper', 'roundPaise'],
  ['feat: add invoice number', 'invoiceNumber'],
  ['feat: add refund calculation', 'refundAmount'],
  ['feat: add price comparison', 'isCheaperThan'],
  ['feat: add wishlist total', 'wishlistTotal'],
]

const GOOD_DISCOUNT = `export function applyDiscount(price, percent) {
  return price - (price * percent) / 100
}`

// The bug: percent is treated as a fraction rather than a percentage, so a
// 10% discount takes off 0.1 rupees. Plausible, small, and invisible unless
// you actually check the number.
const BAD_DISCOUNT = `export function applyDiscount(price, percent) {
  return price - percent / 100
}`

function helper(name, index) {
  return `export function ${name}(value) {
  return value * ${index + 2}
}`
}

export function build(scenario) {
  const { write, commit, mission } = scenario

  // Somewhere in the middle, so neither "check the last commit" nor
  // "check the first one" is a shortcut.
  const badIndex = 5 + Math.floor(Math.random() * (FEATURES.length - 8))

  write('.gitignore', 'verify.mjs\nnode_modules\n')
  write(
    'README.md',
    `# Pricing library

Shared pricing helpers for the storefront.
`,
  )
  write('pricing.js', `${GOOD_DISCOUNT}\n`)
  commit('feat: add applyDiscount')

  let contents = `${GOOD_DISCOUNT}\n`

  FEATURES.forEach(([message, name], index) => {
    if (index === badIndex) {
      contents = contents.replace(GOOD_DISCOUNT, BAD_DISCOUNT)
    }
    contents += `\n${helper(name, index)}\n`
    write('pricing.js', contents)
    commit(message)
  })

  // Untracked and gitignored, so it stays put while bisect moves through history.
  write(
    'verify.mjs',
    `// Checks one thing: a 10% discount on 200 should leave 180.
// Exits 0 when the code is good, 1 when it is broken. That is exactly the
// contract \`git bisect run\` expects.
import { applyDiscount } from './pricing.js'

const actual = applyDiscount(200, 10)
const expected = 180

if (actual !== expected) {
  console.error(\`BROKEN: applyDiscount(200, 10) returned \${actual}, expected \${expected}\`)
  process.exit(1)
}

console.log('OK')
process.exit(0)
`,
  )
  write('package.json', JSON.stringify({ name: 'pricing', type: 'module', private: true }, null, 2))
  commit('chore: add package manifest')

  mission(`# Mission — find the commit that broke the discount

## The situation

Support has been on the phone all morning. Discount codes are applying
essentially nothing: a 10% discount on a 200 rupee order takes off 10 paise.

\`\`\`bash
node verify.mjs
\`\`\`

Broken. Now go back to the very first commit and try again:

\`\`\`bash
git switch --detach $(git rev-list --max-parents=0 HEAD)
node verify.mjs
git switch -
\`\`\`

Fine. So it worked once, it is broken now, and there are 18 commits in between.

## Your mission

Find the exact commit that introduced it.

You could check all 18 one at a time. Or you could check the middle one, learn
which half the bug is in, and throw away the other half. Repeat that and 18
commits takes about five checks.

Git has this built in.

## You may need

\`\`\`bash
git bisect start
git bisect bad                # the current commit is broken
git bisect good <first-sha>   # this one was fine
\`\`\`

Git checks out a commit halfway between. Run \`node verify.mjs\`, then tell it
what you found with \`git bisect good\` or \`git bisect bad\`. Repeat until it
names the culprit.

When you are done, \`git bisect reset\` puts you back where you started.

## Then do it again, automatically

\`verify.mjs\` already exits 0 for good and 1 for bad, which is the contract
\`git bisect run\` wants. Reset, set your good and bad ends again, and then:

\`\`\`bash
git bisect run node verify.mjs
\`\`\`

Git does every step by itself and prints the first bad commit.

## Done when

- Git has printed a line ending in \`is the first bad commit\`
- \`git show <that-sha>\` shows a one-line change to \`applyDiscount\`
- You have run \`git bisect reset\`
- You can say roughly how many checks it took, and why that number is close to
  log₂(18) rather than 18

## Worth noticing

The bad commit's message is a perfectly ordinary \`feat:\` line about an
unrelated helper. Nothing about it looks suspicious, which is the whole reason
reading through the log would not have found it.

Bisect does not care what the commits say. It only cares whether the code
works, which is why it finds things that code review missed.

Two things make this work in real life, and both are habits rather than
commands: commits small enough that "this one" is a useful answer, and a
reliable way to test a given commit. If your commits are 2000 lines each,
bisect will still find the commit, and you will be no wiser.
`)

  return {
    story: [
      'A pricing library with 18 commits. It worked at the beginning and it is broken now.',
      'Reading every commit would take all morning. Halving the range takes about five checks.',
    ],
    firstMoves: ['node verify.mjs', 'git log --oneline | head -20', 'cat MISSION.md'],
  }
}
