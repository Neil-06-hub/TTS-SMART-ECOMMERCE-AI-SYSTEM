import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Dropdown, Avatar, Space } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  DashboardOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useAuthStore, useCartStore } from "../../store/useStore";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: <Link to="/profile">Tài khoản</Link> },
    { key: "orders", icon: <OrderedListOutlined />, label: <Link to="/orders">Đơn hàng</Link> },
    ...(user?.role === "admin" ? [{ key: "admin", icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Quản trị</Link> }] : []),
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: () => { logout(); navigate("/"); },
    },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      height: 64, display: "flex", alignItems: "center", padding: "0 24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", marginRight: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShopOutlined style={{ color: "white", fontSize: 24 }} />
          <span style={{ color: "white", fontWeight: 700, fontSize: 20 }}>
            Smart<span style={{ color: "#ffd700" }}>Shop</span>
          </span>
        </div>
      </Link>

      {/* Nav Links */}
      <Space size={24} style={{ marginRight: 24 }}>
        <Link to="/" style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>Trang chủ</Link>
        <Link to="/shop" style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>Cửa hàng</Link>
      </Space>

      {/* Cart */}
      <Link to="/cart" style={{ marginRight: 16 }}>
        <Badge count={totalItems} size="small">
          <ShoppingCartOutlined style={{ fontSize: 22, color: "white" }} />
        </Badge>
      </Link>

      {/* Auth */}
      {isAuthenticated ? (
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
          <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar
              size={34}
              src={user?.avatar}
              icon={!user?.avatar && <UserOutlined />}
              style={{ background: "#ffd700", color: "#333" }}
            />
            <span style={{ color: "white", fontWeight: 500 }}>{user?.name?.split(" ").pop()}</span>
          </div>
        </Dropdown>
      ) : (
        <Space>
          <Button onClick={() => navigate("/login")} style={{ borderColor: "white", color: "white", background: "transparent" }}>
            Đăng nhập
          </Button>
          <Button onClick={() => navigate("/register")} type="primary" style={{ background: "#ffd700", color: "#333", borderColor: "#ffd700", fontWeight: 600 }}>
            Đăng ký
          </Button>
        </Space>
      )}
    </nav>
  );
};

export default Navbar;
