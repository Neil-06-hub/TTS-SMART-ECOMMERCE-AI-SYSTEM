# 🛍️ SMART ECOMMERCE AI SYSTEM

Hệ thống thương mại điện tử thông minh tích hợp **gợi ý sản phẩm cá nhân hóa** và **tự động hóa Marketing** bằng AI (Google Gemini).

---

## 🏗️ Cấu trúc dự án

```
project/
├── backend/                   # Node.js + Express API
│   ├── config/               # DB, Cloudinary config
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth middleware
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── services/             # AI, Email, Marketing services
│   ├── jobs/                 # Cron jobs
│   ├── .env.example
│   └── server.js
│
└── frontend/                  # React + Vite
    ├── src/
    │   ├── api/              # Axios API calls
    │   ├── components/       # UI Components
    │   ├── pages/            # Pages (Client + Admin)
    │   ├── store/            # Zustand state management
    │   └── App.jsx
    └── .env.example
```

---

## ⚙️ Cài đặt & Chạy dự án

### Bước 1: Chuẩn bị môi trường

Cần cài đặt sẵn:
- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **MongoDB** (local hoặc MongoDB Atlas)
- **Git**

### Bước 2: Cấu hình Backend

```bash
cd backend
npm install
cp .env.example .env
```

Chỉnh sửa file `.env` với các thông tin:

```env
# Bắt buộc
MONGO_URI=mongodb://localhost:27017/smart-ecommerce
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key       # Lấy tại: aistudio.google.com

# Email (tùy chọn - cần để Marketing hoạt động)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password       # Xem hướng dẫn bên dưới

# Cloudinary (tùy chọn - cần để upload ảnh)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Bước 3: Cấu hình Frontend

```bash
cd frontend
npm install
```

### Bước 4: Chạy dự án

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server chạy tại: http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App chạy tại: http://localhost:5173
```

---

## 🔑 Lấy API Keys

### 1. Gemini API Key (Miễn phí)
1. Truy cập [aistudio.google.com](https://aistudio.google.com)
2. Đăng nhập bằng Google Account
3. Vào "Get API Key" → "Create API key"
4. Dán vào `GEMINI_API_KEY` trong `.env`

### 2. Gmail App Password (cho Email)
1. Bật **2-Step Verification** trên Gmail
2. Vào Google Account → Security → App passwords
3. Tạo app password cho "Mail"
4. Dán vào `EMAIL_PASS` trong `.env`

### 3. Cloudinary (Miễn phí)
1. Đăng ký tại [cloudinary.com](https://cloudinary.com)
2. Lấy Cloud name, API Key, API Secret từ Dashboard
3. Điền vào `.env`

---

## 👥 Tài khoản mặc định

Tạo admin đầu tiên bằng cách thêm trực tiếp vào MongoDB:

```js
// Dùng MongoDB Compass hoặc mongosh
db.users.insertOne({
  name: "Admin",
  email: "admin@smartshop.vn",
  password: "$2a$12$...",  // hash của "admin123"
  role: "admin",
  createdAt: new Date()
})
```

Hoặc đăng ký bình thường qua app, sau đó update role thành "admin" trong DB.

---

## 🤖 Tính năng AI

| Tính năng | Mô tả |
|-----------|-------|
| **Content-based Recommendation** | Gợi ý sản phẩm tương tự dựa trên tags |
| **Collaborative Filtering** | Gợi ý theo hành vi người dùng tương tự |
| **Marketing Email** | AI tự động viết email cá nhân hóa |
| **Business Analysis** | AI phân tích doanh thu và đề xuất chiến lược |
| **Newsletter** | AI tạo nội dung newsletter tuần |

## 📧 Marketing Automation

| Trigger | Điều kiện | Lịch chạy |
|---------|-----------|-----------|
| Email chào mừng | Khách hàng mới đăng ký | Ngay lập tức |
| Giỏ hàng bỏ quên | Sau 24h không checkout | Mỗi giờ (cron) |
| Newsletter | Sản phẩm hot nhất tuần | Thứ Hai 9:00 AM |

---

## 📱 Giao diện

- **Trang chủ**: `/` - Banner, AI recommendations, sản phẩm nổi bật
- **Cửa hàng**: `/shop` - Tìm kiếm, lọc, phân trang
- **Chi tiết SP**: `/products/:id` - Info, reviews, AI similar products
- **Giỏ hàng**: `/cart`
- **Thanh toán**: `/checkout`
- **Admin**: `/admin/dashboard`, `/admin/products`, `/admin/orders`, `/admin/marketing`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Ant Design 5, Zustand, React Query |
| Backend | Node.js, Express, JWT |
| Database | MongoDB, Mongoose |
| AI | Google Gemini 1.5 Flash |
| Storage | Cloudinary |
| Email | Nodemailer + Gmail |
| Scheduler | Node-cron |
