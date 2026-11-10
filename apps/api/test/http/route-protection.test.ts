import fs from "node:fs/promises";
import path from "node:path";
import jwt from "jsonwebtoken";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../../src/app";

const app = buildApp();

const token = jwt.sign(
  { sub: "user-id", name: "Ana", email: "ana@example.com" },
  process.env.JWT_SECRET as string,
);

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

function multipart(filename: string, contentType: string, content: Buffer) {
  const boundary = "----get-it-done-test";
  const head = Buffer.from(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
      `Content-Type: ${contentType}\r\n\r\n`,
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  return {
    payload: Buffer.concat([head, content, tail]),
    headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
  };
}

const uploadedFiles: string[] = [];

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await Promise.all(uploadedFiles.map((file) => fs.rm(file, { force: true })));
});

describe("routes that require a token", () => {
  it.each([
    ["GET", "/api/folders/some-group-id"],
    ["POST", "/api/folders"],
    ["DELETE", "/api/folders/some-folder-id"],
    ["POST", "/api/uploads/avatars"],
  ] as const)("%s %s answers 401 without a token", async (method, url) => {
    const response = await app.inject({ method, url });

    expect(response.statusCode).toBe(401);
  });
});

describe("avatar upload", () => {
  it("stores a PNG and returns its URL", async () => {
    const { payload, headers } = multipart("me.png", "image/png", PNG);

    const response = await app.inject({
      method: "POST",
      url: "/api/uploads/avatars",
      headers: { ...headers, authorization: `Bearer ${token}` },
      payload,
    });

    expect(response.statusCode).toBe(200);
    const { url } = response.json() as { url: string };
    expect(url).toMatch(/^http:\/\/localhost(:\d+)?\/uploads\/avatars\/[0-9a-f-]+\.png$/);

    const stored = path.join(process.cwd(), "uploads/avatars", path.basename(url));
    uploadedFiles.push(stored);
    expect(await fs.readFile(stored)).toEqual(PNG);
  });

  it("rejects an SVG, which browsers can run scripts from", async () => {
    const { payload, headers } = multipart("me.svg", "image/svg+xml", SVG);

    const response = await app.inject({
      method: "POST",
      url: "/api/uploads/avatars",
      headers: { ...headers, authorization: `Bearer ${token}` },
      payload,
    });

    expect(response.statusCode).toBe(400);
  });

  it("rejects a file whose content is not the image type it claims", async () => {
    const { payload, headers } = multipart("me.png", "image/png", SVG);

    const response = await app.inject({
      method: "POST",
      url: "/api/uploads/avatars",
      headers: { ...headers, authorization: `Bearer ${token}` },
      payload,
    });

    expect(response.statusCode).toBe(400);
  });
});
