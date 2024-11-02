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
        return 'Invalid date'; // Kiểm tra xem ngày có hợp lệ không
    }

    // Lấy từng phần của ngày và giờ
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Trả về chuỗi có dạng ngày trước giờ sau
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};



const StaffAppointment: React.FC = () => {
    const [appointment, setAppointment] = useState<Appointment[]>([]);
    const columns = ['appointment_id', 'date_time', 'service_name', 'veterinarian_name', 'appointment_status'];
    const columnHeaders = ['ID', 'Date & time', 'Service name', 'Veterinarian name', 'Status'];
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
