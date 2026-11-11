# 3. Two layers of API tests before refactoring

Date: 2026-11-10 · Status: accepted

## Context

The API had no tests, and the next steps (error handling, module structure,
groups and folders) change a lot of code. We need to know when a change breaks
existing behavior.

## Decision

Test the API through HTTP with Fastify's `app.inject()`, using the same app that
`server.ts` starts (`buildApp()` in `src/app.ts`), in two Vitest projects:

- `http`: requests that never reach the database (auth guard, body validation).
  Runs anywhere, in under a second, with `pnpm test`.
- `integration`: full flows against a real Postgres (`getitdone_test`), with
  migrations applied once by a global setup. Runs with `pnpm test:integration`
  locally after `pnpm db:up`, and on every PR in CI.

The first tests are characterization tests: they record what the API does
today, bugs included, such as the `500` on invalid input. A fix changes the
test on purpose, in the same commit.

## Consequences

- Tests check the HTTP contract, not internal functions, so the routes can be
  restructured without rewriting the tests.
- Integration tests share one database and run one file at a time.
- The web app has no tests yet. Add them when its structure settles.
