import { Row, Col, Typography, Button, Divider, Tag } from "antd";
import { ArrowRightOutlined, FireOutlined, ShopOutlined, CompassOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const About = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      category: "Xu Hướng",
      title: "Màu Cam Đất & Đỏ Rực: Tông Màu Thống Trị Thu Đông 2026",
      excerpt: "Sự trở lại mạnh mẽ của các tông màu ấm áp mang đến cảm giác tràn đầy năng lượng và tự tin, hoàn hảo cho những ngày se lạnh sắp tới.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
      date: "12/03/2026",
    },
    {
      id: 2,
      category: "Phong Cách",
      title: "Y2K Trở Lại: Khi Quá Khứ Giao Thoa Cùng Tương Lai AI",
      excerpt: "Nostalgia kết hợp cùng công nghệ vị lai, phong cách Y2K đang được giới trẻ biến tấu đầy sáng tạo không thể chối từ.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
      date: "05/03/2026",
    },
    {
      id: 3,
      category: "Mix & Match",
      title: "Phối Đồ Layering 101: Tỏa Sáng Mà Không Bị Rườm Rà",
      excerpt: "Bí kíp kết hợp nhiều lớp trang phục theo tỷ lệ chuẩn xác giúp bạn trông vừa thời thượng vừa giữ ấm tuyệt đối.",
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800",
      date: "28/02/2026",
    },
  ];

  return (
    <div style={{ background: "var(--bg-main)", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={{ position: "relative", height: "60vh", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1920')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", color: "white" }}>
          <h1 style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 900, marginBottom: 16, letterSpacing: -1 }}>
            Vể Chúng Tôi & <span className="text-gradient-ai">Fashion Blog</span>
          </h1>
          <p style={{ fontSize: 18, maxWidth: 600, margin: "0 auto 32px", color: "rgba(255,255,255,0.8)" }}>
            Khám phá câu chuyện đằng sau SmartShop AI và cập nhật những xu hướng thời trang thịnh hành nhất do AI của chúng tôi chọn lọc.
          </p>
          <Button size="large" type="primary" onClick={() => navigate("/shop")} style={{ borderRadius: 999, height: 50, padding: "0 32px", fontSize: 16, fontWeight: 700, boxShadow: "0 8px 16px rgba(234, 88, 12, 0.3)" }}>
            Bắt Đầu Mua Sắm
          </Button>
        </div>
      </section>

      <div className="container" style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
        
        {/* Về SmartShop Section */}
        <Row gutter={[48, 48]} align="middle" style={{ marginBottom: 100 }}>
           <Col xs={24} lg={12}>
              <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                 <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(234, 88, 12, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-teal)", fontSize: 32 }}>
                   <ShopOutlined />
                 </div>
              </div>
              <Title level={2} style={{ fontSize: 36, fontWeight: 900, color: "var(--text-main)", marginBottom: 24 }}>
                Sự Kết Hợp Giữa <br />Thời Trang & Công Nghệ
              </Title>
              <Paragraph style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 24 }}>
                SmartShop AI không chỉ là một cửa hàng. Chúng tôi là cầu nối giữa gu thẩm mỹ cá nhân của bạn và sức mạnh dự đoán xu hướng của trí tuệ nhân tạo.
              </Paragraph>
              <Paragraph style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.8 }}>
                Bằng cách phân tích hàng triệu dữ liệu thịnh hành toàn cầu, hệ thống gợi ý của chúng tôi giúp bạn luôn bắt kịp mọi làn sóng thời trang mới nhất.
              </Paragraph>
              <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
                 <div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "var(--brand-teal)", marginBottom: 8 }}>10K+</div>
                    <div style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14 }}>Sản Phẩm Tinh Chọn</div>
                 </div>
                 <div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "var(--brand-teal)", marginBottom: 8 }}>99%</div>
                    <div style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14 }}>Độ Chính Xác Gợi Ý AI</div>
                 </div>
              </div>
           </Col>
           <Col xs={24} lg={12}>
              <div style={{ position: "relative" }}>
                 <div style={{ position: "absolute", top: -20, left: -20, width: 200, height: 200, background: "rgba(234, 88, 12, 0.1)", borderRadius: "50%", filter: "blur(40px)", zIndex: 0 }} />
                 <img src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800" alt="About Store" style={{ width: "100%", borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", position: "relative", zIndex: 1 }} />
              </div>
           </Col>
        </Row>

        <Divider style={{ borderColor: "var(--border-color)", margin: "80px 0" }} />

        {/* Fashion Blog Section */}
        <div style={{ marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
           <div>
             <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--brand-teal)", fontWeight: 700, marginBottom: 8 }}>
                <FireOutlined /> TIN TỨC & XU HƯỚNG
             </div>
             <Title level={2} style={{ margin: 0, fontWeight: 900 }}>Tạp Chí Phong Cách</Title>
           </div>
           <Button type="link" onClick={() => navigate("/shop")} style={{ color: "var(--text-main)", fontWeight: 700 }}>
              Xem Thêm Xu Hướng <ArrowRightOutlined />
           </Button>
        </div>

        <Row gutter={[32, 32]}>
          {blogPosts.map((post) => (
            <Col xs={24} md={8} key={post.id}>
               <div style={{ cursor: "pointer", group: "true" }} className="hover:-translate-y-2 transition-transform duration-300">
                  <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", marginBottom: 20, height: 260 }}>
                     <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} className="hover:scale-105" />
                     <Tag color="orange" style={{ position: "absolute", top: 16, left: 16, padding: "4px 12px", borderRadius: 999, fontWeight: 700, border: "none" }}>{post.category}</Tag>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>
                     <span>{post.date}</span>
                     <span>•</span>
                     <span>Bởi SmartShop AI</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", marginBottom: 12, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                     {post.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                     {post.excerpt}
                  </p>
               </div>
            </Col>
          ))}
        </Row>

        {/* Newsletter Callout */}
        <div style={{ marginTop: 100, background: "var(--bg-main)", borderRadius: 32, padding: "64px 24px", textAlign: "center", border: "1px solid rgba(234, 88, 12, 0.2)", position: "relative", overflow: "hidden" }}>
           <div style={{ position: "absolute", bottom: -100, right: -100, width: 300, height: 300, background: "radial-gradient(circle, rgba(234, 88, 12, 0.1) 0%, rgba(255,255,255,0) 70%)" }} />
           <CompassOutlined style={{ fontSize: 48, color: "var(--brand-teal)", marginBottom: 24 }} />
           <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>Đừng Bỏ Lỡ Xu Hướng Mới Cùng AI</h2>
           <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 500, margin: "0 auto 32px" }}>Nhận bản tin xu hướng thời trang mỗi tuần được chọn lọc kỹ càng bởi AI dựa trên sở thích của bạn.</p>
           <Button size="large" type="primary" style={{ borderRadius: 999, padding: "0 40px", height: 50, fontWeight: 700, boxShadow: "0 8px 16px rgba(234, 88, 12, 0.3)" }}>Đăng Ký Bản Tin Phân Tích</Button>
        </div>

      </div>
    </div>
  );
};

export default About;
