import React, { useState } from 'react';
import {
    Tabs, Form, Input, Slider, Switch, Button,
    Card, Select, message, Typography, Row, Col, Divider, InputNumber
} from 'antd';
import {
    RobotOutlined,
    BellOutlined,
    CameraOutlined,
    SaveOutlined,
    SendOutlined,
    ThunderboltFilled
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const SettingsPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);

    // Giả lập lưu cấu hình
    const handleSave = (values) => {
        setLoading(true);
        console.log('Settings Values:', values); // Xem log để biết data form
        setTimeout(() => {
            setLoading(false);
            message.success('System configuration saved successfully!');
        }, 1000);
    };

    // Giả lập test Telegram
    const handleTestTelegram = () => {
        setTestLoading(true);
        setTimeout(() => {
            setTestLoading(false);
            message.success('Test message sent to Telegram!');
        }, 1500);
    };

    // --- CÁC TAB COMPONENTS ---

    // Tab 1: Cấu hình AI
    const AiConfigTab = () => (
        <div>
            <Title level={5}>Fall Detection Model Parameters</Title>
            <Text type="secondary">Fine-tune the sensitivity of the AI model to reduce false alarms.</Text>
            <Divider />

            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        name="sensitivity"
                        label="Detection Sensitivity (Độ nhạy)"
                        extra="Higher sensitivity detects falls faster but may cause false alarms during exercise."
                    >
                        <Slider
                            marks={{ 0: 'Low', 50: 'Balanced', 100: 'High' }}
                            step={10}
                        />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="confidenceThreshold"
                        label="Confidence Threshold (%)"
                        tooltip="Only trigger alert if AI confidence is above this value."
                    >
                        <Slider min={50} max={99} />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="alertDelay"
                        label="Confirmation Delay (Seconds)"
                        tooltip="Time to wait after a fall is detected before sending alert (to check if person stands up)."
                    >
                        <InputNumber min={0} max={60} style={{ width: '100%' }} addonAfter="seconds" />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item
                        name="showSkeleton"
                        label="Visual Overlay (Hiển thị khung xương)"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );

    // Tab 2: Thông báo
    const NotificationTab = () => (
        <div>
            <Title level={5}>Integration Channels</Title>
            <Text type="secondary">Configure how the system communicates when an incident occurs.</Text>
            <Divider />

            {/* Telegram Section */}
            <Card type="inner" title={<span><SendOutlined /> Telegram Bot Integration</span>} style={{ marginBottom: 20 }}>
                <Form.Item name="telegramToken" label="Bot Token">
                    <Input.Password placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" />
                </Form.Item>
                <Form.Item name="telegramChatId" label="Chat ID">
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Input placeholder="-100123456789" />
                        <Button
                            type="dashed"
                            icon={<ThunderboltFilled />}
                            loading={testLoading}
                            onClick={handleTestTelegram}
                        >
                            Test Msg
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item name="enableTelegram" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" defaultChecked />
                </Form.Item>
            </Card>

            {/* Other Channels */}
            <Row gutter={24}>
                <Col span={12}>
                    <Card size="small" title="Local Alarm (Sound)">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>Play siren on device</Text>
                            <Form.Item name="enableLocalAlarm" valuePropName="checked" noStyle>
                                <Switch />
                            </Form.Item>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card size="small" title="SMS / Zalo Alert">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>Send to Guardian Phone</Text>
                            <Form.Item name="enableSms" valuePropName="checked" noStyle>
                                <Switch />
                            </Form.Item>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    // Tab 3: Hệ thống & Camera
    const SystemTab = () => (
        <div>
            <Title level={5}>Camera & Storage</Title>
            <Divider />

            <Form.Item
                name="cameraUrl"
                label="RTSP / IP Camera URL"
                extra="Enter the stream URL of your IP Camera. Leave empty to use WebCam."
            >
                <Input prefix={<CameraOutlined />} placeholder="rtsp://admin:123456@192.168.1.10:554/stream" />
            </Form.Item>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item name="historyRetention" label="Auto-delete History">
                        <Select defaultValue="30">
                            <Option value="7">After 7 days</Option>
                            <Option value="30">After 30 days</Option>
                            <Option value="90">After 90 days</Option>
                            <Option value="never">Never delete</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="privacyMode" label="Privacy Mode (Face Blur)" valuePropName="checked">
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );

    // Cấu trúc Tabs
    const items = [
        {
            key: '1',
            label: <span><RobotOutlined /> AI Configuration</span>,
            children: <AiConfigTab />,
        },
        {
            key: '2',
            label: <span><BellOutlined /> Notifications</span>,
            children: <NotificationTab />,
        },
        {
            key: '3',
            label: <span><CameraOutlined /> Camera & System</span>,
            children: <SystemTab />,
        },
    ];

    return (
        <div className="settings-container">
            {/* Tiêu đề trang */}
            <div style={{ marginBottom: 20 }}>
                <Title level={3}>System Settings</Title>
            </div>

            {/* Form chính */}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={{
                    sensitivity: 65,
                    confidenceThreshold: 75,
                    alertDelay: 5,
                    showSkeleton: true,
                    historyRetention: '30',
                    enableTelegram: true,
                    enableLocalAlarm: true
                }}
            >
                <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <Tabs defaultActiveKey="1" items={items} />

                    <Divider />

                    {/* Nút Save nằm dưới cùng */}
                    <div style={{ textAlign: 'right' }}>
                        <Button type="default" style={{ marginRight: 8 }} onClick={() => form.resetFields()}>
                            Reset Defaults
                        </Button>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">
                            Save Changes
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default SettingsPage;