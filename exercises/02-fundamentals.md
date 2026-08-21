# 02 — What Git is actually doing

> Phase: `FUNDAMENTALS` · ~20 minutes

## The situation

You just made a commit. If somebody asked you what `git add` did, could you answer?

Most people learn `add`, `commit`, `push` as a spell: three words you say in order to make the computer accept your work. That works right up until something goes wrong, and then you have no model to reason with and you start pasting commands from Stack Overflow.

This exercise is twenty minutes of building the model. Everything else today gets easier if you do it properly.

## The three places your code lives

```text
Working Directory  ──git add──>  Staging Area  ──git commit──>  Repository
   (your files)                  (the next commit)              (history)
```

- **Working directory** — the files on disk. What your editor shows you.
- **Staging area** — a draft of your next commit. You choose what goes in it.
- **Repository** — the permanent record. Committed history.

The staging area is the part people skip, and it is the part that makes Git different from every "save my files to the cloud" tool you have used. It exists so you can commit *some* of your changes and not others.

## Your mission

Make some changes, and watch them move through those three places one at a time.

Work on a branch:

```bash
git switch main
git pull
git switch -c chore/<your-team>-explore-git
```

### 1. Change one file, and look before you stage

Open `README.md` and add a line. Then:

```bash
git status
```

Read it properly. It says "Changes not staged for commit". Your edit is in the working directory only.

```bash
git diff
```

That is the difference between the working directory and the staging area.

### 2. Stage it, and look again

```bash
git add README.md
git status
```

Now it says "Changes to be committed". Same edit, different place.

```bash
git diff
```

Empty. This surprises everybody once.

`git diff` compares the working directory against the staging area, and you just made them identical. To see what you staged:

```bash
git diff --staged
```

Two commands, two different questions:

- `git diff` — what have I changed but not staged yet?
- `git diff --staged` — what is about to go into my commit?

### 3. Prove the staging area is worth having

Make two unrelated changes:

- Add a line to `README.md`
- Add a line to `CONTRIBUTING.md`

Stage only one:

```bash
git add README.md
git status
```

One file staged, one not. Commit:

```bash
git commit -m "docs: clarify the setup section in the README"
git status
```

Your `CONTRIBUTING.md` change is still sitting there, uncommitted, untouched. You just made one clean commit out of a messy working directory.

This is the whole point. Real work is messy — you fix a typo while implementing a feature and rename a variable while fixing a bug. Staging lets the history come out clean anyway.

### 4. Undo things

```bash
git restore CONTRIBUTING.md
```

Gone. That change was never staged and never committed, so nothing could bring it back. Do that deliberately, once, so you know what it costs.

Now stage something and unstage it:

```bash
# make a change first
git add README.md
git restore --staged README.md
```

The change is still in your working directory. It just is not staged any more. Two different `restore` commands doing two very different things:

- `git restore <file>` — throw away the change
- `git restore --staged <file>` — unstage it, keep the change

### 5. Read the history

```bash
git log
git log --oneline
git log --oneline --graph --decorate --all
git show HEAD
```

That last one is worth remembering. `git show` on any commit gives you the message, the author, the date, and the full diff.

## Done when

- You can explain, out loud, what `git add` moves and where
- You can say why `git diff` was empty after `git add`
- You made a commit containing one of your two changes
- You have used `git restore` both ways
- `git log --oneline --graph --decorate --all` makes sense to you

## Commit messages

While you are here, one habit worth forming.

Bad:

```text
update
fix
changes
final
final2
```

Useful:

```text
feat: add participant filtering
fix: handle a missing GitHub avatar
docs: update setup instructions
```

A commit is not Ctrl+S. It is a unit of history that somebody — probably you, in six months, at 11pm, trying to work out when something broke — is going to read.

The convention here is `<type>: <what changed>`. Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `hotfix`. It is checked by an advisory CI job, which will tell you off without blocking you.

## Stuck?

<details>
<summary>git diff shows nothing and I definitely changed something</summary>

You already staged it. Use `git diff --staged`.

`git diff HEAD` shows both staged and unstaged changes together, which is often what you actually wanted.
</details>

<details>
<summary>I committed too early / with a bad message</summary>

If you have not pushed yet:

```bash
git commit --amend
```

That replaces the last commit. You can change the message, or `git add` something and fold it in.

Only before pushing. Amending rewrites the commit, and rewriting something other people have already pulled is a different and worse problem. Exercise 09 covers why.
</details>

<details>
<summary>git status shows files I have never heard of</summary>

Probably editor or OS junk (`.DS_Store`, `.idea/`, `*.swp`). It should be in `.gitignore` — that is a legitimate small pull request.

For files that are only junk on *your* machine, `.git/info/exclude` works the same way as `.gitignore` but stays local and does not bother anybody else.
</details>

<details>
<summary>I want to practise this without any risk</summary>

```bash
npm run scenario -- clean
```

That builds a throwaway repository with a working directory full of tracked changes, untracked files, and ignored files, and walks you through telling them apart.
</details>

---

Next: [03 — Branching](03-branching.md)
