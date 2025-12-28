import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Result, Typography } from 'antd';
import { WarningFilled } from '@ant-design/icons';
import { socket } from '../../services/api';

const { Text, Paragraph } = Typography;

const AlertPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [alertData, setAlertData] = useState(null);
    
    // Ref để giữ đối tượng Audio, giúp kiểm soát việc Bật/Tắt
    const audioRef = useRef(null);

    // --- HÀM PHÁT CÒI BÁO ĐỘNG ---
    const playAlarm = () => {
        // Nếu đang có âm thanh chạy thì tắt trước đã
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // Tạo đối tượng Audio mới (File mp3 phải để trong thư mục 'public')
        const audio = new Audio('/public/alert_sound.mp3'); 
        audio.loop = true; // Quan trọng: Lặp lại liên tục cho đến khi tắt
        audio.volume = 1.0; // Âm lượng to nhất

        // Lưu vào ref để dùng sau này
        audioRef.current = audio;

        // Phát âm thanh (cần catch lỗi vì trình duyệt chặn autoplay)
        audio.play().catch((error) => {
            console.error("⚠️ Trình duyệt chặn tự động phát âm thanh:", error);
            // Mẹo: Nếu bị chặn, bạn có thể cần người dùng tương tác ít nhất 1 lần với trang web
        });
    };

    // --- HÀM TẮT CÒI ---
    const stopAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause();        // Tạm dừng
            audioRef.current.currentTime = 0; // Tua về đầu
        }
    };

    useEffect(() => {
        const onFallDetected = (data) => {
             console.log("🔥 NHẬN ĐƯỢC CẢNH BÁO:", data);
             setAlertData(data);
             setIsVisible(true);
             
             // 🔥 KÍCH HOẠT CÒI BÁO ĐỘNG NGAY TẠI ĐÂY
             playAlarm();
        };

        socket.on('fall_detected', onFallDetected);

        // Cleanup: Khi component bị hủy (người dùng rời trang), tắt socket và tắt còi
        return () => {
            socket.off('fall_detected', onFallDetected);
            stopAlarm();
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Tắt còi khi bấm nút Đóng
        stopAlarm();
    };

    return (
        <Modal
            title={<div style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>⚠️ CẢNH BÁO KHẨN CẤP</div>}
            open={isVisible}       // Antd v5
            visible={isVisible}    // Antd v4
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
                        
                        {/* Hiển thị ảnh hiện trường */}
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