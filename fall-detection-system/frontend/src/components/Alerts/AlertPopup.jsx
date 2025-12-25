// // src/components/Alerts/AlertPopup.jsx
// import React, { useEffect, useState } from 'react';
// import { Modal, Button, Result, Typography } from 'antd';
// import { WarningFilled } from '@ant-design/icons';

// const { Text, Paragraph } = Typography;

// const AlertPopup = () => {
//     const [isVisible, setIsVisible] = useState(false);

//     // Giả lập việc lắng nghe tín hiệu từ Backend
//     // Sau này thay đoạn này bằng WebSocket hoặc API Polling
//     useEffect(() => {
//         // Demo: Cứ 10 giây sẽ tự động báo động 1 lần để test giao diện
//         const demoTimer = setInterval(() => {
//             setIsVisible(true);
//             // Phát âm thanh cảnh báo (Optional)
//             // const audio = new Audio('/alert_sound.mp3');
//             // audio.play();
//         }, 10000);

//         return () => clearInterval(demoTimer);
//     }, []);

//     const handleClose = () => {
//         setIsVisible(false);
//     };

//     return (
//         <Modal
//             title={<div style={{ color: 'red', fontWeight: 'bold' }}>⚠️ CẢNH BÁO KHẨN CẤP</div>}
//             open={isVisible}
//             onCancel={handleClose}
//             footer={[
//                 <Button key="ignore" onClick={handleClose}>
//                     Bỏ qua
//                 </Button>,
//                 <Button key="contact" type="primary" danger onClick={handleClose}>
//                     Đã gọi cấp cứu
//                 </Button>,
//             ]}
//             centered
//             styles={{ mask: { backgroundColor: 'rgba(255, 0, 0, 0.2)' } }} // Nền mờ màu đỏ
//         >
//             <Result
//                 status="warning"
//                 icon={<WarningFilled style={{ color: 'red' }} />}
//                 title="PHÁT HIỆN NGƯỜI NGÃ!"
//                 subTitle="Hệ thống camera Phòng Khách vừa phát hiện sự cố ngã."
//             >
//                 <div className="desc">
//                     <Paragraph>
//                         <Text strong>Thời gian:</Text> {new Date().toLocaleTimeString()} <br />
//                         <Text strong>Vị trí:</Text> Camera 01 - Phòng Khách <br />
//                         <Text strong>Hành động khuyến nghị:</Text> Kiểm tra ngay lập tức.
//                     </Paragraph>
//                 </div>
//                 {/* Ảnh chụp khoảnh khắc ngã (Snapshot) */}
//                 <img
//                     src="https://media.giphy.com/media/xT5LMBjGtzam0Z9e3S/giphy.gif" // Ảnh demo
//                     alt="Snapshot"
//                     style={{ width: '100%', borderRadius: '8px', border: '2px solid red' }}
//                 />
//             </Result>
//         </Modal>
//     );
// };

// export default AlertPopup;

// src/components/Alerts/AlertPopup.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, Result, Typography } from 'antd';
import { WarningFilled } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const AlertPopup = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Simulate listening to signals from Backend
    // This will be replaced later with WebSocket or API Polling
    useEffect(() => {
        // Demo: Trigger alert every 10 seconds to test UI
        const demoTimer = setInterval(() => {
            setIsVisible(true);
            // Play alert sound (Optional)
            // const audio = new Audio('/alert_sound.mp3');
            // audio.play();
        }, 10000);

        return () => clearInterval(demoTimer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <Modal
            title={
                <div style={{ color: 'red', fontWeight: 'bold' }}>
                    ⚠️ EMERGENCY ALERT
                </div>
            }
            open={isVisible}
            onCancel={handleClose}
            footer={[
                <Button key="ignore" onClick={handleClose}>
                    Ignore
                </Button>,
                <Button key="contact" type="primary" danger onClick={handleClose}>
                    Emergency Called
                </Button>,
            ]}
            centered
            styles={{ mask: { backgroundColor: 'rgba(255, 0, 0, 0.2)' } }} // Red overlay background
        >
            <Result
                status="warning"
                icon={<WarningFilled style={{ color: 'red' }} />}
                title="FALL DETECTED!"
                subTitle="The living room camera has detected a fall incident."
            >
                <div className="desc">
                    <Paragraph>
                        <Text strong>Time:</Text> {new Date().toLocaleTimeString()} <br />
                        <Text strong>Location:</Text> Camera 01 - Living Room <br />
                        <Text strong>Recommended Action:</Text> Check immediately.
                    </Paragraph>
                </div>

                {/* Fall snapshot image */}
                <img
                    src="https://media.giphy.com/media/xT5LMBjGtzam0Z9e3S/giphy.gif" // Demo image
                    alt="Snapshot"
                    style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: '2px solid red'
                    }}
                />
            </Result>
        </Modal>
    );
};

export default AlertPopup;
