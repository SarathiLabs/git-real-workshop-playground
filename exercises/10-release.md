# 10 — Release

> Phase: `OPEN_SOURCE` · ~20 minutes

## The situation

Look at the header of the dashboard. There is a version badge, currently `v0.1.0` or whatever `package.json` says.

That number is not decoration. It is a name for a specific commit — a point you can point at, roll back to, and talk about without saying "the thing we merged on Thursday around four".

A commit hash is precise and unusable in a conversation. A tag is precise and usable.

## Your mission

Help cut a workshop release.

You will not push the tag. Tagging `main` is a maintainer action, same as merging. You will do the work that makes the tag *mean* something: the changelog.

## 1. Add your work to the changelog

Open `CHANGELOG.md`. Under `## [Unreleased]`, in the right category, add a line for anything you merged today that a user of this dashboard would notice.

```markdown
### Added
- Team filtering on the Participants page (#42)
```

Categories: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.

Write it for somebody who does not have the code open. "Fixed the bug" is not an entry. "Fixed participant search ignoring GitHub usernames (#17)" is.

If you shipped nothing user-visible — a refactor, a test, a docs typo — do not add a line. Changelogs that list everything are as useless as changelogs that list nothing.

```bash
git switch main
git pull
git switch -c docs/<your-team>-changelog
```

Commit, push, open a pull request. Keep it to the changelog. Do not mix it with a feature.

## 2. Understand what the number means

```text
MAJOR.MINOR.PATCH
```

- **MAJOR** — you changed something existing users must react to
- **MINOR** — you added something. Existing users are unaffected
- **PATCH** — you fixed something. No new capability

`0.1.0` to `0.2.0` is "we added things". `0.2.0` to `1.0.0` is "we are now making the compatibility promise". `1.4.2` to `1.5.0` should be safe to install. `1.5.0` to `2.0.0` means read the notes first.

The version is a promise about upgrade risk. That is why it is a decision, not a timestamp.

## 3. Watch a tag happen

The facilitator will, after the changelog PRs merge:

```bash
git switch main
git pull
# edit package.json version, move [Unreleased] to [0.2.0] in CHANGELOG.md
git add package.json CHANGELOG.md
git commit -m "chore: release 0.2.0"
git tag -a v0.2.0 -m "v0.2.0"
git push origin main
git push origin v0.2.0
```

Pushing the tag fires `.github/workflows/release.yml`. That workflow:

1. Runs lint, test, and build on the tagged commit — a tag that does not build is worse than no tag
2. Generates notes from the commit messages since the previous tag
3. Creates a GitHub Release

Watch the Actions tab. Then open the Releases page. Then look at the dashboard header: the badge reads the version from `package.json`, so it changes when that commit is what is deployed.

This is why commit titles were worth caring about all day. The release notes are generated from them. A commit called `fix` becomes a release note called `fix`.

```bash
npm run release:notes
```

runs the same generator locally if you want to see what it would produce.

## 4. Tags are commits with names

```bash
git tag
git show v0.2.0
git log v0.1.0..v0.2.0 --oneline
```

An annotated tag (`-a`) stores a message, an author, and a date. A lightweight tag is just a pointer. Releases should be annotated.

Deleting a tag that has been pushed is possible and almost always a bad idea: people may already have built against it. If the tag is wrong, cut a new patch.

## Done when

- You have a changelog line merged (or you confirmed you had nothing user-visible to add)
- You watched a tag become a GitHub Release
- You can explain what `0.2.0` promises that `0.2.1` and `1.0.0` do not
- You looked at `git log v0.1.0..v0.2.0 --oneline` (or whatever the tags are) and recognised work you did

## Environments, briefly

In a company this is usually:

```text
tag  →  GitHub Release  →  deploy to staging  →  smoke test  →  deploy to production
```

GitHub Environments (Settings → Environments) add protection on the last step: required reviewers, wait timers, and secrets that only that environment can use. We are not wiring a real deploy today. The shape is the same as branch protection, applied to "can this go live" instead of "can this land on main".

Continuous **integration** is "every pull request is built and tested". Continuous **delivery** is "every change on main is releasable". Continuous **deployment** is "every change on main *is* released". They are not synonyms, and most teams are in the middle.

## Stuck?

<details>
<summary>Two of us added a changelog line and we conflicted</summary>

Same as the wall. Keep both lines, keep the headings, watch for a trailing comma that is not actually JSON this time — markdown is more forgiving, but duplicated headings are messy. Pull `main`, merge, resolve, push.
</details>

<details>
<summary>The release workflow failed</summary>

A tag that fails CI is a tag that should not have been pushed. The workflow is doing its job. Fix `main`, move the tag (facilitator only, and only if nobody has used it yet), or cut `v0.2.1`.
</details>

---

Next: [11 — Open source](11-open-source.md)
