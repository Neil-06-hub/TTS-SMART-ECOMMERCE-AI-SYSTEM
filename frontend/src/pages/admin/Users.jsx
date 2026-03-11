import { Table, Avatar, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "../../api";

const AdminUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminAPI.getUsers().then((r) => r.data.users),
  });

  const columns = [
    {
      title: "Khách hàng",
      render: (_, u) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar src={u.avatar} icon={!u.avatar && <UserOutlined />} style={{ background: "#667eea" }} />
          <div>
            <div style={{ fontWeight: 600 }}>{u.name}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{u.email}</div>
          </div>
        </div>
      ),
    },
    { title: "Điện thoại", dataIndex: "phone", render: (p) => p || "-" },
    { title: "Địa chỉ", dataIndex: "address", render: (a) => a || "-", ellipsis: true },
    {
      title: "Sở thích (AI Tags)",
      dataIndex: "preferences",
      render: (tags) => tags?.length ? tags.map((t) => <Tag key={t} color="purple" style={{ fontSize: 11 }}>{t}</Tag>) : "-",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];

  return (
    <div>
      <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Quản lý khách hàng ({data?.length || 0})</h3>
      <Table
        columns={columns} dataSource={data} rowKey="_id"
        loading={isLoading} style={{ background: "white", borderRadius: 12 }}
        pagination={{ pageSize: 15 }}
      />
    </div>
  );
};

export default AdminUsers;
