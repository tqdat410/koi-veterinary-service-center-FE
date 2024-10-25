import React, { useState, useEffect } from 'react';

import Sidebar from '../../components/layout/Sidebar';
import TableComponent from '../../components/table/TableComponent';

import { useNavigate } from 'react-router-dom';
import { fetchAppointment } from '../../api/appointmentApi';
import { fetchStaff } from '../../api/staffApi';


interface Staff {
    staff_id: number;
}


const ManagerStaffPage: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([]);

    const columns = ['user_id', 'first_name', 'last_name', 'username'];
    const columnHeaders = ['User ID', 'First name', 'Last name', 'User name'];

    // tạm thời chưa có customer name!
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(8); // Set the number of items per page

    useEffect(() => {
        const getStaff = async () => {
            try {
                const data = await fetchStaff();
                const filteredData = data.map((staff: any) => {
                    const { ...rest } = staff;
                    return {
                        ...rest,
                    };
                });
                const sortedData = filteredData.sort((a: Staff, b: Staff) => b.staff_id - a.staff_id);
                setStaff(sortedData);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };

        getStaff();
    }, []);

    const handleAppointmentDetails = (staff_id: number) => {
        console.log(staff_id); // check xem có ra id không
        navigate('/staff-details', { state: { staff_id } });
    };

    const actions = [
        {
            label: 'View Details',
            icon: 'fas fa-info-circle',
            onClick: handleAppointmentDetails,
        },
    ];
    console.log(staff);
    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: "6rem" }}>
                <div className="card" style={{ width: '100%' }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="text-start" style={{ fontWeight: "bold", color: "#02033B", fontSize: "2.7rem", padding: "1.2rem" }}>
                            Staff lists
                        </h5>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/manager/add-staff')}
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Add Staff
                        </button>
                    </div>

                    <div className="card-body">
                        <TableComponent
                            columns={columns}
                            columnHeaders={columnHeaders}
                            data={staff}
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

export default ManagerStaffPage;
