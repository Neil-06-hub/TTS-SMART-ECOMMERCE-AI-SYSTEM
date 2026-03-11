# System Architecture

## High-Level Overview

```
[Browser / React SPA]
        │  HTTP /api/*
        ▼
[Express Server :5000]
        │
   ┌────┴────────────────────────┐
   │                             │
[MongoDB]              [External Services]
   │                    ├── Google Gemini API
[Mongoose ODM]          ├── Cloudinary (images)
                        ├── Gmail SMTP (email)
                        └── Node-cron (scheduler)
```

## Backend Structure

```
backend/
├── server.js              # Entry point, Express setup
├── config/
│   ├── db.js              # MongoDB connection (Mongoose)
│   └── cloudinary.js      # Cloudinary SDK config
├── middleware/
│   └── auth.js            # protect (JWT verify), adminOnly
├── models/
│   ├── User.js            # role: 'user'|'admin', emailConsent
│   ├── Product.js         # isActive (soft delete), tags[]
│   ├── Order.js           # status: pending|paid|shipped|delivered
│   ├── Activity.js        # user behavior tracking (views, purchases)
│   └── MarketingLog.js    # email campaign logs
├── controllers/           # Business logic, tách khỏi routes
├── routes/                # Express Router, map URL → controller
├── services/              # Tái sử dụng logic phức tạp
│   ├── gemini.service.js       # Gọi Gemini API
│   ├── recommendation.service.js # Content-based + Collaborative
│   ├── marketing.service.js    # Tạo nội dung email bằng AI
│   └── email.service.js        # Gửi email qua Nodemailer
└── jobs/
    └── marketing.cron.js  # Cron: abandoned cart (hourly), newsletter (Mon 9AM)
```

## Frontend Structure

```
frontend/src/
├── api/
│   └── index.js           # Axios instance + API modules (authAPI, productAPI, ...)
├── store/
│   └── useStore.js        # Zustand: useAuthStore, useCartStore (persisted)
├── components/
│   ├── layout/            # Navbar, Footer, ClientLayout, AdminLayout
│   └── product/           # ProductCard
├── pages/
│   ├── (client)           # Home, Shop, ProductDetail, Cart, Checkout, Profile, OrderHistory
│   └── admin/             # Dashboard, Products, Orders, Users, Marketing
├── App.jsx                # React Router v6 routes
└── main.jsx               # Vite entry, QueryClient, Zustand
```

## Data Flow: AI Recommendation

```
User views product
       │
       ▼
Activity.create({ userId, productId, type: 'view' })
       │
       ▼
GET /api/ai/recommendations/:productId
       │
  ┌────┴──────────────────────┐
  │                           │
Content-based             Collaborative
($setIntersection tags)   (find similar users via Activity)
  │                           │
  └────────────┬──────────────┘
               ▼
       Merged & deduplicated
               ▼
       Frontend ProductCard grid
```

## Data Flow: Marketing Automation

```
[Cron Job - Hourly]
     │
     ▼
Find users: cart not empty + last activity > 24h
     │
     ▼
gemini.service → generate personalized email content
     │
     ▼
email.service → send via Nodemailer (Gmail SMTP)
     │
     ▼
MarketingLog.create({ userId, type, status })
```

## API Endpoints Summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | - | Đăng ký + gửi welcome email |
| POST | /api/auth/login | - | Đăng nhập, trả JWT |
| GET | /api/products | - | Danh sách SP (filter, search, paginate) |
| POST | /api/products | Admin | Tạo SP mới |
| GET | /api/ai/recommendations/:id | User | Gợi ý SP tương tự |
| GET | /api/ai/analysis | Admin | Phân tích doanh thu bằng AI |
| POST | /api/admin/marketing/send | Admin | Gửi campaign thủ công |
