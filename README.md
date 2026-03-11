# SMART ECOMMERCE AI SYSTEM

Hệ thống thương mại điện tử thông minh tích hợp **gợi ý sản phẩm cá nhân hóa**, **tự động hóa Marketing Email**, **Wishlist**, **Thông báo in-app** và **Quản lý mã giảm giá** bằng AI (Google Gemini).

---

## Cấu trúc dự án

```
project/
├── backend/
│   ├── config/               # DB, Cloudinary config
│   ├── controllers/          # Business logic
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── ai.controller.js
│   │   ├── admin.controller.js    # + updateUser, deleteUser, toggleBlockUser
│   │   ├── wishlist.controller.js
│   │   ├── notification.controller.js
│   │   └── discount.controller.js
│   ├── middleware/
│   │   └── auth.js           # protect, adminOnly, isBlocked check
│   ├── models/
│   │   ├── User.js           # + wishlist[], isBlocked
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Activity.js
│   │   ├── Notification.js
│   │   ├── DiscountCode.js
│   │   └── MarketingLog.js
│   ├── routes/               # 8 route files
│   ├── services/             # AI, Email, Marketing services
│   ├── jobs/                 # Cron jobs
│   ├── seed.js               # Seed sản phẩm mẫu
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/              # Axios API layer (7 modules)
        ├── components/layout/
        │   ├── Navbar.jsx    # Cart + Wishlist + Notification icons
        │   ├── WishlistDrawer.jsx   # Popover dropdown ❤️
        │   └── NotificationDrawer.jsx  # Popover dropdown 🔔
        ├── pages/
        │   ├── Home, Shop, ProductDetail, Cart, Checkout
        │   ├── Profile, OrderHistory, AISuggest, About, Wishlist
        │   └── admin/
        │       ├── Dashboard.jsx
        │       ├── Products.jsx
        │       ├── Orders.jsx     # 3 tabs
        │       ├── Users.jsx      # edit/block/delete
        │       ├── Discounts.jsx
        │       └── Marketing.jsx
        └── store/            # useAuthStore, useCartStore, useWishlistStore
```

---

## Cài đặt & Chạy

### Yêu cầu
- Node.js v18+
- MongoDB (local hoặc Atlas)

### Backend
```bash
cd backend && npm install
cp .env.example .env   # điền các biến môi trường
npm run dev            # http://localhost:5000
```

### Frontend
```bash
cd frontend && npm install
npm run dev            # http://localhost:5173
```

### Seed dữ liệu mẫu (tùy chọn)
```bash
cd backend && node seed.js   # Tạo 8 sản phẩm mẫu
```

---

## Cấu hình .env (backend)

```env
MONGO_URI=mongodb://localhost:27017/smart-ecommerce
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Gemini API Key (miễn phí):** [aistudio.google.com](https://aistudio.google.com) → Get API Key

**Gmail App Password:** Google Account → Security → 2-Step Verification → App passwords

**Cloudinary (miễn phí):** [cloudinary.com](https://cloudinary.com) → Dashboard

---

## Tài khoản Admin

```bash
cd backend
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const hash = await bcrypt.hash('123456', 12);
  await User.findOneAndUpdate(
    { email: 'admin@smartshop.ai' },
    { name: 'Admin', email: 'admin@smartshop.ai', password: hash, role: 'admin' },
    { upsert: true, new: true }
  );
  console.log('Admin: admin@smartshop.ai / 123456');
  process.exit();
});
"
```

Đăng nhập tại `http://localhost:5173/login` → vào `/admin/dashboard`.

---

## Tính năng

### Trang Client

| Tính năng | Route |
|-----------|-------|
| Trang chủ + AI Gợi ý | `/` |
| Cửa hàng (tìm kiếm, lọc, sắp xếp) | `/shop` |
| Chi tiết sản phẩm + Reviews + Sản phẩm tương tự | `/products/:id` |
| AI Stylist (cá nhân hóa sở thích) | `/ai-suggest` |
| Giỏ hàng | `/cart` |
| Thanh toán (COD / Banking / MoMo) | `/checkout` |
| Lịch sử đơn hàng | `/orders` |
| Danh sách yêu thích | `/wishlist` |
| Hồ sơ cá nhân | `/profile` |

