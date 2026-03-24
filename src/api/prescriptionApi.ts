import axios from 'axios';
import {BASE_API} from "./baseApi"
//Fetch prescriotion by prescription_id
export const fetchPrescription = async (prescription_id: number) => {
    try {
        const response = await axios.get(`${BASE_API}/prescriptions/${prescription_id}`);
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching prescription:', error);
        throw error; // ném lỗi để xử lý ở nơi gọi
    }
}