// src/components/Layout/HelpCenterModal.jsx
import React from 'react';
import { Modal, Collapse, Typography, Button, Card, Space, Divider, Alert } from 'antd';
import {
    QuestionCircleOutlined,
    ReadOutlined,
    MailOutlined,
    PhoneOutlined,
    GlobalOutlined,
    SafetyCertificateFilled
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const HelpCenterModal = ({ isOpen, onClose }) => {

    // Danh sách câu hỏi thường gặp (Đã dịch)
    const faqItems = [
        {
            key: '1',
            label: 'Hệ thống AI phát hiện ngã hoạt động như thế nào?',
            children: <p>Hệ thống sử dụng Thị giác máy tính và Học sâu (Pose Estimation) để phân tích các điểm khớp trên cơ thể theo thời gian thực. Khi phát hiện sự thay đổi vận tốc đột ngột theo sau là tư thế nằm ngang quá 5 giây, hệ thống sẽ kích hoạt cảnh báo.</p>,
        },
        {
            key: '2',
            label: 'Tôi nên làm gì nếu gặp Báo động giả?',
            children: <p>Nếu hệ thống báo sai (ví dụ: khi đang tập Yoga hoặc thể dục), bạn chỉ cần nhấn nút <b>"Bỏ qua"</b> (hoặc Tắt còi) trên cửa sổ Cảnh báo khẩn cấp. Bạn cũng có thể điều chỉnh độ nhạy trong Cài đặt hệ thống.</p>,
        },
        {
            key: '3',
            label: 'Làm sao để thay đổi số điện thoại người giám hộ?',
            children: <p>Vào mục <b>Tài khoản</b> {'>'} <b>Cập nhật thông tin</b>. Nhập số điện thoại mới và lưu lại để đảm bảo cảnh báo được gửi đúng người.</p>,
        },
    ];

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
                    <QuestionCircleOutlined style={{ color: '#1890ff' }} />
                    <span>Trung tâm Trợ giúp & Hỗ trợ</span>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>Đóng</Button>,
            ]}
            width={700}
            centered
        >
            {/* 1. MEDICAL RESOURCES (Link Wikipedia Tiếng Việt) */}
            <Card
                type="inner"
                title={<><ReadOutlined /> Kiến thức Y khoa cơ bản</>}
                style={{ marginBottom: 20, borderColor: '#d9d9d9' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Text strong style={{ fontSize: '16px' }}>Tìm hiểu về Đột quỵ (Tai biến mạch máu não)</Text>
                        <Paragraph style={{ color: '#666', marginTop: 5, marginBottom: 0 }}>
                            Đột quỵ là tình trạng y tế khẩn cấp khi dòng máu lên não bị gián đoạn. 
                            Việc phát hiện sớm (quy tắc F.A.S.T) là cực kỳ quan trọng để cứu sống người bệnh.
                            

[Image of FAST stroke signs]

                        </Paragraph>
                    </div>
                    <Button
                        type="primary"
                        ghost
                        icon={<GlobalOutlined />}
                        onClick={() => window.open('https://vi.wikipedia.org/wiki/Tai_bi%E1%BA%BFn_m%E1%BA%A1ch_m%C3%A1u_n%C3%A3o', '_blank')}
                    >
                        Đọc trên Wikipedia
                    </Button>
                </div>
            </Card>

            {/* 2. FAQ Section */}
            <Title level={5}>Câu hỏi thường gặp (FAQ)</Title>
            <Collapse accordion items={faqItems} defaultActiveKey={['1']} style={{ marginBottom: 20 }} />

            {/* 3. Contact Support */}
            <Divider orientation="left" style={{ borderColor: '#f0f0f0' }}>Cần thêm trợ giúp?</Divider>
            <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
                <Button icon={<MailOutlined />} size="large">Gửi Email Hỗ trợ</Button>
                <Button icon={<PhoneOutlined />} size="large">Gọi Hotline (1900-xxxx)</Button>
            </Space>

            <Alert
                message="Phiên bản hệ thống: 1.0.0 (Beta)"
                type="info"
                showIcon
                icon={<SafetyCertificateFilled />}
                style={{ marginTop: 20, border: 'none', background: 'rgba(24, 144, 255, 0.1)' }}
            />
        </Modal>
    );
};

export default HelpCenterModal;