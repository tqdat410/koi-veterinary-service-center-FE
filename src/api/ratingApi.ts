import axios from 'axios';
import {BASE_API} from "./baseApi"
const USER_URL = `${BASE_API}/users`;
export const getAverageRating = async (serviceId: number): Promise<number> => {
    try {
        const response = await axios.get(`${USER_URL}/average-rating/${serviceId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching rating for service ID ${serviceId}:`, error);
        return 0; // Return a default rating in case of error
    }
};

export interface Feedback {
    feedback_id: number;
    rating: number;
    comment: string;
    date_time: string;
}

export const getServiceFeedbacks = async (serviceId: number): Promise<Feedback[]> => {
    try {
        const response = await axios.get(`${USER_URL}/service/${serviceId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching feedbacks for service ID ${serviceId}:`, error);
        return []; // Return an empty array in case of error
    }
};