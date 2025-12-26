import { api } from './api';

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error("Lỗi đăng ký:", error.response?.data?.detail || error.message);
        throw error;
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/api/auth/login', { 
            username, 
            password 
        });
        
        // --- LOGIC FIX LỖI USERNAME UNDEFINED ---
        if (response.data.access_token) {
            // 1. Lưu Token
            localStorage.setItem('access_token', response.data.access_token);
            
            // 2. Lưu Username (Ưu tiên lấy từ Server, nếu không có thì lấy luôn cái user vừa nhập)
            const userToSave = response.data.username || username;
            localStorage.setItem('username', userToSave);
            
            console.log("✅ Đã lưu username:", userToSave); // Bật Console F12 để xem dòng này
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi đăng nhập:", error.response?.data?.detail || error.message);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.clear(); // Xóa sạch mọi thứ khi logout
};

export const getCurrentUser = () => {
    return localStorage.getItem('username');
};

export const authService = {
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    getCurrentUser: getCurrentUser,
    loginUser: loginUser 
};

export default authService;