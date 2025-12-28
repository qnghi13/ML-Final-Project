import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Statistic, Tooltip } from 'antd';
import {
    VideoCameraOutlined,
    SafetyCertificateOutlined,
    BellOutlined,
    SendOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LiveStream from '../components/VideoPlayer/LiveStream';
import { api } from '../services/api';

const { Title, Text } = Typography;

const Dashboard = () => {
    const BOT_USERNAME = "canhbaodotquy_us_bot";

    const navigate = useNavigate();

    const [todayCount, setTodayCount] = useState(0);

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/video/stats/today');
            setTodayCount(response.data.count);
        } catch (error) {
            console.error("Lỗi lấy thống kê:", error);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Theo dõi thời gian thực</Title>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Trạng thái hệ thống"
                            value="Hoạt động"
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<SafetyCertificateOutlined />}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card
                        hoverable
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/history')}
                    >
                        <Statistic
                            title="Cảnh báo hôm nay (Nhấn để xem chi tiết)"
                            value={todayCount}
                            valueStyle={{ color: todayCount > 0 ? '#cf1322' : '#000' }}
                            prefix={<BellOutlined />}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card
                        hoverable
                        onClick={() => window.open(`https://t.me/${BOT_USERNAME}`, '_blank')}
                        style={{ cursor: 'pointer', borderColor: '#1890ff' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: '#8c8c8c', marginBottom: 4 }}>
                                    Nhận cảnh báo Telegram
                                    <Tooltip title="Chat với bot cú pháp: /login <user> <pass>">
                                        <InfoCircleOutlined style={{ marginLeft: 8, cursor: 'help' }} />
                                    </Tooltip>
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                                    Kết nối ngay &rarr;
                                </div>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Cú pháp: <code style={{ background: '#f5f5f5', padding: '2px 4px' }}>/login user pass</code>
                                </Text>
                            </div>
                            <SendOutlined style={{ fontSize: '32px', color: '#1890ff', opacity: 0.8 }} />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card
                        title={<Space><VideoCameraOutlined /> Trực tiếp từ camera</Space>}
                        style={{ width: '100%' }}
                    >
                        <div style={{
                            background: '#000',
                            borderRadius: '8px',
                            minHeight: '480px',
                            display: 'flex',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <LiveStream />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;