# Contributing to Git Real

This repository is the workshop. Small, reviewable pull requests are the point.

If you are a participant, start with the [exercises](exercises/README.md), not this file. The backlog lives on the Issues tab; it was seeded from [workshop/issues.yml](workshop/issues.yml).

## Before you start

1. Find or open a GitHub Issue. Comment to claim it.
2. Branch from `main`. Do not commit directly to `main`.
3. Keep the change scoped to that Issue.

```bash
git switch main
git pull
git switch -c feat/<your-team>-short-description
```

Branch names: `<type>/<team>-<description>`. Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `hotfix`.

## While you work

```bash
git status
git diff
git add <files>
git commit -m "feat: short description of why"
git push -u origin HEAD
```

Then open a pull request, fill in the template (`Closes #N`), request a review from another team, and wait for CI.

Required checks: Lint, Test, Build, Validate workshop data, Scan for secrets.

## Review

- Review the code, not the person.
- Prefix comments: `blocking:`, `suggestion:`, `question:`, `praise:`.
- Approve or request changes with a reason.
- Cross-team reviews are the point of the collaboration segment.

## Tests

If you pick up team sorting, unskip `describe.skip` in `src/utils/sort-teams.test.ts` and implement `src/utils/sort-teams.ts` until it passes.

If you pick up `formatRelativeTime`, same pattern in `src/utils/format-relative-time.test.ts`.

```bash
npm test
npm run lint
```

## Do not

- Force-push shared branches
- Merge your own pull request into `main`
- Commit `.env` files or real credentials
- Rewrite published history to hide a mistake — `git revert` instead
