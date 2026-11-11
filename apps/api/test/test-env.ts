// Shared by vitest.config.ts and the integration global setup.
export const testEnv = {
  NODE_ENV: "test",
  JWT_SECRET: "test-only-secret-with-at-least-32-characters",
  // A separate database from the one used by `pnpm dev`; `pnpm db:up` starts the server.
  DATABASE_URL:
    process.env.TEST_DATABASE_URL ??
    "postgresql://getitdone:getitdone@localhost:5432/getitdone_test?schema=public",
};
