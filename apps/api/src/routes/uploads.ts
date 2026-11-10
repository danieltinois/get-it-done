import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fastifyMultipart from "@fastify/multipart";
import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verifyJWT";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

// Detects the type from the file's first bytes, never from the name or the
// Content-Type the client sent. Anything else, SVG included, is refused.
function detectImageExtension(file: Buffer): ".png" | ".jpg" | ".webp" | null {
  const startsWith = (bytes: number[], offset = 0) =>
    bytes.every((byte, index) => file[offset + index] === byte);

  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return ".png";
  if (startsWith([0xff, 0xd8, 0xff])) return ".jpg";
  // "RIFF" .... "WEBP"
  if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)) {
    return ".webp";
  }
  return null;
}

export default async function uploadsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", verifyJWT);
  app.register(fastifyMultipart, { limits: { fileSize: MAX_AVATAR_BYTES, files: 1 } });

  app.post("/avatars", async (req, reply) => {
    const file = await req.file();
    if (!file) {
      return reply.status(400).send({ error: "Envie uma imagem" });
    }

    // Rejects with 413 when the file is larger than MAX_AVATAR_BYTES.
    const content = await file.toBuffer();
    const extension = detectImageExtension(content);
    if (!extension) {
      return reply.status(400).send({ error: "Só imagens PNG, JPEG ou WebP" });
    }

    const fileName = `${randomUUID()}${extension}`;
    const dest = path.join(process.cwd(), "uploads/avatars", fileName);

    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.writeFile(dest, content);

    const url = `${req.protocol}://${req.host}/uploads/avatars/${fileName}`;
    return reply.send({ url });
  });
}
