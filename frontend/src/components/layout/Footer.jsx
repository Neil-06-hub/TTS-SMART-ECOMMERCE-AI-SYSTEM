import { Layout, Row, Col, Typography } from "antd";
import { ShopOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Footer: AntFooter } = Layout;
const { Text, Title } = Typography;

const Footer = () => (
  <AntFooter style={{ background: "#1a1a2e", color: "#aaa", padding: "40px 48px 20px" }}>
    <Row gutter={[32, 32]}>
      <Col xs={24} sm={12} md={8}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <ShopOutlined style={{ color: "#667eea", fontSize: 22 }} />
          <Title level={4} style={{ color: "white", margin: 0 }}>SmartShop AI</Title>
        </div>
        <Text style={{ color: "#aaa", lineHeight: 1.8 }}>
          Hệ thống thương mại điện tử thông minh tích hợp AI gợi ý sản phẩm và tự động hóa Marketing.
        </Text>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Title level={5} style={{ color: "white" }}>Liên kết nhanh</Title>
        {["Trang chủ", "Cửa hàng", "Đơn hàng", "Tài khoản"].map((link) => (
          <div key={link} style={{ marginBottom: 6 }}>
            <Text style={{ color: "#aaa", cursor: "pointer" }}>{link}</Text>
          </div>
        ))}
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Title level={5} style={{ color: "white" }}>Liên hệ</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Text style={{ color: "#aaa" }}><EnvironmentOutlined /> 123 Nguyễn Văn Cừ, TP.HCM</Text>
          <Text style={{ color: "#aaa" }}><PhoneOutlined /> 0901 234 567</Text>
          <Text style={{ color: "#aaa" }}><MailOutlined /> support@smartshop.vn</Text>
        </div>
      </Col>
    </Row>
    <div style={{ borderTop: "1px solid #333", marginTop: 24, paddingTop: 16, textAlign: "center" }}>
      <Text style={{ color: "#666" }}>© 2024 SmartShop AI System. Được phát triển với ❤️ cho môn học.</Text>
    </div>
  </AntFooter>
);

export default Footer;
