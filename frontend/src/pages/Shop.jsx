import { useState } from "react";
import { Row, Col, Select, Slider, Button, Spin, Pagination, Empty, Switch, Tag } from "antd";
import { AppstoreOutlined, BarsOutlined, HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { productAPI, aiAPI } from "../api";
import { useAuthStore } from "../store/useStore";
import ProductCard from "../components/product/ProductCard";

const { Option } = Select;

const Shop = () => {
  const { isAuthenticated } = useAuthStore();
  const [filters, setFilters] = useState({ page: 1, limit: 12, search: "", category: "", sort: "newest", minPrice: 0, maxPrice: 10000000 });
  const [gridView, setGridView] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [quickFilter, setQuickFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productAPI.getAll(filters).then((r) => r.data),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productAPI.getCategories().then((r) => r.data.categories),
  });

  const { data: aiData } = useQuery({
    queryKey: ["ai-recommendations-shop"],
    queryFn: () => aiAPI.getRecommendations().then((r) => r.data),
    enabled: isAuthenticated && aiEnabled,
  });

  const handleFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  const handleReset = () => {
    setFilters({ page: 1, limit: 12, search: "", category: "", sort: "newest", minPrice: 0, maxPrice: 10000000 });
    setQuickFilter("");
  };

  const quickFilters = ["Giảm giá", "Bán chạy", "Mới nhất", "AI Gợi ý"];

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", padding: "32px 32px" }}>
      <Row gutter={[20, 20]}>

        {/* ── Left Sidebar ── */}
        <Col xs={24} lg={5}>
          <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "sticky", top: 80 }}>
            {/* AI Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>AI Powered</span>
              <Switch checked={aiEnabled} onChange={setAiEnabled} style={{ background: aiEnabled ? "#06B6D4" : undefined }} size="small" />
            </div>
            <p style={{ color: "#94A3B8", fontSize: 12, marginBottom: 20 }}>AI đang phân tích sở thích của bạn</p>

            {/* Category */}
            <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>DANH MỤC</p>
            <div style={{ marginBottom: 20 }}>
              <button onClick={() => handleFilter("category", "")} style={{
                width: "100%", textAlign: "left", padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4, fontWeight: 600,
                background: !filters.category ? "linear-gradient(135deg, #06B6D4, #10B981)" : "transparent",
                color: !filters.category ? "white" : "#475569",
              }}>Tất cả</button>
              {categoriesData?.map((cat) => (
                <button key={cat} onClick={() => handleFilter("category", cat)} style={{
                  width: "100%", textAlign: "left", padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4, fontWeight: 500,
                  background: filters.category === cat ? "linear-gradient(135deg, #06B6D4, #10B981)" : "transparent",
                  color: filters.category === cat ? "white" : "#475569",
                }}>{cat}</button>
              ))}
            </div>

            {/* Price range */}
            <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>KHOẢNG GIÁ</p>
            <Slider
              range min={0} max={10000000} step={100000}
              value={[filters.minPrice, filters.maxPrice]}
              onChange={([min, max]) => setFilters((f) => ({ ...f, minPrice: min, maxPrice: max, page: 1 }))}
              tooltip={{ formatter: (v) => v.toLocaleString("vi-VN") + "đ" }}
              trackStyle={[{ background: "linear-gradient(135deg, #06B6D4, #10B981)" }]}
              handleStyle={[{ borderColor: "#06B6D4" }, { borderColor: "#06B6D4" }]}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B", marginBottom: 20 }}>
              <span>0đ</span>
              <span style={{ color: "#06B6D4", fontWeight: 600 }}>{filters.maxPrice.toLocaleString("vi-VN")}đ</span>
            </div>

            {/* Quick filters */}
            <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>BỘ LỌC NHANH</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {quickFilters.map((q) => (
                <button key={q} onClick={() => setQuickFilter(q === quickFilter ? "" : q)} style={{
                  padding: "5px 12px", borderRadius: 999, border: "1px solid #E2E8F0", cursor: "pointer",
                  background: quickFilter === q ? "#0F172A" : "white",
                  color: quickFilter === q ? "white" : "#475569",
                  fontSize: 12, fontWeight: 500,
                }}>{q}</button>
              ))}
            </div>

            <Button block onClick={() => handleFilter("sort", "newest")} style={{ background: "linear-gradient(135deg, #06B6D4, #10B981)", border: "none", color: "white", borderRadius: 10, fontWeight: 700, height: 42, marginBottom: 10 }}>
              Áp dụng bộ lọc
            </Button>
            <button onClick={handleReset} style={{ width: "100%", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 13 }}>Xóa tất cả</button>
          </div>
        </Col>

        {/* ── Main Grid ── */}
        <Col xs={24} lg={14}>
          {/* Header bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#64748B" }}>
              <HomeOutlined />
              <span>/</span>
              <span style={{ color: "#0F172A", fontWeight: 600 }}>Cửa hàng</span>
              {data && <span style={{ color: "#94A3B8" }}>— Tìm thấy <b style={{ color: "#06B6D4" }}>{data.pagination?.total || 0}</b> sản phẩm</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Select value={filters.sort} style={{ width: 150 }} onChange={(v) => handleFilter("sort", v)} size="small">
                <Option value="newest">Phù hợp nhất</Option>
                <Option value="popular">Bán chạy nhất</Option>
                <Option value="price_asc">Giá tăng dần</Option>
                <Option value="price_desc">Giá giảm dần</Option>
                <Option value="rating">Đánh giá cao</Option>
              </Select>
              <button onClick={() => setGridView(true)} style={{ padding: "4px 8px", border: "1px solid #E2E8F0", borderRadius: 6, background: gridView ? "#0F172A" : "white", color: gridView ? "white" : "#475569", cursor: "pointer" }}>
                <AppstoreOutlined />
              </button>
              <button onClick={() => setGridView(false)} style={{ padding: "4px 8px", border: "1px solid #E2E8F0", borderRadius: 6, background: !gridView ? "#0F172A" : "white", color: !gridView ? "white" : "#475569", cursor: "pointer" }}>
                <BarsOutlined />
              </button>
              <Button style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)", border: "none", color: "white", borderRadius: 999, fontWeight: 700, height: 34, fontSize: 13 }}>
                ✦ AI Tìm cho tôi
              </Button>
            </div>
          </div>

          {/* Active filter tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {filters.category && <Tag closable color="purple" onClose={() => handleFilter("category", "")}>{filters.category}</Tag>}
            {quickFilter && <Tag closable color="cyan" onClose={() => setQuickFilter("")}>{quickFilter}</Tag>}
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
          ) : data?.products?.length === 0 ? (
            <Empty description="Không tìm thấy sản phẩm phù hợp" style={{ padding: 60 }} />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {data?.products?.map((product) => (
                  <Col key={product._id} xs={24} sm={gridView ? 12 : 24} lg={gridView ? 8 : 24}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <Pagination
                  current={filters.page}
                  total={data?.pagination?.total}
                  pageSize={filters.limit}
                  onChange={(page) => setFilters((f) => ({ ...f, page }))}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </Col>

        {/* ── Right Sidebar ── */}
        <Col xs={24} lg={5}>
          <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "sticky", top: 80 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #06B6D4, #10B981)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>✦</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>Dành riêng cho bạn</div>
                <div style={{ color: "#94A3B8", fontSize: 11 }}>Dựa trên lịch sử của bạn</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #F1F5F9", marginTop: 16, paddingTop: 16 }}>
              {isAuthenticated && aiData?.products?.length > 0 ? (
                aiData.products.slice(0, 4).map((product, i) => {
                  const match = [94, 89, 87, 91][i] || 85;
                  return (
                    <div key={product._id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                      <img src={product.image} alt={product.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover", background: "#F1F5F9", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{product.name}</div>
                        <div style={{ color: "#06B6D4", fontWeight: 700, fontSize: 13 }}>{new Intl.NumberFormat("vi-VN").format(product.price)}đ</div>
                        <div style={{ background: "#E0F7FA", borderRadius: 4, height: 4, marginTop: 4 }}>
                          <div style={{ background: "linear-gradient(135deg, #06B6D4, #10B981)", borderRadius: 4, height: "100%", width: match + "%" }} />
                        </div>
                        <span style={{ color: "#06B6D4", fontSize: 10, fontWeight: 600 }}>{match}%</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: "#94A3B8", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                  {isAuthenticated ? "Đang tải gợi ý..." : "Đăng nhập để xem gợi ý AI"}
                </p>
              )}
            </div>

            {/* Similar users section */}
            <div style={{ borderTop: "1px solid #F1F5F9", marginTop: 8, paddingTop: 12 }}>
              <p style={{ color: "#64748B", fontSize: 12, marginBottom: 8 }}>Người dùng tương tự cũng mua...</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Tai nghe", "Chuột gaming", "Webcam"].map((c) => (
                  <span key={c} style={{ background: "#F1F5F9", color: "#475569", fontSize: 11, padding: "3px 8px", borderRadius: 999 }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Chat AI button */}
            <button style={{
              width: "100%", marginTop: 16, padding: "12px",
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              border: "none", borderRadius: 12, color: "white",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}>
              💬 Chat với AI Assistant
            </button>
          </div>
        </Col>

      </Row>
    </div>
  );
};

export default Shop;
