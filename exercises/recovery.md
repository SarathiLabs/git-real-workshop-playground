# I broke it

Read the situation that matches, top to bottom. Do not skip to a command from another section. The wrong undo is how a small mess becomes a large one.

If you are not sure which situation you are in, run this and bring the output to a facilitator:

```bash
git status
git branch --show-current
git log --oneline -5
```

## I have not committed, and I want my change gone

```bash
git restore <file>
```

Unstaged, uncommitted, gone. Git cannot get it back. That is the cost.

## I staged something I did not mean to

```bash
git restore --staged <file>
```

The change is still in the file. It is just not in the next commit any more.

## I committed, I have not pushed, and I want to redo the last commit

```bash
git commit --amend
```

Or, to uncommit and keep the work:

```bash
git reset HEAD~1
```

Only if `git status` says the branch is not ahead of a remote that other people are using. If you have already pushed, go to **I pushed something bad**.

## I committed to `main` by accident

```bash
git switch -c feat/<team>-the-work
git switch main
git reset --hard origin/main
git switch -
```

The commit moved with you onto the new branch. Local `main` matches the server again.

## I pushed to `main` and GitHub rejected it

Good. That is branch protection. Your commit is local only.

```bash
git switch -c feat/<team>-the-work
git switch main
git reset --hard origin/main
git switch -
git push -u origin HEAD
```

## I pushed something bad, and other people might have it

Do not reset. Do not force-push. Revert:

```bash
git revert <sha>
git push
```

A new commit undoes the old one. The history stays honest. Everyone else's branches keep working.

## I reset --hard and a commit vanished

It is probably still in the reflog.

```bash
git reflog
```

Find the line before the reset. Then:

```bash
git switch -c recover/<what-it-was> <that-sha>
```

Now it has a branch name again. If this was on the workshop repo, open a pull request from `recover/...` rather than forcing `main`.

## I am in the middle of a merge and I want out

```bash
git merge --abort
```

## I am in the middle of a rebase and I want out

```bash
git rebase --abort
```

## I am in the middle of a bisect and I want out

```bash
git bisect reset
```

## Detached HEAD

`git status` says "HEAD detached at ...". You checked out a commit, not a branch.

If you have **not** made commits here:

```bash
git switch main
```

If you **have**:

```bash
git switch -c feat/<team>-rescue
```

That names where you are. Then switch wherever you actually wanted to be.

## Merge conflict I cannot face right now

```bash
git merge --abort
```

You are back to before the merge. When you are ready, `git merge main` again.

## Stash I cannot find

```bash
git stash list
git stash show -p stash@{0}
git stash pop
```

If `pop` already ran and it "disappeared", `git reflog` often still has a `stash` entry.

## I cloned with HTTPS and every push asks for a password

GitHub does not accept account passwords. Switch to SSH or the GitHub CLI:

```bash
git remote set-url origin git@github.com:SarathiLabs/git-real-workshop-playground.git
```

or `gh auth login`. See [00 — Before we start](00-before-we-start.md).

## I downloaded the ZIP instead of cloning

There is no history and no remote. Delete the folder and clone:

```bash
git clone git@github.com:SarathiLabs/git-real-workshop-playground.git
```

## npm run doctor still fails

Read the `fix:` line under the `FAIL`. It is the exact command. If it still fails after that, the output of `npm run doctor` is what a facilitator needs.

## I force-pushed to a shared branch

Stop. Tell the facilitator. Do not push again. The next move depends on whether anyone else fetched, and guessing is how it gets worse.

## Nuclear, local-only, last resort

This throws away **every uncommitted change** and makes this branch match the server. Uncommitted work is gone. Unpushed commits are gone.

```bash
git fetch origin
git reset --hard origin/<this-branch>
git clean -fd
```

Type the branch name. Do not type `main` unless you mean `main`, and even then only your local `main`.
