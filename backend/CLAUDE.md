# Backend — Claude Context

## Stack
Node.js + Express + MongoDB (Mongoose) + JWT

## Entry Point
`server.js` — khởi tạo Express, connect MongoDB, mount routes, start cron jobs

## Route → Controller Map

| Route file | Controller | Prefix |
|-----------|-----------|--------|
| `routes/auth.js` | `auth.controller.js` | `/api/auth` |
| `routes/product.js` | `product.controller.js` | `/api/products` |
| `routes/order.js` | `order.controller.js` | `/api/orders` |
| `routes/ai.js` | `ai.controller.js` | `/api/ai` |
| `routes/admin.js` | `admin.controller.js` | `/api/admin` |

## Middleware
```
protect        → verify JWT, attach req.user
adminOnly      → check req.user.role === 'admin'
multer upload  → xử lý file upload (Cloudinary)
```

## Models

| Model | Key Fields |
|-------|-----------|
| `User` | name, email, password(hashed), role, cart[], emailConsent |
| `Product` | name, price, category, tags[], images[], isActive, stock |
| `Order` | user(ref), items[], totalAmount, status, paymentStatus |
| `Activity` | user(ref), product(ref), type('view'\|'purchase'), createdAt |
| `MarketingLog` | userId, type, status, sentAt |

## Services (xem `services/CLAUDE.md`)
- `gemini.service.js` — Gọi Gemini API, parse response
- `recommendation.service.js` — Content-based + Collaborative filtering
- `marketing.service.js` — Tạo email content bằng AI
- `email.service.js` — Gửi email qua Nodemailer

## Cron Jobs (`jobs/marketing.cron.js`)
- `0 * * * *` — Abandoned cart emails
- `0 9 * * 1` — Weekly newsletter (Thứ Hai 9AM)

## Conventions
- Response format: `{ success: true/false, data: {}, message: '' }`
- Lỗi: `res.status(400/401/403/404/500).json({ success: false, message })`
- Soft delete: `isActive: false` (không xóa thật)
- Async: dùng `try/catch` trong mọi async controller
