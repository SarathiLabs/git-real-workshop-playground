# Changelog

Notable changes to this project. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## How to add to this file

If your pull request changes something a user would notice, add one line under `Unreleased`, in the right category. If it does not, do not.

```markdown
### Added
- Team filtering on the Participants page (#42)
```

Categories: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.

Write it for somebody who does not have the code open. "Fixed the bug" is not a changelog entry.

## What the version numbers mean

`MAJOR.MINOR.PATCH`

- **MAJOR** — you changed something in a way that breaks existing users. They have to do work to upgrade.
- **MINOR** — you added something. Existing users are unaffected.
- **PATCH** — you fixed something. No new capability, nothing breaks.

The whole point is that a version number is a promise about upgrade risk. `1.4.2` to `1.5.0` should be safe. `1.5.0` to `2.0.0` means read the notes first.

Below `1.0.0` those promises are explicitly not being made yet, which is why this project is on `0.x`.

---

## [Unreleased]

### Added
- Self-paced exercises in `exercises/`, covering setup through open source
- Per-participant registration under `src/data/participants/`
- The Wall at `/wall`, and the merge-conflict exercise built around it
- Workshop data validation and secret scanning in CI
- Disposable practice repositories via `npm run scenario`
- `npm run doctor` for pre-workshop machine checks
- Shared `EmptyState` stub and `formatRelativeTime` stub for cross-team Issues

## [0.1.0] - 2026-08-21

### Added
- Engineering Mission Control dashboard reading live GitHub activity
- Collaboration graph, participants, teams, pull requests, activity, production pages
- Instructor and presentation modes
- Continuous integration running lint, tests, and build
