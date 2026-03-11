# Frontend — Claude Context

## Stack
React 18 + Vite + Ant Design 5 + Zustand + React Query

## Dev Proxy
`vite.config.js`: `/api` → `http://localhost:5000` — không cần CORS trong dev.

## State Management

| Store | File | Dữ liệu | Persist |
|-------|------|---------|---------|
| `useAuthStore` | `store/useStore.js` | token, user, isAuthenticated | localStorage |
| `useCartStore` | `store/useStore.js` | items[], totalPrice | localStorage |

Logout: phải gọi `clearAuth()` + `clearCart()` để xóa localStorage.

## Data Fetching
Dùng **React Query** cho mọi API calls — không dùng useState + useEffect cho server data.

```jsx
// Pattern chuẩn
const { data, isLoading, error } = useQuery({
  queryKey: ['products', { page, category }],
  queryFn: () => productAPI.getAll({ page, category }),
});
```

## API Layer (xem `api/CLAUDE.md`)
Tất cả API calls qua `src/api/index.js` — không import axios trực tiếp trong components.

## Routing (`App.jsx`)
- `/` — Home (public)
- `/shop` — Shop (public)
- `/products/:id` — ProductDetail (public)
- `/cart`, `/checkout`, `/profile`, `/orders` — (private, cần login)
- `/admin/*` — (private, cần role admin)

## Component Conventions
- Ant Design components ưu tiên hơn custom HTML
- `ProductCard.jsx` — component tái sử dụng cho mọi product grid
- Admin pages trong `pages/admin/`
- Layout components: `ClientLayout` (có Navbar+Footer), `AdminLayout` (sidebar)
