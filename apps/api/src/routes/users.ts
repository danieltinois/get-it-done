import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../middleware/verifyJWT";

const prisma = new PrismaClient();

export async function userRoutes(app: FastifyInstance) {
  // Register a new user
  // POST /api/users/register

  app.post("/register", async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return reply.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return reply.status(201).send({ message: "User created successfully" });
  });

  // Login a user
  // POST /api/users/login

  app.post("/login", async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return reply.status(400).send({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return reply.status(400).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m",
      }
    );

    return reply.status(200).send({
      message: "Login successful",
      token,
    });
  });

  // Get current user profile
  // GET /api/users/me

  // Update current user profile
  // PATCH /api/users/me
}
