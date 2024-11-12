import axios from 'axios';
import { BASE_API } from "./baseApi";
const API_URL = `${BASE_API}/users`;

// Fetch user and fish statistics
export const getUserFishStatistics = () => {
    return axios.get(`${API_URL}/user-fish-statistics`);
};

// Fetch appointment statistics
export const getAppointmentStatistics = () => {
    return axios.get(`${API_URL}/appointment-statistics`);
};

// Fetch payment statistics (requires startDate and endDate)
export const getPaymentStatistics = (startDate: string, endDate: string) => {
    return axios.get(`${API_URL}/paymentstatistics`, {
        params: { startDate, endDate }
    });
};

// Fetch feedback statistics
export const getFeedbackStatistics = () => {
    return axios.get(`${API_URL}/feedback-statistics`);
};

// Fetch slots for a specific veterinarian in a specified date range
export const getVetSlotsInRange = (vetId: number, startDate: string, endDate: string) => {
    return axios.get(`${API_URL}/${vetId}/slots`, {
        params: { startDate, endDate }
    });
};

// Fetch all veterinarians
export const getVeterinarians = () => {
    return axios.get(`${API_URL}/veterinarians`);
};

export const getAverageRatingForVeterinarian = (veterinarianId: number) => {
    return axios.get(`${API_URL}/${veterinarianId}/average-rating`);
};