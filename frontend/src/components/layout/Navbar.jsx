import { Link, useNavigate, useLocation } from "react-router-dom";
import { Badge, Button, Dropdown, Avatar, Space } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useAuthStore, useCartStore } from "../../store/useStore";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/shop", label: "Cửa hàng" },
    { to: "/shop", label: "AI Gợi ý" },
    { to: "/", label: "Về chúng tôi" },
  ];

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: <Link to="/profile">Tài khoản</Link> },
    { key: "orders", icon: <OrderedListOutlined />, label: <Link to="/orders">Đơn hàng</Link> },
    ...(user?.role === "admin"
      ? [{ key: "admin", icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Quản trị</Link> }]
      : []),
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
      background: "white",
      borderBottom: "1px solid #F1F5F9",
      height: 76,
      display: "flex", alignItems: "center",
      padding: "0 56px",
      boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", marginRight: 56, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44,
            background: "linear-gradient(135deg, #06B6D4, #10B981)",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 22, fontWeight: 700,
          }}>✦</div>
          <span style={{ color: "#06B6D4", fontWeight: 700, fontSize: 22 }}>SmartShop AI</span>
        </div>
      </Link>

      {/* Nav Links */}
      <Space size={36} style={{ flex: 1 }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to && link.label === "Trang chủ"
            ? location.pathname === "/"
            : location.pathname === link.to;
          return (
            <Link
              key={link.label}
              to={link.to}
              style={{
                color: "#0F172A",
                fontWeight: 500,
                fontSize: 17,
                textDecoration: "none",
                borderBottom: isActive ? "2px solid #06B6D4" : "2px solid transparent",
                paddingBottom: 3,
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </Space>

      {/* Right */}
      <Space size={20} align="center">
        <Link to="/cart">
          <Badge count={totalItems} style={{ background: "#F97316" }}>
            <ShoppingCartOutlined style={{ fontSize: 28, color: "#0F172A" }} />
          </Badge>
        </Link>

        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar
                size={42}
                src={user?.avatar}
                icon={!user?.avatar && <UserOutlined />}
                style={{ background: "linear-gradient(135deg, #06B6D4, #10B981)", color: "white" }}
              />
              <span style={{ color: "#0F172A", fontWeight: 500, fontSize: 16 }}>{user?.name?.split(" ").pop()}</span>
            </div>
          </Dropdown>
        ) : (
          <Space size={10}>
            <UserOutlined style={{ fontSize: 26, color: "#0F172A", cursor: "pointer" }} />
            <Button
              onClick={() => navigate("/login")}
              style={{
                borderColor: "#0F172A",
                color: "#0F172A",
                background: "transparent",
                borderRadius: 999,
                fontWeight: 600,
                height: 46,
                padding: "0 26px",
                fontSize: 16,
              }}
            >
              Đăng nhập
            </Button>
          </Space>
        )}
      </Space>
    </nav>
  );
};

export default Navbar;
