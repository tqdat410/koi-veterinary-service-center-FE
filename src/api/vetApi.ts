// src/api/vetApi.ts
import axios from 'axios';
import {BASE_API} from "./baseApi"
// Base URL for API
const API_BASE_URL = `${BASE_API}/users`;
const API_CERTIFICATE = `${BASE_API}/certificates`;

// Function to fetch veterinarians
export const fetchVets = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/veterinarians`);
        return response.data; // Return the data from the response
    } catch (error) {
        console.error('Error fetching veterinarians:', error);
        throw error; // Rethrow error to be handled in the component
    }
};

// FOR: STAFF TO FETCH VETERINARIANS
// Function to fetch veterinarian based on Slot ID
// Slot id lấy = cách nào ???
export const fetchVetBySlotId = async (slotId: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/veterinarian/${slotId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching veterinarian by slot ID:', error);
        throw error;
    }
};


// Function to get veterinarian profile information
export const getUserProfile = async (userId: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

// Function to update veterinarian profile
export const updateUserProfile = async (userId: number, updatedData: any): Promise<any> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/profile`, updatedData, {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

// Function to update veterinarian address
export const updateUserAddress = async (userId: number, addressData: any): Promise<any> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/address`, addressData, {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user address:', error);
        throw error;
    }
};

// Function to get certificates for a veterinarian
export const getCertificates = async (vetId: number) => {
    try {
        const response = await axios.get(`${API_CERTIFICATE}/veterinarians/${vetId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching certificates:', error);
        throw error;
    }
};

// Function to upload a certificate for a veterinarian
export const uploadCertificate = async (vetId: number, certificateName: string, file: File) => {
    const formData = new FormData();
    formData.append('certificateName', certificateName);
    formData.append('file', file);

    try {
        await axios.post(`${API_CERTIFICATE}/veterinarians/${vetId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error uploading certificate:', error);
        throw error;
    }
};
