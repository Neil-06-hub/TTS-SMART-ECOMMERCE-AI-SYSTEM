import { Row, Col, Spin, Button, Tag, Typography, Card } from "antd";
import { RocketOutlined, SafetyOutlined, CarOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { productAPI, aiAPI } from "../api";
import { useAuthStore } from "../store/useStore";
import ProductCard from "../components/product/ProductCard";

const { Title, Text } = Typography;

// Banner Hero
const HeroBanner = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "80px 48px",
      textAlign: "center",
      color: "white",
    }}>
      <Title level={1} style={{ color: "white", margin: 0, fontSize: 48 }}>
        Mua sắm thông minh với AI
      </Title>
      <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, display: "block", marginTop: 12 }}>
        Hệ thống gợi ý cá nhân hóa giúp bạn tìm đúng sản phẩm yêu thích
      </Text>
      <Button
        size="large" type="primary"
        onClick={() => navigate("/shop")}
        style={{ marginTop: 24, background: "#ffd700", color: "#333", borderColor: "#ffd700", fontWeight: 700, height: 48, padding: "0 32px" }}
      >
        Khám phá ngay
      </Button>
    </div>
  );
};

// Features Section
const features = [
  { icon: <RocketOutlined />, title: "Giao hàng nhanh", desc: "Giao hàng trong 2-24 giờ" },
  { icon: <SafetyOutlined />, title: "Bảo hành chính hãng", desc: "Sản phẩm được kiểm định chất lượng" },
  { icon: <CarOutlined />, title: "Miễn phí vận chuyển", desc: "Cho đơn hàng từ 500.000đ" },
  { icon: <CustomerServiceOutlined />, title: "Hỗ trợ 24/7", desc: "Đội ngũ hỗ trợ luôn sẵn sàng" },
];

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  // Sản phẩm nổi bật
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productAPI.getFeatured().then((r) => r.data.products),
  });

  // AI Recommendations (chỉ khi đăng nhập)
  const { data: aiData, isLoading: aiLoading } = useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: () => aiAPI.getRecommendations().then((r) => r.data),
    enabled: isAuthenticated,
  });

  return (
    <div>
      <HeroBanner />

      {/* Features */}
      <div style={{ background: "white", padding: "32px 48px" }}>
        <Row gutter={[24, 24]}>
          {features.map((f) => (
            <Col key={f.title} xs={12} sm={6}>
              <div style={{ textAlign: "center", padding: 16 }}>
                <div style={{ fontSize: 32, color: "#667eea", marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{f.title}</div>
                <div style={{ color: "#999", fontSize: 13, marginTop: 4 }}>{f.desc}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* AI Recommendations */}
      {isAuthenticated && (
        <div style={{ padding: "40px 48px", background: "#fafafa" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <Title level={3} className="section-title" style={{ margin: 0 }}>
              {aiData?.message || "Gợi ý dành riêng cho bạn"}
            </Title>
            <Tag color="purple">AI Powered</Tag>
          </div>
          {aiLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}><Spin size="large" /></div>
          ) : (
            <Row gutter={[20, 20]}>
              {aiData?.products?.map((product) => (
                <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}

      {/* Featured Products */}
      <div style={{ padding: "40px 48px" }}>
        <Title level={3} className="section-title">Sản phẩm nổi bật</Title>
        {featuredLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}><Spin size="large" /></div>
        ) : (
          <Row gutter={[20, 20]} style={{ marginTop: 32 }}>
            {featuredData?.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Home;
