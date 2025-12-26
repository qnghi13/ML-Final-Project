// src/services/api.js
import axios from 'axios';
import { io } from 'socket.io-client';

// 1. Cấu hình URL Backend
export const API_BASE_URL = 'http://localhost:8000';
// Backend mount video router ở gốc /, nên đường dẫn là /video_feed
export const VIDEO_STREAM_URL = `${API_BASE_URL}/video_feed`;

// 2. Khởi tạo Socket Client (Singleton - Dùng chung cho cả App)
export const socket = io(API_BASE_URL, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
});

// 3. Khởi tạo Axios Instance (Để gọi API REST)
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Timeout sau 10s
});

// Tự động đính kèm Token vào mọi request (nếu đã đăng nhập)
apiClient.interceptors.request.use((config) => {
    // SỬA LẠI: Lấy key là 'token' cho khớp với LandingPage.jsx
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;