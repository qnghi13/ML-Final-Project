// import React, { useState, useEffect } from 'react';
// import apiClient from '../services/api';
// import { Form, Input, Button, Typography, Card, Tabs, message, Modal, List, Avatar, Spin, Result, Statistic } from 'antd';
// import {
//     UserOutlined,
//     LockOutlined,
//     MailOutlined,
//     GoogleOutlined,
//     SafetyCertificateFilled,
//     LoadingOutlined,
//     ArrowLeftOutlined,
//     SafetyOutlined,
//     PhoneOutlined
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// // src/pages/LandingPage.jsx

// // 1. Import service
// import { authService } from '../services/authService';

// // ... (Bên trong LandingPage component) ...

// // === XỬ LÝ LOGIN THỰC TẾ ===
// const onLoginFinish = async (values) => {
//     setLoading(true);
//     try {
//         // Gọi Service Login
//         // const data = await authService.login(values.username, values.password);
//         const response = await apiClient.post('/api/auth/login', {
//             username: values.username,
//             password: values.password
//         });
//         // Lưu token (Backend trả về access_token)
//         localStorage.setItem('access_token', response.data.access_token);
//         localStorage.setItem('user_info', JSON.stringify(response.data.user)); // Nếu BE trả về user info

//         message.success('Login Successful!');
//         navigate('/dashboard');
//     } catch (error) {
//         message.error(error.message); // Hiển thị lỗi từ Backend (400/401)
//     } finally {
//         setLoading(false);
//     }
// };

// // === XỬ LÝ ĐĂNG KÝ (BƯỚC 1: NHẬP INFO) ===
// const onRegisterInfoSubmit = (values) => {
//     setLoading(true);
//     // Giả lập gửi OTP (Client side only)
//     setTimeout(() => {
//         setLoading(false);
//         setTempRegData(values); // Lưu username, pass, phone, fullname vào biến tạm
//         setRegisterStep(2);     // Chuyển sang nhập OTP
//         // Hiển thị thông báo gửi tới SĐT thay vì Email
//         message.info(`OTP Code sent to ${values.phone_number}`);
//     }, 1000);
// };

// // === XỬ LÝ OTP & GỌI API ĐĂNG KÝ (BƯỚC 2) ===
// const onOtpSubmit = async (values) => {
//     setLoading(true);

//     // Giả lập check OTP (Ví dụ cứ nhập đủ 6 số là đúng)
//     // Trong thực tế, bạn có thể hardcode '123456' để test
//     if (values.otp.length !== 6) {
//         setLoading(false);
//         message.error('Invalid OTP Code');
//         return;
//     }

//     try {
//         // OTP OK -> GỌI API ĐĂNG KÝ CỦA BACKEND
//         // Lấy dữ liệu từ bước 1 (tempRegData) để gửi đi
//         await authService.register({
//             username: tempRegData.username,
//             password: tempRegData.password,
//             full_name: tempRegData.full_name,
//             phone_number: tempRegData.phone_number
//         });

//         message.success('Account created successfully! Please Login.');
//         // Reset về Tab Login
//         setActiveTab('1');
//         setRegisterStep(1);

//     } catch (error) {
//         message.error(error.message); // Ví dụ: "Username đã tồn tại"
//     } finally {
//         setLoading(false);
//     }
// };
// const { Title, Text } = Typography;
// const { Countdown } = Statistic;

// const LandingPage = () => {
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);

//     // --- States cho Login Google (Giữ nguyên) ---
//     const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
//     const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);

//     // --- States cho Register Flow (OTP) ---
//     const [activeTab, setActiveTab] = useState('1'); // '1': Login, '2': Register
//     const [registerStep, setRegisterStep] = useState(1); // 1: Input Info, 2: OTP Verification
//     const [tempRegData, setTempRegData] = useState(null); // Lưu tạm email để hiển thị

//     // === XỬ LÝ LOGIN THƯỜNG ===
//     const onLoginFinish = (values) => {
//         setLoading(true);
//         setTimeout(() => {
//             setLoading(false);
//             message.success('Welcome back to Safety Vision AI!');
//             navigate('/dashboard');
//         }, 1000);
//     };

//     // === XỬ LÝ ĐĂNG KÝ (BƯỚC 1: NHẬP INFO) ===
//     const onRegisterInfoSubmit = (values) => {
//         setLoading(true);
//         // Giả lập gọi API gửi OTP về email
//         setTimeout(() => {
//             setLoading(false);
//             setTempRegData(values); // Lưu thông tin tạm
//             setRegisterStep(2); // Chuyển sang bước nhập OTP
//             message.info(`OTP Code sent to ${values.email}`);
//         }, 1500);
//     };

