import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationMessage } from "../ToolInvocationMessage";
import { ToolInvocation } from "ai";

afterEach(cleanup);

function makeTool(overrides: Partial<ToolInvocation> & { toolName: string; args: Record<string, string> }): ToolInvocation {
  return {
    toolCallId: "test-id",
    state: "result",
    result: "Success",
    ...overrides,
  } as ToolInvocation;
}

test("shows 'Creating' for str_replace_editor create command", () => {
  render(
    <ToolInvocationMessage
      tool={makeTool({ toolName: "str_replace_editor", args: { command: "create", path: "/App.jsx" } })}
    />
  );
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows 'Editing' for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationMessage
      tool={makeTool({ toolName: "str_replace_editor", args: { command: "str_replace", path: "/Card.jsx" } })}
    />
  );
  expect(screen.getByText("Editing /Card.jsx")).toBeDefined();
});

test("shows 'Inserting into' for str_replace_editor insert command", () => {
  render(
    <ToolInvocationMessage
      tool={makeTool({ toolName: "str_replace_editor", args: { command: "insert", path: "/utils.ts" } })}
    />
  );
  expect(screen.getByText("Inserting into /utils.ts")).toBeDefined();
});

test("shows 'Viewing' for str_replace_editor view command", () => {
  render(
    <ToolInvocationMessage
      tool={makeTool({ toolName: "str_replace_editor", args: { command: "view", path: "/index.tsx" } })}
    />
  );
  expect(screen.getByText("Viewing /index.tsx")).toBeDefined();
});

test("shows 'Renaming' for file_manager rename command", () => {
  render(
    <ToolInvocationMessage
      tool={makeTool({ toolName: "file_manager", args: { command: "rename", path: "/old.tsx" } })}
    />
  );
  expect(screen.getByText("Renaming /old.tsx")).toBeDefined();
});

test("shows 'Deleting' for file_manager delete command", () => {
  render(
    <ToolInvocationMessage
      tool={makeTool({ toolName: "file_manager", args: { command: "delete", path: "/temp.tsx" } })}
    />
  );
  expect(screen.getByText("Deleting /temp.tsx")).toBeDefined();
});

test("falls back to tool name for unknown tool", () => {
  render(
    <ToolInvocationMessage
      tool={makeTool({ toolName: "unknown_tool", args: { command: "foo" } })}
    />
  );
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("shows spinner when state is 'call'", () => {
  const { container } = render(
    <ToolInvocationMessage
      tool={{ toolCallId: "test", toolName: "str_replace_editor", args: { command: "create", path: "/App.jsx" }, state: "call" } as ToolInvocation}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("shows green dot when state is 'result'", () => {
  const { container } = render(
    <ToolInvocationMessage
      tool={makeTool({ toolName: "str_replace_editor", args: { command: "create", path: "/App.jsx" } })}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});
