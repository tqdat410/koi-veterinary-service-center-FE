import axios from "axios";
import {BASE_API} from "./baseApi"

export const fetchVetSlots = async (vetId: number) => {
    try {
        const response = await axios.get(`${BASE_API}/slots/${vetId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching vet slots:", error);
        throw error;
    }
};

export const fetchVetSlotsAvailable = async (vetId: number) => {
    try {
        const response = await axios.get(`${BASE_API}/slots/${vetId}/available`);
        return response.data;
    } catch (error) {
        console.error("Error fetching vet slots:", error);
        throw error;
    }
};