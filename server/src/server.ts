import "dotenv/config";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { userRoutes } from "./routes/users";
import { taskRoutes } from "./routes/tasks";
import { profileRoutes } from "./routes/profile";
import { verifyJWT } from "./middleware/verifyJWT";
import fastifyStatic from "@fastify/static";
import path from "path";
import uploadsRoutes from "./routes/uploads";
import { groupRoutes } from "./routes/groups";
import { folderRoutes } from "./routes/folders";
const app = fastify();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
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

app.listen({ port: 3333 }).then(() => {
  console.log("🚀 Server is running on http://localhost:3333");
});
