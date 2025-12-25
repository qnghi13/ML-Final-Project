import React, { useState, useRef } from 'react';
import { Modal, Form, Input, Button, Avatar, message, Tag, Space, Divider } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    LockOutlined,
    CameraOutlined,
    CheckCircleFilled,
    SafetyCertificateOutlined
} from '@ant-design/icons';

const UserProfileModal = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);

    // --- 1. LOGIC AVATAR (PREVIEW ONLY) ---
    // Link ảnh mặc định
    const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin";

    // State chỉ giữ ảnh hiện tại, KHÔNG lấy từ LocalStorage nữa
    const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);

    // Reference tới thẻ input ẩn
    const fileInputRef = useRef(null);

    // Bấm nút Camera -> Kích hoạt input file
    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    // Khi chọn file xong -> Đọc và hiển thị ngay
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Kiểm tra dung lượng < 2MB (Option)
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
                return;
            }

            // Đọc file để preview
            const reader = new FileReader();
            reader.onload = (e) => {
                // Chỉ set State để hiện ảnh lên ngay lập tức
                setAvatarUrl(e.target.result);
                message.success('Avatar preview updated!');
            };
            reader.readAsDataURL(file);
        }
    };
    // --------------------------------------

    const initialValues = {
        fullname: 'Nguyen Van A',
        email: 'admin@safetyvision.ai',
        phone: '0909123456',
        password: 'password123',
    };

    const handleVerifyPhone = () => {
        setVerifying(true);
        setTimeout(() => {
            setVerifying(false);
            setIsVerified(true);
            message.success('Phone number verified successfully!');
        }, 2000);
    };

    const handleSave = () => {
        message.success('Profile updated successfully');
        onClose();
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UserOutlined />
                    <span>Account Profile</span>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>Cancel</Button>,
                <Button key="save" type="primary" onClick={handleSave}>Save Changes</Button>,
            ]}
            width={500}
            centered
        >
            <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 10 }}>

                {/* --- PHẦN AVATAR --- */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                        size={100}
                        src={avatarUrl}
                        icon={<UserOutlined />}
                        style={{ border: '2px solid #1890ff', backgroundColor: '#f0f2f5' }}
                    />

                    {/* Nút Camera */}
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<CameraOutlined />}
                        size="small"
                        onClick={handleCameraClick}
                        style={{ position: 'absolute', bottom: 0, right: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                    />

                    {/* Input file ẩn */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                {/* ------------------- */}

                <div style={{ marginTop: 10, fontWeight: 'bold', fontSize: '16px' }}>Guardian / Admin</div>
            </div>

            <Divider />

            <Form form={form} layout="vertical" initialValues={initialValues}>
                <Form.Item label="Full Name" name="fullname">
                    <Input prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item label="Email Address" name="email">
                    <Input prefix={<MailOutlined />} disabled style={{ color: '#555', backgroundColor: '#f5f5f5' }} />
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        *Used for monthly reports and password recovery.
                    </div>
                </Form.Item>

                <Form.Item label={
                    <Space>
                        <span>Emergency Contact Phone</span>
                        {isVerified ? <Tag color="success" icon={<CheckCircleFilled />}>Verified</Tag> : <Tag color="warning">Unverified</Tag>}
                    </Space>
                } name="phone">
                    <Space.Compact style={{ width: '100%' }}>
                        <Input prefix={<PhoneOutlined />} style={{ width: '75%' }} />
                        {isVerified ? (
                            <Button disabled style={{ width: '25%', backgroundColor: '#f6ffed', color: '#52c41a' }}><CheckCircleFilled /> OK</Button>
                        ) : (
                            <Button type="primary" loading={verifying} onClick={handleVerifyPhone} style={{ width: '25%' }} icon={<SafetyCertificateOutlined />}>Verify</Button>
                        )}
                    </Space.Compact>
                    <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '4px' }}>
                        *Critical: This number will receive alerts via Zalo/SMS when a fall is detected.
                    </div>
                </Form.Item>

                <Form.Item label="Password" name="password">
                    <Input.Password prefix={<LockOutlined />} disabled />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserProfileModal;