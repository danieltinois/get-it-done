import path from "node:path";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import { env } from "./env";
import { folderRoutes } from "./routes/folders";
import { groupRoutes } from "./routes/groups";
import { profileRoutes } from "./routes/profile";
import { taskRoutes } from "./routes/tasks";
import uploadsRoutes from "./routes/uploads";
import { userRoutes } from "./routes/users";

// Builds the app without listening, so tests can drive it with app.inject().
export function buildApp() {
  // Route plugins guard themselves with verifyJWT: Fastify ignores hooks passed
  // as register() options, so a preHandler there would not run.
  const app = fastify();

  app.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.register(userRoutes, { prefix: "/api/users" });
  app.register(taskRoutes, { prefix: "/api/tasks" });
  app.register(groupRoutes, { prefix: "/api/groups" });
  app.register(folderRoutes, { prefix: "/api/folders" });
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/", // serve as imagens
    setHeaders: (res) => {
      // Never let the browser guess a type for user files, or run them as a page.
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Security-Policy", "sandbox");
    },
  });

  app.register(uploadsRoutes, { prefix: "/api/uploads" }); // recebe imagens
  app.register(profileRoutes, { prefix: "/api/users" });

  return app;
}
