
import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Tabs, message, Modal, Steps } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    SafetyCertificateFilled,
    PhoneOutlined,
    SafetyOutlined,
    SendOutlined,
    KeyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import apiClient from '../services/api'; // Import api client để gọi endpoint quên mk

const { Title, Text } = Typography;

const LandingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('1'); // '1': Login, '2': Register

    // --- STATES CHO QUÊN MẬT KHẨU ---
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Nhập user, 2: Nhập OTP & Pass mới
    const [resetUsername, setResetUsername] = useState(''); // Lưu tạm username đang reset

    // === 1. XỬ LÝ ĐĂNG NHẬP ===
    const onLoginFinish = async (values) => {
        setLoading(true);
        try {
            await authService.login(values.username, values.password);
            message.success('Đăng nhập thành công!');
            navigate('/dashboard');
        } catch (error) {
            console.error("Login error:", error);
            const errorMsg = error.response?.data?.detail || "Đăng nhập thất bại.";
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // === 2. XỬ LÝ ĐĂNG KÝ ===
    const onRegisterSubmit = async (values) => {
        setLoading(true);
        try {
            await authService.register({
                username: values.username,
                password: values.password,
                full_name: values.full_name,
                phone_number: values.phone_number
            });
            message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            setActiveTab('1');
        } catch (error) {
            console.error("Register error:", error);
            if (error.response && error.response.status === 400) {
                message.error(error.response.data.detail);
            } else {
                message.error("Đăng ký thất bại. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

    // === 3. XỬ LÝ QUÊN MẬT KHẨU (Gửi OTP Telegram) ===

    // Bước 1: Gửi yêu cầu lấy OTP
    const onRequestOtp = async (values) => {
        setLoading(true);
        try {
            // Gọi API Backend: /api/auth/forgot-password/request
            // Body: { username: values.username }
            // Backend sẽ tìm user, lấy ChatID telegram và gửi mã

            // --- Code giả lập hoặc gọi API thực tế ---
            await apiClient.post('/api/auth/forgot-password/request', { username: values.username });

            // Nếu thành công:
            setResetUsername(values.username);
            setForgotStep(2); // Chuyển sang bước nhập OTP
            message.success(`Mã OTP đã được gửi đến Telegram của tài khoản ${values.username}`);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.detail || "Không tìm thấy tài khoản hoặc chưa liên kết Telegram.";
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Bước 2: Xác thực OTP và Đổi mật khẩu
    const onResetPassword = async (values) => {
        setLoading(true);
        try {
            // Gọi API Backend: /api/auth/forgot-password/reset
            // Body: { username: resetUsername, otp: values.otp, new_password: values.new_password }

            await apiClient.post('/api/auth/forgot-password/reset', {
                username: resetUsername,
                otp: values.otp,
                new_password: values.new_password
            });

            message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            setIsForgotModalOpen(false); // Đóng modal
            setForgotStep(1); // Reset về bước 1
            setActiveTab('1'); // Chuyển về tab Login
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.detail || "Mã OTP không đúng hoặc hết hạn.";
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // === COMPONENTS CON ===

    // 1. Form Login (Đã thêm nút Quên mật khẩu)
    const LoginForm = () => (
        <Form name="login" onFinish={onLoginFinish} layout="vertical" size="large">
            <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
                <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            {/* --- NÚT QUÊN MẬT KHẨU --- */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                <a
                    onClick={(e) => { e.preventDefault(); setIsForgotModalOpen(true); }}
                    style={{ color: '#1890ff' }}
                >
                    Quên mật khẩu?
                </a>
            </div>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
                    Đăng Nhập
                </Button>
            </Form.Item>
        </Form>
    );

    // 2. Form Register
    const RegisterForm = () => (
        <Form name="register" onFinish={onRegisterSubmit} layout="vertical" size="large">
            <Form.Item name="full_name" rules={[{ required: true, message: 'Vui lòng nhập Họ tên!' }]}>
                <Input prefix={<UserOutlined />} placeholder="Họ và Tên (VD: Nguyen Van A)" />
            </Form.Item>
            <Form.Item
                name="phone_number"
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ được chứa số!' },
                    { len: 10, message: 'Số điện thoại phải đúng 10 số!' }
                ]}
            >
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại (10 số)" maxLength={10} />
            </Form.Item>
            <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
                <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
                    Đăng Ký Tài Khoản
                </Button>
            </Form.Item>
        </Form>
    );

    const items = [
        { key: '1', label: 'Đăng Nhập', children: <LoginForm /> },
        { key: '2', label: 'Đăng Ký', children: <RegisterForm /> },
    ];

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #001529 0%, #0050b3 100%)'
        }}>
            <Card
                style={{ width: 900, height: 600, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                bodyStyle={{ padding: 0, height: '100%' }}
            >
                <div style={{ display: 'flex', height: '100%' }}>
                    {/* CỘT TRÁI */}
                    <div style={{
                        flex: 1,
                        background: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80) center/cover no-repeat',
                        position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 40
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))' }} />
                        <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                            <SafetyCertificateFilled style={{ fontSize: 48, color: '#1890ff', marginBottom: 20 }} />
                            <Title level={2} style={{ color: 'white', margin: 0 }}>An Toàn AI</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>Hệ thống cảnh báo đột quỵ & té ngã</Text>
                        </div>
                    </div>

                    {/* CỘT PHẢI */}
                    <div style={{ flex: 1, padding: '60px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center', marginBottom: 30 }}>
                            <Title level={3}>Bảo vệ Người thân của bạn</Title>
                            <Text type="secondary">Vui lòng nhập thông tin để truy cập hệ thống.</Text>
                        </div>
                        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} centered size="large" />
                    </div>
                </div>
            </Card>

            {/* --- MODAL QUÊN MẬT KHẨU --- */}
            <Modal
                open={isForgotModalOpen}
                title="Khôi phục mật khẩu qua Telegram"
                onCancel={() => { setIsForgotModalOpen(false); setForgotStep(1); }}
                footer={null}
                centered
            >
                <div style={{ padding: '20px 0' }}>
                    {forgotStep === 1 ? (
                        // BƯỚC 1: NHẬP USERNAME
                        <Form onFinish={onRequestOtp} layout="vertical">
                            <Text type="secondary" style={{ display: 'block', marginBottom: 15 }}>
                                Nhập Username của bạn. Hệ thống sẽ gửi mã OTP đến tài khoản Telegram đã liên kết.
                            </Text>
                            <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Nhập Username của bạn" size="large" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block size="large" icon={<SendOutlined />}>
                                    Gửi OTP
                                </Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        // BƯỚC 2: NHẬP OTP & PASS MỚI
                        <Form onFinish={onResetPassword} layout="vertical">
                            <Text type="secondary" style={{ display: 'block', marginBottom: 15 }}>
                                Mã OTP đã được gửi. Vui lòng kiểm tra Telegram.
                            </Text>

                            <Form.Item name="otp" rules={[{ required: true, message: 'Nhập mã OTP!' }, { len: 6, message: 'Mã OTP gồm 6 chữ số' }]}>
                                <Input prefix={<SafetyOutlined />} placeholder="Nhập mã OTP (6 số)" size="large" maxLength={6} style={{ textAlign: 'center', letterSpacing: 4 }} />
                            </Form.Item>

                            <Form.Item name="new_password" rules={[{ required: true, message: 'Nhập mật khẩu mới!' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}>
                                <Input.Password prefix={<KeyOutlined />} placeholder="Mật khẩu mới" size="large" />
                            </Form.Item>

                            <Form.Item
                                name="confirm_password"
                                dependencies={['new_password']}
                                rules={[
                                    { required: true, message: 'Xác nhận mật khẩu!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('new_password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<KeyOutlined />} placeholder="Xác nhận mật khẩu mới" size="large" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                                    Đổi mật khẩu
                                </Button>
                            </Form.Item>
                            <Button type="link" onClick={() => setForgotStep(1)} block>Quay lại nhập Username</Button>
                        </Form>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default LandingPage;