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
    background: "linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-teal-light) 100%)",
    padding: "64px 0 0",
  }}>
    <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
      <Row gutter={[48, 40]} justify="space-between">
        {/* Brand */}
        <Col xs={24} lg={9}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 18, fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.3)",
            }}>S</div>
            <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>SmartShop AI</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 24, fontSize: 14 }}>
            Hệ thống thương mại điện tử thông minh tích hợp Google Gemini AI.
            Cá nhân hóa trải nghiệm mua sắm, tự động hóa Marketing, và phân
            tích kinh doanh thông minh cho tương lai số.
          </p>
          <div>
            <p style={{ color: "white", fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Nhận tin AI mới nhất</p>
            <Space.Compact style={{ width: "100%", maxWidth: 400 }}>
              <Input
                placeholder="Email của bạn"
                style={{
                  borderRadius: "8px 0 0 8px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  height: 40
                }}
              />
              <Button style={{
                background: "white", color: "var(--brand-teal)",
                fontWeight: 600, border: "none",
                borderRadius: "0 8px 8px 0",
                height: 40
              }}>
                Đăng ký
              </Button>
            </Space.Compact>
          </div>
        </Col>

        {/* Links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <Col xs={12} sm={8} lg={4} key={title}>
            <h4 style={{ color: "white", fontWeight: 700, marginBottom: 24, fontSize: 16 }}>{title}</h4>
            {links.map((link) => (
              <div key={link.label} style={{ marginBottom: 12 }}>
                <Link
                  to={link.to}
                  style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, textDecoration: "none" }}
                  className="hover:text-white transition-colors"
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
        marginTop: 48, padding: "24px 0",
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
    </div>
  </AntFooter>
);

export default Footer;
