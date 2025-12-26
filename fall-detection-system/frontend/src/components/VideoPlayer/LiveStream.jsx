
// import React, { useState } from 'react';
// import { Card, Tag, Space, Button } from 'antd';
// import { VideoCameraOutlined, ReloadOutlined } from '@ant-design/icons';

// const LiveStream = () => {
//     // Assume video stream URL from Backend (will be moved to config later)
//     // Temporary sample or localhost URL
//     const VIDEO_URL = "http://localhost:8000/video_feed";

//     const [isConnected, setIsConnected] = useState(true);

//     return (
//         <Card
//             title={
//                 <Space>
//                     <VideoCameraOutlined style={{ color: 'red' }} />
//                     <span>Live Camera - Living Room</span>
//                 </Space>
//             }
//             extra={
//                 <Space>
//                     <Tag color={isConnected ? "success" : "error"}>
//                         {isConnected ? "CONNECTED" : "NO SIGNAL"}
//                     </Tag>
//                     <Button
//                         icon={<ReloadOutlined />}
//                         size="small"
//                         onClick={() => window.location.reload()}
//                     >
//                         Reload
//                     </Button>
//                 </Space>
//             }
//             style={{
//                 width: '100%',
//                 borderRadius: '10px',
//                 overflow: 'hidden',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//             }}
//             bodyStyle={{
//                 padding: 0,
//                 textAlign: 'center',
//                 background: '#000'
//             }}
//         >
//             {/* VIDEO DISPLAY AREA */}
//             <div
//                 style={{
//                     position: 'relative',
//                     minHeight: '400px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                 }}
//             >
//                 {isConnected ? (
//                     <img
//                         src={VIDEO_URL}
//                         alt="Live Feed"
//                         style={{ width: '100%', height: 'auto', display: 'block' }}
//                         onError={() => setIsConnected(false)} // Mark as disconnected if stream fails
//                     />
//                 ) : (
//                     <div style={{ color: 'white' }}>
//                         <h3>Unable to Connect to Camera</h3>
//                         <p>Please check the Backend Server</p>
//                     </div>
//                 )}
//             </div>
//         </Card>
//     );
// };

// export default LiveStream;















// src/components/VideoPlayer/LiveStream.jsx

import React, { useState } from 'react';
import { Card, Tag, Space, Button } from 'antd';
import { VideoCameraOutlined, ReloadOutlined } from '@ant-design/icons';

// 1. Import URL từ file cấu hình chung (Step 1)
// Lưu ý: Đảm bảo đường dẫn đúng với cấu trúc thư mục của bạn
import { VIDEO_STREAM_URL } from '../../services/api';

const LiveStream = () => {
    // 2. State lưu URL stream hiện tại
    // Khởi tạo bằng URL gốc từ config
    const [streamUrl, setStreamUrl] = useState(VIDEO_STREAM_URL);

    // State trạng thái kết nối
    const [isConnected, setIsConnected] = useState(true);

    // 3. Hàm xử lý Reload thông minh (không load lại cả trang web)
    const handleReload = () => {
        setIsConnected(true);
        // Thêm tham số timestamp (?t=...) để ép trình duyệt bỏ cache và kết nối lại ngay lập tức
        setStreamUrl(`${VIDEO_STREAM_URL}?t=${new Date().getTime()}`);
    };

    return (
        <Card
            title={
                <Space>
                    <VideoCameraOutlined style={{ color: 'red' }} />
                    <span>Live Camera - Living Room</span>
                </Space>
            }
            extra={
                <Space>
                    <Tag color={isConnected ? "success" : "error"}>
                        {isConnected ? "CONNECTED" : "NO SIGNAL"}
                    </Tag>
                    <Button
                        icon={<ReloadOutlined />}
                        size="small"
                        onClick={handleReload} // 4. Gọi hàm reload mới
                    >
                        Reload Stream
                    </Button>
                </Space>
            }
            style={{
                width: '100%',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{
                padding: 0,
                textAlign: 'center',
                background: '#000'
            }}
        >
            {/* VIDEO DISPLAY AREA */}
            <div
                style={{
                    position: 'relative',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {isConnected ? (
                    <img
                        src={streamUrl} // 5. Dùng state url thay vì biến const cứng
                        alt="Live Feed"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        onError={() => setIsConnected(false)} // Nếu mất kết nối thì báo lỗi
                    />
                ) : (
                    <div style={{ color: 'white', padding: 20 }}>
                        <h3>Unable to Connect to Camera</h3>
                        <p>Please check the Backend Server</p>
                        {/* Thêm nút thử lại ngay giữa màn hình cho tiện */}
                        <Button type="primary" onClick={handleReload} style={{ marginTop: 10 }}>
                            Try Reconnect
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default LiveStream;