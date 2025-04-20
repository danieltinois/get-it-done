import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { verifyJWT } from "../middleware/verifyJWT";

const prisma = new PrismaClient();

export async function profileRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: verifyJWT }, async (request, reply) => {
    const userId = request.user.sub;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
      },
    });

    return reply.send({ user });
  });

  app.patch("/me", { preHandler: verifyJWT }, async (request, reply) => {
    const bodySchema = z.object({
      name: z.string().min(2).max(50).optional(),
      bio: z.string().max(160).optional(),
      avatarUrl: z.string().url().optional(),
    });

    const data = bodySchema.parse(request.body);
    const userId = request.user.sub;

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
      },
    });

    return reply.send({ message: "Perfil atualizado!", user: updated });
  });
}
