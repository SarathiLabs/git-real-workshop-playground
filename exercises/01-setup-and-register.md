# 01 — Get on the board

> Phase: `SETUP` · ~15 minutes · Do this first

## The situation

Look at the dashboard on the projector. It is nearly empty.

There are forty teams defined and almost nobody in them. The graph has no nodes worth looking at. Every metric is zero.

Sixty+ engineers are in this room and the system does not know any of you exist.

## Your mission

Put yourself on that screen.

You are going to add one small file that says who you are and which team you are on, get it onto `main` through the same process a real change goes through, and watch your name appear on the projector.

This is a small change on purpose. The point is not the code. The point is walking the whole path from "I have an idea" to "it is live", once, before anything is complicated.

## Step by step

**1. Make sure you are up to date.**

```bash
git switch main
git pull
```

**2. Create a branch.** Branch names in this repository follow `<type>/<team>-<description>`.

Registration is housekeeping, not a feature or a bug fix, so the type is `chore`:

```bash
git switch -c chore/nova-register-asha
```

Swap in **your** team id and **your** name. Team ids are lowercase and live in `src/data/teams.json`.

```text
chore/phoenix-register-saurabh
chore/atlas-register-priya
chore/helix-register-omar
```

**3. Create your file.** It goes in `src/data/participants/` and is named after your GitHub username exactly:

```json
{
  "github": "your-github-username",
  "name": "Your Name",
  "team": "nova",
  "role": "developer",
  "interests": ["React", "Backend"]
}
```

Copy `src/data/participants/_example.json` if that is easier. `role` is `developer` unless your team has picked you as `team-lead`.

**4. Check it locally before you push.** This is the same check CI runs, so there is no reason to find out on GitHub:

```bash
npm run validate:participants
```

**5. Look at what you are about to commit.** Get into this habit now:

```bash
git status
git diff
```

`git diff` will show nothing, because a brand new file is untracked and Git is not tracking its contents yet. That is not a bug — it is worth understanding why, and exercise 02 goes into it.

**6. Commit and push.**

```bash
git add src/data/participants/your-github-username.json
git commit -m "chore: register asha-p on team nova"
git push -u origin HEAD
```

**7. Open a pull request.** Follow the link Git prints, or go to the repository on GitHub — it will offer you a button. Fill in the template. It is three lines for a change this size.

**8. Wait for the checks, then ask for a merge.** Five checks run. When they are green, tell the facilitator or a student maintainer.

## Done when

- Your name appears on the Participants page of the projected dashboard
- Your team's card shows one more member
- `npm run doctor` says `PASS  Workshop registration`
- You can find your own node in the Network view

## Why not one big file

The obvious design is one `students.json` with everybody in it. It would also be a disaster: sixty pull requests all editing the same lines, and fifty-nine merge conflicts before anybody has learned what a merge conflict is.

One file per person means your change cannot collide with anybody else's.

That is a real design decision, and the reasoning generalises. When you find yourself with a file that everybody has to touch, it is usually the file that is wrong.

We do want conflicts, though. Exercise 04 has a file built specifically to cause them, on cue, when everybody is ready.

## Stuck?

<details>
<summary>My push was rejected and it mentions "protected branch"</summary>

You are on `main`. Nobody can push to `main` here, including the facilitator.

```bash
git branch --show-current
```

If that says `main`, your commit is on the wrong branch. Move it:

```bash
git switch -c chore/<your-team>-register-<your-name>
git push -u origin HEAD
```

Your commit comes with you, because a branch is just a pointer to a commit.

</details>

<details>
<summary>The Validate workshop data check is red</summary>

Click **Details** next to the failed check and read the message. It names the file and the problem in plain English.

The most common one by far: the filename does not match the `github` field. `asha.json` containing `"github": "asha-p"` fails. Rename the file, or fix the field.

Run `npm run validate:participants` locally to see the same message faster.

</details>

<details>
<summary>My name is on the board but shows no activity</summary>

Expected. You have not written any code yet. The dashboard reads commits, pull requests, and reviews from the GitHub API — nothing about your activity is stored in the file you just added.

If it is still empty after you have merged real work, check that the email in `git config user.email` is one of the addresses on your GitHub account. If it is not, GitHub cannot link your commits to you, and you will be invisible all day.

</details>

<details>
<summary>Somebody else already pushed a file with my username</summary>

Talk to them. One of you has the wrong username. The validator rejects duplicates, so the second pull request will not merge until it is sorted out.

</details>

---

Next: [02 — Fundamentals](02-fundamentals.md)
