import axios from "axios";
import {BASE_API} from "./baseApi"
const API_URL = `${BASE_API}/users`;
// const API_BASE_URL = "http://localhost:8080/api/v1/users";

// Function to fetch customers
export const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error; // Rethrow error to be handled in the component
  }
};

// Function to get customer profile information
export const getUserProfile = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/profile`
      , {
        params: { userId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Function to update customer profile
export const updateUserProfile = async (
  userId: number,
  updatedData: any
): Promise<any> => {
  try {
    const response = await axios.put(`${API_URL}/profile`, updatedData, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Function to update customer address
export const updateUserAddress = async (
  userId: number,
  addressData: any
): Promise<any> => {
  try {
    const response = await axios.put(`${API_URL}/address`, addressData, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user address:", error);
    throw error;
  }
};

// Function to update customer password
export const updateUserPassword = async (
  userId: number,
  passwordData: any
): Promise<any> => {
  try {
    const response = await axios.put(`${API_URL}/password`, passwordData, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};

// Function to delete customer account
export const deleteUserAccount = async (userId: number): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/delete`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};