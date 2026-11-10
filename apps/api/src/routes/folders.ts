import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { groupAccessibleBy } from "../authorization";
import { verifyJWT } from "../middleware/verifyJWT";

const prisma = new PrismaClient();

export async function folderRoutes(app: FastifyInstance) {
  app.addHook("preHandler", verifyJWT);

  // Listar pastas de um grupo
  app.get("/:groupId", async (req, reply) => {
    const { groupId } = req.params as { groupId: string };

    const group = await prisma.group.findFirst({
      where: { id: groupId, ...groupAccessibleBy(req.user.sub) },
      select: { id: true },
    });
    if (!group) {
      return reply.status(404).send({ message: "Group not found" });
    }

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

    const group = await prisma.group.findFirst({
      where: { id: groupId, ...groupAccessibleBy(req.user.sub) },
      select: { id: true },
    });
    if (!group) {
      return reply.status(404).send({ message: "Group not found" });
    }

    const folder = await prisma.folder.create({
      data: { name, groupId },
    });

    return reply.status(201).send({ folder });
  });

  // Deletar pasta
  app.delete("/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const folder = await prisma.folder.findFirst({
      where: { id, group: groupAccessibleBy(req.user.sub) },
      select: { id: true },
    });
    if (!folder) {
      return reply.status(404).send({ message: "Folder not found" });
    }

    await prisma.folder.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
}
