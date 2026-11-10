import jwt from "jsonwebtoken";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../../src/app";

// These tests never reach the database: every request stops at the auth
// guard or at body validation. They pin down how the API behaves today.

const app = buildApp();

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("auth guard", () => {
  it("rejects a request without a token", async () => {
    const response = await app.inject({ method: "GET", url: "/api/tasks" });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ message: "Token not provided" });
  });

  it("rejects a malformed token", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/tasks",
      headers: { authorization: "Bearer not-a-jwt" },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ message: "Invalid token" });
  });

  it("rejects a token signed with another secret", async () => {
    const token = jwt.sign({ sub: "user-id" }, "a-different-secret-that-is-long-enough");

    const response = await app.inject({
      method: "GET",
      url: "/api/groups",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(401);
  });

  it("rejects a token without a subject", async () => {
    const token = jwt.sign({ name: "no subject" }, process.env.JWT_SECRET as string);

    const response = await app.inject({
      method: "GET",
      url: "/api/tasks",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(401);
  });
});

describe("body validation", () => {
  // Known issue: a ZodError is not mapped to 400, so invalid input answers
  // 500. Change these expectations when the API gets an error handler.
  it("answers 500 to a register request with an invalid email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/users/register",
      payload: { name: "Ana", email: "not-an-email", password: "123456" },
    });

    expect(response.statusCode).toBe(500);
  });

  it("answers 500 to a login request with a short password", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/users/login",
      payload: { email: "ana@example.com", password: "123" },
    });

    expect(response.statusCode).toBe(500);
  });
});
