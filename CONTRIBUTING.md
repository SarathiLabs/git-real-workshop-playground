# Contributing to Git Real

This repository is the workshop. Small, reviewable Pull Requests are the point.

## Before you start

1. Find or open a GitHub Issue.
2. Create a branch from `main`. Do not commit directly to `main`.
3. Keep the change scoped to that Issue.

```bash
git checkout main
git pull
git checkout -b feat/your-issue-slug
```

## While you work

```bash
git status
git diff
git add <files>
git commit -m "feat: short description of why"
git push -u origin HEAD
```

Then open a Pull Request, request a review, and wait for CI.

## Review

- Approve or request changes with a reason.
- Prefer comments on the diff over vague emoji.
- Cross-team reviews are encouraged during the collaboration segment.

## Suggested Issues (sized for one segment)

These are already visible as incomplete UI. You do not have to use these titles, but they match the Feature Lab:

- Enable dark mode (flip `features.darkMode` **and** `ENABLE_THEME_SWITCHER`, then verify both themes)
- Add team filtering (`features.teamFilter`)
- Make search case-insensitive (and match GitHub username)
- Add GitHub profile link to participant drawer
- Show latest PR on student profile
- Implement sorting teams by PR count (and unskip the test)
- Improve loading state on the Activity page
- Add activity filter for CI runs (the checkbox currently does nothing)
- Fix collaboration score (reviews should matter more than commits)
- Improve mobile responsiveness
- Add Reset Graph button (the control is a placeholder)
- Add review count to team cards (graph team node vs page — pick one gap)
- Improve empty Pull Request state
- Add keyboard shortcut for Presentation Mode (already `P` — document or add another)
- Add last-refresh timestamp as a live relative clock
- Add Team Spotlight based on activity instead of a static team
- Add contributor avatar fallback (partially present — improve it)
- Improve API error messages (`GitHubErrorMini` currently renders `Error`)
- Add tooltips to graph edges
- Implement Most Collaborative calculation (`features.collaborationScore`)

## Tests

If you implement team sorting by PRs / commits / reviews, update `src/utils/sort-teams.ts` **and** the tests in `src/utils/sort-teams.test.ts` (`it.todo` cases).

```bash
npm test
npm run lint
```
