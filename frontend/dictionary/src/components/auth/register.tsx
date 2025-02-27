'use client'
import React from 'react';
import { Button, Col, Form, Input, notification, Row, Card, Typography, Divider } from 'antd';
import { ArrowLeftOutlined, UserAddOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const Register = () => {
    const router = useRouter();

    const onFinish = async (values: any) => {
        const { email, password, name } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
            method: "POST",
            body: { email, password, name }
        });

        if (res?.data) {
            router.push(`/verify/${res?.data?._id}`);
        } else {
            notification.error({
                message: "Register error",
                description: res?.message
            });
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: 'Poppins, sans-serif' }}>
            <Col xs={24} md={12} style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#4A90E2", minHeight: "100vh", padding: "40px" }}>
                <div style={{ textAlign: "center", color: "white", maxWidth: "400px" }}>
                    <Title level={1} style={{ color: "white", fontWeight: 600, marginBottom: "20px" }}>Từ điển tiếng Việt</Title>
                    <Text style={{ fontSize: "18px", lineHeight: "1.6" }}>Khám phá kho từ vựng phong phú với định nghĩa, ví dụ và hơn thế nữa.</Text>
                </div>
            </Col>
                <Col xs={24} md={12}>
                    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
                    <Card bordered={false} style={{ width: "100%", borderRadius: "12px" }}>
                        <Title level={2} style={{ textAlign: "center", fontWeight: 600 }}><UserAddOutlined /> Đăng Ký Tài Khoản</Title>
                        <Form name="register" onFinish={onFinish} layout='vertical'>
                            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                                <Input size="large" placeholder="Nhập email của bạn" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                            <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                                <Input.Password size="large" placeholder="Nhập mật khẩu" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                            <Form.Item label="Họ và tên" name="name">
                                <Input size="large" placeholder="Nhập họ và tên" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="large" style={{ width: "100%", borderRadius: "8px", fontWeight: 600 }}>Đăng Ký</Button>
                            </Form.Item>
                        </Form>
                        <Divider />
                        <div style={{ textAlign: "center" }}>
                            <Text>Đã có tài khoản?</Text> <Link href="/auth/login">Đăng nhập</Link>
                        </div>
                        <div style={{ textAlign: "center", marginTop: "15px" }}>
                            <Link href="/"><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                        </div>
                    </Card>
                    </Row>
                </Col>
        </Row>
    );
}

export default Register;
