import axios from "axios";
import {BASE_API} from "./baseApi"

const PAYMENT_URL = `${BASE_API}/payments`;
// const API_BASE_URL = "http://3.0.21.248:8080/api/v1/payments";

// Function to fetch payment information
export const fetchPayment = async (appointment_id: number) => {
  try {
    const response = await axios.get(`${PAYMENT_URL}/${appointment_id}`);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error; // Rethrow error to be handled in the component
  }
};


// Function to update payment information: payment status
export const updatePayment = async (appointmentId: number, paymentData: any): Promise<any> => {
  try {
    const response = await axios.put(`${PAYMENT_URL}/${appointmentId}`, paymentData);
    return response.data; // Dữ liệu cập nhật thành công
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};



export const createPayment = async (appointmentId: number): Promise<any> => {
  try {
      const response = await axios.get(`${PAYMENT_URL}/vnpay-link`, {
          params: { appointmentId },
      });
      return response.data;
  } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
  }
}
