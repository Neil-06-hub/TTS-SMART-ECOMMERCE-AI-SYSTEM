import { useState } from "react";
import { Form, Input, Button, Card, Radio, Row, Col, Typography, Divider, message, Result } from "antd";
import { CreditCardOutlined, CarOutlined, WalletOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../api";
import { useCartStore } from "../store/useStore";

const { Title, Text } = Typography;

const Checkout = () => {
  const [form] = Form.useForm();
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const discount = 0; // Áp dụng discount code sau
  const total = subtotal + shippingFee - discount;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map((i) => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: {
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          city: values.city,
        },
        paymentMethod: values.paymentMethod,
        note: values.note,
        discount,
      };
      await orderAPI.create(orderData);
      clearCart();
      setSuccess(true);
    } catch (err) {
      message.error(err.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: "80px 48px", textAlign: "center" }}>
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          status="success"
          title="Đặt hàng thành công!"
          subTitle="Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất."
          extra={[
            <Button type="primary" key="orders" onClick={() => navigate("/orders")} style={{ background: "#667eea" }}>Xem đơn hàng</Button>,
            <Button key="shop" onClick={() => navigate("/shop")}>Tiếp tục mua sắm</Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 48px" }}>
      <Title level={3} style={{ marginBottom: 24 }}>Thanh toán</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card style={{ borderRadius: 12 }}>
            <Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ paymentMethod: "COD" }}>
              <Title level={5}>Thông tin giao hàng</Title>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                    <Input placeholder="Nguyễn Văn A" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}>
                    <Input placeholder="09xxxxxxxx" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
                <Input placeholder="Số nhà, tên đường, phường/xã" />
              </Form.Item>
              <Form.Item name="city" label="Tỉnh/Thành phố" rules={[{ required: true, message: "Vui lòng nhập tỉnh thành" }]}>
                <Input placeholder="TP. Hồ Chí Minh" />
              </Form.Item>
              <Form.Item name="note" label="Ghi chú (tùy chọn)">
                <Input.TextArea rows={2} placeholder="Ghi chú cho đơn hàng..." />
              </Form.Item>

              <Divider />
              <Title level={5}>Phương thức thanh toán</Title>
              <Form.Item name="paymentMethod">
                <Radio.Group style={{ width: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { value: "COD", icon: <CarOutlined />, label: "Thanh toán khi nhận hàng (COD)" },
                      { value: "banking", icon: <CreditCardOutlined />, label: "Chuyển khoản ngân hàng" },
                      { value: "momo", icon: <WalletOutlined />, label: "Ví MoMo" },
                    ].map((m) => (
                      <Radio key={m.value} value={m.value}>
                        <div style={{ padding: "8px 0" }}>
                          {m.icon} <span style={{ marginLeft: 8 }}>{m.label}</span>
                        </div>
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              </Form.Item>

              <Button
                type="primary" htmlType="submit" block size="large" loading={loading}
                style={{ height: 48, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none", fontWeight: 600 }}
              >
                Xác nhận đặt hàng
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card style={{ borderRadius: 12 }}>
            <Title level={5}>Đơn hàng của bạn ({items.length} sản phẩm)</Title>
            {items.map((item) => (
              <div key={item._id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</Text>
                  <div><Text type="secondary" style={{ fontSize: 12 }}>x{item.quantity}</Text></div>
                </div>
                <Text strong style={{ color: "#e53935" }}>{formatPrice(item.price * item.quantity)}</Text>
              </div>
            ))}
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Text>Tạm tính</Text><Text>{formatPrice(subtotal)}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Text>Phí vận chuyển</Text>
              <Text style={{ color: shippingFee === 0 ? "green" : "inherit" }}>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</Text>
            </div>
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong style={{ fontSize: 16 }}>Tổng cộng</Text>
              <Text strong style={{ fontSize: 18, color: "#e53935" }}>{formatPrice(total)}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
