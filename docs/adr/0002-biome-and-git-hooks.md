# 2. Biome for lint and formatting, enforced by Git hooks and CI

Date: 2026-11-10 · Status: accepted

## Context

Only the web app had a linter (ESLint) and nothing formatted the code, so
style drifted between files and the API had no checks at all.

## Decision

Use Biome for both apps, configured once in `biome.json` at the root. Enforce
it in three places that run the same commands:

1. `pre-commit` checks the staged files with Biome.
2. `commit-msg` and `pre-push` use git-validator for Conventional Commits and
   Git Flow branch names, and block pushes to `main`.
3. CI runs `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`.

## Consequences

- One tool and one config instead of ESLint, Prettier and their plugins.
- Biome has fewer plugins than ESLint. If we need a rule it lacks, revisit this ADR.
- Hooks live in `.githooks/`, tracked in Git; `pnpm install` turns them on
  through the `prepare` script. Hooks can be skipped locally, so CI is the gate.
