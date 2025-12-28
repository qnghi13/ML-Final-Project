import React, { useState } from 'react';

import { Layout, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UserProfileModal from './UserProfileModal';
import HelpCenterModal from './HelpCenterModal';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const getUserInfo = () => {
        try {
            const stored = localStorage.getItem('user_info');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            return {};
        }
    };

    const userInfo = getUserInfo();
    const displayName = userInfo.username || 'Admin';
    const subText = userInfo.full_name || 'Trung tâm giám sát';

    const handleLogout = () => {
        localStorage.clear();
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

                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ fontSize: '16px', width: 64, height: 64, marginLeft: -24 }}
                />

                <Space size="large">

                    <Dropdown
                        menu={{ items: userMenuItems, onClick: handleMenuClick }}
                        trigger={['click']}
                    >
                        <Space style={{ cursor: 'pointer' }}>

                            <Avatar
                                style={{ backgroundColor: '#1890ff' }}
                                src={userInfo.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.username}` : null}
                                icon={!userInfo.username && <UserOutlined />}
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>

                                <Text strong>@{displayName}</Text>

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