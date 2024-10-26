import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TableComponent from '../../components/table/TableComponent';
import { useNavigate } from 'react-router-dom';
import { fetchAppointment } from '../../api/appointmentApi';


interface Appointment {
    appointment_id: number;
    created_date: string;
    service_name: string;
    appointment_status: Status;
    customer_name: string; // chưa có customer name khi list ra trong danh sách chung của staff
}

enum Status {
    CANCELLED = 'CANCELLED',
    CHECKED_IN = 'CHECKED_IN',
    CONFIRMED = 'CONFIRMED',
    DONE = 'DONE',
    ON_GOING = 'ON_GOING',
    PENDING = 'PENDING',
}


const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return 'Invalid date'; // Check if the date is valid
    }

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
    };

    return date.toLocaleString('vi-VN', options);
};


const ManagerAppointment: React.FC = () => {
    const [appointment, setAppointment] = useState<Appointment[]>([]);
    const columns = ['appointment_id', 'created_date', 'service_name', 'veterinarian_name', 'appointment_status'];
    const columnHeaders = ['ID', 'Created date', 'Service', 'Veterinarian', 'Status'];
    // tạm thời chưa có customer name!
    const navigate = useNavigate();

    useEffect(() => {
        const getAppointment = async () => {
            try {
                const data = await fetchAppointment();
                const filteredData = data.map((appointment: any) => {
                    const { created_date, ...rest } = appointment; // Exclude password
                    return {
                        ...rest,
                        created_date: formatDateTime(created_date), // Format created_date to desired format
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
        console.log(appointment_id); // check xem có ra id không
        navigate('/manager/appointment-details', { state: { appointment_id } });
    };

    const actions = [
        {
            label: 'View Details',
            icon: 'fas fa-info-circle',
            onClick: handleAppointmentDetails,
        },
    ];
    console.log(appointment);
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
                            actions={actions} // Pass the actions to the TableComponent
                            isKoiFishPage={false}
                            isAddressPage={false}
                            isAppointmentPage={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerAppointment;
