// // src/components/VideoPlayer/LiveStream.jsx
// import React, { useState } from 'react';
// import { Card, Tag, Space, Button } from 'antd';
// import { VideoCameraOutlined, ReloadOutlined } from '@ant-design/icons';

// const LiveStream = () => {
//     // Giả sử đường link video từ Backend (sau này sẽ lấy từ file cấu hình)
//     // Tạm thời để link mẫu hoặc localhost
//     const VIDEO_URL = "http://localhost:8000/video_feed";

//     const [isConnected, setIsConnected] = useState(true);

//     return (
//         <Card
//             title={
//                 <Space>
//                     <VideoCameraOutlined style={{ color: 'red' }} />
//                     <span>Camera Giám Sát - Phòng Khách</span>
//                 </Space>
//             }
//             extra={
//                 <Space>
//                     <Tag color={isConnected ? "success" : "error"}>
//                         {isConnected ? "ĐANG HOẠT ĐỘNG" : "MẤT TÍN HIỆU"}
//                     </Tag>
//                     <Button
//                         icon={<ReloadOutlined />}
//                         size="small"
//                         onClick={() => window.location.reload()}
//                     >
//                         Tải lại
//                     </Button>
//                 </Space>
//             }
//             style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
//             bodyStyle={{ padding: 0, textAlign: 'center', background: '#000' }}
//         >
//             {/* KHUNG HIỂN THỊ VIDEO */}
//             <div style={{ position: 'relative', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 {isConnected ? (
//                     <img
//                         src={VIDEO_URL}
//                         alt="Live Feed"
//                         style={{ width: '100%', height: 'auto', display: 'block' }}
//                         onError={() => setIsConnected(false)} // Nếu link lỗi thì báo mất kết nối
//                     />
//                 ) : (
//                     <div style={{ color: 'white' }}>
//                         <h3>Không thể kết nối tới Camera</h3>
//                         <p>Vui lòng kiểm tra lại Backend Server</p>
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

const LiveStream = () => {
    // Assume video stream URL from Backend (will be moved to config later)
    // Temporary sample or localhost URL
    const VIDEO_URL = "http://localhost:8000/video_feed";

    const [isConnected, setIsConnected] = useState(true);

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
                        onClick={() => window.location.reload()}
                    >
                        Reload
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
                        src={VIDEO_URL}
                        alt="Live Feed"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        onError={() => setIsConnected(false)} // Mark as disconnected if stream fails
                    />
                ) : (
                    <div style={{ color: 'white' }}>
                        <h3>Unable to Connect to Camera</h3>
                        <p>Please check the Backend Server</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default LiveStream;
