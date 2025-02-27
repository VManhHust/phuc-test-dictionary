'use client'

import { BookOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Typography, Row, Col, Layout } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;
const { Header, Footer, Content } = Layout;

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const onSearch = () => {
        console.log("Searching for:", searchTerm);
    };

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
            <Header style={{ backgroundColor: "#4A90E2", textAlign: "center", padding: "20px" }}>
                <Title level={2} style={{ color: "white", margin: 0 }}>
                    <BookOutlined /> Tra cứu từ điển tiếng Việt
                </Title>
            </Header>

            <Content style={{ padding: "40px 20px", textAlign: "center" }}>
                <Row justify="center" align="middle">
                    <Col xs={24} sm={20} md={16} lg={12}>
                        <div style={{ padding: "30px", backgroundColor: "#FFFFFF", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                            <Text style={{ fontSize: "18px", color: "#333" }}>
                                Nhập từ bạn muốn tra cứu và nhấn nút tìm kiếm.
                            </Text>
                            <Input
                                size="large"
                                placeholder="Nhập từ cần tra..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ marginTop: "20px", backgroundColor: "#fff", width: "100%" }}
                            />
                            <Button
                                type="primary"
                                size="large"
                                icon={<SearchOutlined />}
                                onClick={onSearch}
                                style={{ width: "100%", marginTop: "10px", backgroundColor: "#FF8C00", borderColor: "#FF8C00" }}
                            >
                                Tra cứu
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row justify="center" align="middle" style={{ marginTop: "40px" }}>
                    <Col xs={24} sm={20} md={16} lg={12}>
                        <div style={{ padding: "30px", backgroundColor: "#FFFFFF", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                            <Title level={3} style={{ color: "#4A90E2" }}>
                                <UserOutlined /> Tài khoản cá nhân
                            </Title>
                            <Text style={{ fontSize: "16px", color: "#333" }}>
                                Đăng nhập để lưu lại lịch sử tra cứu và cài đặt cá nhân của bạn.
                            </Text>
                            <Button
                                type="primary"
                                size="large"
                                style={{ width: "100%", marginTop: "10px", backgroundColor: "#4A90E2", borderColor: "#4A90E2" }}
                                href="/auth/login"
                            >
                                Đăng nhập ngay
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Content>

            <Footer style={{ textAlign: "center", padding: "20px", backgroundColor: "#4A90E2", color: "white" }}>
                © 2025 Tra cứu từ điển tiếng Việt. All rights reserved.
            </Footer>
        </Layout>
    );
};

export default HomePage;
