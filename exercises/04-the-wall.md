# 04 — The Wall

> Phase: `BRANCHING` · ~25 minutes · **Everybody does this at the same time**

## The situation

In exercise 01 you added a file nobody else was touching, so nothing collided. That was deliberate, and it is not what most days look like.

This time everybody edits the same three lines of the same file, in the same ten minutes.

Open `src/data/wall.json`:

```json
{
  "engineersOnboard": 1,
  "lastUpdatedBy": "saurabhfegade",
  "entries": [
    { "github": "saurabhfegade", "team": "phoenix", "shipped": "the first commit" }
  ]
}
```

Whoever merges first is fine. Everybody after that is going to conflict. That is the exercise.

## Your mission

Sign the wall.

1. Add your entry as the **first** item in `entries`
2. Increment `engineersOnboard` by one
3. Set `lastUpdatedBy` to your own username
4. Get it merged into `main`

Your entry:

```json
{ "github": "your-username", "team": "your-team", "shipped": "what you built or fixed today" }
```

`shipped` is a short phrase, not a sentence. "dark mode", "the empty state component", "my first pull request".

## Do it

```bash
git switch main
git pull
git switch -c chore/<your-team>-sign-the-wall
```

Edit `src/data/wall.json`, then check it before you push:

```bash
npm run validate:wall
```

```bash
git add src/data/wall.json
git commit -m "chore: sign the wall"
git push -u origin HEAD
```

Open a pull request.

## When your branch conflicts

Somebody merged before you. GitHub says "This branch has conflicts that must be resolved".

Do it locally. The web editor works for a two-line conflict and teaches you nothing.

```bash
git switch main
git pull
git switch -
git merge main
```

Git stops:

```text
CONFLICT (content): Merge conflict in src/data/wall.json
```

**Read the status first:**

```bash
git status
```

Then open the file. You will see:

```text
<<<<<<< HEAD
   your version
=======
   the version from main
>>>>>>> main
```

### The trap

There are three lazy resolutions, and all three are wrong.

**"Keep mine."** You just deleted whoever merged before you. Their entry is gone, their name is off the board, and you did it.

**"Keep theirs."** You threw away your own change. You are not on the wall.

**"Keep both."** Closest, and still wrong. Both entries survive, but `engineersOnboard` cannot be two values at once. Git kept one number, and it is now wrong.

### The actual resolution

Delete the markers and write the file that should exist:

- Both entries present, yours first
- `engineersOnboard` equal to the number of entries — count them
- `lastUpdatedBy` set to you

Then:

```bash
npm run validate:wall
git add src/data/wall.json
git commit
git push
```

`git commit` with no `-m` here: Git has already written a sensible merge message, and you can just save and close.

## Why the counter is in there

The list of entries is a **textual** conflict. Git can see two sets of lines and knows it cannot choose.

`engineersOnboard` is a **semantic** conflict. Both sides changed `1` to `2`. Git shows you two identical-looking changes, and whichever you pick, the answer is wrong, because the correct value is `3`.

This is the dangerous kind. It does not always produce conflict markers. Two people can each make a perfectly correct change, Git can merge them cleanly with no warning at all, and the result can still be broken.

There is no Git command for this. The only defences are reading the change, and having something that checks the result — which is what `npm run validate:wall` is doing in CI. That check is not there to be annoying. It is standing in for the tests that catch this in a real codebase.

## Done when

- Your entry is on `/wall` in the projected dashboard
- `engineersOnboard` matches the number of entries
- Nobody who signed before you has been deleted
- The Validate workshop data check is green

## Worth saying out loud

> A merge conflict is not Git failing. It is Git refusing to guess what two humans meant.

Every alternative is worse. A tool that silently picked one side would be a tool that silently threw away somebody's work.

## Stuck?

<details>
<summary>I want out</summary>

```bash
git merge --abort
```

Back to exactly where you were, every time. Try it once on purpose so you know it is there.
</details>

<details>
<summary>The wall check is red: "engineersOnboard says 4 but there are 5 entries"</summary>

Classic "keep both". The entries merged, the counter did not.

Count the entries. Write that number. Push again.
</details>

<details>
<summary>The wall check is red: "X appears twice"</summary>

The resolution kept both copies of the same entry. Delete one.
</details>

<details>
<summary>Now it says the file is not valid JSON</summary>

There are almost certainly still conflict markers in it:

```bash
grep -n "<<<<<<<\|=======\|>>>>>>>" src/data/wall.json
```

Delete all three marker lines. They are not JSON, and they are not meant to survive.

Also check for a trailing comma after the last entry — that is not valid JSON either.
</details>

<details>
<summary>I conflicted again while fixing the conflict</summary>

Somebody merged while you were working. This is normal on a busy repository and you have not done anything wrong.

```bash
git switch main
git pull
git switch -
git merge main
```

Resolve again. It gets quick after the second time.
</details>

<details>
<summary>I want to practise conflicts privately first</summary>

```bash
npm run scenario -- conflict
```

A throwaway repository with a guaranteed conflict in a pricing function. Nobody is watching, and you can regenerate it as often as you like.
</details>

---

Next: [05 — Issue to pull request](05-issue-to-pr.md)
