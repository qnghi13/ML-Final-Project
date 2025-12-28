import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Avatar, message, Tag, Space, Divider, Typography } from 'antd';
import { UserOutlined, PhoneOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { api } from '../../services/api';

const { Text: AntText } = Typography;

const UserProfileModal = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});

    const loadProfileData = () => {
        try {
            const rawData = localStorage.getItem('user_info');
            if (rawData) {
                const info = JSON.parse(rawData);
                setUserData(info);

                form.setFieldsValue({
                    username: info.username || '',
                    fullname: info.full_name || '',
                    phone: info.phone_number || '',
                });
            }
        } catch (error) {
            console.error("Lỗi parse data:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadProfileData();
        }
    }, [isOpen, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);


            const response = await api.post('/api/auth/update-profile', {
                username: userData.username,
                full_name: values.fullname,
                phone_number: values.phone
            });

            const updatedInfo = {
                ...userData,
                full_name: response.data.full_name,
                phone_number: response.data.phone_number
            };
            localStorage.setItem('user_info', JSON.stringify(updatedInfo));

            message.success('Cập nhật thành công!');
            onClose();

            window.location.reload();
        } catch (error) {
            message.error(error.response?.data?.detail || "Lỗi cập nhật");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<Space><UserOutlined /><span>Thông tin tài khoản</span></Space>}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>Hủy</Button>,
                <Button key="save" type="primary" loading={loading} onClick={handleSave}>Lưu thay đổi</Button>,
            ]}
            centered
            destroyOnClose
        >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <Avatar
                    size={80}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username || 'user'}`}
                    style={{ border: '2px solid #1890ff' }}
                />
                <div style={{ marginTop: 8 }}>
                    <Tag color="blue">@{userData.username || '...'}</Tag>
                </div>
            </div>

            <Form form={form} layout="vertical">
                <Form.Item label="Tên đăng nhập" name="username">
                    <Input prefix={<IdcardOutlined />} disabled style={{ backgroundColor: '#f5f5f5' }} />
                </Form.Item>

                <Form.Item label="Họ và Tên" name="fullname" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                    <Input prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                        { pattern: /^[0-9]{10}$/, message: 'Phải đúng 10 chữ số' }
                    ]}
                >
                    <Input prefix={<PhoneOutlined />} />
                </Form.Item>

                <Divider plain><AntText type="secondary" style={{ fontSize: '12px' }}>Bảo mật</AntText></Divider>
                <Form.Item label="Mật khẩu">
                    <Input.Password prefix={<LockOutlined />} value="********" disabled />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserProfileModal;