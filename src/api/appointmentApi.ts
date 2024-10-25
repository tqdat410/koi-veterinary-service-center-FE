import axios from 'axios';
import { fetchVetBySlotId } from './vetApi';


const API_BASE_URL = 'http://localhost:8080/api/v1/appointments';

// Define interfaces for the data types used in the requests/responses
export interface AppointmentDetails {
    appointment_id: number;
    created_date: string;
    current_status: string;
    customer_name: string;
    email: string;
    phone_number: string;
    description: string;
    total_price: number;
    service: {
        service_id: number;
        service_name: string;
        service_price: number;
    };
    moving_surcharge: {
        moving_surcharge_id: number;
        district: string;
        price: number;
    };
    address: {
        address_id: number;
        city: string;
        district: string;
        ward: string;
        home_number: string;
        status: boolean;
    };
    veterinarian: {
        user_id: number;
        first_name: string;
        last_name: string;
    };
    fish: {
        fish_id: number;
        gender: string;
        age: number;
        species: string;
        size: number;
        weight: number;
        color: string;
        origin: string;
        enable: boolean;
    };
}

export interface StatusUpdate {
    current_status: string; // Ensure this matches the expected API structure
}

export interface MedicalReport {

    veterinarian_id: number;
    prescription_id: number;
    conclusion: string;
    advise: string;

}

export interface Medicine {
    medicine_id: number;
    medicine_name: string;
    instruction: string;
    quantity: number;
}

export interface Prescription {
    prescription_id: number;
    instruction: string;
    medicines: Medicine[];
}


// API to fetch appointment details by ID
export const getAppointmentDetailsVet = async (appointmentId: number): Promise<AppointmentDetails> => {
    const response = await axios.get(`${API_BASE_URL}/${appointmentId}/veterinarian`);
    return response.data;
};



// API to create a medical report for an appointment
export const createMedicalReport = async (appointmentId: number, report: MedicalReport) => {
    const response = await axios.post(`${API_BASE_URL}/${appointmentId}/report`, report);
    return response.data;
};

// API to fetch the medical report for an appointment
export const getMedicalReport = async (appointmentId: number): Promise<MedicalReport> => {
    const response = await axios.get(`${API_BASE_URL}/${appointmentId}/report`);
    return response.data;
};

// API to fetch appointment logs (status history)
export const getAppointmentLogs = async (appointmentId: number) => {
    const response = await axios.get(`${API_BASE_URL}/${appointmentId}/logs`);
    return response.data;
};

// // API to create a new appointment
// export const createAppointment = async (appointmentData: any) => {
//     const response = await axios.post(API_BASE_URL, appointmentData);
//     return response.data;
// };

// API to fetch all appointments
export const getAllAppointments = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

// API to fetch appointments for a specific customer
export const getAppointmentsForCustomer = async (customerId: number) => {
    const response = await axios.get(`${API_BASE_URL}/customer/${customerId}`);
    return response.data;
};

const API_PRESCRIPTION_URL = 'http://localhost:8080/api/v1/prescriptions';

export const getMedicines = async () => {
    const response = await axios.get(`${API_PRESCRIPTION_URL}/medicines`);
    return response.data;
};

export const createPrescription = async (prescriptionData: any) => {
    const response = await axios.post(`${API_PRESCRIPTION_URL}`, prescriptionData);
    return response.data;
};

export const fetchPrescriptionDetails = async (prescriptionId: number): Promise<Prescription> => {
    try {
        const response = await axios.get(`${API_PRESCRIPTION_URL}/${prescriptionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching prescription by ID:', error);
        throw error;
    }
}

export const updateDoneStatus = async (appointmentId: number,status: string ) => {
    const response = await axios.put(`${API_BASE_URL}/${appointmentId}/status`, {
        status
    });
    return response.data;
};



interface Appointment {
    service_id: number,
    address_id?: number | null,
    slot_id: number,
    veterinarian_id?: number | null,
    email: string,
    phone: string,
    customer_name: string,
    description?: string,
    fish_id?: number | null,
    payment: {
        payment_method: string,
    };
}

const createAppointment = async (payload: Appointment) => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/appointments', payload);
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error; // ném lỗi để xử lý ở nơi gọi
    }
};

export const fetchAppointment = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/appointments`);
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching appointment:', error);
        throw error; // ném lỗi để xử lý ở nơi gọi
    }
}

export const fetchAppointmentForCus = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/appointments/customer`);
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching appointment:', error);
        throw error; // ném lỗi để xử lý ở nơi gọi
    }
}

// Function to fetch appointment details and slot id to get veterinarian name
export const getAppointmentDetails = async (appointment_id: number) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/appointments/${appointment_id}`);
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching appointment details:', error);

    }
}

// Gọi hàm lấy chi tiết cuộc hẹn và danh sách bác sĩ
export const fetchAppointmentAndVeterinarians = async (appointment_id: number) => {
    try {
        const appointmentDetails = await getAppointmentDetails(appointment_id); // Gọi API để lấy chi tiết cuộc hẹn
        let veterinarians = [];

        if (appointmentDetails.slot_id) {
            // Nếu có slot_id, gọi API lấy danh sách bác sĩ
            const response = await axios.put(`http://localhost:8080/api/v1/users/appointments/${appointment_id}/veterinarian`);
            veterinarians = response.data; // Lưu dữ liệu vào biến veterinarians
            console.log('Danh sách bác sĩ từ slot id đó:', veterinarians);
        } else {
            console.error('Không tìm thấy slot_id trong chi tiết cuộc hẹn');
        }

        return { appointmentDetails, veterinarians }; // Trả về cả chi tiết cuộc hẹn và danh sách bác sĩ
    } catch (error) {
        console.error('Lỗi khi lấy thông tin chi tiết cuộc hẹn hoặc danh sách bác sĩ:', error);
        // throw error; // Ném lại lỗi để có thể xử lý trong useEffect
    }
}

// Gọi hàm lấy chi tiết cuộc hẹn và danh sách bác sĩ, và có thể gán bác sĩ cho cuộc hẹn
export const fetchAppointmentAndVeterinariansDemo = async (appointment_id: number, veterinarian_id: number) => {
    try {
        // Gọi API để lấy chi tiết cuộc hẹn
        const appointmentDetails = await getAppointmentDetails(appointment_id);
        const vet_id = appointmentDetails.veterinarian_id;
        let veterinarians = [];

        if (appointmentDetails.slot_id) {
            // Nếu có slot_id, gọi API lấy danh sách bác sĩ từ slot_id đó
            const response = await axios.get(`http://localhost:8080/api/v1/slots/${appointmentDetails.slot_id}/${vet_id}`);
            veterinarians = response.data; // Lưu danh sách bác sĩ vào biến veterinarians
            console.log('Danh sách bác sĩ từ slot id:', veterinarians);
        } else {
            console.error('Đã gắn bác sĩ cho cuộc hẹn');
        }

        // Nếu có veterinarianId, thực hiện gán bác sĩ cho cuộc hẹn
        // if (veterinarian_id) {
        //     const assignVetResponse = await axios.put(`http://localhost:8080/api/v1/appointments/${appointment_id}/veterinarian/${veterinarian_id}`);
        //     console.log('Kết quả gán bác sĩ:', assignVetResponse.data);
        // }

        return { appointmentDetails, veterinarians }; // Trả về cả chi tiết cuộc hẹn và danh sách bác sĩ
    } catch (error) {
        console.error('Lỗi khi lấy thông tin chi tiết cuộc hẹn hoặc gán bác sĩ:', error);
        throw error; // Ném lại lỗi để xử lý bên ngoài (trong useEffect)
    }
};


// update appointment : update veterinarian_id
export const updateAppointment = async (appointment_id: number, veterinarian_id: number) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/v1/appointments/${appointment_id}/veterinarian/${veterinarian_id}`);
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error; // ném lỗi để xử lý ở nơi gọi
    }
}



//View medical report of an appointment
export const fetchMedicalReport = async (appointment_id: number) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/appointments/${appointment_id}/report`);
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching medical report:', error);
        throw error; // ném lỗi để xử lý ở nơi gọi
    }
}

//Manager get the logs of an appointment
export const fetchLogs = async (appointment_id: number) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/appointments/${appointment_id}/logs`);
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error; // ném lỗi để xử lý ở nơi gọi
    }
}

// Staff update appointment status
export const updateAppointmentStatus = async (appointment_id: number, status: string) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/v1/appointments/${appointment_id}/status`,
            { status: status } // Chuyển đổi thành đối tượng với thuộc tính status
        );
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error updating appointment status:', error);
        throw error; // ném lỗi để xử lý ở nơi gọi
    }
};

// Staff update appointmet status: ONLY CANCELED
export const updateAppointmentStatusCanceled = async (appointment_id: number) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/v1/appointments/${appointment_id}`);
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error updating appointment status:', error);
        throw error; // ném lỗi để xử lý ở nơi gọi
    }
}

//get appointment details for customer
export const getAppointmentDetailsForCus = async (appointment_id: number) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/appointments/${appointment_id}/customer`);
        return response.data; // trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching appointment details:', error);
        
    }
}

export { createAppointment };

