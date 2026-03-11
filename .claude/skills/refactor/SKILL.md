# Skill: Refactor

Hướng dẫn refactor code trong Smart Ecommerce AI System.

## Patterns chuẩn

### Backend Controller Pattern
```js
// controllers/example.controller.js
export const getItems = async (req, res) => {
  try {
    const items = await Model.find({ isActive: true });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Service Pattern (AI/Email)
```js
// services/example.service.js
export const doSomething = async (params) => {
  // Pure logic, không có req/res
  // Throw error nếu fail, để controller catch
};
```

### Frontend API Pattern
```js
// api/index.js — thêm vào module tương ứng
export const exampleAPI = {
  getAll: (params) => api.get('/example', { params }),
  create: (data) => api.post('/example', data),
};
```

### React Query Pattern
```jsx
const { data, isLoading, error } = useQuery({
  queryKey: ['items', filters],
  queryFn: () => exampleAPI.getAll(filters),
});
```

## Khi Refactor
1. Đọc file hiện tại trước khi sửa
2. Giữ nguyên interface (tên hàm, params) nếu đã được dùng ở nơi khác
3. Không thêm abstraction thừa — 3 dòng tương tự tốt hơn 1 helper dùng 1 lần
4. Cập nhật CLAUDE.md của sub-module nếu thay đổi convention
