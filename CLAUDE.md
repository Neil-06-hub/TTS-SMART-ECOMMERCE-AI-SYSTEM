# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in natural language, Claude generates code via tool use, and the result renders in a sandboxed iframe. Built on Next.js 15 (App Router) + React 19 + TypeScript.

## Commands

```bash
npm run dev          # Dev server with Turbopack (requires cross-env on Windows)
npm run build        # Production build
npm run test         # Run all tests (Vitest + jsdom + Testing Library)
npx vitest run src/components/chat/__tests__/MessageList.test.tsx  # Single test file
npm run setup        # Install deps + Prisma generate + migrate
npm run db:reset     # Wipe and re-migrate SQLite database
```

## Architecture

### Routing

- `/` — Home page; anonymous users see main content, authenticated users redirect to most recent project
- `/[projectId]` — Project page (requires auth, loads saved messages + files from DB)
- `/api/chat` — Streaming POST endpoint for AI chat (messages, files, projectId)

### Three-Panel UI (`main-content.tsx`)

Left panel: chat interface. Right panel toggles between live preview (iframe) and code editor (Monaco + file tree). Panels use `react-resizable-panels`.

### AI Integration

- **Provider** (`lib/provider.ts`): Uses Claude Haiku 4.5 via `@ai-sdk/anthropic` when `ANTHROPIC_API_KEY` is set; falls back to `MockLanguageModel` with static responses otherwise.
- **Streaming** (`api/chat/route.ts`): `streamText()` with maxSteps=40, maxTokens=10000. On finish, persists messages + file system to project DB.
- **Tools**: Claude uses two tools to modify code:
  - `str_replace_editor` — view/create/edit files (commands: `view`, `create`, `str_replace`, `insert`)
  - `file_manager` — rename/delete files and directories
- **System prompt** (`lib/prompts/generation.tsx`): Instructs Claude to use React + Tailwind, start with `/App.jsx`, use `@/` import alias.

### Virtual File System (`lib/file-system.ts`)

In-memory tree of `FileNode` objects (no disk I/O). Serialized to/from JSON for DB persistence. The `FileSystemContext` wraps it in React context and syncs tool call results to UI.

### Preview Pipeline (`lib/transform/jsx-transformer.ts`)

1. Babel standalone transforms JSX/TSX files
2. `createImportMap()` generates blob URLs for local files + esm.sh URLs for third-party packages
3. `createPreviewHTML()` builds a complete HTML document with importmap, Tailwind CDN, and error boundary

### Auth

JWT sessions (jose) stored in HTTP-only cookies. Passwords hashed with bcrypt. Server actions in `src/actions/` handle signUp/signIn/signOut. Anonymous users can work without auth; their work is saved to sessionStorage (`anon-work-tracker.ts`) and transferred to a project on sign-in.

### State Management

Two React contexts drive the app:
- **ChatContext** (`lib/contexts/chat-context.tsx`): Messages, input, streaming status (wraps Vercel AI SDK `useChat`)
- **FileSystemContext** (`lib/contexts/file-system-context.tsx`): Virtual file system state, selected file, handles tool calls from AI

### Database

SQLite via Prisma. Two models: `User` (email, hashed password) and `Project` (name, messages as JSON string, file system data as JSON string, optional userId). Project data is denormalized — entire file tree and conversation stored as JSON blobs.

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## node-compat.cjs

Required via `NODE_OPTIONS` to delete `globalThis.localStorage/sessionStorage` on the server. Node.js 25+ exposes these globals, which breaks SSR guards in dependencies.

## Code Style

- Use comments sparingly. Only comment complex, non-obvious code.

## Testing

Tests live in `__tests__/` directories adjacent to source files. Vitest with jsdom environment, React Testing Library, and `vite-tsconfig-paths` for path resolution.

The database schema is defined in @prisma/schema.prisma