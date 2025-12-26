


import React, { useEffect, useState } from 'react';
import { Modal, Button, Result, Typography } from 'antd';
import { WarningFilled } from '@ant-design/icons';
import io from 'socket.io-client'; // Import thư viện
import { socket } from '../../services/api';

const { Text, Paragraph } = Typography;

// Kết nối tới Backend
// const socket = io('http://localhost:8000', {
//     transports: ['websocket'], // Bắt buộc dùng websocket để nhanh nhất
// });

const AlertPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [alertData, setAlertData] = useState(null); // Lưu dữ liệu ngã (ảnh, giờ)

    useEffect(() => {
        // Lắng nghe sự kiện từ Backend
        socket.on('fall_detected', (data) => {
            console.log("🔥 NHẬN ĐƯỢC CẢNH BÁO TỪ SERVER:", data);
            setAlertData(data);
            setIsVisible(true);

            // Có thể phát âm thanh ở đây
            // const audio = new Audio('/alert.mp3'); audio.play();
            const audio = new Audio('/alert_sound.mp3'); // Nhớ bỏ file mp3 vào folder public
            audio.play().catch(e => console.error("Audio error:", e));
        });

        // Cleanup khi component unmount
        return () => {
            socket.off('fall_detected');
        };
    }, []);

    const handleClose = () => setIsVisible(false);

    return (
        <Modal
            title={<div style={{ color: 'red', fontWeight: 'bold' }}>⚠️ EMERGENCY ALERT</div>}
            open={isVisible}
            onCancel={handleClose}
            footer={[
                <Button key="close" onClick={handleClose}>Close</Button>,
                <Button key="contact" type="primary" danger>Call Emergency</Button>,
            ]}
            centered
            width={600}
            styles={{ mask: { backgroundColor: 'rgba(255, 0, 0, 0.2)' } }}
        >
            {alertData && (
                <Result
                    status="warning"
                    icon={<WarningFilled style={{ color: 'red' }} />}
                    title="FALL DETECTED!"
                    subTitle={`Confidence: ${alertData.confidence * 100}% - Location: ${alertData.location}`}
                >
                    <div className="desc">
                        <Paragraph>
                            <Text strong>Time:</Text> {alertData.timestamp}
                        </Paragraph>
                    </div>
                    {/* Hiển thị ảnh chụp hiện trường do Backend gửi */}
                    <img
                        src={alertData.image}
                        alt="Fall Evidence"
                        style={{ width: '100%', borderRadius: '8px', border: '2px solid red' }}
                    />
                </Result>
            )}
        </Modal>
    );
};

export default AlertPopup;