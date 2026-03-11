import { useState } from "react";
import { Table, Tag, Select, Button, Space, Typography, Drawer, Descriptions, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "../../api";

const { Option } = Select;

const statusConfig = {
  pending: { color: "orange", text: "Chờ xác nhận" },
  confirmed: { color: "blue", text: "Đã xác nhận" },
  shipping: { color: "cyan", text: "Đang giao hàng" },
  delivered: { color: "green", text: "Đã giao hàng" },
  cancelled: { color: "red", text: "Đã hủy" },
};

const paymentConfig = {
  pending: { color: "orange", text: "Chưa thanh toán" },
  paid: { color: "green", text: "Đã thanh toán" },
  failed: { color: "red", text: "Thất bại" },
};

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: () => adminAPI.getOrders({ status: statusFilter }).then((r) => r.data),
  });

  const handleStatusUpdate = async (orderId, orderStatus, paymentStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { orderStatus, paymentStatus });
      message.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setSelectedOrder(null);
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      render: (id) => <Typography.Text copyable code>{id.slice(-8).toUpperCase()}</Typography.Text>,
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      render: (u) => (
        <div>
          <div style={{ fontWeight: 600 }}>{u?.name}</div>
          <div style={{ fontSize: 12, color: "#999" }}>{u?.email}</div>
        </div>
      ),
    },
    { title: "Tổng tiền", dataIndex: "totalAmount", render: formatPrice, sorter: (a, b) => a.totalAmount - b.totalAmount },
    { title: "TT Đơn hàng", dataIndex: "orderStatus", render: (s) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.text || s}</Tag> },
    { title: "TT Thanh toán", dataIndex: "paymentStatus", render: (s) => <Tag color={paymentConfig[s]?.color}>{paymentConfig[s]?.text || s}</Tag> },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => setSelectedOrder(record)}>Xem</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, margin: 0 }}>Quản lý đơn hàng</h3>
        <Select value={statusFilter || undefined} placeholder="Lọc theo trạng thái" style={{ width: 200 }}
          onChange={setStatusFilter} allowClear>
          <Option value="pending">Chờ xác nhận</Option>
          <Option value="confirmed">Đã xác nhận</Option>
          <Option value="shipping">Đang giao</Option>
          <Option value="delivered">Đã giao</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>
      </div>

      <Table
        columns={columns} dataSource={data?.orders} rowKey="_id"
        loading={isLoading} style={{ background: "white", borderRadius: 12 }}
        pagination={{ pageSize: 15, showTotal: (t) => `${t} đơn hàng` }}
      />

      {/* Order Detail Drawer */}
      <Drawer
        title={`Chi tiết đơn hàng #${selectedOrder?._id.slice(-8).toUpperCase()}`}
        open={!!selectedOrder} onClose={() => setSelectedOrder(null)}
        width={520}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={1} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Khách hàng">{selectedOrder.user?.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrder.user?.email}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao">{selectedOrder.shippingAddress?.fullName} - {selectedOrder.shippingAddress?.phone}</Descriptions.Item>
              <Descriptions.Item label="">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</Descriptions.Item>
              <Descriptions.Item label="Thanh toán">{selectedOrder.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Typography.Text strong style={{ color: "#e53935", fontSize: 16 }}>
                  {formatPrice(selectedOrder.totalAmount)}
                </Typography.Text>
              </Descriptions.Item>
            </Descriptions>

            {/* Products */}
            <div style={{ marginBottom: 20 }}>
              <Typography.Title level={5}>Sản phẩm</Typography.Title>
              {selectedOrder.items?.map((item) => (
                <div key={item._id} style={{ display: "flex", gap: 10, marginBottom: 8, padding: 8, background: "#fafafa", borderRadius: 6 }}>
                  <img src={item.image} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} alt={item.name} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>x{item.quantity} × {formatPrice(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Update Status */}
            <Typography.Title level={5}>Cập nhật trạng thái</Typography.Title>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Select defaultValue={selectedOrder.orderStatus} style={{ width: "100%" }}
                onChange={(v) => handleStatusUpdate(selectedOrder._id, v, undefined)}>
                <Option value="pending">Chờ xác nhận</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="shipping">Đang giao hàng</Option>
                <Option value="delivered">Đã giao hàng</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
              <Select defaultValue={selectedOrder.paymentStatus} style={{ width: "100%" }}
                onChange={(v) => handleStatusUpdate(selectedOrder._id, undefined, v)}>
                <Option value="pending">Chưa thanh toán</Option>
                <Option value="paid">Đã thanh toán</Option>
                <Option value="failed">Thất bại</Option>
              </Select>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminOrders;
