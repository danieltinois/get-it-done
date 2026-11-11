import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../../src/app";

// Who may touch what: a group's owner and members see its folders; only the
// owner deletes the group. Anything else answers 404, so the API does not
// reveal that another user's group or folder exists.

const app = buildApp();
const prisma = new PrismaClient();

async function login(email: string) {
  const password = "secret123";
  await app.inject({
    method: "POST",
    url: "/api/users/register",
    payload: { name: email, email, password },
  });
  const response = await app.inject({
    method: "POST",
    url: "/api/users/login",
    payload: { email, password },
  });
  return { authorization: `Bearer ${response.json().token}` };
}

async function createGroup(headers: { authorization: string }) {
  const response = await app.inject({
    method: "POST",
    url: "/api/groups",
    headers,
    payload: { name: "Home" },
  });
  return response.json().group as { id: string; shareCode: string };
}

async function createFolder(headers: { authorization: string }, groupId: string) {
  const response = await app.inject({
    method: "POST",
    url: "/api/folders",
    headers,
    payload: { name: "Groceries", groupId },
  });
  return response;
}

let owner: { authorization: string };
let stranger: { authorization: string };

beforeAll(async () => {
  await app.ready();
});

beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();
  owner = await login("owner@example.com");
  stranger = await login("stranger@example.com");
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});

describe("groups", () => {
  it("gives each group a long, URL-safe share code", async () => {
    const group = await createGroup(owner);

    expect(group.shareCode).toMatch(/^[A-Za-z0-9_-]{16,}$/);
  });

  it("does not let another user delete the group", async () => {
    const group = await createGroup(owner);

    const response = await app.inject({
      method: "DELETE",
      url: `/api/groups/${group.id}`,
      headers: stranger,
    });

    expect(response.statusCode).toBe(404);
    expect(await prisma.group.count({ where: { id: group.id } })).toBe(1);
  });

  it("lets the owner delete the group", async () => {
    const group = await createGroup(owner);

    const response = await app.inject({
      method: "DELETE",
      url: `/api/groups/${group.id}`,
      headers: owner,
    });

    expect(response.statusCode).toBe(204);
  });
});

describe("folders", () => {
  it("lets the owner create and list folders", async () => {
    const group = await createGroup(owner);

    expect((await createFolder(owner, group.id)).statusCode).toBe(201);

    const list = await app.inject({
      method: "GET",
      url: `/api/folders/${group.id}`,
      headers: owner,
    });
    expect(list.json().folders).toHaveLength(1);
  });

  it("lets a member list the group's folders", async () => {
    const group = await createGroup(owner);
    await createFolder(owner, group.id);
    const member = await login("member@example.com");
    const memberUser = await prisma.user.findUniqueOrThrow({
      where: { email: "member@example.com" },
    });
    await prisma.groupMember.create({ data: { userId: memberUser.id, groupId: group.id } });

    const list = await app.inject({
      method: "GET",
      url: `/api/folders/${group.id}`,
      headers: member,
    });

    expect(list.statusCode).toBe(200);
    expect(list.json().folders).toHaveLength(1);
  });

  it("hides another user's group folders", async () => {
    const group = await createGroup(owner);
    await createFolder(owner, group.id);

    const list = await app.inject({
      method: "GET",
      url: `/api/folders/${group.id}`,
      headers: stranger,
    });

    expect(list.statusCode).toBe(404);
  });

  it("does not create a folder in another user's group", async () => {
    const group = await createGroup(owner);

    const response = await createFolder(stranger, group.id);

    expect(response.statusCode).toBe(404);
    expect(await prisma.folder.count()).toBe(0);
  });

  it("does not delete a folder of another user's group", async () => {
    const group = await createGroup(owner);
    const folder = (await createFolder(owner, group.id)).json().folder as { id: string };

    const response = await app.inject({
      method: "DELETE",
      url: `/api/folders/${folder.id}`,
      headers: stranger,
    });

    expect(response.statusCode).toBe(404);
    expect(await prisma.folder.count()).toBe(1);
  });
});

describe("tasks in folders", () => {
  it("does not create a task in another user's folder", async () => {
    const group = await createGroup(owner);
    const folder = (await createFolder(owner, group.id)).json().folder as { id: string };

    const response = await app.inject({
      method: "POST",
      url: "/api/tasks",
      headers: stranger,
      payload: { title: "Sneaky", status: "PENDING", folderId: folder.id },
    });

    expect(response.statusCode).toBe(404);
    expect(await prisma.task.count()).toBe(0);
  });
});
