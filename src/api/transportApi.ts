// src/api/transportApi.ts
import axios from 'axios';
import {BASE_API} from "./baseApi"
const TRANSPORT_API_URL = `${BASE_API}/surcharges`;

export const fetchTransportationPrices = async () => {
    try {
        const response = await axios.get(TRANSPORT_API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching transportation prices:', error);
        throw error; // Rethrow the error for handling in the component
    }
};

export const updateTransportationPrice = async (district_id: number, updatedSurcharges: any) => {
    try {
        await axios.put(`${TRANSPORT_API_URL}/${district_id}`, updatedSurcharges);

    } catch (error) {
        console.error('Error updating transportation price:', error);
        throw error; // Rethrow the error for handling in the component
    }
};
