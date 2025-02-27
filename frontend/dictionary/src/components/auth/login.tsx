'use client'
import {Button, Col, Form, Input, notification, Row, Card, Typography, Divider} from 'antd';
import {ArrowLeftOutlined, GoogleOutlined} from '@ant-design/icons';
import Link from 'next/link';
import {authenticate} from '@/utils/actions';
import {useRouter} from 'next/navigation';
import ModalReactive from './modal.reactive';
import {useState} from 'react';
import ModalChangePassword from './modal.change.password';

const {Title, Text} = Typography;

const Login = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [changePassword, setChangePassword] = useState(false);

    const onFinish = async (values: any) => {
        const {username, password} = values;
        setUserEmail("");
        const res = await authenticate(username, password);

        if (res?.error) {
            if (res?.code === 2) {
                setIsModalOpen(true);
                setUserEmail(username);
                return;
            }
            notification.error({
                message: "Error login",
                description: res?.error
            });
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <Row justify="center" align="middle"
             style={{minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: 'Poppins, sans-serif'}}>
                <Col xs={24} md={8} style={{minHeight: "90vh"}}>
                <Card bordered={false}
                      style={{boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", minHeight: "92vh", padding: "60px",  backgroundColor: "#4A90E2"}}>
                <Title level={1} style={{color: "white", fontWeight: 600, marginBottom: "20px"}}>Từ điển tiếng
                    Việt</Title>
                <Text style={{fontSize: "18px", lineHeight: "1.6"}}>Khám phá kho từ vựng phong phú với định nghĩa, ví dụ
                    và hơn thế nữa.</Text>
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card bordered={false}
                      style={{boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", maxHeight: "92vh", padding: "40px"}}>
                    <Title level={2} style={{textAlign: "center", fontWeight: 600}}>Đăng Nhập</Title>
                    <Form name="basic" onFinish={onFinish} layout='vertical'>
                        <Form.Item
                            label="Email"
                            name="username"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <Input size="large" placeholder="Nhập email của bạn" style={{borderRadius: "8px"}}/>
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{required: true, message: 'Please input your password!'}]}
                        >
                            <Input.Password size="large" placeholder="Nhập mật khẩu" style={{borderRadius: "8px"}}/>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" style={{
                                width: "100%",
                                backgroundColor: "#4A90E2",
                                borderColor: "#4A90E2",
                                borderRadius: "8px",
                                fontWeight: 600
                            }}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                    <Button type='link' onClick={() => setChangePassword(true)}
                            style={{width: "100%", textAlign: "center", fontWeight: 500}}>Quên mật khẩu?</Button>
                    <Divider>Hoặc</Divider>
                    <Button icon={<GoogleOutlined/>}
                            style={{width: "100%", marginBottom: "10px", borderRadius: "8px", fontWeight: 500}}>Sign in
                        with Google</Button>
                    <Divider/>
                    <div style={{textAlign: "center"}}>
                        <Text>Chưa có tài khoản?</Text> <Link href="/auth/register">Đăng ký tại đây</Link>
                    </div>
                    <div style={{textAlign: "center", marginTop: "15px"}}>
                        <Link href="/"><ArrowLeftOutlined/> Quay lại trang chủ</Link>
                    </div>
                </Card>
            </Col>
            <ModalReactive isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userEmail={userEmail}/>
            <ModalChangePassword isModalOpen={changePassword} setIsModalOpen={setChangePassword}/>
        </Row>
    );
}

export default Login;
