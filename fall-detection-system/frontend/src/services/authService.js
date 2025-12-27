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
        // 1. Gọi API Login để lấy Token
        const response = await api.post('/api/auth/login', { 
            username, 
            password 
        });
        
        const { access_token } = response.data;

        if (access_token) {
            // 2. Lưu Token ngay lập tức
            localStorage.setItem('access_token', access_token);
            
            // 3. QUAN TRỌNG: Gọi ngay API /me để lấy thông tin chi tiết (Fullname, Phone)
            // Vì API login thường chỉ trả về Token, không trả về chi tiết user
            try {
                const userResponse = await api.get('/api/auth/me');
                
                // 4. Lưu toàn bộ object user vào 'user_info' để Modal có cái mà đọc
                const userInfo = userResponse.data; 
                // userInfo sẽ có dạng: { username: "...", full_name: "...", phone_number: "..." }
                
                localStorage.setItem('user_info', JSON.stringify(userInfo));
                
                console.log("✅ Đã lưu thông tin user:", userInfo);
            } catch (err) {
                console.error("Không lấy được thông tin user chi tiết:", err);
            }
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi đăng nhập:", error.response?.data?.detail || error.message);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.clear(); // Xóa sạch token và user_info
    window.location.href = '/'; // Chuyển hướng về trang login
};

export const getCurrentUser = () => {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
};

export const authService = {
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    getCurrentUser: getCurrentUser,
    loginUser: loginUser 
};

export default authService;