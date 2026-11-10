# Get It Done: rules for AI agents

Read README.md first: it has the stack, the scripts and the known issues.
Architecture decisions live in docs/adr/. Read the related ADR before changing
tooling or structure, and add a new ADR when you make a decision of that kind.

## Before saying a change is done

Run from the repository root and report the result:

```bash
pnpm lint && pnpm typecheck && pnpm test
```

Run `pnpm test:integration` too when the change touches the api's routes,
Prisma schema or auth; it needs `pnpm db:up`. If you could not run something,
say so.

## Code

- Monorepo with pnpm workspaces: `apps/api` (Fastify + Prisma) and `apps/web` (React + Vite).
  Add a dependency to the app that imports it: `pnpm --filter @get-it-done/api add <pkg>`.
- Read environment variables through `apps/api/src/env.ts`, never `process.env` directly.
  A new variable goes in the zod schema and in `.env.example`.
- The api is built by `buildApp()` in `src/app.ts`; tests use `app.inject()`, no real port.
- New api behavior comes with a test: `test/http/` when it needs no database,
  `test/integration/` when it does.
- Follow the style Biome enforces. Fix the code instead of disabling a rule.
- A schema change is a new Prisma migration; never edit an applied one.

## Git

- Git Flow branches (`feature/`, `bugfix/`, `hotfix/`, `release/`, `support/`), never commit to `main`.
- Conventional Commits. Commit and push only when the owner asks.
- Everything goes out under the owner's name only: no AI co-author, "generated with" footer
  or mention of AI tools in commits, PRs or docs. The commit-msg hook rejects it.
