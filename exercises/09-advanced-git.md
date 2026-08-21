# 09 — Advanced Git

> Phase: `ADVANCED_GIT` · ~35 minutes · Self-paced, on throwaway repos

## The situation

The commands in this exercise can rewrite history, detach `HEAD`, or force-push. Doing any of that to the workshop repository, with sixty people fetching it, is how you spend the rest of the afternoon apologising.

So none of this happens here. It happens in disposable local repositories that you can smash and rebuild.

```bash
npm run scenario
```

That prints the list. Each one sets up a real problem, writes a `MISSION.md` inside the repo, and prints where it lives (`.scenarios/<name>/`, gitignored).

If you wreck one:

```bash
npm run scenario -- <name>
```

It deletes the old copy and builds a fresh one. That is the whole safety model.

## Your mission

Do **bisect**, plus at least **two** others. Read `MISSION.md` in each before you type anything. The situation is in there. The commands come after.

Recommended order if you have no preference:

1. `bisect` — a regression somewhere in 18 commits
2. `reflog` — a commit that has disappeared from `git log`
3. `rebase-interactive` — six messy commits that should be two
4. `cherry-pick` — you need one commit from a branch you do not want to merge
5. `stash` — if you missed it during the incident
6. `conflict` — if you want another wall-style conflict, privately
7. `blame` — a mysterious line
8. `detached-head` — you checked out a commit, not a branch, and then committed
9. `force-push` — two clones, and why `--force-with-lease` exists
10. `clean` / `worktree` — if you still have time

## The ideas, before the commands

You do not need to memorise these. You need the picture, so that when a `MISSION.md` names a command you already know *why* it exists.

### Rebase

Merge combines two histories. The result has a fork and a join, and a merge commit to remember the join.

Rebase takes your commits and replays them on top of a newer starting point, as if you had branched today.

```text
          A --- B  feat
         /
    D --- E --- F  main

    after merge:     D --- E --- F --- M
                    /             /
                   A ---------- B

    after rebase:    D --- E --- F --- A' --- B'
```

A' and B' are new commits. They have new hashes. That is why you do not rebase commits other people already have: you would be asking them to pretend the old hashes never existed.

**Merge** when the branch is shared. **Rebase** when the branch is still yours, and you want the history to read as a straight line.

### Interactive rebase

`git rebase -i` is rebase with an editor open on the list of commits. You can reorder, squash, reword, or drop. This is how a local history that looks like `wip / fix / oops / actually` becomes `feat: add filtering` before anyone else sees it.

Only on commits that have not been pushed, or that only you have pulled.

### Cherry-pick

Copies one commit onto your current branch, by replaying its diff. Use it when a useful fix lives on a branch you do not want the rest of.

### Reflog

`git log` shows the history of a branch. `git reflog` shows the history of *your* `HEAD` — every commit you have pointed at, including ones that no branch names any more.

A `reset --hard` that "lost" a commit did not delete it. It moved a pointer. Reflog is how you find where the pointer used to be.

### Bisect

Binary search over history. Mark a known-good commit and a known-bad commit, and Git checks out the midpoint until it names the first bad one. Needs two things to be useful: small commits, and a test you can run on any commit.

### Detached HEAD

You checked out a commit, not a branch. Commits you make now have no branch pointing at them. The moment you switch away, the only name they have is in the reflog. The fix is to create a branch where you are, before you leave.

### Force-push

`git push --force` tells the server "my branch is the truth, throw yours away". If someone else pushed in the meantime, their work disappears.

`git push --force-with-lease` does the same thing *unless the server has moved since you last fetched*. That is the version you actually want, on the rare days you want either.

Never on `main`. Almost never on a shared feature branch. The `force-push` scenario makes this concrete with two clones.

## Done when

- You have completed the bisect scenario, including `git bisect run`
- You have completed two others
- You can say, for rebase vs merge, which one you would pick on a branch that three people are pushing to, and why
- You have used `git reflog` at least once, even if only to look

## Back on the workshop repo

If your feature branch is behind `main` because other teams merged while you were working:

```bash
git switch main
git pull
git switch -
git merge main          # the safe default on a shared branch
```

Rebase instead only if you are the only person on the branch:

```bash
git fetch origin
git rebase origin/main
```

If you already pushed the un-rebased branch you will need `--force-with-lease`. That is the cost. If anyone else has that branch, merge instead and do not pay it.

## Stuck?

<details>
<summary>The scenario command is not found / does nothing</summary>

```bash
npm run scenario -- bisect
```

The `--` is required. Without it, npm swallows the argument.
</details>

<details>
<summary>I am in a bisect and I want out</summary>

```bash
git bisect reset
```

Always. Leaves you on the branch you started from.
</details>

<details>
<summary>rebase -i opened an editor I cannot quit</summary>

Vim: `Esc`, then `:wq` and Enter. Nano: `Ctrl+O`, Enter, `Ctrl+X`.

To set a friendlier editor for next time:

```bash
git config --global core.editor "code --wait"   # VS Code
```
</details>

<details>
<summary>I force-pushed on the workshop repo by accident</summary>

Tell the facilitator immediately. Do not try to fix it further. See [recovery.md](recovery.md).
</details>

---

Next: [10 — Release](10-release.md)