//     // === XỬ LÝ OTP (BƯỚC 2: XÁC THỰC) ===
//     const onOtpSubmit = (values) => {
//         setLoading(true);
//         // Giả lập check OTP (Ví dụ OTP đúng là bất kỳ số nào 6 chữ số)
//         setTimeout(() => {
//             setLoading(false);
//             if (values.otp.length === 6) {
//                 message.success('Account verified successfully!');
//                 navigate('/dashboard');
//             } else {
//                 message.error('Invalid OTP Code. Please try again.');
//             }
//         }, 1500);
//     };

//     // Quay lại bước nhập thông tin nếu nhập sai email
//     const handleBackToRegisterInfo = () => {
//         setRegisterStep(1);
//     };

//     // === LOGIC GOOGLE LOGIN (Giữ nguyên) ===
//     const handleGoogleClick = () => setIsGoogleModalOpen(true);
//     const handleChooseAccount = (accountName) => {
//         setIsGoogleLoggingIn(true);
//         setTimeout(() => {
//             setIsGoogleLoggingIn(false);
//             setIsGoogleModalOpen(false);
//             message.success(`Logged in as ${accountName}`);
//             navigate('/dashboard');
//         }, 1500);
//     };

//     const googleAccounts = [
//         { name: 'Nguyen Le Quang', email: 'quang.nl@university.edu.vn', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quang' },
//         { name: 'Safety Admin', email: 'admin@safetyvision.ai', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
//         { name: 'Use another account', email: '', avatar: '' }
//     ];

//     // === COMPONENTS CON ===

//     // 1. Form Login
//     const LoginForm = () => (
//         <Form name="login" onFinish={onLoginFinish} layout="vertical" size="large">
//             <Form.Item name="username" rules={[{ required: true, message: 'Please input Username!' }]}>
//                 <Input prefix={<UserOutlined />} placeholder="Username" />
//             </Form.Item>
//             <Form.Item name="password" rules={[{ required: true, message: 'Please input Password!' }]}>
//                 <Input.Password prefix={<LockOutlined />} placeholder="Password" />
//             </Form.Item>
//             <Form.Item>
//                 <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
//                     Log in
//                 </Button>
//             </Form.Item>
//             <div style={{ textAlign: 'center' }}>
//                 <Text type="secondary">Or login with</Text> <br />
//                 <Button icon={<GoogleOutlined />} style={{ marginTop: 10, width: '100%' }} onClick={handleGoogleClick}>
//                     Google Account
//                 </Button>
//             </div>
//         </Form>
//     );

//     // 2. Form Register (Step 1 & Step 2)
//     const RegisterContainer = () => {
//         // STEP 1: NHẬP THÔNG TIN
//         // if (registerStep === 1) {
//         //     return (
//         //         <Form name="register_info" onFinish={onRegisterInfoSubmit} layout="vertical" size="large">
//         //             <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Invalid Email!' }]}>
//         //                 <Input prefix={<MailOutlined />} placeholder="Email Address" />
//         //             </Form.Item>
//         //             <Form.Item name="username" rules={[{ required: true, message: 'Username required!' }]}>
//         //                 <Input prefix={<UserOutlined />} placeholder="Username" />
//         //             </Form.Item>
//         //             <Form.Item name="password" rules={[{ required: true, message: 'Password required!' }]}>
//         //                 <Input.Password prefix={<LockOutlined />} placeholder="Password" />
//         //             </Form.Item>
//         //             <Form.Item>
//         //                 <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
//         //                     Next Step
//         //                 </Button>
//         //             </Form.Item>
//         //         </Form>
//         //     );
//         // }

//         // STEP 2: NHẬP OTP
//         // return (
//         //     <div style={{ textAlign: 'center' }}>
//         //         <Result
//         //             status="info"
//         //             icon={<SafetyOutlined style={{ color: '#1890ff' }} />}
//         //             title="Security Verification"
//         //             subTitle={
//         //                 <span>
//         //                     We sent a 6-digit code to <Text strong>{tempRegData?.email}</Text>.
//         //                     <br />Please enter it below to verify your identity.
//         //                 </span>
//         //             }
//         //             style={{ padding: '0 0 20px 0' }}
//         //         />

