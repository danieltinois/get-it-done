# Get It Done

A task manager where each person keeps their own tasks and can share
folders of tasks with a group.

> Status: early. Accounts, login, profile and personal tasks work end to end.
> Groups and folders exist in the API but have no screens yet.

## Stack

| Part       | Tech                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| `apps/web` | React 19, Vite, React Router, react-hook-form + zod, styled-components |
| `apps/api` | Fastify 5, Prisma 6, PostgreSQL, JWT auth, zod                         |
| Tooling    | pnpm workspaces, Biome, Vitest, Git hooks, GitHub Actions              |

## Getting started

Prerequisites: Node.js 24 (`fnm use` reads `.nvmrc`), pnpm 12 and Docker Desktop.

```bash
pnpm install                                 # also points Git at .githooks
cp apps/api/.env.example apps/api/.env       # then set JWT_SECRET
cp apps/web/.env.example apps/web/.env
pnpm db:up                                   # Postgres in Docker
pnpm db:migrate                              # applies the Prisma migrations
pnpm dev                                     # api on :3333, web on :5173
```

Generate a `JWT_SECRET` with `openssl rand -base64 48`. The API refuses to
start, and says which variable is wrong, when the environment is incomplete.

## Scripts

Run them from the repository root.

| Script                           | What it does                                    |
| -------------------------------- | ----------------------------------------------- |
| `pnpm dev`                       | Starts the api and the web app in watch mode    |
| `pnpm lint`                      | Lint and format check with Biome                |
| `pnpm format`                    | Applies Biome's safe fixes and formatting       |
| `pnpm typecheck`                 | TypeScript in every app                         |
| `pnpm test`                      | HTTP tests of the api, no database needed       |
| `pnpm test:integration`          | API tests against Postgres (`pnpm db:up` first) |
| `pnpm build`                     | Production build of the web app                 |
| `pnpm db:up` / `pnpm db:migrate` | Starts Postgres / applies migrations            |

## Project layout

```text
apps/
  api/            Fastify API
    prisma/       schema and migrations
    src/app.ts    builds the app (used by server.ts and the tests)
    src/env.ts    validated environment variables
    src/routes/   one file per resource
    test/         http/ (no database) and integration/ (Postgres)
  web/            React app
docs/adr/         architecture decision records
.githooks/        pre-commit, commit-msg and pre-push hooks
compose.yaml      local Postgres, plus the getitdone_test database
```

## Contributing

- Branches follow Git Flow (`feature/…`, `bugfix/…`, `hotfix/…`, `release/…`, `support/…`).
- Commits follow Conventional Commits. The hooks check both.
- Before opening a PR: `pnpm lint && pnpm typecheck && pnpm test`. CI runs the same checks
  and the integration tests.

## Known issues

Kept here until each one has a fix:

- Invalid request bodies answer `500` instead of `400`: zod errors have no error handler.
- Each route file creates its own `PrismaClient`.
- `POST /api/uploads/avatars` has no auth, does not wait for the file to finish writing,
  and returns a URL with port `3333` hard-coded.
- Most web components call the API with hard-coded URLs instead of `src/services/api.ts`.
- Group share codes come from `Math.random`, and `Task.status` is a free string in the database.
- The web app ships two toast libraries (`react-hot-toast` and `react-toastify`).
