import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/users";

// Function to fetch staff from the API
export const fetchStaff = async () => {
    try {
        const response = await axios.get(`${API_URL}/staffs`);
        return response.data; // Return the data from the response
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error; // Rethrow error to be handled in the component
    }
};

//Function to get staff details by id
export const getStaffDetailsById = async (userId: number) => {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching staff details:", error);
        throw error;
    }
};

//Fucntipn to add staff: ONLY MANAGER CAN DO
export const createStaff = async (userDTO: any) => {
    try {
        const response = await axios.post(`${API_URL}/staff`, userDTO); // Gọi API POST để tạo nhân viên mới
        return response.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
        console.error("Error creating staff:", error);
        throw error; // Ném lỗi để có thể xử lý tại nơi gọi hàm
    }
};



// Function to update staff profile information, ko thể enable cho staff, có hàm riêng
// test thêm tích hợp cái deleteuser
export const updateStaffProfile = async (
    userId: number,
    updatedData: any
): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}/profile`, updatedData, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating staff profile:", error);
        throw error;
    }
};

// Function to enable/disable staff
export const modifyStaffStatus = async (id: number, enable: boolean) => {
    await axios.delete(`http://localhost:8080/api/v1/users/deleteuser`, {
        data: { // Đã thêm dấu hai chấm ở đây
            user_id: id, // Truyền giá trị id từ phía client
            enable: enable, // Truyền giá trị enable từ phía client
        }
    });
};