//         //         <Form name="register_otp" onFinish={onOtpSubmit} layout="vertical" size="large">
//         //             <Form.Item
//         //                 name="otp"
//         //                 rules={[
//         //                     { required: true, message: 'Please enter OTP!' },
//         //                     { len: 6, message: 'OTP must be 6 digits' }
//         //                 ]}
//         //             >
//         //                 <Input
//         //                     style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 'bold' }}
//         //                     placeholder="• • • • • •"
//         //                     maxLength={6}
//         //                 />
//         //             </Form.Item>

//         //             <Form.Item>
//         //                 <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
//         //                     Verify & Register
//         //                 </Button>
//         //             </Form.Item>
//         //         </Form>

//         //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
//         //             <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleBackToRegisterInfo} size="small">
//         //                 Change Email
//         //             </Button>

//         //             <Text type="secondary" style={{ fontSize: '12px' }}>
//         //                 Resend in <Countdown value={Date.now() + 60 * 1000} format="mm:ss" valueStyle={{ fontSize: '12px', color: '#8c8c8c' }} onFinish={() => message.info('You can request new OTP now')} />
//         //             </Text>
//         //         </div>
//         //     </div>
//         // );
//         if (registerStep === 1) {
//             return (
//                 <Form name="register_info" onFinish={onRegisterInfoSubmit} layout="vertical" size="large">
//                     {/* THAY ĐỔI: Thay Email bằng Full Name và Phone */}
//                     <Form.Item name="full_name" rules={[{ required: true, message: 'Please input Full Name!' }]}>
//                         <Input prefix={<UserOutlined />} placeholder="Full Name (e.g. Nguyen Van A)" />
//                     </Form.Item>

//                     <Form.Item name="phone_number" rules={[{ required: true, message: 'Phone number required!' }]}>
//                         <Input prefix={<PhoneOutlined />} placeholder="Phone Number (e.g. 0909...)" />
//                     </Form.Item>

//                     <Form.Item name="username" rules={[{ required: true, message: 'Username required!' }]}>
//                         <Input prefix={<UserOutlined />} placeholder="Username" />
//                     </Form.Item>

//                     <Form.Item name="password" rules={[{ required: true, message: 'Password required!' }]}>
//                         <Input.Password prefix={<LockOutlined />} placeholder="Password" />
//                     </Form.Item>

//                     <Form.Item>
//                         <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
//                             Next Step
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             );
//         }
//     };

//     const items = [
//         { key: '1', label: 'Login', children: <LoginForm /> },
//         { key: '2', label: 'Register', children: <RegisterContainer /> },
//     ];

//     // Reset step khi chuyển tab (ví dụ đang nhập OTP mà bấm sang Login thì reset)
//     const onTabChange = (key) => {
//         setActiveTab(key);
//         if (key === '1') setRegisterStep(1);
//     };

//     return (
//         <div style={{
//             height: '100vh',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             background: 'linear-gradient(135deg, #001529 0%, #0050b3 100%)'
//         }}>
//             <Card
//                 style={{ width: 900, height: 600, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
//                 bodyStyle={{ padding: 0, height: '100%' }}
//             >
//                 <div style={{ display: 'flex', height: '100%' }}>
//                     {/* CỘT TRÁI */}
//                     <div style={{
//                         flex: 1,
//                         background: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80) center/cover no-repeat',
//                         position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 40
//                     }}>
//                         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))' }} />
//                         <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
//                             <SafetyCertificateFilled style={{ fontSize: 48, color: '#1890ff', marginBottom: 20 }} />
//                             <Title level={2} style={{ color: 'white', margin: 0 }}>Safety Vision AI</Title>
//                             <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>Smart Stroke & Fall Detection System</Text>
//                         </div>
//                     </div>

//                     {/* CỘT PHẢI */}
//                     <div style={{ flex: 1, padding: '60px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//                         <div style={{ textAlign: 'center', marginBottom: 30 }}>
//                             <Title level={3}>Welcome</Title>
//                             <Text type="secondary">Please enter your details to access the system.</Text>
//                         </div>

//                         <Tabs
//                             activeKey={activeTab}
//                             onChange={onTabChange}
//                             items={items}
//                             centered
//                             size="large"
//                         />
//                     </div>
//                 </div>
//             </Card>

