# API Layer — Claude Context

## File: `src/api/index.js`

Tất cả HTTP calls đi qua file này. Không gọi `axios` trực tiếp trong components/pages.

## Axios Instance
```js
const api = axios.create({ baseURL: '/api', timeout: 30000 });

// Request interceptor: tự động đính token từ localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: redirect /login nếu 401
```

## API Modules

### authAPI
```js
authAPI.register(data)            // POST /auth/register
authAPI.login(data)               // POST /auth/login
authAPI.getMe()                   // GET  /auth/me
authAPI.updateProfile(data)       // PUT  /auth/profile
authAPI.changePassword(data)      // PUT  /auth/change-password
```

### productAPI
```js
productAPI.getAll(params)         // GET /products?page=&category=&search=&sort=
productAPI.getById(id)            // GET /products/:id
productAPI.getFeatured()          // GET /products/featured
productAPI.getCategories()        // GET /products/categories
productAPI.addReview(id, data)    // POST /products/:id/reviews
```

### orderAPI
```js
orderAPI.create(data)             // POST /orders
orderAPI.getMy()                  // GET  /orders/my
orderAPI.getById(id)              // GET  /orders/:id
orderAPI.cancel(id)               // PUT  /orders/:id/cancel
```

### aiAPI
```js
aiAPI.getRecommendations()        // GET  /ai/recommendations  → { products, type, message }
aiAPI.trackActivity(data)         // POST /ai/track  → { productId, action }
```

### wishlistAPI
```js
wishlistAPI.get()                 // GET    /wishlist           → { wishlist: Product[] }
wishlistAPI.getIds()              // GET    /wishlist/ids       → { wishlistIds: string[] }
wishlistAPI.toggle(productId)     // POST   /wishlist/:id       → { added: bool, wishlistIds }
wishlistAPI.remove(productId)     // DELETE /wishlist/:id
```

### notificationAPI
```js
notificationAPI.getAll()          // GET /notifications  → { notifications, unreadCount }
notificationAPI.readAll()         // PUT /notifications/read-all
notificationAPI.readOne(id)       // PUT /notifications/:id/read
notificationAPI.deleteOne(id)     // DELETE /notifications/:id
```

### adminAPI
```js
// Dashboard
adminAPI.getDashboard()           // GET /admin/dashboard
adminAPI.getAIAnalysis()          // GET /admin/dashboard/ai-analysis
// Products (multipart/form-data)
adminAPI.getProducts(params)      // GET    /admin/products
adminAPI.createProduct(formData)  // POST   /admin/products
adminAPI.updateProduct(id, data)  // PUT    /admin/products/:id
adminAPI.deleteProduct(id)        // DELETE /admin/products/:id
// Orders
adminAPI.getOrders(params)        // GET /admin/orders
adminAPI.updateOrderStatus(id, data) // PUT /admin/orders/:id/status
// Users
adminAPI.getUsers()               // GET    /admin/users
adminAPI.updateUser(id, data)     // PUT    /admin/users/:id
adminAPI.deleteUser(id)           // DELETE /admin/users/:id
adminAPI.toggleBlockUser(id)      // PATCH  /admin/users/:id/toggle-block
// Discounts
adminAPI.getDiscounts()           // GET    /admin/discounts
adminAPI.createDiscount(data)     // POST   /admin/discounts
adminAPI.updateDiscount(id, data) // PUT    /admin/discounts/:id
adminAPI.deleteDiscount(id)       // DELETE /admin/discounts/:id
adminAPI.toggleDiscount(id)       // PATCH  /admin/discounts/:id/toggle
// Marketing
adminAPI.getMarketingLogs(params) // GET  /admin/marketing/logs
adminAPI.triggerMarketing(type)   // POST /admin/marketing/trigger
```

## Error Handling
API errors trả về `{ success: false, message: '...' }`.
React Query tự catch và expose qua `error.response.data.message`.
401 response → interceptor tự redirect về `/login`.
