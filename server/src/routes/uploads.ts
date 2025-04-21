import fs from "node:fs";
import path from "node:path";
import fp from "fastify-plugin";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";

export default async function uploadsRoutes(app: FastifyInstance) {
  app.register(import("@fastify/multipart"));

  app.post("/avatars", async (req, reply) => {
    const file = await req.file();
    if (!file || !file.mimetype.startsWith("image/")) {
      return reply.status(400).send({ error: "Só imagens, por favor" });
    }

    const fileExt = path.extname(file.filename);
    const fileName = `${randomUUID()}${fileExt}`;
    const dest = path.join(process.cwd(), "uploads/avatars", fileName);

    await fs.promises.mkdir(path.dirname(dest), { recursive: true });

    const write = fs.createWriteStream(dest);
    await file.file.pipe(write);

    const url = `${req.protocol}://${req.hostname}:3333/uploads/avatars/${fileName}`;
    reply.send({ url });
  });
}
