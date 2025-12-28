import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content, Footer } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ height: '100vh' }}>
            <Sidebar collapsed={collapsed} />
            <Layout style={{ transition: 'all 0.2s', height: '100vh', overflow: 'hidden' }}>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                <Content style={{ margin: '24px 16px 0', overflowY: 'auto', height: '100%' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Outlet />
                    </div>
                    <Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
                        Safety Vision AI ©2024
                    </Footer>
                </Content>
            </Layout>
            {/* REMOVED AlertPopup from here */}
        </Layout>
    );
};

export default MainLayout;