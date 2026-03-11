import { useState } from "react";
import { Form, Input, Button, Card, Row, Col, Avatar, Tag, Typography, message, Tabs, DatePicker, Select, Upload } from "antd";
import { UserOutlined, LockOutlined, SaveOutlined, CameraOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuthStore } from "../store/useStore";
import { authAPI } from "../api";

const { Title, Text } = Typography;

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [profileForm] = Form.useForm();
  const [passForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        preferences: values.preferences
          ? (typeof values.preferences === "string" ? values.preferences.split(",").map((s) => s.trim()) : values.preferences)
          : [],
      };
      const { data } = await authAPI.updateProfile(payload);
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

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('Chỉ được phép upload file JPG/PNG/WEBP!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Hình ảnh phải nhỏ hơn 2MB!');
      return false;
    }

    getBase64(file, (url) => {
      setAvatarPreview(url);
      profileForm.setFieldsValue({ avatar: url });
    });

    return false; // Ngăn chặn AntD tự động gọi HTTP request (sẽ gửi data base64 lúc submit form)
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
          initialValues={{
             name: user?.name,
             phone: user?.phone,
             address: user?.address,
             avatar: user?.avatar,
             gender: user?.gender,
             dob: user?.dob ? dayjs(user.dob) : null,
             preferences: user?.preferences ? user.preferences.join(", ") : ""
          }}
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
          
          <Row gutter={16}>
             <Col xs={24} sm={12}>
               <Form.Item name="dob" label="Ngày sinh">
                 <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
               </Form.Item>
             </Col>
             <Col xs={24} sm={12}>
               <Form.Item name="gender" label="Giới tính">
                 <Select placeholder="Chọn giới tính" allowClear>
                    <Select.Option value="Nam">Nam</Select.Option>
                    <Select.Option value="Nữ">Nữ</Select.Option>
                    <Select.Option value="Khác">Khác</Select.Option>
                 </Select>
               </Form.Item>
             </Col>
          </Row>

          <Form.Item name="avatar" hidden>
             <Input />
          </Form.Item>

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
            <Upload
               name="avatar"
               showUploadList={false}
               beforeUpload={beforeUpload}
               accept="image/*"
            >
               <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }} className="group">
                 <Avatar size={100} icon={<UserOutlined />} src={avatarPreview || user?.avatar} style={{ background: "#667eea", marginBottom: 16, transition: "filter 0.3s" }} className="group-hover:brightness-75" />
                 <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -100%)", color: "white", fontSize: 24, opacity: 0, transition: "opacity 0.3s" }} className="group-hover:opacity-100">
                    <CameraOutlined />
                 </div>
               </div>
            </Upload>
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
