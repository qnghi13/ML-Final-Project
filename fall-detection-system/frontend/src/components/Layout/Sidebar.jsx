// import React from 'react';
// import { Layout, Menu } from 'antd';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//     DashboardOutlined,
//     HistoryOutlined,
//     SettingOutlined,
//     LogoutOutlined,
//     SafetyCertificateFilled
// } from '@ant-design/icons';

// const { Sider } = Layout;

// const Sidebar = ({ collapsed }) => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Danh sách menu định nghĩa ở đây để dễ quản lý
//     const menuItems = [
//         {
//             key: '/dashboard',
//             icon: <DashboardOutlined />,
//             label: 'Giám Sát Trực Tiếp',
//         },
//         {
//             key: '/history',
//             icon: <HistoryOutlined />,
//             label: 'Lịch Sử Sự Cố',
//         },
//         {
//             key: '/settings',
//             icon: <SettingOutlined />,
//             label: 'Cài Đặt Hệ Thống',
//         },
//     ];

//     // Xử lý đăng xuất (Tạm thời chỉ điều hướng)
//     const handleLogout = () => {
//         // Sau này sẽ gọi authService.logout() ở đây
//         navigate('/login');
//     };

//     return (
//         <Sider
//             trigger={null}
//             collapsible
//             collapsed={collapsed}
//             width={260}
//             style={{
//                 minHeight: '100vh',
//                 background: '#001529', // Màu xanh đen chuyên nghiệp của Antd
//                 boxShadow: '2px 0 6px rgba(0,21,41,0.35)'
//             }}
//         >
//             {/* Logo Area */}
//             <div style={{
//                 height: '64px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: collapsed ? 'center' : 'flex-start',
//                 padding: collapsed ? '0' : '0 24px',
//                 background: '#002140',
//                 transition: 'all 0.2s'
//             }}>
//                 <SafetyCertificateFilled style={{ fontSize: '24px', color: '#1890ff' }} />
//                 {!collapsed && (
//                     <span style={{
//                         color: 'white',
//                         fontSize: '18px',
//                         fontWeight: 'bold',
//                         marginLeft: '12px',
//                         whiteSpace: 'nowrap'
//                     }}>
//                         Safety Vision AI
//                     </span>
//                 )}
//             </div>

//             {/* Menu Items */}
//             <Menu
//                 theme="dark"
//                 mode="inline"
//                 selectedKeys={[location.pathname]} // Tự động highlight menu theo URL hiện tại
//                 onClick={({ key }) => navigate(key)}
//                 items={menuItems}
//                 style={{ marginTop: '16px', fontSize: '15px' }}
//             />

//             {/* Logout Button ở dưới cùng */}
//             <div style={{ position: 'absolute', bottom: 0, width: '100%', borderTop: '1px solid #ffffff1a' }}>
//                 <Menu
//                     theme="dark"
//                     mode="inline"
//                     selectable={false}
//                     items={[{
//                         key: 'logout',
//                         icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />, // Màu đỏ cảnh báo
//                         label: <span style={{ color: '#ff4d4f' }}>Đăng xuất</span>,
//                         onClick: handleLogout
//                     }]}
//                 />
//             </div>
//         </Sider>
//     );
// };

// export default Sidebar;

import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    HistoryOutlined,
    SettingOutlined,
    LogoutOutlined,
    SafetyCertificateFilled
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Menu items definition
    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Live Monitoring',
        },
        {
            key: '/dashboard/history',
            icon: <HistoryOutlined />,
            label: 'Incident History',
        },
        {
            key: '/dashboard/settings',
            icon: <SettingOutlined />,
            label: 'System Settings',
        },
    ];

    // Handle logout (temporary navigation only)
    const handleLogout = () => {
        // Later: call authService.logout()
        navigate('/login');
    };

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
                selectedKeys={[location.pathname]}
                onClick={({ key }) => navigate(key)}
                items={menuItems}
                style={{ marginTop: '16px', fontSize: '15px' }}
            />


        </Sider>
    );
};

export default Sidebar;
