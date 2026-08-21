# Participants

One file per person: `<your-github-username>.json`.

```json
{
  "github": "your-github-username",
  "name": "Your Name",
  "team": "nova",
  "role": "developer",
  "interests": ["React", "Backend"]
}
```

Copy `_example.json` and rename it to your GitHub username. Files starting with `_` are templates and are ignored by both the app and the validator.

## Why one file each

Sixty people editing one shared roster file would mean sixty pull requests all touching the same lines, and fifty-nine merge conflicts before anybody has learned what a merge conflict is.

Separate files means your registration never collides with anybody else's. When we *do* want a conflict, we use [`../wall.json`](../wall.json), where it is deliberate and the point of the exercise.

## Rules the CI enforces

`npm run validate:participants` checks all of this, and runs on every pull request:

- The filename must match the `github` field exactly. `asha-p.json` must contain `"github": "asha-p"`.
- `github`, `name`, `team`, and `role` are required.
- `role` is either `developer` or `team-lead`.
- `team` must be an id that exists in [`../teams.json`](../teams.json).
- No two people may claim the same GitHub username.
- `interests` is optional, and must be an array of strings if present.

Your GitHub stats are never stored here. Commits, pull requests, and reviews are read live from the GitHub API. This file only says who you are and which team you are on.
