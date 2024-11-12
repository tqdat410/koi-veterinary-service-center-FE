import axios from 'axios';
import { BASE_API } from "./baseApi";

// Define the structure of VoucherDto based on the response
export interface VoucherDto {
    voucher_id: number;
    voucher_code: string;
    description: string;
    discount_amount: number;
}

// Fetch available vouchers for the authenticated customer
export const getAvailableVouchers = async (): Promise<VoucherDto[]> => {
    try {
        const response = await axios.get(`${BASE_API}/vouchers/customer`);
        return response.data;
    } catch (error: any) {
        throw new Error(`Error fetching available vouchers: ${error.message}`);
    }
};

// Fetch the amount of a specific voucher by ID
export const getVoucherAmount = async (voucherId: number): Promise<number> => {
    try {
        const response = await axios.get(`${BASE_API}/vouchers/${voucherId}/amount`);
        return response.data;
    } catch (error: any) {
        throw new Error(`Error fetching voucher amount: ${error.message}`);
    }
};

// Add a voucher for a customer
export const addVoucher = async (customerId: number, voucherId: number): Promise<number> => {
    try {
        const response = await axios.post(`${BASE_API}/vouchers`, null, {
            params: { customerId, voucherId }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(`Error adding voucher: ${error.message}`);
    }
};

// Delete a voucher for the authenticated customer
export const deleteVoucher = async (voucherId: number): Promise<number> => {
    try {
        const response = await axios.delete(`${BASE_API}/vouchers/${voucherId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(`Error deleting voucher: ${error.message}`);
    }
};
