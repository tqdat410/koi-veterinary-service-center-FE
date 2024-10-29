import axios from "axios";
import {BASE_API} from "./baseApi"

// const API_URL = `http://3.0.21.248:8080/api/v1/feedbacks/all`;
const FEEDBACK_URL = `${BASE_API}/feedbacks`;

// Function to fetch feedback for manager
export const fecthFeedbacks = async () => {
  try {
    const response = await axios.get(`${FEEDBACK_URL}/all`);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error; // Rethrow error to be handled in the component
  }
};

// Function to get feedback details information for manager
export const fecthFeedbackDetails = async (feedback_id: number): Promise<any> => {
  try {
    const response = await axios.get(`${FEEDBACK_URL}/${feedback_id}`,
      {
        params: { feedback_id },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// For Veterinarian get feedbacks
export const fetchVetFeedbacks = async () => {
  try {
    const response = await axios.get(`${FEEDBACK_URL}/veterinarian`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

// For Veterinarian get feedback details
export const fetchVetFeedbackDetails = async (feedback_id: number): Promise<any> => {
  try {
    const response = await axios.get(`${FEEDBACK_URL}/${feedback_id}/veterinarian`,
      {
        params: { feedback_id },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};


// For customer: create feedback
export const createFeedback = async (appointmentId: number, feedbackDto: any) => {
  try {
      const response = await axios.post(`http://3.0.21.248:8080/api/v1/feedbacks`, feedbackDto, {
          params: { appointmentId },  
      });

      const result = await response.data;

      if (response) {
          console.log('Feedback created successfully:', result);
          return result;  // You can handle success here, like showing a message
      } else {
          console.error('Failed to create feedback:', result);
      }
  } catch (error) {
      alert('Error creating feedback: You have feedback already');
      console.error('Error creating feedback:', error);
  }
};

//For customer: get feedback details
export const getFeedbackDetailsCus = async(feedback_id: number) => {
  try {
    const response = await axios.get(`${FEEDBACK_URL}/${feedback_id}/customer`,
      {
        params: { feedback_id },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

