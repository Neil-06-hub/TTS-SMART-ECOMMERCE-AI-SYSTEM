# UIGen

AI-powered React component generator with live preview. Describe components in natural language, watch them get generated and previewed in real-time using Claude AI.

## Prerequisites

- Node.js 18+ (hỗ trợ Node.js 25+ với compatibility fix tự động)
- npm

## Setup

1. Clone repo và tạo file `.env`:

```bash
cp .env.example .env
```

Hoặc tạo file `.env` với nội dung:

```
ANTHROPIC_API_KEY=your-api-key-here
```

> **Note:** Project vẫn chạy được mà không cần API key — sẽ trả về static code thay vì gọi AI.

2. Cài đặt dependencies và khởi tạo database:

```bash
npm run setup
```

Lệnh này sẽ:
- Cài tất cả dependencies
- Generate Prisma client
- Chạy database migrations (SQLite)

## Commands

```bash
npm run dev        # Dev server (Turbopack) tại http://localhost:3000
npm run build      # Build production
npm run start      # Chạy production server
npm run lint       # ESLint
npm run test       # Chạy test (Vitest)
npm run setup      # Cài đặt + Prisma generate + migrate
npm run db:reset   # Xóa và tạo lại database
```

## Project Structure

```
src/
├── app/                  # Next.js App Router (routes, API, layouts)
│   ├── api/chat/         # Streaming AI chat endpoint
│   └── [projectId]/      # Project detail page
├── actions/              # Server actions (auth, project CRUD)
├── components/
│   ├── auth/             # Sign in/up forms
│   ├── chat/             # Chat interface, message list, input
│   ├── editor/           # Monaco code editor, file tree
│   ├── preview/          # Live preview iframe
│   └── ui/               # Shadcn/ui components
├── hooks/                # Custom React hooks
└── lib/
    ├── contexts/         # ChatContext, FileSystemContext
    ├── prompts/          # System prompt cho Claude
    ├── tools/            # AI tools (str_replace_editor, file_manager)
    ├── transform/        # JSX transformation + import map
    ├── auth.ts           # JWT session management
    ├── file-system.ts    # Virtual file system (in-memory)
    └── provider.ts       # AI model provider (Claude / Mock)
```

## Usage

1. Đăng ký tài khoản hoặc sử dụng ở chế độ anonymous
2. Mô tả React component bạn muốn tạo trong chat
3. Xem component được generate real-time trong Preview
4. Chuyển sang tab Code để xem và chỉnh sửa code
5. Tiếp tục chat với AI để refine component

## Features

- AI-powered component generation using Claude
- Live preview with hot reload
- Monaco code editor with syntax highlighting
- Virtual file system (không ghi file ra disk)
- Project persistence cho registered users
- Anonymous mode — làm việc không cần đăng nhập, lưu lại khi đăng ký

## Tech Stack

- **Next.js 15** — App Router, Server Actions, Turbopack
- **React 19** — Latest with automatic JSX runtime
- **TypeScript 5**
- **Tailwind CSS v4**
- **Prisma** — ORM với SQLite
- **Vercel AI SDK** — Streaming AI responses
- **@ai-sdk/anthropic** — Claude integration
- **Monaco Editor** — Code editing
- **Babel Standalone** — JSX transformation in browser
- **Shadcn/ui** — UI components (Radix UI)
- **jose** — JWT authentication
- **bcrypt** — Password hashing
