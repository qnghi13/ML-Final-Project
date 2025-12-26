import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    HistoryOutlined,
    SafetyCertificateFilled
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Menu items definition
    const menuItems = [
        {
            key: '/dashboard', // Key trùng với đường dẫn URL
            icon: <DashboardOutlined />,
            label: 'Live Monitoring',
        },
        {
            // --- THAY ĐỔI Ở ĐÂY ---
            key: '/history', // Đổi từ '/dashboard/history' thành '/history'
            icon: <HistoryOutlined />,
            label: 'Incident History',
        },
    ];

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={260}
            style={{
                minHeight: '100vh',
                background: '#001529',
                boxShadow: '2px 0 6px rgba(0,21,41,0.35)'
            }}
        >
            {/* Logo Area */}
            <div
                style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '0' : '0 24px',
                    background: '#002140',
                    transition: 'all 0.2s'
                }}
            >
                <SafetyCertificateFilled
                    style={{ fontSize: '24px', color: '#1890ff' }}
                />
                {!collapsed && (
                    <span
                        style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginLeft: '12px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Safety Vision AI
                    </span>
                )}
            </div>

            {/* Menu Items */}
            <Menu
                theme="dark"
                mode="inline"
                // Tự động highlight menu dựa trên URL hiện tại
                selectedKeys={[location.pathname]} 
                // Khi click sẽ chuyển hướng theo key đã định nghĩa ở trên
                onClick={({ key }) => navigate(key)} 
                items={menuItems}
                style={{ marginTop: '16px', fontSize: '15px' }}
            />
        </Sider>
    );
};

export default Sidebar;