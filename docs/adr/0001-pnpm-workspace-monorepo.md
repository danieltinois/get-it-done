# 1. One repository with a pnpm workspace

Date: 2026-11-10 · Status: accepted

## Context

The web app and the API lived in `client/` and `server/`, each with its own npm
lockfile and no shared scripts. Running the project meant knowing which folder
to enter for each command, and npm's hoisting hid a missing dependency: the
API imported `fastify-plugin` without declaring it.

## Decision

Keep both apps in one repository as a pnpm workspace: `apps/web` and `apps/api`,
one lockfile, Node.js pinned in `.nvmrc`, and every command run from the root
(`pnpm dev`, `pnpm lint`, `pnpm test`, ...).

## Consequences

- A change that touches the API and the web app is one branch and one PR.
- pnpm only lets a package import what it declares, so missing dependencies
  fail at once instead of in production.
- Build scripts of dependencies only run when listed in `allowBuilds` in
  `pnpm-workspace.yaml`. A new dependency with a postinstall step needs an entry.
- A shared package (types or the API contract) can be added later as
  `packages/*` without moving anything.
