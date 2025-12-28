import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    HistoryOutlined,
    SafetyCertificateFilled,
    KeyOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Giám sát trực tiếp',
        },
        {

            key: '/history',
            icon: <HistoryOutlined />,
            label: 'Lịch sử sự cố',
        },

        {
            key: '/change-password',
            icon: <KeyOutlined />,
            label: 'Đổi mật khẩu',
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
                        An Toàn AI
                    </span>
                )}
            </div>

            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={({ key }) => navigate(key)}
                items={menuItems}
                style={{ marginTop: '16px', fontSize: '15px' }}
            />
        </Sider>
    );
};

export default Sidebar;