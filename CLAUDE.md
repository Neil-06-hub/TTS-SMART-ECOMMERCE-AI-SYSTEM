# SMART ECOMMERCE AI SYSTEM — Claude Context

## Project Overview
Full-stack e-commerce tích hợp AI (Google Gemini) cho gợi ý sản phẩm cá nhân hóa và tự động hóa Marketing Email.

## Architecture
- **Backend**: `backend/` — Node.js + Express REST API, port 5000
- **Frontend**: `frontend/` — React 18 + Vite SPA, port 5173
- **Database**: MongoDB (Mongoose ODM)
- **AI Layer**: Google Gemini 1.5 Flash qua `@google/generative-ai`
- **Storage**: Cloudinary (ảnh sản phẩm)
- Chi tiết đầy đủ → `docs/architecture.md`

## Key Conventions
- Vite proxy `/api` → `localhost:5000` (không cần CORS trong dev)
- JWT auth: token lưu trong Zustand persist (localStorage)
- Soft delete sản phẩm: `isActive: false` thay vì xóa thật
- Gemini response: strip markdown code blocks trước `JSON.parse()`
- Admin routes bảo vệ bởi middleware `protect` + `adminOnly`
- Wishlist: lưu trong `User.wishlist[]` (ObjectId refs), sync server ↔ `useWishlistStore` (localStorage) khi login qua `wishlistAPI.getIds()`
- Notifications: `createNotification(userId, {type, title, message, link})` — helper export từ `notification.controller.js`
- Discount Codes: model `DiscountCode` (type: percent/fixed, usageLimit, expiresAt), CRUD qua `/api/admin/discounts`
- User blocking: `User.isBlocked` — middleware `protect` tự check và trả 403 nếu bị khóa

## Run Commands
```bash
cd backend && npm run dev   # port 5000
cd frontend && npm run dev  # port 5173
```

## Required Env Vars
Xem `backend/.env.example` — cần: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `EMAIL_USER`, `EMAIL_PASS`, `CLOUDINARY_*`

## Documentation
- `docs/architecture.md` — Kiến trúc hệ thống chi tiết
- `docs/decisions/` — Các quyết định kỹ thuật (ADR)
- `docs/runbooks/` — Hướng dẫn vận hành

## Sub-module Context
- `backend/CLAUDE.md` — API routes (7 routes), models, services, cron jobs, notification helper
- `backend/services/CLAUDE.md` — AI & Email services
- `frontend/src/api/CLAUDE.md` — Axios API layer (7 modules: auth, product, order, ai, wishlist, notification, admin)
- `frontend/src/CLAUDE.md` — Components, pages, state (3 stores: auth, cart, wishlist)
