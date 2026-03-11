# API Layer — Claude Context

## File: `src/api/index.js`

Tất cả HTTP calls đi qua file này. Không gọi `axios` trực tiếp trong components/pages.

## Axios Instance
```js
const api = axios.create({ baseURL: '/api' });

// Request interceptor: tự động đính token
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## API Modules

### authAPI
```js
authAPI.register(data)   // POST /auth/register
authAPI.login(data)      // POST /auth/login
authAPI.getProfile()     // GET  /auth/profile
```

### productAPI
```js
productAPI.getAll(params)    // GET /products?page=&category=&search=
productAPI.getById(id)       // GET /products/:id
productAPI.create(formData)  // POST /products (admin, multipart)
productAPI.update(id, data)  // PUT /products/:id (admin)
productAPI.delete(id)        // DELETE /products/:id (admin, soft delete)
```

### orderAPI
```js
orderAPI.create(data)        // POST /orders
orderAPI.getMyOrders()       // GET /orders/my
orderAPI.getAll()            // GET /orders (admin)
orderAPI.updateStatus(id, status) // PUT /orders/:id/status (admin)
```

### aiAPI
```js
aiAPI.getRecommendations(productId)  // GET /ai/recommendations/:id
aiAPI.getAnalysis()                  // GET /ai/analysis (admin)
```

### adminAPI
```js
adminAPI.getStats()               // GET /admin/stats
adminAPI.getUsers()               // GET /admin/users
adminAPI.sendMarketing(data)      // POST /admin/marketing/send
adminAPI.getMarketingLogs()       // GET /admin/marketing/logs
```

## Error Handling
API errors trả về `{ success: false, message: '...' }`.
React Query tự catch và expose qua `error.response.data.message`.
