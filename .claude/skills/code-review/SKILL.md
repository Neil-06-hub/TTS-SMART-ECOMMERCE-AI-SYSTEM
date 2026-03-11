# Skill: Code Review

Review code trong project Smart Ecommerce AI System.

## Checklist

### Security
- [ ] Không có secrets/API keys hardcoded
- [ ] Input validation trên tất cả route params và body
- [ ] JWT middleware `protect` áp dụng đúng cho protected routes
- [ ] `adminOnly` áp dụng cho tất cả admin routes
- [ ] Không có SQL/NoSQL injection (dùng Mongoose validators)

### Backend (Node.js/Express)
- [ ] Controllers tách biệt logic khỏi routes
- [ ] Async/await với try-catch hoặc asyncHandler
- [ ] Response format nhất quán: `{ success, data, message }`
- [ ] Soft delete: query có `isActive: true` cho products
- [ ] Gemini response được strip markdown trước JSON.parse()

### Frontend (React)
- [ ] API calls đi qua `src/api/index.js`, không gọi axios trực tiếp
- [ ] Auth state dùng `useAuthStore`, cart dùng `useCartStore`
- [ ] Server state dùng React Query, không useState cho API data
- [ ] Loading và error states được xử lý
- [ ] Admin pages được bảo vệ bởi route guard

### Performance
- [ ] MongoDB queries có index trên fields thường query (email, isActive, tags)
- [ ] React Query cache được tận dụng, không refetch không cần thiết
- [ ] Cloudinary upload có size limit

## How to Use
Khi review PR hoặc file, chạy qua checklist trên và comment cụ thể dòng nào vi phạm.
