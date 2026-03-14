import { test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/use-auth";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/anon-work-tracker", () => ({
  getAnonWorkData: vi.fn(),
  clearAnonWork: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn(),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn(),
}));

import { signIn as signInAction, signUp as signUpAction } from "@/actions";
import { getAnonWorkData, clearAnonWork } from "@/lib/anon-work-tracker";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAnonWorkData).mockReturnValue(null);
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(createProject).mockResolvedValue({ id: "new-project-id" } as any);
});

// --- signIn ---

test("signIn returns result from action", async () => {
  vi.mocked(signInAction).mockResolvedValue({ success: false, error: "Invalid credentials" });

  const { result } = renderHook(() => useAuth());

  let returnValue: any;
  await act(async () => {
    returnValue = await result.current.signIn("user@example.com", "wrongpass");
  });

  expect(returnValue).toEqual({ success: false, error: "Invalid credentials" });
});

test("signIn calls action with correct email and password", async () => {
  vi.mocked(signInAction).mockResolvedValue({ success: true });

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.signIn("user@example.com", "password123");
  });

  expect(signInAction).toHaveBeenCalledWith("user@example.com", "password123");
});

test("signIn sets isLoading to true during call and false after", async () => {
  let resolveSignIn!: (value: any) => void;
  vi.mocked(signInAction).mockReturnValue(
    new Promise((resolve) => { resolveSignIn = resolve; })
  );

  const { result } = renderHook(() => useAuth());

  expect(result.current.isLoading).toBe(false);

  act(() => { result.current.signIn("user@example.com", "password123"); });

  expect(result.current.isLoading).toBe(true);

  await act(async () => { resolveSignIn({ success: false, error: "Invalid" }); });

  expect(result.current.isLoading).toBe(false);
});

test("signIn resets isLoading to false when action throws", async () => {
  vi.mocked(signInAction).mockRejectedValue(new Error("Network error"));

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    try {
      await result.current.signIn("user@example.com", "password123");
    } catch {}
  });

  expect(result.current.isLoading).toBe(false);
});

test("signIn does not navigate when auth fails", async () => {
  vi.mocked(signInAction).mockResolvedValue({ success: false, error: "Invalid credentials" });

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.signIn("user@example.com", "wrongpass");
  });

  expect(mockPush).not.toHaveBeenCalled();
});

// --- signUp ---

test("signUp returns result from action", async () => {
  vi.mocked(signUpAction).mockResolvedValue({ success: false, error: "Email already registered" });

  const { result } = renderHook(() => useAuth());

  let returnValue: any;
  await act(async () => {
    returnValue = await result.current.signUp("existing@example.com", "password123");
  });

  expect(returnValue).toEqual({ success: false, error: "Email already registered" });
});

test("signUp calls action with correct email and password", async () => {
  vi.mocked(signUpAction).mockResolvedValue({ success: true });

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.signUp("new@example.com", "password123");
  });

  expect(signUpAction).toHaveBeenCalledWith("new@example.com", "password123");
});

test("signUp sets isLoading to true during call and false after", async () => {
  let resolveSignUp!: (value: any) => void;
  vi.mocked(signUpAction).mockReturnValue(
    new Promise((resolve) => { resolveSignUp = resolve; })
  );

  const { result } = renderHook(() => useAuth());

  expect(result.current.isLoading).toBe(false);

  act(() => { result.current.signUp("new@example.com", "password123"); });

  expect(result.current.isLoading).toBe(true);

  await act(async () => { resolveSignUp({ success: false }); });

  expect(result.current.isLoading).toBe(false);
});

test("signUp resets isLoading to false when action throws", async () => {
  vi.mocked(signUpAction).mockRejectedValue(new Error("Server error"));

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    try {
      await result.current.signUp("new@example.com", "password123");
    } catch {}
  });

  expect(result.current.isLoading).toBe(false);
});

test("signUp does not navigate when auth fails", async () => {
  vi.mocked(signUpAction).mockResolvedValue({ success: false, error: "Email already registered" });

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.signUp("existing@example.com", "password123");
  });

  expect(mockPush).not.toHaveBeenCalled();
});

// --- handlePostSignIn: anon work ---

test("navigates to new project after sign-in when anon work exists", async () => {
  vi.mocked(signInAction).mockResolvedValue({ success: true });
  vi.mocked(getAnonWorkData).mockReturnValue({
    messages: [{ role: "user", content: "hello" }],
    fileSystemData: { "/": {} },
  });
  vi.mocked(createProject).mockResolvedValue({ id: "anon-project-id" } as any);

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.signIn("user@example.com", "password123");
  });

  expect(createProject).toHaveBeenCalledWith(
    expect.objectContaining({
      messages: [{ role: "user", content: "hello" }],
      data: { "/": {} },
    })
  );
  expect(clearAnonWork).toHaveBeenCalled();
  expect(mockPush).toHaveBeenCalledWith("/anon-project-id");
});

test("does not use anon work when messages array is empty", async () => {
  vi.mocked(signInAction).mockResolvedValue({ success: true });
  vi.mocked(getAnonWorkData).mockReturnValue({
    messages: [],
    fileSystemData: {},
  });
  vi.mocked(getProjects).mockResolvedValue([{ id: "existing-id" }] as any);

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.signIn("user@example.com", "password123");
  });

  expect(clearAnonWork).not.toHaveBeenCalled();
  expect(mockPush).toHaveBeenCalledWith("/existing-id");
});

// --- handlePostSignIn: existing projects ---

test("navigates to most recent project when no anon work and projects exist", async () => {
  vi.mocked(signInAction).mockResolvedValue({ success: true });
  vi.mocked(getProjects).mockResolvedValue([
    { id: "recent-project" },
    { id: "older-project" },
  ] as any);

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.signIn("user@example.com", "password123");
  });

  expect(mockPush).toHaveBeenCalledWith("/recent-project");
});

// --- handlePostSignIn: no projects ---

test("creates a new project and navigates when no anon work and no projects exist", async () => {
  vi.mocked(signInAction).mockResolvedValue({ success: true });
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(createProject).mockResolvedValue({ id: "brand-new-id" } as any);

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.signIn("user@example.com", "password123");
  });

  expect(createProject).toHaveBeenCalledWith(
    expect.objectContaining({ messages: [], data: {} })
  );
  expect(mockPush).toHaveBeenCalledWith("/brand-new-id");
});

test("new project created on sign-up with empty messages and data", async () => {
  vi.mocked(signUpAction).mockResolvedValue({ success: true });
  vi.mocked(getProjects).mockResolvedValue([]);
  vi.mocked(createProject).mockResolvedValue({ id: "signup-project-id" } as any);

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.signUp("new@example.com", "password123");
  });

  expect(createProject).toHaveBeenCalledWith(
    expect.objectContaining({ messages: [], data: {} })
  );
  expect(mockPush).toHaveBeenCalledWith("/signup-project-id");
});

// --- initial state ---

test("isLoading is false on initial render", () => {
  const { result } = renderHook(() => useAuth());
  expect(result.current.isLoading).toBe(false);
});

test("hook exposes signIn, signUp, and isLoading", () => {
  const { result } = renderHook(() => useAuth());
  expect(typeof result.current.signIn).toBe("function");
  expect(typeof result.current.signUp).toBe("function");
  expect(typeof result.current.isLoading).toBe("boolean");
});
