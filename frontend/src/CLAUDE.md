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
| `useWishlistStore` | `store/useStore.js` | items[] (productIds string), isWishlisted() | localStorage |

Logout: phải gọi `logout()` + `clearCart()` + `clearWishlist()` để xóa localStorage.

Wishlist sync: `App.jsx` có `useEffect` theo dõi `isAuthenticated` → gọi `wishlistAPI.getIds()` → `setItems()` khi login, `clearWishlist()` khi logout.

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
- `/ai-suggest` — AI Stylist (public, cần login để xem kết quả)
- `/about` — Về chúng tôi (public)
- `/cart` — Giỏ hàng (public)
- `/checkout`, `/profile`, `/orders`, `/wishlist` — (private, cần login)
- `/admin/dashboard`, `/admin/products`, `/admin/orders`, `/admin/users`, `/admin/discounts`, `/admin/marketing` — (private, cần role admin)

## Component Conventions
- Ant Design components ưu tiên hơn custom HTML
- `ProductCard.jsx` — component tái sử dụng cho mọi product grid, bao gồm heart toggle wishlist
- Admin pages trong `pages/admin/`
- Layout components: `ClientLayout` (có Navbar+Footer), `AdminLayout` (sidebar)
- `WishlistDrawer.jsx` — Popover dropdown wishlist (tự quản lý state open/close, bao gồm trigger icon ❤️)
- `NotificationDrawer.jsx` — Popover dropdown notifications (tự quản lý state, poll 30s khi mở, bao gồm trigger icon 🔔)
