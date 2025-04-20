import "dotenv/config";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { userRoutes } from "./routes/users";
import { taskRoutes } from "./routes/tasks";
import { profileRoutes } from "./routes/profile";
import { verifyJWT } from "./middleware/verifyJWT";

const app = fastify();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
app.register(userRoutes, { prefix: "/api/users" });
app.register(taskRoutes, { prefix: "/api/tasks" });
app.register(profileRoutes, { prefix: "/api/users", preHandler: verifyJWT });

app.listen({ port: 3333 }).then(() => {
  console.log("🚀 Server is running on http://localhost:3333");
});
