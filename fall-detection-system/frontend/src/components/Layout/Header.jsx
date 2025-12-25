
import React, { useState } from 'react';

import { Layout, Button, Avatar, Badge, Dropdown, Space, Typography } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// Import component Profile vừa tạo
import UserProfileModal from './UserProfileModal';
import HelpCenterModal from './HelpCenterModal';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();

    // State để bật tắt modal Profile
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const handleLogout = () => {
        navigate('/');
    };

    // Danh sách menu dropdown
    const userMenuItems = [
        { key: 'profile', label: 'My Profile' }, // Key là 'profile'
        { key: 'help', label: 'Help Center' },
        { type: 'divider' },
        { key: 'logout', label: 'Logout', danger: true },
    ];

    // Xử lý sự kiện click menu
    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            handleLogout();
        } else if (e.key === 'profile') {
            setIsProfileOpen(true);
        } else if (e.key === 'help') { // Thêm dòng này
            setIsHelpOpen(true);
        }
    };

    return (
        <>
            <AntHeader
                style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
                    zIndex: 1,
                }}
            >
                {/* Nút thu gọn Menu */}
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ fontSize: '16px', width: 64, height: 64, marginLeft: -24 }}
                />

                {/* Khu vực bên phải */}
                <Space size="large">
                    <Badge count={5} dot>
                        <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: '20px' }} />} />
                    </Badge>

                    <Dropdown
                        menu={{ items: userMenuItems, onClick: handleMenuClick }}
                        trigger={['click']}
                    >
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                                <Text strong>Admin</Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>Monitoring Center</Text>
                            </div>
                        </Space>
                    </Dropdown>
                </Space>
            </AntHeader>

            {/* Đặt Modal Profile ở đây, nó ẩn cho đến khi isOpen=true */}
            <UserProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
            <HelpCenterModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />
        </>
    );
};

export default Header;