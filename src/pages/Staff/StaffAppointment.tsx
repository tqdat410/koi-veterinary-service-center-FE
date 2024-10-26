import React, { useState, useEffect } from 'react';
import "../../styles/StaffAppointment.css";
import TableComponent from '../../components/table/TableComponent';
import { useNavigate } from 'react-router-dom';
import { fetchAppointment } from '../../api/appointmentApi';
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

   const handleAppointmentDetails = (appointment_id: number) => {
        navigate(`/staff/appointments/${appointment_id}`);
    };
    

    const actions = [
        {
            label: 'View Details',
            icon: 'fas fa-info-circle',
            onClick: handleAppointmentDetails,
        },
    ];

    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <h5 className="text-start">
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
