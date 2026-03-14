"use client";

import { ToolInvocation } from "ai";
import { Loader2 } from "lucide-react";

function getToolDescription(tool: ToolInvocation): string {
  const args = tool.args as Record<string, string> | undefined;
  const command = args?.command;
  const path = args?.path;

  if (tool.toolName === "str_replace_editor" && path) {
    switch (command) {
      case "create":
        return `Creating ${path}`;
      case "str_replace":
        return `Editing ${path}`;
      case "insert":
        return `Inserting into ${path}`;
      case "view":
        return `Viewing ${path}`;
    }
  }

  if (tool.toolName === "file_manager" && path) {
    switch (command) {
      case "rename":
        return `Renaming ${path}`;
      case "delete":
        return `Deleting ${path}`;
    }
  }

  return tool.toolName;
}

interface ToolInvocationMessageProps {
  tool: ToolInvocation;
}

export function ToolInvocationMessage({ tool }: ToolInvocationMessageProps) {
  const isComplete = tool.state === "result" && "result" in tool;
  const description = getToolDescription(tool);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{description}</span>
    </div>
  );
}
