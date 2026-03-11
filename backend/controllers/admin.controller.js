const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const MarketingLog = require("../models/MarketingLog");
const { cloudinary, upload } = require("../config/cloudinary");
const { analyzeBusinessWithAI } = require("../services/gemini.service");
const { triggerMarketingCampaign } = require("../services/marketing.service");

// ===================== DASHBOARD =====================

// @desc  Thống kê tổng quan Dashboard
// @route GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [totalUsers, totalProducts, totalOrders, allOrders] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.find({ orderStatus: { $ne: "cancelled" } }).select("totalAmount createdAt orderStatus"),
    ]);

    const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const thisMonthRevenue = allOrders
      .filter((o) => o.createdAt >= startOfMonth)
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const lastMonthRevenue = allOrders
      .filter((o) => o.createdAt >= startOfLastMonth && o.createdAt <= endOfLastMonth)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Doanh thu theo tháng (12 tháng gần nhất)
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const revenue = allOrders
        .filter((o) => o.createdAt >= start && o.createdAt <= end)
        .reduce((sum, o) => sum + o.totalAmount, 0);
      monthlyRevenue.push({
        month: start.toLocaleDateString("vi-VN", { month: "short", year: "numeric" }),
        revenue,
      });
    }

    // Trạng thái đơn hàng
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalProducts, totalOrders, totalRevenue, thisMonthRevenue, lastMonthRevenue },
      monthlyRevenue,
      ordersByStatus,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  AI phân tích kinh doanh
// @route GET /api/admin/dashboard/ai-analysis
const getAIAnalysis = async (req, res) => {
  try {
    // Lấy dữ liệu nhanh để truyền cho AI
    const [recentOrders, topProducts] = await Promise.all([
      Order.find({ orderStatus: { $ne: "cancelled" } })
        .sort({ createdAt: -1 })
        .limit(20)
        .select("totalAmount orderStatus createdAt"),
      Product.find({ isActive: true }).sort({ sold: -1 }).limit(5).select("name sold price category"),
    ]);

    const analysis = await analyzeBusinessWithAI({ recentOrders, topProducts });
    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== PRODUCT MANAGEMENT =====================

// @desc  Lấy tất cả sản phẩm (admin)
// @route GET /api/admin/products
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, products, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Tạo sản phẩm mới
// @route POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, tags, stock, featured } = req.body;
    const image = req.file ? req.file.path : req.body.image;
    if (!image) return res.status(400).json({ success: false, message: "Vui lòng tải lên hình ảnh sản phẩm" });

    const product = await Product.create({
      name, description,
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      category,
      tags: typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags || [],
      stock: Number(stock),
      image,
      featured: featured === "true" || featured === true,
    });
    res.status(201).json({ success: true, message: "Tạo sản phẩm thành công", product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Cập nhật sản phẩm
// @route PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, tags, stock, featured, isActive } = req.body;
    const updateData = {
      name, description,
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      category,
      tags: typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags || [],
      stock: Number(stock),
      featured: featured === "true" || featured === true,
      isActive: isActive !== false && isActive !== "false",
    };
    if (req.file) updateData.image = req.file.path;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.json({ success: true, message: "Cập nhật thành công", product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Xóa sản phẩm (soft delete)
// @route DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.json({ success: true, message: "Đã ẩn sản phẩm thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== ORDER MANAGEMENT =====================

// @desc  Lấy tất cả đơn hàng
// @route GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, orders, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Cập nhật trạng thái đơn hàng
// @route PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    ).populate("user", "name email");

    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    res.json({ success: true, message: "Cập nhật trạng thái thành công", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== USER MANAGEMENT =====================

// @desc  Lấy danh sách người dùng
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== MARKETING =====================

// @desc  Lấy lịch sử marketing
// @route GET /api/admin/marketing/logs
const getMarketingLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const filter = {};
    if (type) filter.type = type;
    const total = await MarketingLog.countDocuments(filter);
    const logs = await MarketingLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, logs, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Kích hoạt chiến dịch Marketing thủ công
// @route POST /api/admin/marketing/trigger
const triggerMarketing = async (req, res) => {
  try {
    const { campaignType } = req.body;
    const result = await triggerMarketingCampaign(campaignType);
    res.json({ success: true, message: "Chiến dịch đã được kích hoạt", result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboardStats, getAIAnalysis,
  getAllProducts, createProduct, updateProduct, deleteProduct,
  getAllOrders, updateOrderStatus,
  getAllUsers,
  getMarketingLogs, triggerMarketing,
};
