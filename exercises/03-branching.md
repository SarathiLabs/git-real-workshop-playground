# 03 — Branches, and why they exist

> Phase: `BRANCHING` · ~20 minutes

## The situation

Sixty people are about to start changing this codebase at the same time.

Think about what that means if everybody works directly on `main`. Your half-finished feature is on the same line of history as somebody else's half-finished bug fix. Nobody can save their work without everybody else getting it. Nothing can ever be tested in isolation, because there is no isolation.

Branches are the answer to that, and once you see the problem the answer is almost boring.

## The mental model

A commit is a snapshot with a parent. A chain of commits is a history.

A **branch is a pointer to a commit**. That is it. Not a copy of the code, not a folder — a name pointing at one commit, stored in a file that is about 40 bytes.

```text
        A ── B ── C          <- main
                   \
                    D ── E   <- feat/nova-search
```

Creating a branch is instant because there is nothing to copy. When you commit on `feat/nova-search`, the pointer moves forward. `main` does not move.

`HEAD` is a pointer to the branch you are currently on. That is how Git knows which pointer to move when you commit.

## Your mission

Build that diagram yourself, then merge it.

### 1. Two branches from the same point

```bash
git switch main
git pull
git switch -c feat/<your-team>-branch-practice
```

Add a file `notes/<your-github-username>.md` with a couple of lines about what you want to get out of today.

```bash
git add notes/
git commit -m "docs: add personal workshop notes"
```

Now go back and look:

```bash
git switch main
ls notes/
```

Your file is not there. It has not been deleted — it exists on the other branch. `main` never knew about it.

```bash
git switch -
ls notes/
```

Back. `git switch -` returns to the previous branch, the same way `cd -` does.

### 2. See the shape

```bash
git log --oneline --graph --decorate --all
```

`--all` is what makes this useful: it shows every branch at once, so you can actually see the fork.

### 3. Merge it

```bash
git switch main
git merge feat/<your-team>-branch-practice
```

It says **Fast-forward**.

That is worth understanding. `main` had not moved since you branched, so there was nothing to combine. Git just slid the `main` pointer forward to your commit. No merge commit, because there was no merging to do.

```bash
git log --oneline --graph --decorate --all
```

One straight line.

### 4. Now force a real merge

Undo that so you can see the other case:

```bash
git reset --hard HEAD~1
```

(Safe here — this is your local `main`, and the commit is still on your branch.)

Make `main` move independently:

```bash
echo "" >> README.md
git commit -am "docs: add a trailing line"
git merge feat/<your-team>-branch-practice
```

This time Git makes a **merge commit**: a commit with two parents, joining the two histories. Look at it:

```bash
git log --oneline --graph --decorate --all
```

Now you can see the fork and the join.

### 5. Clean up your local main

You have been experimenting on `main`, which is fine locally but let us not keep it:

```bash
git fetch origin
git reset --hard origin/main
```

That throws away your local `main` and makes it match the server exactly. Your branch is untouched.

## Branch naming

```text
<type>/<team>-<description>
```

```text
feat/phoenix-dark-mode
fix/atlas-search-case
docs/striders-readme
test/nova-validation
hotfix/ashes-production
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `hotfix`.

This is not bureaucracy. Open the branch list on a repository with forty active branches and see how much faster you can find things when they are all named like this. An advisory CI check will nudge you if you forget.

## Done when

- You created a branch, committed on it, and saw the file vanish and reappear as you switched
- You have seen both a fast-forward merge and a merge commit, and can say what made them different
- `git log --oneline --graph --decorate --all` is readable to you
- Your local `main` matches `origin/main`

## Local and remote

One thing that confuses everybody once:

```bash
git branch        # local branches
git branch -r     # remote-tracking branches (origin/...)
git branch -a     # both
git branch -vv    # local branches and what they track
```

`origin/main` is **not** the server. It is your local record of where `main` was on the server the last time you looked. It only updates when you `fetch` or `pull`.

Which is exactly why:

- `git fetch` — go and find out what changed on the server, change none of my files
- `git pull` — fetch, and then merge it into my branch
- `git push` — send my commits to the server

`git fetch` is completely safe and cannot break anything you are doing. When you are unsure what state things are in, fetch first and look.

## Stuck?

<details>
<summary>"Your local changes would be overwritten by checkout"</summary>

You have uncommitted work in a file that differs between the two branches, so switching would silently destroy it. Git refuses.

Three options:

```bash
git commit -am "wip: whatever this is"   # commit it
git stash                                # park it (exercise 08)
git restore <file>                       # throw it away
```
</details>

<details>
<summary>What is the difference between git checkout and git switch?</summary>

`git checkout` does about six unrelated things, which is why it confuses people. Git 2.23 split it into two clearer commands:

- `git switch` — change branches
- `git restore` — restore files

`checkout` still works and you will see it everywhere. Use the newer ones.
</details>

<details>
<summary>I committed to main by accident</summary>

Nothing is broken. Move the commit onto a branch:

```bash
git switch -c feat/<team>-my-work    # branch here, taking the commit
git switch main
git reset --hard origin/main         # put main back
git switch -
```

Nothing was lost — you were only ever moving pointers around.
</details>

<details>
<summary>Give me a harder merge</summary>

```bash
npm run scenario -- conflict
```

A throwaway repository where two branches change the same lines and Git cannot resolve it. Exercise 04 does this for real, with the whole room.
</details>

---

Next: [04 — The Wall](04-the-wall.md)
