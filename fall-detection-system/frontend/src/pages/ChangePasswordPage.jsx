import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Row, Col } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ChangePasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);

            const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');

            await api.post('/api/auth/change-password', {
                username: userInfo.username,
                current_password: values.currentPassword,
                new_password: values.newPassword
            });

            message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');

            localStorage.clear();
            navigate('/');

        } catch (error) {
            message.error(error.response?.data?.detail || "Mật khẩu cũ không đúng hoặc lỗi hệ thống");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="center">
                <Col xs={24} md={12} lg={8}>
                    <Card hoverable style={{ marginTop: 20, borderRadius: 10 }}>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <LockOutlined style={{ fontSize: 40, color: '#1890ff' }} />
                            <Title level={3}>Đổi mật khẩu</Title>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="currentPassword"
                                label="Mật khẩu hiện tại"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu cũ" />
                            </Form.Item>

                            <Form.Item
                                name="newPassword"
                                label="Mật khẩu mới"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                                    { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' }
                                ]}
                            >
                                <Input.Password prefix={<CheckCircleOutlined />} placeholder="Nhập mật khẩu mới" />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label="Xác nhận mật khẩu mới"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<CheckCircleOutlined />} placeholder="Nhập lại mật khẩu mới" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                                    Xác nhận đổi
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ChangePasswordPage;