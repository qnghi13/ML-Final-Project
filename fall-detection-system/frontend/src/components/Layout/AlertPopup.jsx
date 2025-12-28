import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Result, Typography } from 'antd';
import { WarningFilled } from '@ant-design/icons';
import { socket } from '../../services/api';

const { Text, Paragraph } = Typography;

const AlertPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [alertData, setAlertData] = useState(null);
    const audioRef = useRef(null);

    const playAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const audio = new Audio('/public/alert_sound.mp3');
        audio.loop = true;
        audio.volume = 1.0;

        audioRef.current = audio;
        audio.play().catch((error) => {
            console.error("⚠️ Trình duyệt chặn tự động phát âm thanh:", error);
        });
    };

    const stopAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        const onFallDetected = (data) => {
            console.log("🔥 NHẬN ĐƯỢC CẢNH BÁO:", data);
            setAlertData(data);
            setIsVisible(true);

            playAlarm();
        };

        socket.on('fall_detected', onFallDetected);

        return () => {
            socket.off('fall_detected', onFallDetected);
            stopAlarm();
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        stopAlarm();
    };

    return (
        <Modal
            title={<div style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>⚠️ CẢNH BÁO KHẨN CẤP</div>}
            open={isVisible}
            visible={isVisible}
            onCancel={handleClose}
            footer={[
                <Button key="close" type="primary" danger size="large" onClick={handleClose} block>
                    Đã xử lý & Tắt còi báo động
                </Button>
            ]}
            centered
            width={600}
            styles={{ mask: { backgroundColor: 'rgba(255, 0, 0, 0.3)' } }}
            maskStyle={{ backgroundColor: 'rgba(255, 0, 0, 0.3)' }}
            zIndex={10000}
        >
            {alertData && (
                <Result
                    status="warning"
                    icon={<WarningFilled style={{ color: 'red', fontSize: '50px', animation: 'blink 1s infinite' }} />}
                    title={<span style={{ color: '#cf1322', fontWeight: 'bold', fontSize: '24px' }}>PHÁT HIỆN CÓ NGƯỜI NGÃ!</span>}
                >
                    <div style={{ textAlign: 'center' }}>
                        <Paragraph style={{ fontSize: '16px' }}>
                            <Text strong>🕒 Thời gian:</Text> {alertData.timestamp}
                        </Paragraph>

                        {alertData.image && (
                            <img
                                src={alertData.image}
                                alt="Evidence"
                                style={{
                                    width: '100%',
                                    marginTop: 10,
                                    borderRadius: '8px',
                                    border: '2px solid red'
                                }}
                            />
                        )}
                    </div>
                </Result>
            )}
        </Modal>
    );
};

export default AlertPopup;