**Header Navbar:** Icon ❤️ Wishlist dropdown + Icon 🔔 Notifications dropdown.

### Trang Admin

| Trang | Route | Chức năng |
|-------|-------|-----------|
| Dashboard | `/admin/dashboard` | KPIs, biểu đồ 12 tháng, AI phân tích kinh doanh |
| Sản phẩm | `/admin/products` | CRUD đầy đủ, upload ảnh Cloudinary |
| Đơn hàng | `/admin/orders` | 3 tabs: Chờ xử lý / Đang giao / Lịch sử |
| Khách hàng | `/admin/users` | Xem, Sửa thông tin, Khóa/Mở khóa, Xóa tài khoản |
| Mã giảm giá | `/admin/discounts` | Tạo/Sửa/Xóa mã %, fixed, giới hạn dùng, ngày hết hạn |
| Marketing AI | `/admin/marketing` | Trigger campaigns thủ công, xem lịch sử gửi email |

---

## AI & Automation

### Gợi ý sản phẩm
- **Content-based:** gợi ý theo tags/category tương tự
- **Collaborative Filtering:** gợi ý theo hành vi người dùng giống nhau
- **AI Stylist:** người dùng nhập sở thích → AI trả về sản phẩm phù hợp

### Marketing Email Automation

| Trigger | Điều kiện | Lịch chạy |
|---------|-----------|-----------|
| Chào mừng | Tài khoản mới đăng ký | Ngay lập tức |
| Giỏ hàng bỏ quên | Sau 24h không checkout | Cron mỗi giờ |
| Newsletter | Sản phẩm hot tuần | Thứ Hai 9:00 AM |

### Thông báo In-app (6 loại)

| Loại | Kích hoạt khi |
|------|--------------|
| `order` | Đặt hàng / Admin cập nhật trạng thái đơn |
| `new_product` | Admin thêm sản phẩm mới khớp preferences |
| `promotion` | Admin kích hoạt chiến dịch marketing |
| `system` | Đăng ký tài khoản thành công |
| `wishlist` | Sản phẩm yêu thích thay đổi trạng thái |
| `ai` | Gợi ý AI cá nhân hóa |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Ant Design 5, Zustand, React Query |
| Backend | Node.js 18, Express, JWT, bcryptjs |
| Database | MongoDB Atlas / Local, Mongoose ODM |
| AI | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| Storage | Cloudinary (`multer-storage-cloudinary`) |
| Email | Nodemailer + Gmail SMTP |
| Scheduler | node-cron |

---

## API Endpoints

```
# Auth
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/change-password

# Products
GET    /api/products
GET    /api/products/featured
GET    /api/products/categories
GET    /api/products/:id
POST   /api/products/:id/reviews

# Orders
POST   /api/orders
GET    /api/orders/my
GET    /api/orders/:id
PUT    /api/orders/:id/cancel

# AI
GET    /api/ai/recommendations
POST   /api/ai/track

# Wishlist
GET    /api/wishlist
GET    /api/wishlist/ids
POST   /api/wishlist/:productId
DELETE /api/wishlist/:productId

# Notifications
GET    /api/notifications
PUT    /api/notifications/read-all
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id

# Admin — Products
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id

# Admin — Orders
GET    /api/admin/orders
PUT    /api/admin/orders/:id/status

# Admin — Users
GET    /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
PATCH  /api/admin/users/:id/toggle-block

# Admin — Discounts
GET    /api/admin/discounts
POST   /api/admin/discounts
PUT    /api/admin/discounts/:id
DELETE /api/admin/discounts/:id
PATCH  /api/admin/discounts/:id/toggle

# Admin — Dashboard & Marketing
GET    /api/admin/dashboard
GET    /api/admin/dashboard/ai-analysis
GET    /api/admin/marketing/logs
POST   /api/admin/marketing/trigger
```
