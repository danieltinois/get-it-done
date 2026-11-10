import path from "node:path";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import { env } from "./env";
import { verifyJWT } from "./middleware/verifyJWT";
import { folderRoutes } from "./routes/folders";
import { groupRoutes } from "./routes/groups";
import { profileRoutes } from "./routes/profile";
import { taskRoutes } from "./routes/tasks";
import uploadsRoutes from "./routes/uploads";
import { userRoutes } from "./routes/users";

const app = fastify();

app.register(fastifyCors, {
  origin: env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
app.register(userRoutes, { prefix: "/api/users" });
app.register(taskRoutes, { prefix: "/api/tasks" });
app.register(groupRoutes, { prefix: "/api/groups", preHandler: verifyJWT });
app.register(folderRoutes, { prefix: "/api/folders", preHandler: verifyJWT });
app.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/", // serve as imagens
});

app.register(uploadsRoutes, { prefix: "/api/uploads" }); // recebe imagens
app.register(profileRoutes, { prefix: "/api/users", preHandler: verifyJWT });

app.ready((err) => {
  if (!err) console.log(app.printRoutes());
});

app.listen({ port: env.PORT }).then(() => {
  console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
});
