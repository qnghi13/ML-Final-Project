// import React, { useState } from 'react';
// import { Layout } from 'antd';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import AlertPopup from '../Alerts/AlertPopup';
// const { Content, Footer } = Layout;

// const MainLayout = () => {
//     const [collapsed, setCollapsed] = useState(false);

//     return (
//         <Layout style={{ minHeight: '100vh' }}>
//             {/* Sidebar bên trái */}
//             <Sidebar collapsed={collapsed} />

//             {/* Layout chính bên phải */}
//             <Layout style={{ transition: 'all 0.2s' }}>
//                 <Header collapsed={collapsed} setCollapsed={setCollapsed} />

//                 <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
//                     <div
//                         style={{
//                             padding: 24,
//                             minHeight: 360,
//                             background: '#fff', // Nền trắng cho nội dung
//                             borderRadius: '8px',
//                             // Hiệu ứng bóng nhẹ tạo chiều sâu
//                             boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
//                         }}
//                     >
//                         {/* Đây là nơi các trang con (Dashboard, History...) sẽ hiển thị */}
//                         <Outlet />
//                     </div>
//                 </Content>

//                 <Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
//                     Stroke Warning System ©2025 Created by YourTeam - Powered by AI
//                 </Footer>
//             </Layout>
//             <AlertPopup />
//         </Layout>
//     );
// };

// export default MainLayout;

import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // Giả sử bạn đã có file này
import AlertPopup from '../Alerts/AlertPopup'; // Đường dẫn popup của bạn

const { Content, Footer } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ height: '100vh' }}>
            {/* Sidebar bên trái: Truyền props collapsed xuống */}
            <Sidebar collapsed={collapsed} />

            {/* Layout chính bên phải */}
            <Layout style={{
                transition: 'all 0.2s',
                height: '100vh',
                overflow: 'hidden' // Khóa scroll của container ngoài
            }}>
                {/* Header: Truyền props để nút toggle hoạt động */}
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />

                {/* Phần nội dung cuộn được */}
                <Content style={{ 
                    margin: '24px 16px 0', 
                    overflowY: 'auto', // Scroll nằm ở đây
                    height: '100%' 
                }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        {/* Outlet: Nơi Dashboard hoặc HistoryPage hiển thị */}
                        <Outlet />
                    </div>

                    <Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
                        Safety Vision AI ©2024
                    </Footer>
                </Content>
            </Layout>

            <AlertPopup />
        </Layout>
    );
};

export default MainLayout;