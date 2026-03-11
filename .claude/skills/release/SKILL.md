# Skill: Release Checklist

Checklist trước khi deploy Smart Ecommerce AI System lên production.

## Pre-release

### Environment Variables
- [ ] `backend/.env` có đủ tất cả required vars (xem `.env.example`)
- [ ] `MONGO_URI` trỏ đến production DB (Atlas)
- [ ] `JWT_SECRET` là string ngẫu nhiên mạnh (>32 chars)
- [ ] `GEMINI_API_KEY` còn hạn và đủ quota
- [ ] `EMAIL_USER` + `EMAIL_PASS` là Gmail App Password (không phải password thường)
- [ ] `CLOUDINARY_*` là production credentials

### Code
- [ ] Không có `console.log` debug thừa trong production code
- [ ] Không có hardcoded `localhost` URLs trong frontend
- [ ] Frontend `.env` có `VITE_API_URL` đúng nếu deploy riêng
- [ ] `npm run build` frontend chạy không lỗi

### Database
- [ ] MongoDB Atlas whitelist IP của server
- [ ] Indexes đã tạo: `User.email`, `Product.isActive`, `Product.tags`
- [ ] Backup DB trước khi migrate

### Security
- [ ] `.env` không được commit lên git (kiểm tra `.gitignore`)
- [ ] CORS origin trong `server.js` đúng domain production
- [ ] Rate limiting được bật cho auth routes

## Deploy Steps
```bash
# Backend (ví dụ: Railway/Render)
cd backend
npm install --production
npm start

# Frontend (ví dụ: Vercel/Netlify)
cd frontend
npm run build
# Upload dist/ hoặc connect git repo
```

## Post-deploy Verification
- [ ] Đăng ký tài khoản mới → nhận welcome email
- [ ] Thêm sản phẩm vào giỏ → có trong cart sau reload
- [ ] AI recommendation hoạt động tại trang chi tiết SP
- [ ] Admin dashboard load được dữ liệu
