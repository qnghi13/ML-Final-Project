

import React from 'react';
import { Row, Col, Card, Typography, Space, Statistic } from 'antd';
import { VideoCameraOutlined, SafetyCertificateOutlined, BellOutlined } from '@ant-design/icons';
import LiveStream from '../components/VideoPlayer/LiveStream';

const { Title } = Typography;

const Dashboard = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Theo dõi thời gian thực</Title>

            {/* Thống kê nhanh */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic title="Trạng thái hệ thống" value="Hoạt động" valueStyle={{ color: '#3f8600' }} prefix={<SafetyCertificateOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Cảnh báo hôm nay" value={0} prefix={<BellOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Camera Chính */}
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card title={<Space><VideoCameraOutlined /> Camera Live Feed</Space>} style={{ width: '100%' }}>
                        <div style={{ background: '#000', borderRadius: '8px', minHeight: '480px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                            <LiveStream />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;