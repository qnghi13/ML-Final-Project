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

    // Danh sách câu hỏi thường gặp
    const faqItems = [
        {
            key: '1',
            label: 'How does the AI Fall Detection work?',
            children: <p>Our system uses Computer Vision and Deep Learning (Pose Estimation) to analyze human body keypoints in real-time. When it detects a sudden change in velocity followed by a horizontal posture (lying down) for more than 5 seconds, it triggers an alert.</p>,
        },
        {
            key: '2',
            label: 'What should I do in case of a False Alarm?',
            children: <p>If the system reports a fall incorrectly (e.g., during Yoga or exercise), simply click the <b>"Ignore"</b> button on the Emergency Popup. You can also adjust the sensitivity in System Settings.</p>,
        },
        {
            key: '3',
            label: 'How to add a new Guardian phone number?',
            children: <p>Go to <b>My Profile</b> {'>'} <b>Emergency Contact Phone</b>. Click "Update" and verify the new number via OTP to ensure alerts are sent to the right person.</p>,
        },
    ];

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
                    <QuestionCircleOutlined style={{ color: '#1890ff' }} />
                    <span>Help & Support Center</span>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>Close</Button>,
            ]}
            width={700} // Rộng hơn chút để đọc cho dễ
            centered
        >
            {/* 1. MEDICAL RESOURCES (Link Wikipedia) */}
            <Card
                type="inner"
                title={<><ReadOutlined /> Medical Knowledge Base</>}
                style={{ marginBottom: 20, borderColor: '#d9d9d9' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Text strong style={{ fontSize: '16px' }}>Understanding Stroke (Cerebrovascular accident)</Text>
                        <Paragraph style={{ color: '#666', marginTop: 5, marginBottom: 0 }}>
                            A stroke is a medical condition in which poor blood flow to the brain results in cell death.
                            Early detection (FAST) is crucial for survival and recovery.
                        </Paragraph>
                    </div>
                    <Button
                        type="primary"
                        ghost
                        icon={<GlobalOutlined />}
                        onClick={() => window.open('https://en.wikipedia.org/wiki/Stroke', '_blank')}
                    >
                        Read on Wikipedia
                    </Button>
                </div>
            </Card>

            {/* 2. FAQ Section */}
            <Title level={5}>Frequently Asked Questions</Title>
            <Collapse accordion items={faqItems} defaultActiveKey={['1']} style={{ marginBottom: 20 }} />

            {/* 3. Contact Support */}
            <Divider orientation="left" style={{ borderColor: '#f0f0f0' }}>Need more help?</Divider>
            <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
                <Button icon={<MailOutlined />} size="large">Email Support</Button>
                <Button icon={<PhoneOutlined />} size="large">Call Hotline (1900-xxxx)</Button>
            </Space>

            <Alert
                message="System Version: 1.0.0 (Beta)"
                type="info"
                showIcon
                icon={<SafetyCertificateFilled />}
                style={{ marginTop: 20, border: 'none', background: 'rgba(24, 144, 255, 0.1)' }}
            />
        </Modal>
    );
};

export default HelpCenterModal;