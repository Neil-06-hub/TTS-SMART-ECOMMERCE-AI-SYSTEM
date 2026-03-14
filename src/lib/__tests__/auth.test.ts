// @vitest-environment node
import { test, expect, vi, beforeEach } from "vitest";
import { SignJWT, jwtVerify } from "jose";

vi.mock("server-only", () => ({}));

const cookieStore = new Map<string, { value: string; options?: Record<string, unknown> }>();
const mockSet = vi.fn((name: string, value: string, options?: Record<string, unknown>) => {
  cookieStore.set(name, { value, options });
});
const mockGet = vi.fn((name: string) => cookieStore.get(name));
const mockDelete = vi.fn((name: string) => { cookieStore.delete(name); });

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    set: mockSet,
    get: mockGet,
    delete: mockDelete,
  })),
}));

const JWT_SECRET = new TextEncoder().encode("development-secret-key");

beforeEach(() => {
  cookieStore.clear();
  vi.clearAllMocks();
});

test("createSession sets an httpOnly cookie", async () => {
  const { createSession } = await import("@/lib/auth");

  await createSession("user-123", "test@example.com");

  expect(mockSet).toHaveBeenCalledOnce();
  const [name, , options] = mockSet.mock.calls[0];
  expect(name).toBe("auth-token");
  expect(options.httpOnly).toBe(true);
  expect(options.sameSite).toBe("lax");
  expect(options.path).toBe("/");
});

test("createSession token contains correct userId and email", async () => {
  const { createSession } = await import("@/lib/auth");

  await createSession("user-456", "hello@test.com");

  const token = mockSet.mock.calls[0][1] as string;
  const { payload } = await jwtVerify(token, JWT_SECRET);
  expect(payload.userId).toBe("user-456");
  expect(payload.email).toBe("hello@test.com");
});

test("createSession cookie expires in 7 days", async () => {
  const { createSession } = await import("@/lib/auth");
  const before = Date.now();

  await createSession("user-789", "expire@test.com");

  const options = mockSet.mock.calls[0][2] as Record<string, unknown>;
  const expires = options.expires as Date;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const diff = expires.getTime() - before;
  expect(diff).toBeGreaterThanOrEqual(sevenDaysMs - 1000);
  expect(diff).toBeLessThanOrEqual(sevenDaysMs + 1000);
});
