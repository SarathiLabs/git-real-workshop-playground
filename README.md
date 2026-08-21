# Git Real Workshop

Hands-on Git and GitHub workshop playground.

## Setup

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
VITE_REFRESH_INTERVAL_MS=10000
```

Set `VITE_GITHUB_TOKEN` to a read-only GitHub token, then restart `npm run dev`.
