import { Layout, Row, Col, Input, Button, Space } from "antd";
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Footer: AntFooter } = Layout;

const footerLinks = {
  "Sản Phẩm": [
    { label: "Cửa hàng", to: "/shop" },
    { label: "AI Gợi ý", to: "/shop" },
    { label: "Bán chạy", to: "/shop" },
    { label: "Khuyến mãi", to: "/shop" },
  ],
  "Công Nghệ": [
    { label: "Google Gemini", to: "/" },
    { label: "AI Marketing", to: "/" },
    { label: "Phân tích AI", to: "/" },
    { label: "Tài liệu API", to: "/" },
  ],
  "Hỗ Trợ": [
    { label: "Trung tâm trợ giúp", to: "/" },
    { label: "Liên hệ", to: "/" },
    { label: "Chính sách", to: "/" },
    { label: "Điều khoản", to: "/" },
  ],
};

const Footer = () => (
  <AntFooter style={{
    background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    padding: "48px 48px 0",
  }}>
    <Row gutter={[48, 40]}>
      {/* Brand */}
      <Col xs={24} md={8}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 18, fontWeight: 700,
            border: "1px solid rgba(255,255,255,0.3)",
          }}>✦</div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>SmartShop AI</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 24, fontSize: 14 }}>
          Hệ thống thương mại điện tử thông minh tích hợp Google Gemini AI.
          Cá nhân hóa trải nghiệm mua sắm, tự động hóa Marketing, và phân
          tích kinh doanh thông minh cho tương lai số.
        </p>
        <div>
          <p style={{ color: "white", fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Nhận tin AI mới nhất</p>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Email của bạn"
              style={{
                borderRadius: "8px 0 0 8px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.15)",
                color: "white",
              }}
            />
            <Button style={{
              background: "white", color: "#059669",
              fontWeight: 600, border: "none",
              borderRadius: "0 8px 8px 0",
            }}>
              Đăng ký
            </Button>
          </Space.Compact>
        </div>
      </Col>

      {/* Links */}
      {Object.entries(footerLinks).map(([title, links]) => (
        <Col xs={8} md={4} key={title}>
          <h4 style={{ color: "white", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>{title}</h4>
          {links.map((link) => (
            <div key={link.label} style={{ marginBottom: 10 }}>
              <Link
                to={link.to}
                style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, textDecoration: "none" }}
              >
                {link.label}
              </Link>
            </div>
          ))}
        </Col>
      ))}
    </Row>

    {/* Bottom */}
    <div style={{
      borderTop: "1px solid rgba(255,255,255,0.2)",
      marginTop: 40, padding: "20px 0",
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
        © 2026 SmartShop AI. Powered by Google Gemini 1.5 Flash
      </span>
      <Space size={16}>
        <FacebookOutlined style={{ fontSize: 20, color: "rgba(255,255,255,0.8)", cursor: "pointer" }} />
        <TwitterOutlined style={{ fontSize: 20, color: "rgba(255,255,255,0.8)", cursor: "pointer" }} />
        <InstagramOutlined style={{ fontSize: 20, color: "rgba(255,255,255,0.8)", cursor: "pointer" }} />
      </Space>
    </div>
  </AntFooter>
);

export default Footer;
