import React, { useState, useEffect } from 'react';
import { Card, Tag, Space, Button } from 'antd';
import { VideoCameraOutlined, ReloadOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '../../services/api';

const LiveStream = () => {
    const [streamUrl, setStreamUrl] = useState('');
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        // --- SỬA LOGIC LẤY USERNAME TẠI ĐÂY ---
        let username = 'admin'; // Giá trị mặc định an toàn

        try {
            // 1. Lấy chuỗi JSON từ localStorage (key là 'user_info')
            const storedData = localStorage.getItem('user_info');
            
            if (storedData) {
                // 2. Parse chuỗi JSON thành Object
                const userInfo = JSON.parse(storedData);
                
                // 3. Kiểm tra và lấy username
                if (userInfo && userInfo.username) {
                    username = userInfo.username;
                }
            }
        } catch (error) {
            console.warn("⚠️ Lỗi đọc data user, đang dùng 'admin'", error);
        }

        console.log("🎥 LiveStream đang chạy với user:", username);

        // 4. Tạo URL kết nối tới Backend
        const url = `${API_BASE_URL}/api/video/video_feed?username=${username}`;
        setStreamUrl(url);
    }, []);

    const handleReload = () => {
        setIsConnected(true);
        setStreamUrl(prev => {
            if (!prev) return prev;
            // Thêm tham số t=... để ép trình duyệt tải lại ảnh mới nhất
            const baseUrl = prev.split('&t=')[0];
            return `${baseUrl}&t=${Date.now()}`;
        });
    };

    return (
        <Card
            title={
                <Space>
                    <VideoCameraOutlined style={{ color: 'red', fontSize: '20px' }} />
                </Space>
            }
            extra={
                <Space>
                    <Tag color={isConnected ? "success" : "error"}>
                        {isConnected ? "TRỰC TUYẾN" : "MẤT TÍN HIỆU"}
                    </Tag>
                    <Button 
                        icon={<ReloadOutlined />} 
                        size="small" 
                        onClick={handleReload}
                        type="dashed"
                    >
                        Tải lại
                    </Button>
                </Space>
            }
            style={{ 
                width: '100%', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                background: '#1f1f1f', // Màu nền tối cho khung camera
                border: '1px solid #434343'
            }}
            bodyStyle={{ 
                padding: 0, 
                textAlign: 'center', 
                minHeight: '480px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#000',
                position: 'relative'
            }}
        >
            {streamUrl ? (
                <img
                    src={streamUrl}
                    alt="Camera Feed"
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain', // Giữ tỉ lệ khung hình chuẩn
                        display: 'block' 
                    }}
                    onError={() => setIsConnected(false)}
                    onLoad={() => setIsConnected(true)}
                />
            ) : (
                <div style={{ color: '#8c8c8c' }}>Đang khởi tạo kết nối...</div>
            )}
            
            {!isConnected && (
                <div style={{ 
                    position: 'absolute', 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    color: '#ff4d4f', 
                    background: 'rgba(0,0,0,0.85)', 
                    padding: '20px 40px', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #ff4d4f'
                }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '16px' }}>
                        ⚠️ Mất kết nối Camera
                    </p>
                    <Button type="primary" danger size="small" onClick={handleReload}>
                        Thử lại ngay
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default LiveStream;