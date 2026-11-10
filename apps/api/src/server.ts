import { buildApp } from "./app";
import { env } from "./env";

const app = buildApp();

app.ready((err) => {
  if (!err) console.log(app.printRoutes());
});

app.listen({ port: env.PORT }).then(() => {
  console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
});
