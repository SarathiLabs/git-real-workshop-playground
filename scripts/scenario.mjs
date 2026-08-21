#!/usr/bin/env node
/**
 * npm run scenario                 list the scenarios
 * npm run scenario -- bisect       build one
 * npm run scenario -- --all        build all of them
 *
 * Each scenario is a throwaway Git repository under .scenarios/, which is
 * gitignored. Nothing here touches the workshop repository or GitHub, so the
 * commands that make people nervous — reset --hard, force pushes, rebasing
 * published branches — can be practised without any consequences.
 *
 * Every scenario is disposable. Rebuild it as often as you like.
 */
import { color, symbol } from './lib/console.mjs'
import { briefing, createScenario, relativeToCwd, scenariosRoot } from './lib/scenario.mjs'

const ORDER = [
  'conflict',
  'stash',
  'reflog',
  'rebase-interactive',
  'cherry-pick',
  'bisect',
  'blame',
  'detached-head',
  'clean',
  'worktree',
  'force-push',
]

// force-push builds a bare remote plus two clones, so its top-level folder is
// a container rather than a repository.
const CONTAINERS = new Set(['force-push'])

const modules = new Map()
for (const name of ORDER) {
  modules.set(name, await import(`./scenarios/${name}.mjs`))
}

const requested = process.argv.slice(2).filter((arg) => !arg.startsWith('--'))
const all = process.argv.includes('--all')

function list() {
  console.log('')
  console.log(color.bold('Git Real — practice scenarios'))
  console.log('')
  console.log('Each one builds a disposable repository that sets up a real problem.')
  console.log('Nothing here can affect the workshop repository.')
  console.log('')
  for (const name of ORDER) {
    console.log(`  ${color.cyan(name.padEnd(20))} ${color.gray(modules.get(name).summary)}`)
  }
  console.log('')
  console.log(`  ${color.bold('npm run scenario -- <name>')}   build one`)
  console.log(`  ${color.bold('npm run scenario -- --all')}    build all of them`)
  console.log('')
  console.log(color.gray(`They are created in ${relativeToCwd(scenariosRoot)}/`))
  console.log('')
}

if (!all && requested.length === 0) {
  list()
  process.exit(0)
}

const targets = all ? ORDER : requested
const unknown = targets.filter((name) => !modules.has(name))

if (unknown.length > 0) {
  console.log('')
  for (const name of unknown) {
    console.log(`${symbol.fail}  There is no scenario called "${name}".`)
  }
  list()
  process.exit(1)
}

for (const name of targets) {
  const module = modules.get(name)
  const scenario = createScenario(name, { init: !CONTAINERS.has(name) })
  const result = module.build(scenario) ?? {}

  if (all) {
    console.log(`${symbol.pass}  ${name.padEnd(20)} ${color.gray(relativeToCwd(scenario.dir))}`)
    continue
  }

  briefing({
    title: `Scenario: ${name}`,
    dir: scenario.dir,
    story: result.story ?? [module.summary],
    firstMoves: result.firstMoves ?? ['cat MISSION.md'],
  })
}

if (all) {
  console.log('')
  console.log(color.gray(`${targets.length} scenarios built in ${relativeToCwd(scenariosRoot)}/`))
  console.log('')
}
