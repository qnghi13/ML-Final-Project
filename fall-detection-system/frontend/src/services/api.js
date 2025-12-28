import axios from 'axios';
import { io } from 'socket.io-client';

// 1. Cấu hình URL Backend
export const API_BASE_URL = 'http://localhost:8000';

// Đường dẫn Video (Backend mount tại /api/video)
export const VIDEO_STREAM_URL = `${API_BASE_URL}/api/video/video_feed`;

// 2. Khởi tạo Socket Client
export const socket = io(API_BASE_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
});

// 3. Khởi tạo Axios Instance
// --- SỬA LỖI TẠI ĐÂY: Đổi tên thành 'api' và thêm 'export' ---
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Interceptor (Giữ nguyên)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token'); // Hoặc 'token' tùy code login của bạn
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Export default luôn để tránh lỗi nếu chỗ khác import default
export default api;