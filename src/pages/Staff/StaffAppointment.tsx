import React, { useState, useEffect } from 'react';

// import TableComponent from '../components/table/TableComponent';
import TableComponent from '../../components/table/TableComponentForStaff';
import { useNavigate } from 'react-router-dom';
import { fetchAppointment, fetchAppointmentAndVeterinarians } from '../../api/appointmentApi';
import Sidebar from "../../components/layout/Sidebar";

interface Appointment {
    appointment_id: number;
    created_date: string;
    service_name: string;
    appointment_status: Status;
    customer_name: string; 
    time_slot: TimeSlot;
}

interface TimeSlot {
    slot_id: number,
    year: number,
    month: number,
    day: number,
    slot_order: number,
    description: string
}


enum Status {
    CANCELLED = 'CANCELLED',
    CHECKED_IN = 'CHECKED_IN',
    CONFIRMED = 'CONFIRMED',
    DONE = 'DONE',
    ON_GOING = 'ON_GOING',
    PENDING = 'PENDING',
}

// interface Service {
//     service_id: number;
//     service_name: string;
//     service_price: number;
// };

// interface movingSurcharge {
//     moving_surcharge_id: number;
//     district: string;
//     price: number;
// };

// interface Address {
//     address_id: number;
//     city: string;
//     district: string;
//     ward: string;
//     home_number: string;
//     status: boolean;
// };

// interface Veterinarian {
//     user_id: number;
//     first_name: string;
//     last_name: string;
// };

// interface Fish {
//     fish_id: number;
//     gender: string;
//     age: number;
//     species: string;
//     size: number;
//     weight: number;
//     color: string;
//     origin: string;
//     enable: boolean;
// };

// Function to format DateTime


const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return 'Invalid date'; // Check if the date is valid
    }

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
    };

    return date.toLocaleString('vi-VN', options);
};


const StaffAppointment: React.FC = () => {
    const [appointment, setAppointment] = useState<Appointment[]>([]);
    const columns = ['appointment_id', 'date_time', 'service_name', 'veterinarian_name', 'appointment_status'];
    const columnHeaders = ['Appointment ID', 'Created date', 'Service name', 'Veterinarian name', 'Status'];
    // tạm thời chưa có customer name!
    const navigate = useNavigate();

    useEffect(() => {
        const getAppointment = async () => {
            try {
                const data = await fetchAppointment();
                const filteredData = data.map((appointment: any) => {
                    const { password, created_date, ...rest } = appointment; // Exclude password
                    return {
                        ...rest,
                        date_time: formatDateTime(created_date), // Format created_date to desired format
                        // current_status: mapStatus(current_status), // Map ENUM to readable status
                    };
                });
                const sortedData = filteredData.sort((a: Appointment, b: Appointment) => b.appointment_id - a.appointment_id);
                setAppointment(sortedData);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };

        getAppointment();
    }, []);

    // chuyển tới path my-appointment/appointment_id với state là appointment_id not path /số ra page khác 
    // dấu / là trang khác còn : là trang cùng 1 trang
    // dấu / chuyển theo path vd: appointment?appointment_id=1 ---> chuyền qua url parameters
 
    const handleAppointmentDetails = (appointment_id: number) => {
        // console.log(appointment_id);
        navigate(`/staff/appointments/${appointment_id}`);
    };
    

    const actions = [
        {
            label: 'View Details',
            icon: 'fas fa-info-circle',
            onClick: handleAppointmentDetails,
        },
    ];
    
    // console.log(appointment);
    
    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: "6rem" }}>
                <div className="card" style={{ width: '100%' }}>
                    <div className="card-header">
                        <h5 className="text-start" style={{ fontWeight: "bold", color: "#02033B", fontSize: "2.7rem", padding: "1.2rem" }}>
                            Appointment Lists
                        </h5>
                    </div>
                    <div className="card-body">
                        <TableComponent
                            columns={columns}
                            columnHeaders={columnHeaders}
                            data={appointment}
                            actions={actions}
                            isAppointmentPage={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffAppointment;
