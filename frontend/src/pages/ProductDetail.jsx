import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Row, Col, Button, Rate, Tag, InputNumber, Spin, Form, Input, message, Divider, Typography } from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { productAPI } from "../api";
import { useCartStore, useAuthStore } from "../store/useStore";
import ProductCard from "../components/product/ProductCard";

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [qty, setQty] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productAPI.getById(id).then((r) => r.data),
  });

  if (isLoading) return <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>;

  const { product, similar } = data || {};
  if (!product) return null;

  const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addItem(product, qty);
    message.success(`Đã thêm ${qty} "${product.name}" vào giỏ hàng!`);
  };

  const handleReview = async (values) => {
    if (!isAuthenticated) return message.warning("Vui lòng đăng nhập để đánh giá");
    try {
      await productAPI.addReview(id, values);
      message.success("Đánh giá thành công!");
      form.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi gửi đánh giá");
    }
  };

  return (
    <div style={{ padding: "32px 48px" }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        Quay lại
      </Button>

      <Row gutter={[40, 40]}>
        {/* Product Image */}
        <Col xs={24} md={10}>
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", borderRadius: 12, objectFit: "cover" }} />
            {discount > 0 && <Tag color="red" style={{ position: "absolute", top: 12, left: 12, fontSize: 14, padding: "4px 10px" }}>-{discount}%</Tag>}
          </div>
        </Col>

        {/* Product Info */}
        <Col xs={24} md={14}>
          <Tag color="purple">{product.category}</Tag>
          <Title level={2} style={{ marginTop: 8 }}>{product.name}</Title>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Rate disabled value={product.rating} />
            <Text type="secondary">({product.numReviews} đánh giá)</Text>
            <Text type="secondary">• Đã bán: {product.sold}</Text>
          </div>

          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: "#e53935" }}>{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: 18, color: "#999", textDecoration: "line-through", marginLeft: 12 }}>{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <Paragraph style={{ color: "#555", lineHeight: 1.8 }}>{product.description}</Paragraph>

          <div style={{ marginBottom: 16 }}>
            {product.tags?.map((tag) => <Tag key={tag} style={{ marginBottom: 4 }}>{tag}</Tag>)}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Text strong>Số lượng:</Text>
            <InputNumber min={1} max={product.stock} value={qty} onChange={setQty} />
            <Text type="secondary">({product.stock} sản phẩm còn lại)</Text>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Button
              size="large" type="primary" icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart} disabled={product.stock === 0}
              style={{ flex: 1, height: 48, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none", fontWeight: 600 }}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              size="large" danger
              onClick={() => { handleAddToCart(); navigate("/checkout"); }}
              disabled={product.stock === 0}
              style={{ flex: 1, height: 48, fontWeight: 600 }}
            >
              Mua ngay
            </Button>
          </div>
        </Col>
      </Row>

      <Divider />

      {/* Reviews */}
      <div style={{ marginTop: 24 }}>
        <Title level={4}>Đánh giá sản phẩm</Title>
        {product.reviews?.map((r) => (
          <div key={r._id} style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text strong>{r.name}</Text>
              <Rate disabled defaultValue={r.rating} style={{ fontSize: 12 }} />
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString("vi-VN")}</Text>
            <p style={{ marginTop: 4 }}>{r.comment}</p>
          </div>
        ))}

        {isAuthenticated && (
          <div style={{ marginTop: 20 }}>
            <Title level={5}>Viết đánh giá của bạn</Title>
            <Form form={form} onFinish={handleReview} layout="vertical">
              <Form.Item name="rating" label="Đánh giá" rules={[{ required: true, message: "Vui lòng chọn số sao" }]}>
                <Rate />
              </Form.Item>
              <Form.Item name="comment" label="Nhận xét" rules={[{ required: true, message: "Vui lòng nhập nhận xét" }]}>
                <Input.TextArea rows={3} placeholder="Chia sẻ trải nghiệm của bạn..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ background: "#667eea", border: "none" }}>
                  Gửi đánh giá
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>

      {/* AI Similar Products */}
      {similar?.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0 }}>Sản phẩm tương tự</Title>
            <Tag color="purple">AI Powered</Tag>
          </div>
          <Row gutter={[16, 16]}>
            {similar.map((p) => (
              <Col key={p._id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={p} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

// Import useState
import { useState } from "react";
export default ProductDetail;
