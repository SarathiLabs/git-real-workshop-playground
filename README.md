# Git Real

Hands-on Git and GitHub workshop playground. The app is an Engineering Mission Control dashboard that visualises this repository's own GitHub activity as a room of students turns into an engineering organisation.

## Participants

Do this first: **[SETUP.md](SETUP.md)** (or [exercises/00-before-we-start.md](exercises/00-before-we-start.md)).

Then:

```bash
npm run doctor
npm run dev
```

The self-paced track is in [`exercises/`](exercises/README.md).

## Quick start (already set up)

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env`:

```text
VITE_GITHUB_TOKEN=
VITE_GITHUB_OWNER=SarathiLabs
VITE_GITHUB_REPO=git-real-workshop-playground
VITE_USE_MOCK_GITHUB=false
VITE_REFRESH_INTERVAL_MS=0
```

Set `VITE_GITHUB_TOKEN` to a **read-only** GitHub token in `git-real-workshop-playground/.env` (not a parent folder), then restart `npm run dev`. Leave `VITE_REFRESH_INTERVAL_MS` at `0` so the dashboard only hits GitHub on load and when you click **Refresh**.

## Keyboard shortcuts

| Key | Action                      |
| --- | --------------------------- |
| `P` | Toggle presentation mode    |
| `F` | Fit the collaboration graph |
| `N` | Network page                |
| `A` | Activity page               |
| `I` | Instructor mode             |

## More

- [docs/README.md](docs/README.md) — architecture, env, GitHub API, instructor mode
- [docs/repo-settings.md](docs/repo-settings.md) — branch protection, teams, labels
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to send a pull request
- `npm run scenario` — throwaway repos for bisect, reflog, rebase, and the other sharp tools
