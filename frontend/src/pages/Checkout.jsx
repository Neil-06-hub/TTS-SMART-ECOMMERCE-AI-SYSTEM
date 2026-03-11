import { useState } from "react";
import { Form, Input, Button, Card, Radio, Row, Col, Typography, Divider, message, Result, Space } from "antd";
import { CreditCardOutlined, CarOutlined, WalletOutlined, CheckCircleOutlined, ThunderboltFilled, SafetyCertificateOutlined } from "@ant-design/icons";
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

  const formatPrice = (p) => new Intl.NumberFormat("vi-VN").format(p) + "đ";
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const discount = 0; // Áp dụng discount code sau
  const total = subtotal + shippingFee - discount;

  const onFinish = async (values) => {
    if (items.length === 0) {
      return message.error("Giỏ hàng đang trống!");
    }
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
      <div style={{ padding: "100px 24px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-main)" }}>
        <div style={{ textAlign: "center", background: "white", padding: "60px 40px", borderRadius: 32, boxShadow: "0 10px 40px rgba(0,0,0,0.05)", border: "1px solid var(--border-color)", maxWidth: 640 }}>
           <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#DCFCE7", color: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, margin: "0 auto 32px" }}>
              <CheckCircleOutlined />
           </div>
           <Title level={2} style={{ color: "var(--text-main)", fontWeight: 800, marginBottom: 16 }}>Đặt hàng thành công!</Title>
           <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>Cảm ơn bạn đã tin tưởng mua sắm. Mã đơn hàng của bạn đã được gửi qua email. Mong bạn sẽ có trải nghiệm tuyệt vời với sản phẩm!</p>
           
           <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
              <Button type="primary" size="large" onClick={() => navigate("/orders")} style={{ background: "var(--brand-teal)", border: "none", height: 50, borderRadius: 12, fontWeight: 700, padding: "0 32px" }}>
                 Xem Đơn Hàng
              </Button>
              <Button size="large" onClick={() => navigate("/shop")} style={{ height: 50, borderRadius: 12, fontWeight: 700, padding: "0 32px", color: "var(--text-main)", borderColor: "var(--border-color)" }}>
                 Tiếp Tục Mua Sắm
              </Button>
           </Space>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-main)", minHeight: "100vh", padding: "40px 24px" }}>
       <div className="container" style={{ maxWidth: 1280 }}>
        
        <div style={{ marginBottom: 40 }}>
           <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px", color: "var(--text-main)" }}>Thanh Toán Phân Tích Thông Minh</h1>
           <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
             <SafetyCertificateOutlined style={{ color: "var(--brand-teal)" }} /> Thông tin thanh toán của bạn được mã hóa an toàn 256-bit
           </p>
        </div>

        <Row gutter={[40, 40]}>
          <Col xs={24} lg={14}>
              <Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ paymentMethod: "COD" }} requiredMark={false}>
                
                {/* Thông tin giao hàng */}
                <div style={{ background: "white", borderRadius: 24, padding: 32, border: "1px solid var(--border-color)", marginBottom: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                      <div className="bg-gradient-ai" style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>1</div>
                      <Title level={4} style={{ margin: 0, fontWeight: 800, color: "var(--text-main)" }}>Thông Tin Giao Hàng</Title>
                   </div>

                   <Row gutter={24}>
                     <Col xs={24} sm={12}>
                       <Form.Item name="fullName" label={<span style={{ fontWeight: 600 }}>Họ và tên</span>} rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                         <Input size="large" placeholder="Vd: Nguyễn Văn A" style={{ borderRadius: 10 }} />
                       </Form.Item>
                     </Col>
                     <Col xs={24} sm={12}>
                       <Form.Item name="phone" label={<span style={{ fontWeight: 600 }}>Số điện thoại</span>} rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                         <Input size="large" placeholder="Vd: 0912345678" style={{ borderRadius: 10 }} />
                       </Form.Item>
                     </Col>
                   </Row>
                   
                   <Form.Item name="address" label={<span style={{ fontWeight: 600 }}>Địa chỉ chi tiết</span>} rules={[{ required: true, message: "Vui lòng nhập địa chỉ giao hàng" }]}>
                     <Input size="large" placeholder="Số nhà, Tên đường, Phường/Xã..." style={{ borderRadius: 10 }} />
                   </Form.Item>
                   
                   <Form.Item name="city" label={<span style={{ fontWeight: 600 }}>Tỉnh / Thành phố</span>} rules={[{ required: true, message: "Vui lòng chọn hoặc nhập Tỉnh thành" }]}>
                     <Input size="large" placeholder="Vd: TP. Hồ Chí Minh" style={{ borderRadius: 10 }} />
                   </Form.Item>
                   
                   <Form.Item name="note" label={<span style={{ fontWeight: 600 }}>Ghi chú đơn hàng <span style={{ fontWeight: 400, color: "var(--text-muted)", marginLeft: 4 }}>(Không bắt buộc)</span></span>}>
                     <Input.TextArea rows={3} placeholder="Ghi chú thêm về thời gian nhận hàng hoặc chỉ dẫn địa chỉ..." style={{ borderRadius: 10, resize: "none" }} />
                   </Form.Item>
                </div>
                
                {/* Phương thức thanh toán */}
                <div style={{ background: "white", borderRadius: 24, padding: 32, border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                      <div className="bg-gradient-ai" style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>2</div>
                      <Title level={4} style={{ margin: 0, fontWeight: 800, color: "var(--text-main)" }}>Phương Thức Thanh Toán</Title>
                   </div>
                   
                   <Form.Item name="paymentMethod" style={{ marginBottom: 0 }}>
                     <Radio.Group style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                       
                       <Radio.Button value="COD" style={{ height: "auto", padding: 20, borderRadius: 16, border: "2px solid var(--border-color)", background: "transparent", display: "flex", alignItems: "center" }} className="payment-radio-btn">
                          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
                             <div style={{ width: 48, height: 48, borderRadius: 12, background: "#E0F2FE", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}><CarOutlined /></div>
                             <div style={{ flex: 1 }}>
                               <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-main)" }}>Thanh Toán Bằng Tiền Mặt (COD)</div>
                               <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Thanh toán khi nhận được hàng từ đối tác vận chuyển</div>
                             </div>
                          </div>
                       </Radio.Button>
                       
                       <Radio.Button value="banking" style={{ height: "auto", padding: 20, borderRadius: 16, border: "2px solid var(--border-color)", background: "transparent", display: "flex", alignItems: "center" }} className="payment-radio-btn">
                          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
                             <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F1F5F9", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}><CreditCardOutlined /></div>
                             <div style={{ flex: 1 }}>
                               <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-main)" }}>Chuyển Khoản Ngân Hàng</div>
                               <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Chuyển khoản trực tiếp 24/7 qua mã QR tự động</div>
                             </div>
                          </div>
                       </Radio.Button>

                       <Radio.Button value="momo" style={{ height: "auto", padding: 20, borderRadius: 16, border: "2px solid var(--border-color)", background: "transparent", display: "flex", alignItems: "center" }} className="payment-radio-btn">
                          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
                             <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FCE7F3", color: "#DB2777", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}><WalletOutlined /></div>
                             <div style={{ flex: 1 }}>
                               <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-main)" }}>Ví Điện Tử MoMo</div>
                               <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Quét mã QR qua app MoMo nhanh chóng</div>
                             </div>
                          </div>
                       </Radio.Button>

                     </Radio.Group>
                   </Form.Item>
                </div>
                
                {/* Submit button on mobile */}
                <div style={{ display: "block", marginTop: 24 }} className="lg:hidden">
                    <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ height: 60, borderRadius: 16, background: "var(--brand-teal)", border: "none", fontWeight: 800, fontSize: 16 }}>
                      Xác Nhận & Đặt Hàng Ngay
                    </Button>
                </div>
              </Form>
          </Col>

          {/* Cột Tóm tắt đơn hàng */}
          <Col xs={24} lg={10}>
             <div style={{ borderRadius: 24, position: "sticky", top: 100, background: "white", padding: 32, border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <Title level={4} style={{ fontWeight: 800, color: "var(--text-main)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                   <div className="bg-gradient-ai" style={{ width: 8, height: 24, borderRadius: 4 }} /> Đơn Hàng Của Bạn
                </Title>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24, maxHeight: 400, overflowY: "auto", paddingRight: 8 }} className="custom-scroll">
                  {items.map((item) => (
                    <div key={item._id} style={{ display: "flex", gap: 16 }}>
                      <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", background: "var(--bg-main)", border: "1px solid var(--border-color)", flexShrink: 0, position: "relative" }}>
                         <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                         <span style={{ position: "absolute", top: -8, right: -8, background: "var(--text-main)", color: "white", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{item.quantity}</span>
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-main)", marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.name}</div>
                        <div style={{ color: "var(--brand-teal)", fontWeight: 700, fontSize: 14 }}>{formatPrice(item.price)}</div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                     <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>Chưa có sản phẩm nào</p>
                  )}
                </div>
                
                {/* Promo Code section */}
                <div style={{ display: "flex", gap: 12, marginBottom: 24, padding: "24px 0", borderTop: "1px dashed var(--border-color)", borderBottom: "1px dashed var(--border-color)" }}>
                   <Input placeholder="Nhập mã ưu đãi (nếu có)" size="large" style={{ borderRadius: 10 }} value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />
                   <Button size="large" style={{ borderRadius: 10, fontWeight: 600, color: "var(--brand-teal)", borderColor: "var(--brand-teal)" }}>Áp Dụng</Button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <Text style={{ color: "var(--text-muted)", fontSize: 15 }}>Tạm tính</Text>
                     <Text style={{ fontWeight: 700, fontSize: 16, color: "var(--text-main)" }}>{formatPrice(subtotal)}</Text>
                   </div>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <Text style={{ color: "var(--text-muted)", fontSize: 15 }}>Phí vận chuyển</Text>
                     <Text style={{ fontWeight: 700, fontSize: 15, color: shippingFee === 0 ? "var(--brand-teal)" : "var(--text-main)" }}>
                       {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                     </Text>
                   </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, paddingTop: 24, borderTop: "1px solid var(--border-color)" }}>
                   <Text style={{ fontWeight: 700, fontSize: 18, color: "var(--text-main)" }}>Tổng thanh toán</Text>
                   <div style={{ textAlign: "right" }}>
                      <Text style={{ fontWeight: 800, fontSize: 32, color: "var(--brand-teal)", lineHeight: 1, display: "block" }}>{formatPrice(total)}</Text>
                   </div>
                </div>
                
                <Button className="hidden lg:block" type="primary" block size="large" loading={loading} onClick={() => form.submit()} style={{ height: 60, borderRadius: 16, background: "var(--brand-teal)", border: "none", fontWeight: 800, fontSize: 16, boxShadow: "0 8px 16px rgba(13, 148, 136, 0.2)" }}>
                  Xác Nhận & Đặt Hàng
                </Button>
                <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12, marginTop: 16 }}>Nhấn "Đặt Hàng" đồng nghĩa với việc bạn chấp nhận <a href="#" style={{ color: "var(--brand-teal)" }}>Điều Kiện & Điều Khoản</a> của chúng tôi.</p>
             </div>
          </Col>
        </Row>
       </div>
    </div>
  );
};

export default Checkout;