//             {/* --- MODAL GOOGLE (Giữ nguyên) --- */}
//             <Modal
//                 title={null} footer={null} open={isGoogleModalOpen} onCancel={() => !isGoogleLoggingIn && setIsGoogleModalOpen(false)}
//                 width={400} centered bodyStyle={{ padding: '20px' }}
//             >
//                 {isGoogleLoggingIn ? (
//                     <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                         <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
//                         <div style={{ marginTop: 20 }}>Verifying credentials...</div>
//                     </div>
//                 ) : (
//                     <div>
//                         <div style={{ textAlign: 'center', marginBottom: 20 }}>
//                             <GoogleOutlined style={{ fontSize: '32px', color: '#DB4437' }} />
//                             <Title level={4}>Choose an account</Title>
//                         </div>
//                         <List
//                             itemLayout="horizontal" dataSource={googleAccounts}
//                             renderItem={(item) => (
//                                 <List.Item style={{ cursor: 'pointer', padding: '12px', borderRadius: '8px' }} onClick={() => handleChooseAccount(item.name)}>
//                                     <List.Item.Meta avatar={<Avatar src={item.avatar} />} title={<Text strong>{item.name}</Text>} description={item.email} />
//                                 </List.Item>
//                             )}
//                         />
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default LandingPage;
import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Tabs, message, Modal, Steps } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    SafetyCertificateFilled,
    PhoneOutlined,
    SafetyOutlined,
    SendOutlined,
    KeyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import apiClient from '../services/api'; // Import api client để gọi endpoint quên mk

const { Title, Text } = Typography;

const LandingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('1'); // '1': Login, '2': Register

    // --- STATES CHO QUÊN MẬT KHẨU ---
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Nhập user, 2: Nhập OTP & Pass mới
    const [resetUsername, setResetUsername] = useState(''); // Lưu tạm username đang reset

    // === 1. XỬ LÝ ĐĂNG NHẬP ===
    const onLoginFinish = async (values) => {
        setLoading(true);
        try {
            await authService.login(values.username, values.password);
            message.success('Đăng nhập thành công!');
            navigate('/dashboard');
        } catch (error) {
            console.error("Login error:", error);
            const errorMsg = error.response?.data?.detail || "Đăng nhập thất bại.";
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // === 2. XỬ LÝ ĐĂNG KÝ ===
    const onRegisterSubmit = async (values) => {
        setLoading(true);
        try {
            await authService.register({
                username: values.username,
                password: values.password,
                full_name: values.full_name,
                phone_number: values.phone_number
            });
            message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            setActiveTab('1');
        } catch (error) {
            console.error("Register error:", error);
            if (error.response && error.response.status === 400) {
                message.error(error.response.data.detail);
            } else {
                message.error("Đăng ký thất bại. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

    // === 3. XỬ LÝ QUÊN MẬT KHẨU (Gửi OTP Telegram) ===
    
    // Bước 1: Gửi yêu cầu lấy OTP
    const onRequestOtp = async (values) => {
        setLoading(true);
        try {
            // Gọi API Backend: /api/auth/forgot-password/request
            // Body: { username: values.username }
            // Backend sẽ tìm user, lấy ChatID telegram và gửi mã
            
            // --- Code giả lập hoặc gọi API thực tế ---
            await apiClient.post('/api/auth/forgot-password/request', { username: values.username });
            
            // Nếu thành công:
            setResetUsername(values.username);
            setForgotStep(2); // Chuyển sang bước nhập OTP
            message.success(`Mã OTP đã được gửi đến Telegram của tài khoản ${values.username}`);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.detail || "Không tìm thấy tài khoản hoặc chưa liên kết Telegram.";
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Bước 2: Xác thực OTP và Đổi mật khẩu
    const onResetPassword = async (values) => {
        setLoading(true);
        try {
            // Gọi API Backend: /api/auth/forgot-password/reset
            // Body: { username: resetUsername, otp: values.otp, new_password: values.new_password }
            
            await apiClient.post('/api/auth/forgot-password/reset', {
                username: resetUsername,
                otp: values.otp,
                new_password: values.new_password
            });

            message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            setIsForgotModalOpen(false); // Đóng modal
            setForgotStep(1); // Reset về bước 1
            setActiveTab('1'); // Chuyển về tab Login
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.detail || "Mã OTP không đúng hoặc hết hạn.";
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // === COMPONENTS CON ===

    // 1. Form Login (Đã thêm nút Quên mật khẩu)
    const LoginForm = () => (
        <Form name="login" onFinish={onLoginFinish} layout="vertical" size="large">
            <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}>
                <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập Password!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            
            {/* --- NÚT QUÊN MẬT KHẨU --- */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                <a 
                    onClick={(e) => { e.preventDefault(); setIsForgotModalOpen(true); }}
                    style={{ color: '#1890ff' }}
                >
                    Quên mật khẩu?
                </a>
            </div>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
                    Đăng Nhập
                </Button>
            </Form.Item>
        </Form>
    );

    // 2. Form Register
    const RegisterForm = () => (
        <Form name="register" onFinish={onRegisterSubmit} layout="vertical" size="large">
            <Form.Item name="full_name" rules={[{ required: true, message: 'Vui lòng nhập Họ tên!' }]}>
                <Input prefix={<UserOutlined />} placeholder="Họ và Tên (VD: Nguyen Van A)" />
            </Form.Item>
            <Form.Item 
                name="phone_number" 
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ được chứa số!' },
                    { len: 10, message: 'Số điện thoại phải đúng 10 số!' }
                ]}
            >
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại (10 số)" maxLength={10} />
            </Form.Item>
            <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}>
                <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập Password!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '45px' }}>
                    Đăng Ký Tài Khoản
                </Button>
            </Form.Item>
        </Form>
    );

    const items = [
        { key: '1', label: 'Đăng Nhập', children: <LoginForm /> },
        { key: '2', label: 'Đăng Ký', children: <RegisterForm /> },
    ];

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #001529 0%, #0050b3 100%)'
        }}>
            <Card
                style={{ width: 900, height: 600, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                bodyStyle={{ padding: 0, height: '100%' }}
            >
                <div style={{ display: 'flex', height: '100%' }}>
                    {/* CỘT TRÁI */}
                    <div style={{
                        flex: 1,
                        background: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80) center/cover no-repeat',
                        position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 40
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))' }} />
                        <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                            <SafetyCertificateFilled style={{ fontSize: 48, color: '#1890ff', marginBottom: 20 }} />
                            <Title level={2} style={{ color: 'white', margin: 0 }}>Safety Vision AI</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>Hệ thống cảnh báo đột quỵ & té ngã</Text>
                        </div>
                    </div>

                    {/* CỘT PHẢI */}
                    <div style={{ flex: 1, padding: '60px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center', marginBottom: 30 }}>
                            <Title level={3}>Xin Chào</Title>
                            <Text type="secondary">Vui lòng nhập thông tin để truy cập hệ thống.</Text>
                        </div>
                        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} centered size="large" />
                    </div>
                </div>
            </Card>

            {/* --- MODAL QUÊN MẬT KHẨU --- */}
            <Modal
                open={isForgotModalOpen}
                title="Khôi phục mật khẩu qua Telegram"
                onCancel={() => { setIsForgotModalOpen(false); setForgotStep(1); }}
                footer={null}
                centered
            >
                <div style={{ padding: '20px 0' }}>
                    {forgotStep === 1 ? (
                        // BƯỚC 1: NHẬP USERNAME
                        <Form onFinish={onRequestOtp} layout="vertical">
                            <Text type="secondary" style={{ display: 'block', marginBottom: 15 }}>
                                Nhập Username của bạn. Hệ thống sẽ gửi mã OTP đến tài khoản Telegram đã liên kết.
                            </Text>
                            <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Nhập Username của bạn" size="large" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block size="large" icon={<SendOutlined />}>
                                    Gửi OTP
                                </Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        // BƯỚC 2: NHẬP OTP & PASS MỚI
                        <Form onFinish={onResetPassword} layout="vertical">
                            <Text type="secondary" style={{ display: 'block', marginBottom: 15 }}>
                                Mã OTP đã được gửi. Vui lòng kiểm tra Telegram.
                            </Text>
                            
                            <Form.Item name="otp" rules={[{ required: true, message: 'Nhập mã OTP!' }, { len: 6, message: 'Mã OTP gồm 6 chữ số' }]}>
                                <Input prefix={<SafetyOutlined />} placeholder="Nhập mã OTP (6 số)" size="large" maxLength={6} style={{ textAlign: 'center', letterSpacing: 4 }} />
                            </Form.Item>

                            <Form.Item name="new_password" rules={[{ required: true, message: 'Nhập mật khẩu mới!' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}>
                                <Input.Password prefix={<KeyOutlined />} placeholder="Mật khẩu mới" size="large" />
                            </Form.Item>

                            <Form.Item 
                                name="confirm_password" 
                                dependencies={['new_password']}
                                rules={[
                                    { required: true, message: 'Xác nhận mật khẩu!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('new_password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<KeyOutlined />} placeholder="Xác nhận mật khẩu mới" size="large" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                                    Đổi mật khẩu
                                </Button>
                            </Form.Item>
                            <Button type="link" onClick={() => setForgotStep(1)} block>Quay lại nhập Username</Button>
                        </Form>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default LandingPage;