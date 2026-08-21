# Security

## Tokens

`VITE_GITHUB_TOKEN` is read in the browser for this workshop build. That is acceptable for a short-lived classroom token with **read-only** access to the playground repository.

Do **not**:

- Use an org-owner or admin token
- Commit `.env` or any real secret
- Deploy a privileged token to a public Vercel URL

If a token leaks, revoke it in GitHub immediately.

## Reporting a vulnerability

Email the workshop organizers or open a **private** maintainers-only report. Do not file a public Issue for a live secret.

## Dependency and CI hygiene

Pull Requests must pass GitHub Actions (lint, test, build) before a maintainer merges to `main`.
