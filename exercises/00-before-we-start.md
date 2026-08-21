# 00 — Before we start

> Phase: `SETUP` · Do this initially till the workshop starts · 20 minutes

## The situation

Sixty+ people are about to work on one codebase at the same time. If twenty of them spend the first hour installing Git, the other forty+ sit and wait.

So the boring part happens now, alone, at your own pace.

## Your mission

Get your machine to the point where it can prove who you are to GitHub, and where this project runs locally.

Work through [SETUP.md](../SETUP.md). It covers:

1. Install Git 2.23+
2. Install Node.js 20+
3. Create a GitHub account and send your username to the organiser
4. Set `user.name` and `user.email`
5. Add an SSH key (or sign in with the GitHub CLI)
6. Clone this repository and run `npm install`

## Done when

```bash
npm run doctor
```

prints no `FAIL` lines.

One `WARN` is expected and correct:

```text
WARN  Workshop registration — You (your-username) have not registered yet. That is Exercise 01.
```

Leave that one. It is the first thing you will do in the room.

Also confirm the app starts:

```bash
npm run dev
```

The dashboard will look almost empty. Sixty people are missing from it. You are one of them.

## Why this matters

Two of these steps look like bureaucracy and are not.

**Your email decides whether you exist.** Git writes `user.email` into every commit. GitHub matches that string against the addresses on your account to work out who made the commit. Get it wrong and your commits are real, your work is real, and the dashboard shows nothing next to your name. People discover this on their first day at a new job more often than you would think.

**Cloning is not downloading.** The ZIP button gives you the files. `git clone` gives you the files _plus_ every version of them that ever existed, plus a link back to where they came from. Almost everything in this workshop lives in that second part.

## Stuck?

<details>
<summary>ssh -T git@github.com says "Permission denied (publickey)"</summary>

Your key is not on your GitHub account. Print the public half:

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the whole line, including `ssh-ed25519` at the start, and add it at [github.com/settings/keys](https://github.com/settings/keys). If the file does not exist, you skipped `ssh-keygen`.

</details>

<details>
<summary>Git asks for a username and password every time</summary>

You are on an HTTPS remote, and GitHub has not accepted account passwords since 2021. Either switch to SSH:

```bash
git remote set-url origin git@github.com:SarathiLabs/git-real-workshop-playground.git
```

or run `gh auth login` and let the CLI manage credentials for you.

</details>

<details>
<summary>"git is not recognized as an internal or external command" on Windows</summary>

Git installed fine, but your terminal was open while it installed and still has the old PATH. Close every terminal window and open a fresh one.

</details>

<details>
<summary>npm install fails with EACCES / permission errors</summary>

Do not rerun it with `sudo` — that makes the next problem worse. It usually means Node was installed through a system package manager into a root-owned location. Install the LTS build from [nodejs.org](https://nodejs.org) instead.

</details>

---

Next: [01 — Setup and register](01-setup-and-register.md)
