import React, { useState } from 'react';

import { Layout, Button, Avatar, Dropdown, Space, Typography } from 'antd'; // Bỏ Badge
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
    // Bỏ BellOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UserProfileModal from './UserProfileModal';
import HelpCenterModal from './HelpCenterModal';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();

    // State bật tắt modal
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // --- LOGIC LẤY THÔNG TIN USER TỪ LOCALSTORAGE ---
    const getUserInfo = () => {
        try {
            const stored = localStorage.getItem('user_info');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            return {};
        }
    };
    
    const userInfo = getUserInfo();
    const displayName = userInfo.username || 'Admin'; // Ưu tiên hiện username
    const subText = userInfo.full_name || 'Trung tâm giám sát'; // Dòng dưới hiện tên đầy đủ

    const handleLogout = () => {
        localStorage.clear(); // Xóa data khi logout
        navigate('/');
    };

    const userMenuItems = [
        { key: 'profile', label: 'Tài khoản' },
        { key: 'help', label: 'Hỗ trợ' },
        { type: 'divider' },
        { key: 'logout', label: 'Đăng xuất', danger: true },
    ];

    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            handleLogout();
        } else if (e.key === 'profile') {
            setIsProfileOpen(true);
        } else if (e.key === 'help') {
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
                    {/* ĐÃ XÓA PHẦN CÁI CHUÔNG (BADGE & BELL) */}

                    <Dropdown
                        menu={{ items: userMenuItems, onClick: handleMenuClick }}
                        trigger={['click']}
                    >
                        <Space style={{ cursor: 'pointer' }}>
                            {/* Avatar có thể dùng seed là username để tạo ảnh khác nhau nếu muốn */}
                            <Avatar 
                                style={{ backgroundColor: '#1890ff' }} 
                                src={userInfo.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.username}` : null}
                                icon={!userInfo.username && <UserOutlined />} 
                            />
                            
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                                {/* Hiển thị Username động */}
                                <Text strong>@{displayName}</Text>
                                {/* Hiển thị Họ tên hoặc text mặc định */}
                                <Text type="secondary" style={{ fontSize: '12px' }}>{subText}</Text>
                            </div>
                        </Space>
                    </Dropdown>
                </Space>
            </AntHeader>

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