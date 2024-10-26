import axios from 'axios';
import bcrypt from 'bcryptjs';
import {BASE_API} from "./baseApi"
const USER_URL = `${BASE_API}/users`;
export const register = async (username: string, email: string, password: string, first_name: string, last_name: string) => {
    try {

        const response = await axios.post(`${USER_URL}/signup`, {
            "username": username,
            "email": email,
            "password": password,
            "first_name": first_name,
            "last_name": last_name,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data; // Return the response data
    } catch (error) {
        // Handle error (could be from API or network issues)
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data);
        } else {
            throw new Error('An error occurred during registration.');
        }
    }
};



// API để lấy thông tin người dùng
export const getUserInfo = async (userId: number) => {
    const token = localStorage.getItem("token");
    console.log(token)
    try {
        const response = await axios.get(`${USER_URL}/profile?userId=${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching user info:", error.response?.data || error.message);
        throw error; // hoặc xử lý lỗi theo cách của bạn
    }
};
// Update user profile
export const updateUserInfoAPI = async (userId: number, userData: any) => {
    console.log(userData)
    const response = await axios.put(`${USER_URL}/profile?userId=${userId}`, userData);

    return response.data;

};

// Update user address
export const updateUserAddressAPI = async (userId: number, addressData: any) => {
    const response = await axios.put(`${USER_URL}/address?userId=${userId}`, addressData);
    return response.data;
};
export const changePassword = async (userId: number, currentPassword: string, newPassword: string) => {
    const user = await getUserInfo(userId);
    console.log(user);

    if (user) {
        // Compare the current password with the stored hash
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        console.log(isMatch);

        if (isMatch) {
            const response = await axios.put(`${USER_URL}/password`, {
                password: newPassword
            } );

            console.log(response.data); // Log the response data for debugging
            return response.data;
        } else {
            throw new Error('Current password is incorrect.'); // Mật khẩu không khớp
        }
    } else {
        throw new Error('User not found.');
    }
};


export const logout = async (token: string) => {
    try {
        const response = await axios.post(`${USER_URL}/logout`, { token });
        return response.data; // Trả về phản hồi nếu cần thiết
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data); // Lỗi từ API
        } else {
            throw new Error('An error occurred during logout.');
        }
    }
};

export const refreshToken = async (token: string) => {
    const response = await axios.post(`${USER_URL}/refresh`, { refreshToken: token });
    return response.data.result.token;
};



export const updateUserAvatarAPI = async (userId: number, image: File) => {
    const formData = new FormData();
    formData.append("user_id", userId.toString());
    formData.append("image", image);
    const token = localStorage.getItem("token");
    console.log(token)
    const response = await axios.put(`${USER_URL}/avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
};