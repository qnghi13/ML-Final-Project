import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, Image, Typography, Card, message } from 'antd';
import { EyeOutlined, HistoryOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';

const { Title } = Typography;

const HistoryPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Hàm gọi API lấy dữ liệu
    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/alerts');
            if (!response.ok) throw new Error('Failed to fetch history');
            const data = await response.json();
            setAlerts(data);
        } catch (error) {
            message.error('Lỗi tải lịch sử: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi mới vào trang
    useEffect(() => {
        fetchHistory();

        // (Optional) Tự động refresh mỗi 30s để cập nhật tin mới
        const interval = setInterval(fetchHistory, 30000);
        return () => clearInterval(interval);
    }, []);

    // Cấu hình các cột cho bảng
    const columns = [
        {
            title: 'Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text) => new Date(text).toLocaleString('vi-VN'), // Format ngày giờ Việt Nam
        },
        {
            title: 'Confidence',
            dataIndex: 'confidence',
            key: 'confidence',
            render: (score) => {
                const percent = (score * 100).toFixed(1);
                let color = score > 0.8 ? 'red' : 'orange';
                return <Tag color={color}>{percent}%</Tag>;
            }
        },
        {
            title: 'Status',
            dataIndex: 'is_sent',
            key: 'is_sent',
            render: (sent) => (
                sent
                    ? <Tag icon={<CheckCircleOutlined />} color="success">Sent</Tag>
                    : <Tag color="default">Pending</Tag>
            )
        },
        {
            title: 'Evidence',
            key: 'action',
            render: (_, record) => (
                <Button
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => {
                        // Backend mount folder 'evidence' vào đường dẫn '/static'
                        // Filename trong DB là 'fall_xyz.jpg' -> Full URL: http://localhost:8000/static/fall_xyz.jpg
                        setPreviewImage(`http://localhost:8000/static/${record.image_path}`);
                    }}
                >
                    View
                </Button>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Title level={3} style={{ margin: 0 }}><HistoryOutlined /> Incident History</Title>
                <Button icon={<SyncOutlined />} onClick={fetchHistory} loading={loading}>Refresh</Button>
            </div>

            <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Table
                    columns={columns}
                    dataSource={alerts}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            {/* Modal xem ảnh phóng to */}
            <Modal
                open={!!previewImage}
                footer={null}
                onCancel={() => setPreviewImage(null)}
                title="Evidence Snapshot"
                centered
            >
                <Image src={previewImage} style={{ width: '100%' }} />
            </Modal>
        </div>
    );
};

export default HistoryPage;