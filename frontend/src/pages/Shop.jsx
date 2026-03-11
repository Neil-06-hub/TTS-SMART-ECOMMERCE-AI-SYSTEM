import { useState } from "react";
import { Row, Col, Select, Slider, Button, Spin, Pagination, Empty, Switch, Tag, Input } from "antd";
import { AppstoreOutlined, BarsOutlined, HomeOutlined, ThunderboltFilled, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { productAPI, aiAPI } from "../api";
import { useAuthStore } from "../store/useStore";
import ProductCard from "../components/product/ProductCard";

const { Option } = Select;

const Shop = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
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

  const { data: aiData, isLoading: aiLoading } = useQuery({
    queryKey: ["ai-recommendations-shop"],
    queryFn: () => aiAPI.getRecommendations().then((r) => r.data),
    enabled: !!(isAuthenticated && aiEnabled),
  });

  const handleFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  const handleReset = () => {
    setFilters({ page: 1, limit: 12, search: "", category: "", sort: "newest", minPrice: 0, maxPrice: 10000000 });
    setQuickFilter("");
  };

  const quickFilters = ["Giảm giá", "Bán chạy", "Mới nhất"];

  return (
    <div style={{ background: "var(--bg-main)", minHeight: "100vh", padding: "40px 24px" }}>
      <div className="container" style={{ maxWidth: 1440 }}>
        <Row gutter={[24, 24]}>

          <Col xs={24} lg={5}>
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", position: "sticky", top: 80, border: "1px solid var(--border-color)" }}>
              {/* Search */}
              <p style={{ color: "var(--text-main)", fontSize: 13, fontWeight: 800, letterSpacing: 0.5, marginBottom: 16, textTransform: "uppercase" }}>Tìm Kiếm</p>
              <Input
                placeholder="Tên sản phẩm..."
                prefix={<SearchOutlined style={{ color: "var(--text-muted)" }} />}
                value={filters.search}
                onChange={(e) => handleFilter("search", e.target.value)}
                style={{ marginBottom: 28, borderRadius: 12, height: 44 }}
              />

              {/* Category */}
              <p style={{ color: "var(--text-main)", fontSize: 13, fontWeight: 800, letterSpacing: 0.5, marginBottom: 16, textTransform: "uppercase" }}>Danh Mục</p>
              <div style={{ marginBottom: 28 }}>
                <button onClick={() => handleFilter("category", "")} style={{
                  width: "100%", textAlign: "left", padding: "10px 16px", borderRadius: 12, border: "none", cursor: "pointer", marginBottom: 6, fontWeight: 600, fontSize: 14,
                  background: !filters.category ? "var(--brand-teal)" : "transparent",
                  color: !filters.category ? "white" : "var(--text-muted)",
                  transition: "all 0.2s"
                }} className={!filters.category ? "" : "hover:bg-slate-50 hover:text-slate-900"}>Tất cả sản phẩm</button>
                {categoriesData?.map((cat) => (
                  <button key={cat} onClick={() => handleFilter("category", cat)} style={{
                    width: "100%", textAlign: "left", padding: "10px 16px", borderRadius: 12, border: "none", cursor: "pointer", marginBottom: 6, fontWeight: 500, fontSize: 14,
                    background: filters.category === cat ? "var(--brand-teal)" : "transparent",
                    color: filters.category === cat ? "white" : "var(--text-muted)",
                    transition: "all 0.2s"
                  }} className={filters.category === cat ? "" : "hover:bg-slate-50 hover:text-slate-900"}>{cat}</button>
                ))}
              </div>

              {/* Price range */}
              <p style={{ color: "var(--text-main)", fontSize: 13, fontWeight: 800, letterSpacing: 0.5, marginBottom: 16, textTransform: "uppercase" }}>Khoảng Giá</p>
              <div style={{ padding: "0 8px" }}>
                 <Slider
                   range min={0} max={10000000} step={100000}
                   value={[filters.minPrice, filters.maxPrice]}
                   onChange={([min, max]) => setFilters((f) => ({ ...f, minPrice: min, maxPrice: max, page: 1 }))}
                   tooltip={{ formatter: (v) => v.toLocaleString("vi-VN") + "đ" }}
                   trackStyle={[{ background: "var(--brand-teal)" }]}
                   handleStyle={[{ borderColor: "var(--brand-teal)" }, { borderColor: "var(--brand-teal)" }]}
                 />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)", marginBottom: 28, fontWeight: 500 }}>
                <span>0đ</span>
                <span style={{ color: "var(--brand-teal)", fontWeight: 700 }}>{filters.maxPrice.toLocaleString("vi-VN")}đ</span>
              </div>

              {/* Quick filters */}
              <p style={{ color: "var(--text-main)", fontSize: 13, fontWeight: 800, letterSpacing: 0.5, marginBottom: 16, textTransform: "uppercase" }}>Lọc Nhanh</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
                {quickFilters.map((q) => (
                  <button key={q} onClick={() => setQuickFilter(q === quickFilter ? "" : q)} style={{
                    padding: "6px 16px", borderRadius: 999, border: "1px solid var(--border-color)", cursor: "pointer",
                    background: quickFilter === q ? "var(--text-main)" : "white",
                    color: quickFilter === q ? "white" : "var(--text-muted)",
                    fontSize: 13, fontWeight: 500, transition: "all 0.2s"
                  }} className="hover:border-slate-400">{q}</button>
                ))}
              </div>

              <button onClick={handleReset} style={{ width: "100%", background: "none", border: "1px dashed var(--border-color)", color: "var(--text-muted)", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: "10px", borderRadius: 12, transition: "all 0.2s" }} className="hover:text-red-500 hover:border-red-200 hover:bg-red-50">Xóa Bộ Lọc</button>
            </div>
          </Col>

          {/* ── Main Grid (Products) ── */}
          <Col xs={24} lg={13} xl={14}>
            {/* Header bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12, background: "white", padding: "16px 20px", borderRadius: 16, border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-muted)" }}>
                <HomeOutlined />
                <span>/</span>
                <span style={{ color: "var(--text-main)", fontWeight: 600 }}>Cửa hàng</span>
                {data && <span style={{ color: "var(--text-muted)" }}>— <b style={{ color: "var(--brand-teal)", fontWeight: 700 }}>{data.pagination?.total || 0}</b> sản phẩm</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Select value={filters.sort} style={{ width: 160 }} onChange={(v) => handleFilter("sort", v)} size="middle" variant="filled">
                  <Option value="newest">Mới nhất</Option>
                  <Option value="popular">Bán chạy nhất</Option>
                  <Option value="price_asc">Giá tăng dần</Option>
                  <Option value="price_desc">Giá giảm dần</Option>
                  <Option value="rating">Đánh giá cao</Option>
                </Select>
                <div style={{ display: "flex", background: "var(--bg-main)", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-color)", padding: 2 }}>
                   <button onClick={() => setGridView(true)} style={{ padding: "6px 10px", border: "none", borderRadius: 6, background: gridView ? "white" : "transparent", color: gridView ? "var(--text-main)" : "var(--text-muted)", cursor: "pointer", boxShadow: gridView ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                     <AppstoreOutlined style={{ fontSize: 16 }} />
                   </button>
                   <button onClick={() => setGridView(false)} style={{ padding: "6px 10px", border: "none", borderRadius: 6, background: !gridView ? "white" : "transparent", color: !gridView ? "var(--text-main)" : "var(--text-muted)", cursor: "pointer", boxShadow: !gridView ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                     <BarsOutlined style={{ fontSize: 16 }} />
                   </button>
                </div>
              </div>
            </div>

            {/* Active filter tags */}
            {(filters.category || quickFilter) && (
               <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                 {filters.category && <Tag closable color="cyan" style={{ padding: "4px 10px", borderRadius: 6, fontSize: 13 }} onClose={() => handleFilter("category", "")}>{filters.category}</Tag>}
                 {quickFilter && <Tag closable style={{ background: "var(--text-main)", color: "white", padding: "4px 10px", borderRadius: 6, fontSize: 13, border: "none" }} onClose={() => setQuickFilter("")}>{quickFilter}</Tag>}
               </div>
            )}

            {isLoading ? (
              <div style={{ textAlign: "center", padding: 100 }}><Spin size="large" /></div>
            ) : data?.products?.length === 0 ? (
              <Empty description="Không tìm thấy sản phẩm phù hợp" style={{ padding: 80, background: "white", borderRadius: 20, border: "1px solid var(--border-color)" }} />
            ) : (
              <>
                <Row gutter={[20, 20]}>
                  {data?.products?.map((product) => (
                    <Col key={product._id} xs={24} sm={gridView ? 12 : 24} lg={gridView ? 12 : 24} xl={gridView ? 8 : 24}>
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>
                <div style={{ textAlign: "center", marginTop: 40 }}>
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

          {/* ── Right Sidebar (AI Suggestions) ── */}
          <Col xs={24} lg={6} xl={5}>
            <div style={{ background: "white", borderRadius: 20, padding: 20, border: "1px solid var(--border-color)", position: "sticky", top: 80 }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                   <div className="bg-gradient-ai" style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16, boxShadow: "0 4px 10px rgba(236, 72, 153, 0.2)" }}>
                      <ThunderboltFilled />
                   </div>
                   <div>
                     <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text-main)" }}>Dành Cho Bạn</div>
                     <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Phân tích bởi AI</div>
                   </div>
                 </div>
                 <Switch checked={aiEnabled} onChange={setAiEnabled} className={aiEnabled ? "bg-gradient-ai" : ""} size="small" />
              </div>

              {/* Suggestions List */}
              <div style={{ borderTop: "1px solid var(--border-color)", marginTop: 8, paddingTop: 16 }}>
                {!aiEnabled ? (
                   <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                     Bật AI để nhận gợi ý mua sắm cá nhân hóa.
                   </p>
                ) : !isAuthenticated ? (
                  <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                    Vui lòng <a href="/login" style={{ color: "var(--ai-purple)", fontWeight: 600 }}>đăng nhập</a> để AI có thể phân tích sở thích của bạn.
                  </p>
                ) : aiLoading ? (
                  <div style={{ textAlign: "center", padding: 30 }}><Spin /></div>
                ) : aiData?.products?.length > 0 ? (
                  aiData.products.slice(0, 5).map((product, i) => {
                    const match = [98, 94, 89, 87, 82][i] || 80;
                    return (
                      <div key={product._id} onClick={() => navigate(`/products/${product._id}`)} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, cursor: "pointer", padding: 8, borderRadius: 12, transition: "background 0.2s" }} className="hover:bg-slate-50">
                        <img src={product.image || "https://placehold.co/100x100"} alt={product.name} style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", background: "white", flexShrink: 0, border: "1px solid var(--border-color)" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 2 }}>{product.name}</div>
                          <div style={{ color: "var(--brand-teal)", fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{new Intl.NumberFormat("vi-VN").format(product.price)}đ</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                             <div style={{ background: "var(--bg-main)", borderRadius: 999, height: 6, flex: 1, overflow: "hidden" }}>
                               <div className="bg-gradient-ai" style={{ borderRadius: 999, height: "100%", width: match + "%" }} />
                             </div>
                             <span className="text-gradient-ai" style={{ fontSize: 11, fontWeight: 800 }}>{match}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                    Chưa có đủ dữ liệu hành vi. Hãy duyệt thêm sản phẩm!
                  </p>
                )}
              </div>
              
              {/* Promo Banner */}
              <div className="bg-gradient-ai" style={{ marginTop: 16, padding: "20px", borderRadius: 16, color: "white", textAlign: "center", position: "relative", overflow: "hidden" }}>
                 <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.1 }}>✨</div>
                 <h4 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: "white" }}>Khuyến mãi AI Mới</h4>
                 <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>Dùng thử hệ sinh thái gợi ý tuần này với mã giảm giá đặc biệt.</p>
                 <Button shape="round" style={{ width: "100%", fontWeight: 700, color: "var(--ai-purple)", border: "none" }}>Lấy Mã Ngay</Button>
              </div>
            </div>
          </Col>

        </Row>
      </div>
    </div>
  );
};

export default Shop;
