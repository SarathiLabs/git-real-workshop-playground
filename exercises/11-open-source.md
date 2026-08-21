# 11 — Open source

> Phase: `OPEN_SOURCE` · ~15 minutes

## The situation

All day you have been an employee of this organisation. You had write access. You pushed branches to the one repository. Maintainers merged them.

Now change the story:

> You no longer work here. You found this project on GitHub, the way you find any other, and you want to contribute.

You cannot push a branch to `SarathiLabs/git-real-workshop-playground` any more. That is not hostility. That is how almost every public project in the world actually works.

## Two different shapes

```text
Company (today, until now)
  you  →  branch on the org repo  →  pull request  →  merge

Open source (now)
  original repo
       ↓  fork
  your repo
       ↓  clone
  origin    = your fork
  upstream  = the original
       ↓  branch
       ↓  pull request from your fork into the original
```

The Git is identical. The social structure is not. In a company you are trusted with the building. In open source you are proposing a change to someone else's building from a copy you made.

## Your mission

Walk the open-source path once, even though you still have write access from the workshop. Pretend you do not.

### 1. Fork

On GitHub, click **Fork**. Take the default (your account, `main` only). You now have `your-username/git-real-workshop-playground`.

A fork is a copy, on GitHub, that remembers where it came from. It is not a clone. A clone is on your laptop. A fork is another repository.

### 2. Clone *your* fork, not the original

If you already have the workshop clone, leave it alone. Use a second folder:

```bash
git clone git@github.com:YOUR_USERNAME/git-real-workshop-playground.git git-real-fork
cd git-real-fork
```

### 3. Name both remotes

```bash
git remote -v
```

`origin` is your fork. That is correct for this workflow. Add the original as `upstream`:

```bash
git remote add upstream git@github.com:SarathiLabs/git-real-workshop-playground.git
git fetch upstream
```

```text
origin    = my copy. I can push here.
upstream  = the project. I cannot push here. I pull from here.
```

Those two words are the whole model.

### 4. Branch from upstream's main, not from your memory of it

Forks go stale. Always:

```bash
git switch main
git fetch upstream
git merge upstream/main
git switch -c docs/fix-a-typo
```

Pick something tiny — a typo in an exercise, a sentence in the README that is no longer true. The point is the path, not the change.

```bash
git add -p
git commit -m "docs: fix a stale instruction in exercise 11"
git push -u origin HEAD
```

Push to **origin**. Pushing to upstream should fail (and if it does not, you are still an org member — do it anyway, then open the pull request from the fork).

### 5. Open the pull request across repositories

GitHub will offer "compare across forks". The pull request base is `SarathiLabs/git-real-workshop-playground:main`. The head is `YOUR_USERNAME:docs/fix-a-typo`.

That is a pull request from a fork. Same review, same CI, same merge box. The only difference is where the branch lives.

### 6. Keep a long-lived fork up to date

```bash
git switch main
git fetch upstream
git merge upstream/main
git push origin main
```

If you skip this for a month, your next pull request will be a thousand commits behind and a conflict factory. Maintainers notice.

## Done when

- You have a fork
- `git remote -v` in the fork clone shows `origin` (you) and `upstream` (SarathiLabs)
- A pull request exists *from the fork* into the original, even if it is a one-line docs fix
- You can explain why `git push origin` is correct here and `git push upstream` is not

## What maintainers actually look at

If you do this for real, on a project you did not sit in a room with:

- A tiny, focused change beats a refactor of their architecture
- The contributing guide is not optional. Read it. They wrote it to save both of you time
- CI on *their* repository is the CI that matters, not yours
- "Fixes #123" in the pull request body is how the issue closes itself
- Silence for a week is normal. These people have day jobs
- A good first contribution is often docs, tests, or a bug you actually hit

The CODEOWNERS, reviews, required checks, and "don't push to main" from today all still apply. They are stricter, if anything, because the maintainers do not know you.

## Stuck?

<details>
<summary>GitHub will not let me fork it</summary>

Organisation policy can disable forking. If that is the case, skip the click and still do the remote setup conceptually: add a second remote named `upstream` on a fresh clone and walk the rest of the commands. Tell the facilitator — they may be able to turn forking on.
</details>

<details>
<summary>I pushed to the original by habit</summary>

Expected, you have had write access all day. Delete that branch on the original, push it to the fork instead, and open the pull request from there. The Git history is fine; only the remote was wrong.
</details>

<details>
<summary>My fork is already behind and the pull request is a conflict mess</summary>

```bash
git switch main
git fetch upstream
git merge upstream/main
git switch -
git merge main
git push origin HEAD
```

Same as updating any other branch. The extra fetch is the part people forget: `git pull` without a remote name pulls `origin`, which is *your* fork, which is also stale.
</details>

---

You are at the end of the track. Open the Network view. Find your node. Find the edges you created — the reviews, the pull requests, the other teams. That graph is the point of the day.

> Git did not just store our files today. It turned a room full of independent developers into one coordinated engineering system.
