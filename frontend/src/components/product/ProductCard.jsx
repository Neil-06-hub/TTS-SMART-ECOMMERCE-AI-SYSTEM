import { Card, Rate, Tag, Button, message } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCartStore, useAuthStore } from "../../store/useStore";
import { aiAPI } from "../../api";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    message.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
    // Track activity
    if (isAuthenticated) {
      aiAPI.trackActivity({ productId: product._id, action: "add_cart" }).catch(() => {});
    }
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      className="product-card"
      hoverable
      onClick={() => navigate(`/products/${product._id}`)}
      cover={
        <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          {discount > 0 && (
            <Tag color="red" style={{ position: "absolute", top: 8, left: 8, fontWeight: 700 }}>
              -{discount}%
            </Tag>
          )}
          {product.stock === 0 && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Tag color="default" style={{ fontSize: 14 }}>Hết hàng</Tag>
            </div>
          )}
        </div>
      }
      actions={[
        <Button
          key="cart" type="primary" icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart} disabled={product.stock === 0}
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none" }}
        >
          Thêm vào giỏ
        </Button>,
        <Button key="view" icon={<EyeOutlined />} onClick={() => navigate(`/products/${product._id}`)}>
          Xem
        </Button>,
      ]}
      style={{ borderRadius: 12, overflow: "hidden" }}
      bodyStyle={{ padding: "12px 16px" }}
    >
      <Tag color="purple" style={{ marginBottom: 6, fontSize: 11 }}>{product.category}</Tag>
      <Meta
        title={
          <span style={{ fontSize: 14, fontWeight: 600, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.name}
          </span>
        }
      />
      <div style={{ marginTop: 8 }}>
        <Rate disabled defaultValue={product.rating} style={{ fontSize: 12 }} />
        <span style={{ fontSize: 12, color: "#999", marginLeft: 4 }}>({product.numReviews})</span>
      </div>
      <div style={{ marginTop: 6 }}>
        <span className="price-tag">{formatPrice(product.price)}</span>
        {product.originalPrice > product.price && (
          <span className="price-original" style={{ marginLeft: 8 }}>{formatPrice(product.originalPrice)}</span>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
