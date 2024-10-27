import axios from 'axios';
import {BASE_API} from "./baseApi"
const API_URL = `${BASE_API}/users`;

// Fetch user and fish statistics
export const getUserFishStatistics = () => {
    return axios.get(`${API_URL}/user-fish-statistics`);
};

// Fetch appointment statistics
export const getAppointmentStatistics = () => {
    return axios.get(`${API_URL}/appointment-statistics`);
};

// Fetch payment statistics
export const getPaymentStatistics = () => {
    return axios.get(`${API_URL}/payment-statistics`);
};

// Fetch feedback statistics
export const getFeedbackStatistics = () => {
    return axios.get(`${API_URL}/feedback-statistics`);
};

// Fetch slots for a specific veterinarian in the current week
export const getVetSlotsInCurrentWeek = (vetId: number) => {
    return axios.get(`${API_URL}/${vetId}/slots-this-week`);
};

// Fetch all veterinarians
export const getVeterinarians = () => {
    return axios.get(`${API_URL}/veterinarians`);
};
