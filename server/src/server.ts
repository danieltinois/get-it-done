import "dotenv/config";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { userRoutes } from "./routes/users";
import { taskRoutes } from "./routes/tasks";

const app = fastify();

app.register(fastifyCors, {
  origin: "http://localhost:5173", // frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // <– isso é crucial
  allowedHeaders: ["Content-Type", "Authorization"],
});
app.register(userRoutes, { prefix: "/api/users" });
app.register(taskRoutes, { prefix: "/api/tasks" });

app.listen({ port: 3333 }).then(() => {
  console.log("🚀 Server is running on http://localhost:3333");
});
