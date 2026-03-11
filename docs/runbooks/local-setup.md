# Runbook: Local Development Setup

## Prerequisites
- Node.js v18+
- MongoDB (local hoặc Atlas URI)
- Git

## Steps

### 1. Clone & Install
```bash
git clone <repo-url>
cd project-TTS-SMART-ECOMMERCE

# Backend
cd backend
npm install
cp .env.example .env
# → Điền MONGO_URI, JWT_SECRET, GEMINI_API_KEY, EMAIL_*, CLOUDINARY_*

# Frontend
cd ../frontend
npm install
```

### 2. Khởi động
```bash
# Terminal 1
cd backend && npm run dev
# → http://localhost:5000

# Terminal 2
cd frontend && npm run dev
# → http://localhost:5173
```

### 3. Tạo Admin đầu tiên
```js
// Dùng MongoDB Compass hoặc mongosh
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## API Keys cần thiết

| Key | Lấy tại |
|-----|---------|
| `GEMINI_API_KEY` | aistudio.google.com → Get API Key |
| `EMAIL_PASS` | Google Account → Security → App Passwords |
| `CLOUDINARY_*` | cloudinary.com → Dashboard |
