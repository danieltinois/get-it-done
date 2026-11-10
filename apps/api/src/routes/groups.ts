import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "../middleware/verifyJWT";

const prisma = new PrismaClient();

export async function groupRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: verifyJWT }, async (req) => {
    const userId = req.user.sub;
    const groups = await prisma.group.findMany({
      where: { ownerId: userId },
    });
    return { groups };
  });

  app.post("/", { preHandler: verifyJWT }, async (req, reply) => {
    const bodySchema = z.object({
      name: z.string().min(2),
    });

    const { name } = bodySchema.parse(req.body);
    const ownerId = req.user.sub;

    const group = await prisma.group.create({
      data: {
        name,
        shareCode: Math.random().toString(36).substring(2, 10),
        owner: { connect: { id: ownerId } },
      },
    });

    return reply.status(201).send({ group });
  });

  app.delete("/:id", { preHandler: verifyJWT }, async (req, reply) => {
    const { id } = req.params as { id: string };

    await prisma.group.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
}
