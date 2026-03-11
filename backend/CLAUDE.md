# Backend — Claude Context

## Stack
Node.js + Express + MongoDB (Mongoose) + JWT

## Entry Point
`server.js` — khởi tạo Express, connect MongoDB, mount routes, start cron jobs

## Route → Controller Map

| Route file | Controller | Prefix |
|-----------|-----------|--------|
| `routes/auth.routes.js` | `auth.controller.js` | `/api/auth` |
| `routes/product.routes.js` | `product.controller.js` | `/api/products` |
| `routes/order.routes.js` | `order.controller.js` | `/api/orders` |
| `routes/ai.routes.js` | `ai.controller.js` | `/api/ai` |
| `routes/admin.routes.js` | `admin.controller.js` | `/api/admin` |
| `routes/wishlist.routes.js` | `wishlist.controller.js` | `/api/wishlist` |
| `routes/notification.routes.js` | `notification.controller.js` | `/api/notifications` |
| `routes/discount.routes.js` | `discount.controller.js` | `/api/admin/discounts` |

## Middleware
```
protect        → verify JWT, attach req.user
adminOnly      → check req.user.role === 'admin'
multer upload  → xử lý file upload (Cloudinary)
```

## Models

| Model | Key Fields |
|-------|-----------|
| `User` | name, email, password(hashed), role(customer/admin), avatar, phone, address, dob, gender, preferences[], wishlist[], **isBlocked**, cartAbandonedAt, cartAbandonedNotified |
| `Product` | name, description, price, originalPrice, category, tags[], image(string), stock, sold, reviews[], rating, numReviews, featured, isActive |
| `Order` | user(ref), items[], shippingAddress, paymentMethod(COD/banking/momo), paymentStatus, orderStatus(pending/confirmed/shipping/delivered/cancelled), subtotal, shippingFee, discount, totalAmount, note |
| `Activity` | user(ref), product(ref), action(view/add_cart/purchase/remove_cart) |
| `MarketingLog` | type, recipient, recipientName, subject, content, status, aiGenerated |
| `Notification` | user(ref), type(order/wishlist/promotion/system/new_product/ai), title, message, link, isRead |
| `DiscountCode` | code(unique,uppercase), type(percent/fixed), value, minOrderAmount, maxDiscount, usageLimit, usedCount, isActive, expiresAt, description |

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
- User blocking: `protect` middleware check `req.user.isBlocked` → 403 nếu bị khóa (admin không bị ảnh hưởng)
- Admin user management: `updateUser`, `deleteUser` (không cho xóa admin), `toggleBlockUser` trong `admin.controller.js`
- Notification helper: import `createNotification` từ `./notification.controller` vào bất kỳ controller nào cần tạo thông báo
  ```js
  const { createNotification } = require("./notification.controller");
  createNotification(userId, { type, title, message, link });
  // type: 'order' | 'wishlist' | 'promotion' | 'system' | 'new_product' | 'ai'
  ```
