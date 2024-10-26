// src/api/serviceApi.ts
import axios from 'axios';
import {BASE_API} from "./baseApi"

const SERVICE_URL = `${BASE_API}/services`;

export const fetchServices = async () => {
    try {
        const response = await axios.get(SERVICE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error; // Rethrow the error for handling in the component
    }
};

export const updateServicePrice = async (serviceId: number, updatedService: any) => {
    try {
        console.log('Updating service with ID:', serviceId, 'and new data:', updatedService);
        await axios.put(`${SERVICE_URL}/${serviceId}`, updatedService);
    } catch (error) {
        console.error('Error updating price:', error);
        throw error; // Rethrow the error for handling in the component
    }
};
