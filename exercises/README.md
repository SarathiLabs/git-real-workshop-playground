# Exercises

This is the student track. Work through it in order. The facilitator will call out when the whole room should do something together — usually [04 — The Wall](04-the-wall.md) and [08 — Incident](08-incident.md). Everything else you can do at your own pace.

Every exercise is a situation first. The command that solves it shows up after you have the problem, not before.

```text
00  Before we start            SETUP
01  Get on the board           SETUP
02  What Git is actually doing FUNDAMENTALS
03  Branches                   BRANCHING
04  The Wall                   BRANCHING          (together)
05  Issue to pull request      COLLABORATION
06  Code review                CODE_REVIEW
07  Continuous integration     CI_CD
08  Incident                   INCIDENT           (together)
09  Advanced Git               ADVANCED_GIT
10  Release                    OPEN_SOURCE
11  Open source                OPEN_SOURCE
```

## How to read an exercise

- **The situation** — why this exists
- **Your mission** — what "done" looks like
- **You may need** — command *names*, not a script to paste
- **Done when** — a checklist you can actually verify
- **Stuck?** — progressive hints. Read them in order. The last one is the answer.

If you are lost in Git itself rather than in an exercise, go to [recovery.md](recovery.md). If you need a word defined, [glossary.md](glossary.md). If you need a command and already know why, [cheatsheet.md](cheatsheet.md).

## Practice repositories

Some commands are unsafe on a shared repository with sixty people on it. Those live in throwaway local repos:

```bash
npm run scenario                # list them
npm run scenario -- bisect      # build one
```

They are created under `.scenarios/`, which is gitignored. Wreck them. Rebuild them. Nothing you do there can affect this repository or GitHub.

## The shape of the day

```text
Individual developer
        ↓
Local history
        ↓
Branches
        ↓
Parallel development
        ↓
Remote repository
        ↓
Issues
        ↓
Pull Requests
        ↓
Reviews
        ↓
Automated checks
        ↓
Approval
        ↓
Merge
        ↓
Release
```

By the later exercises the room should feel like an engineering organisation, because that is what it will have become.
