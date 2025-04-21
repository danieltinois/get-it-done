import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "../middleware/verifyJWT";

const prisma = new PrismaClient();

export async function taskRoutes(app: FastifyInstance) {
  // Register a new task
  app.post("/", { preHandler: verifyJWT }, async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      description: z.string().optional(),
      status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
      folderId: z.string().optional(), // adicionado
    });

    const { title, description, status, folderId } = bodySchema.parse(
      request.body
    );

    const userId = (request.user as any).sub;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        folderId,
        userId,
      },
    });

    return reply
      .status(201)
      .send({ message: "Task created successfully", task });
  });

  // Update a task
  app.put("/:id", { preHandler: verifyJWT }, async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { title, description, status } = bodySchema.parse(request.body);

    const userId = (request.user as any).sub;

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task || task.userId !== userId) {
      return reply.status(404).send({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        status,
      },
    });

    return reply.send({
      message: "Task updated successfully",
      task: updatedTask,
    });
  });

  // Delete a task
  app.delete("/:id", { preHandler: verifyJWT }, async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);
    const userId = (request.user as any).sub;

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task || task.userId !== userId) {
      return reply.status(404).send({ message: "Task not found" });
    }

    await prisma.task.delete({
      where: {
        id,
      },
    });

    return reply.status(204).send({ message: "Task deleted successfully" });
  });

  // Get all tasks for a user
  app.get("/", { preHandler: verifyJWT }, async (request, reply) => {
    const userId = (request.user as any).sub;

    const task = await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reply.status(200).send({ tasks: task });
  });

  // Get tasks by folder
  app.get(
    "/folder/:folderId",
    { preHandler: verifyJWT },
    async (request, reply) => {
      const { folderId } = request.params as { folderId: string };
      const userId = (request.user as any).sub;

      const tasks = await prisma.task.findMany({
        where: {
          folderId,
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return reply.send({ tasks });
    }
  );
}
