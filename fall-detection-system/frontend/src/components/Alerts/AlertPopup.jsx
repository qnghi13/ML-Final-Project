import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Result, Typography } from 'antd';
import { WarningFilled } from '@ant-design/icons';
import { socket } from '../../services/api';

const { Text, Paragraph } = Typography;

const AlertPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [alertData, setAlertData] = useState(null);
    
    // Lưu đối tượng Audio để kiểm soát bật/tắt
    const audioRef = useRef(null);

    useEffect(() => {
        socket.on('fall_detected', (data) => {
            console.log("🔥 NHẬN ĐƯỢC CẢNH BÁO TỪ SERVER:", data);
            setAlertData(data);
            setIsVisible(true);

            // Tắt âm thanh cũ nếu có
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }

            // Tạo và phát âm thanh mới
            const audio = new Audio('/alert_sound.mp3');
            audio.loop = true; // Lặp lại liên tục để gây chú ý
            audioRef.current = audio;

            audio.play().catch(e => console.error("Lỗi phát âm thanh:", e));
        });

        return () => {
            socket.off('fall_detected');
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Tắt âm thanh ngay khi bấm đóng
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return (
        <Modal
            title={<div style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>⚠️ CẢNH BÁO KHẨN CẤP</div>}
            open={isVisible}
            onCancel={handleClose}
            footer={[
                <Button key="close" type="primary" danger size="large" onClick={handleClose} block>
                    Đã xử lý & Tắt còi báo động
                </Button>
            ]}
            centered
            width={600}
            styles={{ mask: { backgroundColor: 'rgba(255, 0, 0, 0.3)' } }}
        >
            {alertData && (
                <Result
                    status="warning"
                    icon={<WarningFilled style={{ color: 'red', fontSize: '50px', animation: 'blink 1s infinite' }} />}
                    title={<span style={{ color: '#cf1322', fontWeight: 'bold', fontSize: '24px' }}>PHÁT HIỆN CÓ NGƯỜI NGÃ!</span>}
                    // Đã bỏ dòng subTitle hiển thị độ chính xác
                >
                    <div className="desc" style={{ background: '#fff1f0', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                        <Paragraph style={{ marginBottom: 0, textAlign: 'center' }}>
                            <Text strong style={{ fontSize: '16px' }}>🕒 Thời gian:</Text> 
                            <Text style={{ fontSize: '16px', marginLeft: '8px' }}>{alertData.timestamp}</Text>
                        </Paragraph>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                        <Text strong type="secondary">Hình ảnh hiện trường:</Text>
                        <img
                            src={alertData.image}
                            alt="Hình ảnh hiện trường"
                            style={{ 
                                width: '100%', 
                                marginTop: '10px', 
                                borderRadius: '8px', 
                                border: '3px solid red',
                                boxShadow: '0 4px 12px rgba(255,0,0,0.2)'
                            }}
                        />
                    </div>
                </Result>
            )}
        </Modal>
    );
};

export default AlertPopup;