# 08 — Incident

> Phase: `INCIDENT` · ~30 minutes · **The facilitator starts this one**

## The situation

You are in the middle of something. Your working directory has files you have not committed. Then, from the front of the room:

> Production is degraded. Active Developers just went to zero. Commits are still climbing. Nobody has gone home. Stop what you are doing and find out what we merged.

This is not a drill in the theatrical sense. Something on `main` is wrong, the dashboard is showing it, and the people who have to fix it are you.

## First: park the work in your hands

You cannot switch branches cleanly with a dirty working tree, and you should not commit a half-finished feature just to get it out of the way.

```bash
git status
git stash push -m "wip: whatever I was in the middle of"
git status
```

Working tree clean. Your work is not gone — it is on a stack. You will come back for it.

(If `stash` is new to you, that is why this interruption exists. The command is the answer to "I am not finished, and I have to do something else right now.")

```bash
git switch main
git pull
```

## Your mission

Treat this like a real incident.

1. **File an issue first**, using the Incident template. One sentence of what you are seeing is enough. Assign your team. This is the record, and it is how the rest of the room knows somebody is on it.
2. Find the change that did this.
3. Decide whether to revert it or roll forward.
4. Open a hotfix pull request.
5. After it merges, restore your parked work and keep going.

## Finding it

Do not grep the whole codebase at random. The question is "what changed recently", not "what looks suspicious".

```bash
git log --oneline -15
git log -p --since="30 minutes ago"
```

A metric dropped. The file that produces the headline numbers is `src/utils/metrics.ts`:

```bash
git log -p -- src/utils/metrics.ts
git blame src/utils/metrics.ts
```

`git blame` annotates every line with the last commit that touched it. Find the line that decides who counts as active. Then:

```bash
git show <that-sha>
```

Read the commit. Read the message. Read the diff. You are looking for a change that would compile, pass the tests (there are none for this file), and still be wrong.

`git blame` is archaeology, not a performance review. The question is "why does this line exist", not "who do we shout at".

## The decision

The change is already on `main`. Other people have already branched from it.

**Do not rewrite it away.** `git reset --hard` on a published commit would make every one of those branches lie about history. That is how you turn one incident into twenty.

**Revert it.** A revert is a *new* commit whose diff is the inverse of the bad one. The mistake stays in the history, which is correct — it happened — and `main` is healthy again.

```bash
git switch -c hotfix/<your-team>-active-developer-count
git revert <sha>
git push -u origin HEAD
```

Open a pull request. `Closes #<the-incident-issue>`. Request a review. This is a hotfix, so keep it tiny: one commit, one file, the inverse of the mistake.

## After it merges

```bash
git switch main
git pull
```

The Production badge should go back to HEALTHY once the facilitator flips it. `git log --oneline -5` should show both the bad commit and the revert. That pair is the record you want. Pretending the bad commit never happened would be a worse record.

### Get your work back

```bash
git switch feat/<your-team>-whatever-you-were-doing
git stash pop
```

If `stash pop` conflicts, that is the same kind of conflict you have already resolved. The parked work and the new `main` both touched something. Resolve it, `git add`, and keep going.

`git stash list` shows the stack if you stashed more than once. `git stash pop` takes the most recent. `git stash apply stash@{n}` takes a specific one without removing it.

## A second mystery, if you have time

Open `src/services/github/client.ts` and find `SECONDARY_RATE_LIMIT_BACKOFF_MS`. The number looks arbitrary. Why 1100, not 1000, not 2000?

```bash
git blame src/services/github/client.ts
git show <the-sha-on-that-line>
```

The commit message is the explanation. The code cannot be. This is what `blame` is for: recovering the conversation that produced a line, months later, when everybody who was in the room has forgotten.

## Done when

- You stashed unfinished work rather than committing it or throwing it away
- An incident issue exists
- You found the bad commit with `log` / `blame` / `show`, not by being told the filename
- A revert pull request is open or merged
- You restored your stash and kept working
- You can explain why revert, not reset, is the move on shared history

## Stuck?

<details>
<summary>git stash pop says I have no stash</summary>

```bash
git stash list
```

Empty means the stash did not happen — maybe you committed instead, or you were already clean. `git reflog` will show a `stash` entry if it did happen and you have since dropped it. See [recovery.md](recovery.md).
</details>

<details>
<summary>git revert says the commit is not found</summary>

You probably copied a short sha from `git blame`'s porcelain and it got truncated wrongly, or you are not on a branch that contains it.

```bash
git log --oneline -- src/utils/metrics.ts
```

Use a sha from that list.
</details>

<details>
<summary>I want to practise stash / revert without the room watching</summary>

```bash
npm run scenario -- stash
```

A throwaway repo where you are mid-feature and a hotfix lands. Same shape, no audience.
</details>

---

Next: [09 — Advanced Git](09-advanced-git.md)
