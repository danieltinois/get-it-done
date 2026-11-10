import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../../src/app";

// Needs a migrated Postgres at DATABASE_URL (see vitest.config.ts).
// Locally: pnpm db:up, then pnpm --filter @get-it-done/api test:integration.

const app = buildApp();
const prisma = new PrismaClient();

const password = "secret123";

async function registerAndLogin(email: string) {
  await app.inject({
    method: "POST",
    url: "/api/users/register",
    payload: { name: "Test User", email, password },
  });
  const login = await app.inject({
    method: "POST",
    url: "/api/users/login",
    payload: { email, password },
  });
  return login.json().token as string;
}

beforeAll(async () => {
  await app.ready();
});

beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});

describe("users", () => {
  it("registers a user and logs in", async () => {
    const register = await app.inject({
      method: "POST",
      url: "/api/users/register",
      payload: { name: "Ana", email: "ana@example.com", password },
    });
    expect(register.statusCode).toBe(201);

    const login = await app.inject({
      method: "POST",
      url: "/api/users/login",
      payload: { email: "ana@example.com", password },
    });
    expect(login.statusCode).toBe(200);
    expect(login.json().token).toEqual(expect.any(String));
  });

  it("refuses a second account with the same email", async () => {
    const payload = { name: "Ana", email: "ana@example.com", password };
    await app.inject({ method: "POST", url: "/api/users/register", payload });

    const second = await app.inject({ method: "POST", url: "/api/users/register", payload });

    expect(second.statusCode).toBe(400);
    expect(second.json()).toEqual({ message: "User already exists" });
  });

  it("refuses a wrong password", async () => {
    await registerAndLogin("ana@example.com");

    const login = await app.inject({
      method: "POST",
      url: "/api/users/login",
      payload: { email: "ana@example.com", password: "wrong-password" },
    });

    expect(login.statusCode).toBe(400);
  });
});

describe("tasks", () => {
  it("creates, lists, updates and deletes a task", async () => {
    const token = await registerAndLogin("ana@example.com");
    const headers = { authorization: `Bearer ${token}` };

    const created = await app.inject({
      method: "POST",
      url: "/api/tasks",
      headers,
      payload: { title: "Write tests", status: "PENDING" },
    });
    expect(created.statusCode).toBe(201);
    const taskId = created.json().task.id as string;

    const list = await app.inject({ method: "GET", url: "/api/tasks", headers });
    expect(list.json().tasks).toHaveLength(1);

    const updated = await app.inject({
      method: "PUT",
      url: `/api/tasks/${taskId}`,
      headers,
      payload: { status: "COMPLETED" },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json().task.status).toBe("COMPLETED");

    const deleted = await app.inject({ method: "DELETE", url: `/api/tasks/${taskId}`, headers });
    expect(deleted.statusCode).toBe(204);

    const empty = await app.inject({ method: "GET", url: "/api/tasks", headers });
    expect(empty.json().tasks).toHaveLength(0);
  });

  it("hides one user's task from another user", async () => {
    const ownerToken = await registerAndLogin("owner@example.com");
    const otherToken = await registerAndLogin("other@example.com");

    const created = await app.inject({
      method: "POST",
      url: "/api/tasks",
      headers: { authorization: `Bearer ${ownerToken}` },
      payload: { title: "Private", status: "PENDING" },
    });
    const taskId = created.json().task.id as string;

    const update = await app.inject({
      method: "PUT",
      url: `/api/tasks/${taskId}`,
      headers: { authorization: `Bearer ${otherToken}` },
      payload: { title: "Hijacked" },
    });
    expect(update.statusCode).toBe(404);

    const otherList = await app.inject({
      method: "GET",
      url: "/api/tasks",
      headers: { authorization: `Bearer ${otherToken}` },
    });
    expect(otherList.json().tasks).toHaveLength(0);
  });
});
