# Setup — do this before the workshop

Budget 20 minutes. If everything on this page is done before you arrive, you start writing code in minute one instead of minute forty.

At the end there is one command that checks all of it for you.

---

## 1. Install Git

**Windows** — download from [git-scm.com/downloads](https://git-scm.com/downloads). Accept the defaults, except set the default editor to something you actually know how to quit. Use "Git from the command line and also from 3rd-party software".

**macOS** — `git --version` in Terminal will offer to install the developer tools. Or `brew install git`.

**Linux** — `sudo apt install git` / `sudo dnf install git`.

Check it:

```bash
git --version
```

You want 2.23 or newer. Older versions do not have `git switch` and `git restore`, which we use all day.

## 2. Install Node.js 20 or newer

Download the LTS build from [nodejs.org](https://nodejs.org).

```bash
node --version
npm --version
```

## 3. Create a GitHub account

If you already have one, use it — a real account with your real history is more useful to you than a throwaway.

Send your GitHub **username** to the workshop organiser. You will be invited to the organisation before the session, and you need to accept that invite from your email or from [github.com/notifications](https://github.com/notifications).

## 4. Tell Git who you are

Git stamps every commit with a name and an email. If you skip this, your work shows up as somebody else or as nobody.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

The email **must** be one of the addresses on your GitHub account at [github.com/settings/emails](https://github.com/settings/emails). If it is not, GitHub cannot link your commits to your profile, and you will be invisible on the workshop dashboard all day.

Prefer not to publish your real address? GitHub gives you a free alias at [github.com/settings/emails](https://github.com/settings/emails) that looks like `12345678+username@users.noreply.github.com`. Use that.

## 5. Let your machine authenticate to GitHub

GitHub stopped accepting account passwords over Git in 2021. Pick one of these.

### Option A — SSH key (recommended)

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

Press Enter at every prompt. Then print the **public** half and paste it into [github.com/settings/keys](https://github.com/settings/keys):

```bash
# macOS / Linux
cat ~/.ssh/id_ed25519.pub

# Windows PowerShell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

Verify:

```bash
ssh -T git@github.com
```

"Hi _username_! You've successfully authenticated" is success, even though it then says you cannot get shell access.

### Option B — GitHub CLI

```bash
gh auth login
```

Choose HTTPS and follow the browser flow. This also gives you the `gh` command, which is handy but optional.

## 6. Clone the playground

```bash
git clone git@github.com:SarathiLabs/git-real-workshop-playground.git
cd git-real-workshop-playground
npm install
```

Download the ZIP from GitHub instead and you get a folder with no history and no remote, which means no branches, no pushing, and no workshop. Clone it.

## 7. Check your work

```bash
npm run doctor
```

This checks your Git version, your identity, your GitHub authentication, your Node version, your line-ending config, and whether you have registered yet. Every failure prints the exact command that fixes it.

You want no `FAIL` lines. A `WARN` about registration is expected — registering is the first exercise.

## 8. Confirm the app runs

```bash
npm run dev
```

Open the URL it prints, usually `http://localhost:5173`. You should see the Mission Control dashboard. It will look empty. That is the point: by the end of the session it fills up with the room.

Stop it with `Ctrl+C`.

---

## Troubleshooting

**`git` is not recognised (Windows)** — you installed Git but did not restart your terminal. Close it and open a new one.

**`Permission denied (publickey)`** — the SSH key is not on your GitHub account. Redo step 5 and confirm you pasted the `.pub` file.

**`npm install` fails with permission errors** — do not use `sudo`. Reinstall Node from nodejs.org rather than through a system package manager.

**Laptop blocks SSH on port 22** — use Option B, or configure [SSH over HTTPS](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port).

**Everything looks broken and you have 5 minutes left** — come anyway. Arrive early and we will fix it together.
