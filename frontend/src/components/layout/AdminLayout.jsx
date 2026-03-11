import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, theme } from "antd";
import {
  DashboardOutlined, AppstoreOutlined, OrderedListOutlined,
  TeamOutlined, NotificationOutlined, LogoutOutlined, UserOutlined, ShopOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/useStore";

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "/admin/dashboard", icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Dashboard</Link> },
  { key: "/admin/products", icon: <AppstoreOutlined />, label: <Link to="/admin/products">Sản phẩm</Link> },
  { key: "/admin/orders", icon: <OrderedListOutlined />, label: <Link to="/admin/orders">Đơn hàng</Link> },
  { key: "/admin/users", icon: <TeamOutlined />, label: <Link to="/admin/users">Khách hàng</Link> },
  { key: "/admin/marketing", icon: <NotificationOutlined />, label: <Link to="/admin/marketing">Marketing AI</Link> },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { token: { colorBgContainer } } = theme.useToken();

  const userMenu = {
    items: [
      { key: "home", icon: <ShopOutlined />, label: <Link to="/">Về trang chủ</Link> },
      { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true, onClick: () => { logout(); navigate("/login"); } },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible collapsed={collapsed} onCollapse={setCollapsed}
        style={{ background: "#1a1a2e" }}
        theme="dark"
      >
        <div style={{
          height: 64, display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}>
          <ShopOutlined style={{ color: "#ffd700", fontSize: 20 }} />
          {!collapsed && (
            <span style={{ color: "white", fontWeight: 700, fontSize: 16, marginLeft: 8 }}>
              Admin Panel
            </span>
          )}
        </div>
        <Menu
          theme="dark" mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ background: "#1a1a2e", borderRight: "none" }}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: "0 24px", background: colorBgContainer,
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}>
          <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ background: "#667eea" }} />
              <span style={{ fontWeight: 500 }}>{user?.name}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: "24px", background: "#f5f5f5", minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
