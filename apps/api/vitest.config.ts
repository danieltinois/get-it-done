import { defineConfig } from "vitest/config";
import { testEnv } from "./test/test-env";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "http",
          include: ["test/http/**/*.test.ts"],
          env: testEnv,
        },
      },
      {
        test: {
          name: "integration",
          include: ["test/integration/**/*.test.ts"],
          env: testEnv,
          globalSetup: ["test/integration/global-setup.ts"],
          // The files share one database, so they run one after another.
          fileParallelism: false,
        },
      },
    ],
  },
});
