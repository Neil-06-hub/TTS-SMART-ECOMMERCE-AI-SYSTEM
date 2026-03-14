import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./Navbar";
import Footer from "./Footer";

const { Content } = Layout;

const ClientLayout = () => (
  <Layout style={{ minHeight: "100vh" }}>
    <Navbar />
    <Content style={{ marginTop: 64 }}>
      <Outlet />
    </Content>
    <Footer />
  </Layout>
);

export default ClientLayout;
