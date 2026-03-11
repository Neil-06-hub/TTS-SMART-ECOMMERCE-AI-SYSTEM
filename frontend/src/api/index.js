import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Gắn token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý lỗi 401 (token hết hạn)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get("/products/featured"),
  getCategories: () => api.get("/products/categories"),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getMy: () => api.get("/orders/my"),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// AI APIs
export const aiAPI = {
  getRecommendations: () => api.get("/ai/recommendations"),
  trackActivity: (data) => api.post("/ai/track", data),
};

// Wishlist APIs
export const wishlistAPI = {
  get: () => api.get("/wishlist"),
  getIds: () => api.get("/wishlist/ids"),
  toggle: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get("/notifications"),
  readAll: () => api.put("/notifications/read-all"),
  readOne: (id) => api.put(`/notifications/${id}/read`),
  deleteOne: (id) => api.delete(`/notifications/${id}`),
};

// Admin APIs
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get("/admin/dashboard"),
  getAIAnalysis: () => api.get("/admin/dashboard/ai-analysis"),
  // Products
  getProducts: (params) => api.get("/admin/products", { params }),
  createProduct: (data) => api.post("/admin/products", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  // Orders
  getOrders: (params) => api.get("/admin/orders", { params }),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  // Users
  getUsers: () => api.get("/admin/users"),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleBlockUser: (id) => api.patch(`/admin/users/${id}/toggle-block`),
  // Discounts
  getDiscounts: () => api.get("/admin/discounts"),
  createDiscount: (data) => api.post("/admin/discounts", data),
  updateDiscount: (id, data) => api.put(`/admin/discounts/${id}`, data),
  deleteDiscount: (id) => api.delete(`/admin/discounts/${id}`),
  toggleDiscount: (id) => api.patch(`/admin/discounts/${id}/toggle`),
  // Marketing
  getMarketingLogs: (params) => api.get("/admin/marketing/logs", { params }),
  triggerMarketing: (campaignType) => api.post("/admin/marketing/trigger", { campaignType }),
};

export default api;
