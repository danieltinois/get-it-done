import { execFileSync } from "node:child_process";
import { testEnv } from "../test-env";

// Applies every migration to the test database once, before any
// integration test file runs. compose.yaml creates that database.
export function setup() {
  execFileSync("pnpm", ["exec", "prisma", "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: testEnv.DATABASE_URL },
    stdio: "inherit",
  });
}
