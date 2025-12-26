
const API_URL = "http://localhost:8000/api/auth";
export const authService = {
    // 1. Xử lý Đăng nhập (Chuyển JSON -> Form Data)
    login: async (username, password) => {
        // OAuth2PasswordRequestForm yêu cầu form-data
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Header bắt buộc
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Đăng nhập thất bại');
        }

        return await response.json();
    },

    // 2. Xử lý Đăng ký (Gửi JSON đúng schema Backend)
    register: async (userData) => {
        // Backend cần: username, password, full_name, phone_number
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Đăng ký thất bại');
        }

        return await response.json();
    }
};