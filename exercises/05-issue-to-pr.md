# 05 — Issue to pull request

> Phase: `COLLABORATION` · ~40 minutes · Work as a team

## The situation

The backlog is full. Open the Issues tab and look at it.

Some are labelled `good first issue`. Some are labelled `blocked` and say "Blocked by #12" — those need another team's work merged first. A few are labelled `cross-team` and have other teams waiting on *them*.

This is the shape of a real backlog, and from here on you are not following instructions. You are picking up work.

## Your mission

Take an issue from the backlog and get it merged into `main`.

The whole path:

```text
Issue  ->  claim it  ->  branch  ->  code  ->  commit  ->  push  ->  pull request  ->  review  ->  CI  ->  merge
```

## 1. Pick something

Filter by `difficulty:starter` if this is new to you.

Before anything else, **comment on the issue** to claim it. One line is enough:

> Team Nova is picking this up.

Skipping this is how two teams spend forty minutes building the same thing and find out at merge time.

If the issue is labelled `blocked`, read the blocking issue. Either pick something else, or go and talk to the team who has it. Which brings us to the interesting part.

## 2. If your issue is blocked, go and find the other team

Some issues genuinely cannot be finished until another team merges. That is not a mistake in the setup — it is the most realistic thing in this whole workshop.

Four teams are building things others depend on:

```text
formatRelativeTime util  ──>  live "last refreshed" clock
                         └─>  activity feed timestamps

EmptyState component     ──>  empty state on Pull Requests
                         └─>  empty state on Activity

sortTeams by activity    ──>  Teams page sort dropdown

collaboration score      ──>  Most Collaborative panel
```

If you are downstream: find the team upstream and agree the interface *now*, before either of you writes code. What is the function called? What arguments does it take? What does it return?

You can start immediately once you have agreed. Write your side against the interface you agreed on, even though it does not exist yet.

If you are upstream: other people are waiting on you. Say when you expect to be done, and tell them on the issue when it merges.

This conversation is the single most valuable thing in this exercise. Almost every expensive engineering problem is two teams who each did reasonable work against different assumptions.

## 3. Branch

```bash
git switch main
git pull
git switch -c feat/nova-empty-state
```

`<type>/<team>-<description>`.

## 4. Work in small commits

Not one enormous commit at the end. A commit per logical step:

```bash
git add src/components/ui/empty-state.tsx
git commit -m "feat: add EmptyState component with icon and action slot"
```

Small commits are what make `git revert`, `git bisect`, and code review work at all. You will feel the benefit of this in exercise 08 and 09, when you are trying to find one bad change among many.

## 5. Check it before anybody else has to

```bash
npm run lint
npm test
npm run build
```

Sending a pull request that fails checks you could have run yourself costs a reviewer their attention for nothing.

## 6. Push and open a pull request

```bash
git push -u origin HEAD
```

Fill in the template. The parts that matter:

- **What changed** — one or two sentences
- **Why** — the part the diff cannot tell them
- **Closes #42** — this actual line, with the real number. GitHub closes the issue automatically when the pull request merges, and links them together permanently.
- **How to check it** — how a reviewer verifies this themselves

Then, before you request a review: **open the Files changed tab and read your own diff.**

Do this every time. You will find a stray `console.log`, a commented-out block, a file you did not mean to touch. Roughly half the comments you would have received, you will catch yourself in ninety seconds.

## 7. Request a review from a different team

Not your own team. Pick another one. Their pull requests need reviewers too, so it works out.

Some paths request reviewers automatically — that is `.github/CODEOWNERS` doing its job. If you touched `src/data/` or `src/utils/`, expect an extra reviewer to appear without you asking.

## Done when

- The issue is claimed with a comment
- Your pull request says `Closes #<number>`
- All five required checks are green
- Somebody from another team has reviewed it
- It is merged, and the issue closed itself

## Issues and pull requests are different things

- An **issue** is a problem, a request, or a piece of work. It can be open for months. Anybody can file one.
- A **pull request** is a specific proposed change to the code, with a diff attached.

One issue can take three pull requests. One pull request can close two issues. They are related and they are not the same thing, and people who conflate them end up with a backlog that is really a pile of diffs.

## Stuck?

<details>
<summary>Somebody merged while I was working and now I am behind</summary>

Normal. Bring your branch up to date:

```bash
git switch main
git pull
git switch -
git merge main
```

Resolve anything that conflicts, then push. Exercise 09 covers the `rebase` alternative and when you would want it.
</details>

<details>
<summary>The team I am blocked on has not finished</summary>

Do not sit and wait. Options, roughly in order:

1. Agree the interface with them and build your side against it
2. Write the tests for your part — they do not need the dependency to exist
3. Pick up a second, unblocked issue and come back

Then say on the issue what you are doing, so nobody has to guess.
</details>

<details>
<summary>My pull request has grown to fifteen files</summary>

It is too big, and the honest signal is that the review you get back will say "LGTM" without anybody having read it.

Split it. The clean way:

```bash
git switch main
git switch -c feat/nova-part-one
git cherry-pick <the commits for part one>
```

This is why small commits are worth the discipline. Splitting a branch of six focused commits is easy. Splitting one commit of 800 lines is not.
</details>

<details>
<summary>Nobody is reviewing my pull request</summary>

Go and ask a specific person out loud. Not the room — one person.

Then go and review somebody else's. Review capacity is the bottleneck on almost every real team, and the way it improves is people choosing to review rather than waiting to be asked.
</details>

---

Next: [06 — Code review](06-code-review.md)
