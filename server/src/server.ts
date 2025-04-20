import "dotenv/config";
import fastify from "fastify";
import { userRoutes } from "./routes/users";
import { taskRoutes } from "./routes/tasks";

const app = fastify();

app.register(userRoutes, { prefix: "/api/users" });
app.register(taskRoutes, { prefix: "/api/tasks" });

app.listen({ port: 3333 }).then(() => {
  console.log("🚀 Server is running on http://localhost:3333");
});
