# 06 — Code review

> Phase: `CODE_REVIEW` · ~30 minutes

## The situation

There are open pull requests waiting. Not from the facilitator — from the people sitting around you.

Somebody has to decide whether that code goes into `main`. Today that is you.

This is the part of the job most people are never taught. You will do it in your first week of your first job, and nobody will have shown you how.

## Your mission

Review at least one pull request from another team properly, and get one of yours reviewed.

## How to actually read a pull request

**1. Read the description first.** What is this trying to do? If you cannot tell, that is your first comment, and it is a useful one.

**2. Read the linked issue.** You are reviewing whether this solves the problem, not just whether the code is tidy.

**3. Get it running.** For anything non-trivial:

```bash
git fetch origin
git switch <their-branch>
npm install
npm run dev
```

A reviewer who has actually used the change finds things no amount of diff-reading will.

**4. Then read the diff.** Files changed tab. Line by line.

## What to look for

In roughly this order:

- **Does it do what it says?** Read the description, then check the code matches it.
- **Edge cases.** Empty list. Null. Zero. A name with an apostrophe. What happens when the API is slow?
- **Tests.** Is there a test? Would it catch the bug this is fixing if the fix were reverted?
- **Naming.** Will this name make sense to somebody in six months who has no context?
- **Security.** Hardcoded keys, unescaped input, anything logged that should not be.
- **Consistency.** Does it look like the code around it?
- **Size.** Is this one change, or three unrelated ones sharing a branch?

What *not* to look for: formatting and personal style. Nobody learns anything from an argument about brace placement, and if it matters it should be automated.

## Say which kind of comment you are making

The single most useful habit in code review. Prefix your comments so the author knows what to do with them:

```markdown
**blocking:** This throws when `items` is empty. `activity-page.tsx` calls it
with an empty array on first load.

**suggestion:** Extracting this into a helper would let the other page reuse it.
Fine to leave for a follow-up.

**question:** What happens if the API returns a null avatar here? I might be
misreading it.

**praise:** This is much clearer than what was there before.
```

Without the prefix, every comment reads as blocking, and a review with six nitpicks feels like a rejection. With it, the author knows exactly what stands between them and a merge.

`praise:` is not padding. Reviews that only ever contain criticism are demoralising, and noticing when somebody did something well is how good patterns spread.

## Use suggestions for small things

For a typo or a one-line change, GitHub lets you propose the exact edit:

````markdown
```suggestion
const total = items.reduce((sum, item) => sum + item.value, 0)
```
````

The author clicks a button and it is committed. Far better than three round trips describing a missing bracket.

## Review the code, not the person

```text
"This is wrong."                    ->  "This throws when the list is empty."
"Why would you do it like this?"    ->  "What made you choose a map here over an array?"
"You forgot the test."              ->  "This needs a test for the empty case."
"Terrible naming."                  ->  "`d` is hard to follow — `daysElapsed`?"
```

Same technical content. Completely different experience for the person reading it at the end of a long day.

Two rules that carry most of the weight:

- Talk about the code, not the author. "This function" not "you".
- Ask rather than accuse when you are not sure. You are wrong more often than you expect, and a question costs you nothing.

## Then choose

- **Approve** — good to merge. Approving with a couple of `suggestion:` comments is fine and normal.
- **Request changes** — something must change first. Say clearly what, and why.
- **Comment** — thoughts, no verdict.

Requesting changes is not an insult. It is the mechanism working. What *is* rude is a vague "needs work" with no specifics.

## Receiving a review

This is the other half, and it is a skill.

- Assume good intent. It reads harsher than it was meant, in text, every time.
- Reply to every comment, even if only "good catch, fixed".
- Push a new commit — do not force-push over the review, or the reviewer loses their place.
- Disagree when you disagree. Explain why. A review is a conversation, not a verdict.
- Resolve conversations as you address them, so the reviewer can see what is left.

To update your pull request:

```bash
# make the change
git add .
git commit -m "fix: handle the empty list case"
git push
```

The pull request updates itself, CI reruns, and the reviewer gets notified. Nothing else to do.

## Done when

- You have reviewed at least one pull request from **another team**
- Your comments are prefixed with `blocking:`, `suggestion:`, `question:`, or `praise:`
- You left at least one comment that is not a criticism
- You either approved or requested changes, with a reason
- Somebody reviewed yours, and you responded to every comment

## Watch the graph

Open the Network view on the projector.

Review edges between teams are the ones that matter. A room full of nodes with no edges between teams is sixty people working alone in the same repository. The edges are what make it an engineering organisation.

Find yours.

## Stuck?

<details>
<summary>I do not know enough to review someone else's code</summary>

You know more than you think, and you do not need to be an expert.

Things anyone can usefully check:

- Does the description explain what this does?
- Can you follow the code without asking the author?
- Is there a test?
- Any leftover `console.log` or commented-out code?
- Does anything look copy-pasted?

"I could not follow this function, could you add a comment?" is genuinely valuable feedback. If a reader could not follow it, that is a real problem with the code, and only a reader can report it.
</details>

<details>
<summary>I disagree with a review comment</summary>

Say so, with your reasoning. Reviews are not orders.

> I thought about that, but the API can return null here, so the guard is
> load-bearing. Happy to add a comment explaining why if that helps.

If you still disagree after a round, pull in a third person rather than going back and forth. Two people stuck is a conversation; four comments deep is a stalemate.
</details>

<details>
<summary>My pull request has been approved but I cannot merge</summary>

Check the merge box on the pull request. It lists exactly what is missing. Usually one of:

- A required check is still running or failed
- An unresolved conversation
- The branch is behind `main` and needs updating
- A CODEOWNERS review is still outstanding

Branch protection is doing its job. Writing code and getting code accepted into a shared system are two different things.
</details>

---

Next: [07 — CI](07-ci.md)
