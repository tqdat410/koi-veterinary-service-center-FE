import axios from 'axios';
import {BASE_API} from "./baseApi"
// URL cơ bản cho các API liên quan đến địa chỉ
const BASE_URL = `${BASE_API}/addresses`;
// const DISTRICT_URL = 'http://localhost:8080/api/v1';
// API để lấy tất cả địa chỉ của khách hàng
export const fetchAddresses = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw error;
    }
};

// API để lấy chi tiết địa chỉ theo ID
export const fetchAddressById = async (addressId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/${addressId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching address details:', error);
        throw error;
    }
};

// API để cập nhật địa chỉ theo ID
export const updateAddressById = async (addressId: number, addressData: any) => {
    try {
        const response = await axios.put(`${BASE_URL}/${addressId}`, addressData);
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};

// API để thêm địa chỉ mới cho khách hàng
export const addAddress = async (addressData: any) => {
    try {
        const response = await axios.post(`${BASE_URL}`, addressData);
        return response.data;
    } catch (error) {
        console.error('Error adding new address:', error);
        throw error;
    }
};

// API để xóa địa chỉ theo ID
export const deleteAddress = async (addressId: number) => {
    try {
        const response = await axios.delete(`${BASE_URL}`, {
            params: { addressId }
        });
        return response.data;
    } catch (error) {
        // Check if the error is an AxiosError
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 409) {
                // Handle the conflict error, such as showing a message to the user
                console.error('This address is currently in use and cannot be deleted.');
                throw new Error('This address is currently in use and cannot be deleted.');
            }
        } else {
            // Handle unexpected errors
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred.');
        }
    }
};

export const fetchDistricts = async () => {
    const response = await axios.get(`${BASE_API}/surcharges`);
    return response.data;
};

export const setCurrentAddress = async (addressId: number): Promise<void> => {
    try {
        const response = await axios.put(`${BASE_API}/users/address`, null, {
            params: { addressId }
        });
        return response.data; // Optionally return the updated address data if needed
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 403) {
                console.error('You are not authorized to update this address.');
            } else if (error.response && error.response.status === 404) {
                console.error('Address or user not found.');
            } else {
                console.error('An unexpected error occurred.');
            }
        } else {
            console.error('An unexpected error occurred:', error);
        }
        throw error;
    }
};