import { useState } from "react";
import { Row, Col, Input, Select, Slider, Button, Spin, Pagination, Empty, Tag, Collapse } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { productAPI } from "../api";
import ProductCard from "../components/product/ProductCard";

const { Option } = Select;

const Shop = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 12, search: "", category: "", sort: "newest", minPrice: 0, maxPrice: 50000000 });
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productAPI.getAll(filters).then((r) => r.data),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productAPI.getCategories().then((r) => r.data.categories),
  });

  const handleSearch = () => setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
  const handleFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  return (
    <div style={{ padding: "32px 48px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Cửa hàng</h2>

      <Row gutter={[24, 24]}>
        {/* Sidebar Filters */}
        <Col xs={24} md={6}>
          <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}><FilterOutlined /> Bộ lọc</h3>

            {/* Search */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Tìm kiếm</label>
              <Input.Search
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSearch={handleSearch}
                placeholder="Tìm sản phẩm..."
                enterButton
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Danh mục</label>
              <Select value={filters.category || undefined} placeholder="Tất cả danh mục" style={{ width: "100%" }}
                onChange={(v) => handleFilter("category", v || "")} allowClear>
                {categoriesData?.map((c) => <Option key={c} value={c}>{c}</Option>)}
              </Select>
            </div>

            {/* Sort */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Sắp xếp</label>
              <Select value={filters.sort} style={{ width: "100%" }} onChange={(v) => handleFilter("sort", v)}>
                <Option value="newest">Mới nhất</Option>
                <Option value="popular">Bán chạy nhất</Option>
                <Option value="price_asc">Giá tăng dần</Option>
                <Option value="price_desc">Giá giảm dần</Option>
                <Option value="rating">Đánh giá cao nhất</Option>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Khoảng giá</label>
              <Slider
                range min={0} max={10000000} step={100000}
                value={[filters.minPrice, filters.maxPrice]}
                onChange={([min, max]) => setFilters((f) => ({ ...f, minPrice: min, maxPrice: max, page: 1 }))}
                tooltip={{ formatter: (v) => `${v.toLocaleString("vi-VN")}đ` }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginTop: 4 }}>
                <span>{filters.minPrice.toLocaleString("vi-VN")}đ</span>
                <span>{filters.maxPrice.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            {/* Reset */}
            <Button block style={{ marginTop: 16 }} onClick={() => { setFilters({ page: 1, limit: 12, search: "", category: "", sort: "newest", minPrice: 0, maxPrice: 50000000 }); setSearchInput(""); }}>
              Xóa bộ lọc
            </Button>
          </div>
        </Col>

        {/* Product Grid */}
        <Col xs={24} md={18}>
          {/* Active Filters */}
          <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {filters.category && <Tag closable color="purple" onClose={() => handleFilter("category", "")}>{filters.category}</Tag>}
            {filters.search && <Tag closable color="blue" onClose={() => { setSearchInput(""); handleFilter("search", ""); }}>{filters.search}</Tag>}
            <span style={{ color: "#999", fontSize: 13 }}>
              {isLoading ? "" : `${data?.pagination?.total || 0} sản phẩm`}
            </span>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
          ) : data?.products?.length === 0 ? (
            <Empty description="Không tìm thấy sản phẩm phù hợp" style={{ padding: 60 }} />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {data?.products?.map((product) => (
                  <Col key={product._id} xs={24} sm={12} lg={8}>
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
      </Row>
    </div>
  );
};

export default Shop;
