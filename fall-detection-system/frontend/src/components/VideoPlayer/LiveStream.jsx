import React, { useState, useEffect } from 'react';
import { Card, Tag, Space, Button } from 'antd';
import { VideoCameraOutlined, ReloadOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '../../services/api';

const LiveStream = () => {
    const [streamUrl, setStreamUrl] = useState('');
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        // 1. Cố gắng lấy username từ bộ nhớ
        let username = localStorage.getItem('username');
        
        // 2. Nếu không có (bị undefined/null), ép dùng 'admin' để Camera vẫn chạy
        if (!username || username === 'undefined') {
            console.warn("⚠️ Không tìm thấy username, đang dùng mặc định 'admin'");
            username = 'admin';
        }

        // 3. Tạo URL
        const url = `${API_BASE_URL}/api/video/video_feed?username=${username}`;
        console.log("Video URL:", url); // Xem log này để check
        setStreamUrl(url);
    }, []);

    const handleReload = () => {
        setIsConnected(true);
        setStreamUrl(prev => {
            const baseUrl = prev.split('&t=')[0];
            return `${baseUrl}&t=${Date.now()}`;
        });
    };

    return (
        <Card
            title={
                <Space>
                    <VideoCameraOutlined style={{ color: 'red' }} />
                    <span>Live Camera - Khu Vực Giám Sát</span>
                </Space>
            }
            extra={
                <Space>
                    <Tag color={isConnected ? "success" : "error"}>
                        {isConnected ? "TRỰC TUYẾN" : "MẤT TÍN HIỆU"}
                    </Tag>
                    <Button icon={<ReloadOutlined />} size="small" onClick={handleReload}>
                        Tải lại
                    </Button>
                </Space>
            }
            style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', background: '#000' }}
            bodyStyle={{ padding: 0, textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            {streamUrl ? (
                <img
                    src={streamUrl}
                    alt="Camera Feed"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    onError={() => setIsConnected(false)}
                    onLoad={() => setIsConnected(true)}
                />
            ) : (
                <div style={{ color: 'white' }}>Đang tải kết nối...</div>
            )}
            
            {!isConnected && (
                <div style={{ position: 'absolute', color: 'red', background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>⚠️ Mất kết nối Camera</p>
                    <Button type="primary" size="small" style={{ marginTop: 10 }} onClick={handleReload}>Thử lại ngay</Button>
                </div>
            )}
        </Card>
    );
};

export default LiveStream;