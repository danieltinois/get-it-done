import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../env";

export type AuthUser = {
  sub: string;
  name: string;
  email: string;
};

declare module "fastify" {
  interface FastifyRequest {
    // Set by verifyJWT; only read it in routes that run verifyJWT as preHandler.
    user: AuthUser;
  }
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: "Token not provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === "string" || typeof decoded.sub !== "string") {
      return reply.status(401).send({ message: "Invalid token" });
    }
    request.user = decoded as AuthUser;
  } catch {
    return reply.status(401).send({ message: "Invalid token" });
  }
}
