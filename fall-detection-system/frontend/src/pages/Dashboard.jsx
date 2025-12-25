// import React from 'react';
// import { Row, Col, Card, Statistic, List, Tag, Typography, Space } from 'antd';
// import {
//     VideoCameraOutlined,
//     WarningOutlined,
//     CheckCircleOutlined,
//     ClockCircleOutlined
// } from '@ant-design/icons';
// import LiveStream from '../components/VideoPlayer/LiveStream';

// const { Title, Text } = Typography;

// // Dữ liệu giả lập cho danh sách sự kiện gần đây (Sau này lấy từ API)
// const recentActivities = [
//     { time: '10:42:05', msg: 'Phát hiện chuyển động - Phòng Khách', type: 'info' },
//     { time: '09:15:00', msg: 'Hệ thống khởi động thành công', type: 'success' },
//     { time: 'Yesterday', msg: 'Cảnh báo: Phát hiện ngã (Đã xử lý)', type: 'warning' },
// ];

// const Dashboard = () => {
//     return (
//         <div className="dashboard-container">
//             {/* 1. Phần Thống kê (Statistics) trên cùng */}
//             <div style={{ marginBottom: '24px' }}>
//                 <Row gutter={16}>
//                     <Col span={8}>
//                         <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
//                             <Statistic
//                                 title="Trạng thái hệ thống"
//                                 value="Online"
//                                 valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
//                                 prefix={<CheckCircleOutlined />}
//                             />
//                         </Card>
//                     </Col>
//                     <Col span={8}>
//                         <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
//                             <Statistic
//                                 title="Camera đang hoạt động"
//                                 value={2}
//                                 suffix="/ 4"
//                                 prefix={<VideoCameraOutlined />}
//                             />
//                         </Card>
//                     </Col>
//                     <Col span={8}>
//                         <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
//                             <Statistic
//                                 title="Cảnh báo hôm nay"
//                                 value={5} // Số này sau này lấy từ database
//                                 valueStyle={{ color: '#cf1322' }}
//                                 prefix={<WarningOutlined />}
//                             />
//                         </Card>
//                     </Col>
//                 </Row>
//             </div>

//             {/* 2. Phần Chính: Camera và Log bên cạnh */}
//             <Row gutter={24}>
//                 {/* Cột Trái (Lớn): Hiển thị Camera */}
//                 <Col xs={24} lg={16}>
//                     <Title level={4} style={{ marginBottom: 16 }}>
//                         <Space><VideoCameraOutlined /> Giám sát trực tiếp</Space>
//                     </Title>

//                     <Row gutter={[0, 24]}>
//                         <Col span={24}>
//                             {/* Camera 1: Đây là cái LiveStream m đã viết */}
//                             <LiveStream />
//                         </Col>

//                         {/* Nếu muốn thêm Camera 2 (Demo) */}
//                         <Col span={24}>
//                             {/* Đây là ví dụ camera thứ 2 (đang offline) */}
//                             <Card title="Camera 02 - Hành Lang" size="small">
//                                 <div style={{ height: '100px', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
//                                     <Space><VideoCameraOutlined /> Camera Offline</Space>
//                                 </div>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Col>

//                 {/* Cột Phải (Nhỏ): Log hoạt động */}
//                 <Col xs={24} lg={8}>
//                     <Title level={4} style={{ marginBottom: 16 }}>
//                         <Space><ClockCircleOutlined /> Hoạt động gần đây</Space>
//                     </Title>

//                     <Card bordered={false} style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
//                         <List
//                             itemLayout="horizontal"
//                             dataSource={recentActivities}
//                             renderItem={(item) => (
//                                 <List.Item>
//                                     <List.Item.Meta
//                                         avatar={
//                                             item.type === 'warning' ? <WarningOutlined style={{ color: 'red' }} /> :
//                                                 item.type === 'success' ? <CheckCircleOutlined style={{ color: 'green' }} /> :
//                                                     <ClockCircleOutlined style={{ color: 'blue' }} />
//                                         }
//                                         title={<Text strong>{item.time}</Text>}
//                                         description={<Text type="secondary" style={{ fontSize: '13px' }}>{item.msg}</Text>}
//                                     />
//                                 </List.Item>
//                             )}
//                         />
//                         <div style={{ marginTop: 16, textAlign: 'center' }}>
//                             <a href="/history">Xem tất cả lịch sử</a>
//                         </div>
//                     </Card>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default Dashboard;

// src/pages/Dashboard.jsx
import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space } from 'antd';
import {
    VideoCameraOutlined,
    CheckCircleOutlined,
    WifiOutlined
} from '@ant-design/icons';
import LiveStream from '../components/VideoPlayer/LiveStream';

const { Title } = Typography;

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* 1. Phần Thống kê (Statistics) trên cùng */}
            <div style={{ marginBottom: '24px' }}>
                <Row gutter={24}>
                    {/* Hộp 1: Trạng thái hệ thống */}
                    <Col xs={24} sm={12}>
                        <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Trạng thái hệ thống"
                                value="Online"
                                valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>

                    {/* Hộp 2: Tên Camera đang kết nối (Thay cho số lượng) */}
                    <Col xs={24} sm={12}>
                        <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Thiết bị đang giám sát"
                                value="Camera 01 - Phòng Khách" // Tên giả định
                                valueStyle={{ fontSize: '20px', fontWeight: '500', color: '#1890ff' }}
                                prefix={<WifiOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* 2. Phần Chính: CHỈ HIỂN THỊ 1 CAMERA DUY NHẤT */}
            <Row>
                <Col span={24}>
                    <Title level={4} style={{ marginBottom: 16 }}>
                        <Space><VideoCameraOutlined /> Giám sát trực tiếp</Space>
                    </Title>

                    {/* Component LiveStream chiếm trọn chiều ngang */}
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <LiveStream
                            // Có thể bỏ prop label ở đây nếu muốn gọn, hoặc giữ lại tùy ý
                            label="Main Feed"
                            // Link video backend (Tạm thời để trống hoặc link test)
                            url="http://localhost:8000/video_feed"
                            isConnected={true}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;