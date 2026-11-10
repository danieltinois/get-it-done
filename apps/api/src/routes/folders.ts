import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function folderRoutes(app: FastifyInstance) {
  // Listar pastas de um grupo
  app.get("/:groupId", async (req) => {
    const { groupId } = req.params as { groupId: string };

    const folders = await prisma.folder.findMany({
      where: { groupId },
    });

    return { folders };
  });

  // Criar pasta
  app.post("/", async (req, reply) => {
    const bodySchema = z.object({
      name: z.string().min(2),
      groupId: z.string(),
    });

    const { name, groupId } = bodySchema.parse(req.body);

    const folder = await prisma.folder.create({
      data: { name, groupId },
    });

    return reply.status(201).send({ folder });
  });

  // Deletar pasta
  app.delete("/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    await prisma.folder.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
}
