import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Image, Typography, Card, Tag, message } from 'antd';
import { EyeOutlined, HistoryOutlined, SyncOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { api } from '../services/api';

const { Title } = Typography;

const HistoryPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/video/history');
            setAlerts(response.data);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 10000);
        return () => clearInterval(interval);
    }, []);

    const columns = [
        {
            title: 'Ngày ghi nhận',
            dataIndex: 'timestamp',
            key: 'date',
            align: 'center',
            render: (text) => {
                if (!text) return '-';
                const dateObj = new Date(text.replace(' ', 'T') + 'Z');
                return (
                    <span style={{ fontSize: '16px', fontWeight: 500 }}>
                        <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        {dateObj.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                    </span>
                );
            },
        },
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'time',
            align: 'center',
            render: (text) => {
                if (!text) return '-';
                const dateObj = new Date(text.replace(' ', 'T') + 'Z');
                return (
                    <Tag icon={<ClockCircleOutlined />} color="blue" style={{ fontSize: '14px', padding: '4px 10px' }}>
                        {dateObj.toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                    </Tag>
                );
            },
        },
        {
            title: 'Hành động',
            dataIndex: 'image_url',
            key: 'image',
            align: 'center',
            render: (url) => (
                <Button
                    icon={<EyeOutlined />}
                    type="primary"
                    onClick={() => setPreviewImage(url)}
                >
                    Xem bằng chứng
                </Button>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Title level={3} style={{ margin: 0 }}><HistoryOutlined /> Lịch Sử Cảnh Báo Ngã</Title>
                <Button icon={<SyncOutlined />} onClick={fetchHistory} loading={loading}>Làm mới</Button>
            </div>

            <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Table
                    columns={columns}
                    dataSource={alerts}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 8, position: ['bottomCenter'] }}
                    locale={{ emptyText: 'Không có dữ liệu cảnh báo' }}
                />
            </Card>

            <Modal
                open={!!previewImage}
                footer={null}
                onCancel={() => setPreviewImage(null)}
                title="Hình ảnh hiện trường"
                centered
                width={800}
            >
                <Image
                    src={previewImage}
                    style={{ width: '100%' }}
                    fallback="https://via.placeholder.com/800x600?text=Image+Not+Found"
                />
            </Modal>
        </div>
    );
};

export default HistoryPage;