import { useState } from "react";
import { Form, Input, Button, Card, Row, Col, Avatar, Tag, Typography, message, Tabs } from "antd";
import { UserOutlined, LockOutlined, SaveOutlined } from "@ant-design/icons";
import { useAuthStore } from "../store/useStore";
import { authAPI } from "../api";

const { Title, Text } = Typography;

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [profileForm] = Form.useForm();
  const [passForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(values);
      updateUser(data.user);
      message.success("Cập nhật thông tin thành công!");
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      await authAPI.changePassword(values);
      message.success("Đổi mật khẩu thành công!");
      passForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "info",
      label: "Thông tin cá nhân",
      children: (
        <Form
          form={profileForm}
          onFinish={handleUpdateProfile}
          layout="vertical"
          initialValues={{ name: user?.name, phone: user?.phone, address: user?.address }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="Địa chỉ">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="preferences" label="Sở thích (giúp AI gợi ý tốt hơn)">
            <Input placeholder="VD: điện tử, thời trang, sách (phân cách bằng dấu phẩy)" />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}
            style={{ background: "#667eea", border: "none" }}>
            Lưu thay đổi
          </Button>
        </Form>
      ),
    },
    {
      key: "password",
      label: "Đổi mật khẩu",
      children: (
        <Form form={passForm} onFinish={handleChangePassword} layout="vertical">
          <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true }, { min: 6, message: "Tối thiểu 6 ký tự" }]}>
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ background: "#667eea", border: "none" }}>
            Đổi mật khẩu
          </Button>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ padding: "32px 48px" }}>
      <Title level={3}>Tài khoản của tôi</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 12, textAlign: "center" }}>
            <Avatar size={100} icon={<UserOutlined />} src={user?.avatar} style={{ background: "#667eea", marginBottom: 16 }} />
            <Title level={4} style={{ margin: 0 }}>{user?.name}</Title>
            <Text type="secondary">{user?.email}</Text>
            <div style={{ marginTop: 12 }}>
              <Tag color={user?.role === "admin" ? "red" : "blue"}>{user?.role === "admin" ? "Admin" : "Khách hàng"}</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card style={{ borderRadius: 12 }}>
            <Tabs items={tabItems} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
