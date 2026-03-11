import { Table, Button, InputNumber, Empty, Tag, Typography, Card, Row, Col, Popconfirm, message } from "antd";
import { DeleteOutlined, ShoppingOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCartStore, useAuthStore } from "../store/useStore";

const { Title, Text } = Typography;

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      render: (_, item) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />
          <div>
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            <Tag color="purple">{item.category}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (price) => <Text strong style={{ color: "#e53935" }}>{formatPrice(price)}</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (qty, item) => (
        <InputNumber
          min={1} max={item.stock} value={qty}
          onChange={(v) => updateQuantity(item._id, v)}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: "Thành tiền",
      render: (_, item) => <Text strong style={{ color: "#667eea" }}>{formatPrice(item.price * item.quantity)}</Text>,
    },
    {
      title: "",
      render: (_, item) => (
        <Popconfirm title="Xóa sản phẩm này?" onConfirm={() => removeItem(item._id)} okText="Xóa" cancelText="Hủy">
          <Button danger icon={<DeleteOutlined />} type="text" />
        </Popconfirm>
      ),
    },
  ];

  if (items.length === 0) {
    return (
      <div style={{ padding: "80px 48px", textAlign: "center" }}>
        <Empty
          image={<ShoppingOutlined style={{ fontSize: 64, color: "#667eea" }} />}
          description="Giỏ hàng của bạn đang trống"
        >
          <Button type="primary" size="large" onClick={() => navigate("/shop")} style={{ background: "#667eea" }}>
            Mua sắm ngay
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={3}>Giỏ hàng ({items.length} sản phẩm)</Title>
        <Popconfirm title="Xóa toàn bộ giỏ hàng?" onConfirm={clearCart} okText="Xóa tất cả" cancelText="Hủy">
          <Button danger>Xóa tất cả</Button>
        </Popconfirm>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Table
            columns={columns}
            dataSource={items}
            rowKey="_id"
            pagination={false}
            style={{ background: "white", borderRadius: 12 }}
          />
        </Col>
        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 12, position: "sticky", top: 80 }}>
            <Title level={4}>Tóm tắt đơn hàng</Title>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <Text>Tạm tính</Text>
              <Text strong>{formatPrice(subtotal)}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <Text>Phí vận chuyển</Text>
              <Text strong style={{ color: shippingFee === 0 ? "green" : "inherit" }}>
                {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
              </Text>
            </div>
            {subtotal < 500000 && (
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 12 }}>
                Mua thêm {formatPrice(500000 - subtotal)} để miễn phí vận chuyển
              </Text>
            )}
            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong style={{ fontSize: 18 }}>Tổng cộng</Text>
                <Text strong style={{ fontSize: 20, color: "#e53935" }}>{formatPrice(total)}</Text>
              </div>
            </div>
            <Button
              type="primary" block size="large" icon={<ArrowRightOutlined />}
              onClick={handleCheckout}
              style={{ height: 48, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none", fontWeight: 600 }}
            >
              Tiến hành thanh toán
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;
