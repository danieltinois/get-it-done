import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
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
        shareCode: randomBytes(12).toString("base64url"),
        owner: { connect: { id: ownerId } },
      },
    });

    return reply.status(201).send({ group });
  });

  app.delete("/:id", { preHandler: verifyJWT }, async (req, reply) => {
    const { id } = req.params as { id: string };

    // Only the owner deletes a group; deleteMany lets the owner check live in the query.
    const { count } = await prisma.group.deleteMany({
      where: { id, ownerId: req.user.sub },
    });
    if (count === 0) {
      return reply.status(404).send({ message: "Group not found" });
    }

    return reply.status(204).send();
  });
}
