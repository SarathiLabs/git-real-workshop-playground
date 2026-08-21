# Incident kit

Facilitator-only. Participants should not read this file before the incident segment, because knowing the answer removes the entire exercise.

The point of an incident is that something changed, it reached `main`, nobody noticed for a while, and the people fixing it have to find out *what* changed before they can decide *how* to undo it. That sequence only teaches anything if the room does not already know the answer.

---

## One-time preparation

Do this once, before the workshop, on `main`.

### Commit the retry backoff on its own

`src/services/github/client.ts` contains a line that looks arbitrary:

```ts
const SECONDARY_RATE_LIMIT_BACKOFF_MS = 1100
```

This is the `git blame` target for exercise 08. It only works if it has its own commit with a real explanation, so commit that file **alone**, with this message:

```text
fix: back off and retry once on GitHub secondary rate limits

Sixty browsers polling the same repository on the same ten-second interval
looks like abuse to GitHub. The response is a 403 with a rate-limit remaining
header that is NOT zero, which is what distinguishes it from the ordinary
hourly limit. Retrying immediately makes it worse, because the secondary
limiter counts the retry too.

1100ms was chosen by measurement, not by theory. Below roughly one second the
retry was still being rejected in a room of ~50 machines. Above two seconds
the dashboard visibly lagged behind the room during a live demo. 1100ms was
the smallest value that survived a full workshop without a single 403 reaching
the UI.

Do not "clean this up" into a shorter constant without re-testing at full room
size. The number is small and looks arbitrary precisely because it is
empirical.

Refs: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
```

That is the whole exercise: a strange constant, a `git blame` that finds the commit, and a `git show` that explains why touching it is a bad idea. Nobody could have worked that out from the code alone.

---

## Incident 001 — Active Developers drops to zero

**Why this one.** The bug lives in `src/utils/metrics.ts`, which has no test file at all. There is a seeded issue about that (`Add tests for the metrics helpers`). When the room writes the postmortem, the action item is already sitting in the backlog, which is a more honest ending than "we will be more careful".

Lint passes. Types pass. Tests pass, because there are none. It is a one-word change that reaches production through a completely green pipeline.

### Firing it

Roughly ten minutes before you want the incident, while teams are busy with their own pull requests:

```bash
git switch main
git pull
git switch -c refactor/atlas-metric-cleanup

git apply workshop/incidents/001-active-developers.patch

git add src/utils/metrics.ts
git commit -m "refactor: simplify active developer metric"
git push -u origin HEAD
```

Open a pull request, let CI go green, and merge it. Merging it through the normal flow matters — if you push straight to `main` the history looks different from everything else the room has seen, and somebody will notice the shortcut instead of the bug.

Then set Production to `DEGRADED` in Instructor Mode and say the line out loud:

> Active Developers just went to zero on the dashboard, and commits are still climbing. Nobody has gone home. Something we merged in the last twenty minutes did this.

Do not name the file.

### What the room should do

1. File an incident issue first, using the incident template
2. `git log --oneline -10` on `main` to see what landed recently
3. `git log -p -- src/utils/metrics.ts` or `git blame src/utils/metrics.ts` to find the line
4. `git show <sha>` to read the change in isolation
5. Decide: revert, or roll forward?

That decision is the real lesson. The change is already on `main` and other people have branched from it. Rewriting shared history to make it disappear would break every one of those branches. `git revert` makes a new commit that undoes it, which is honest, safe for everyone else, and leaves the mistake visible in the history where it belongs.

### Resolving it

A team opens the revert as a normal pull request:

```bash
git switch main
git pull
git switch -c hotfix/<team>-active-developer-count
git revert <sha>
git push -u origin HEAD
```

Merge it, set Production back to `HEALTHY`, and point out that `git log` now shows both the mistake and the correction. That is the record a real team wants.

### Follow-up

Steer the postmortem toward the seeded issue about metrics tests. The bug was possible because a file that produces every headline number on the projector had no tests. A team can pick that issue up immediately and close the loop in the same session.

### Undoing it outside the workshop

```bash
git apply -R workshop/incidents/001-active-developers.patch
```

---

## Other disruptions you can trigger without a patch

Not everything needs a code change. These need nothing but timing.

**Emergency hotfix.** Wait until most teams have uncommitted work in progress, then announce a production bug that must be fixed now. Their working tree is dirty and they cannot switch branches cleanly. That is when `git stash` means something. Covered in exercise 08.

**Outdated branch.** Merge two or three pull requests that touch shared files, then ask a team who branched twenty minutes ago to update. Their branch is behind, and they have to choose between merge and rebase.

**Conflict on the wall.** Ask several teams to sign `src/data/wall.json` in the same two-minute window. They all insert at the top and all increment the same counter, so everyone after the first conflicts. `npm run validate:wall` rejects a careless resolution, so they cannot paper over it. Covered in exercise 04.

**Rejected push.** Ask a volunteer to commit directly to `main` and push. The branch ruleset rejects it in front of the room. Far more memorable than a slide about branch protection.
