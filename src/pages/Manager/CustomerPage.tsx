import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TableComponent from '../../components/table/TableComponent';
import { useNavigate } from 'react-router-dom';
import { fetchCustomers } from '../../api/customerApi';

interface Customer {
    user_id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_number: string;
    // address: string;
}
const CustomerManagementPage: React.FC = () => {
    const [customers, setCustomers] = useState<any[]>([]);
    const columns = ['user_id', 'fullName', 'username', 'email', 'phone_number'];
    const columnHeaders = ['ID', 'Full Name', 'Username', 'Email', 'Phone Number'];
    const navigate = useNavigate();

    useEffect(() => {
        const getCustomerInfo = async () => {
            try {
                const data = await fetchCustomers();
                const filteredData = data.map((vet: any) => {
                    const { address, ...rest } = vet; // Lấy address ra
                    // const addressString = `${address.home_number} ${address.ward}, ${address.district}, ${address.city}`; // Tạo chuỗi địa chỉ
                    return { ...rest
                        // address: addressString
                     }; // Thay thế địa chỉ bằng chuỗi
                });
                
                const sortedData = filteredData.sort((a: Customer, b: Customer) => a.user_id - b.user_id);
                setCustomers(sortedData);
            } catch (error) {
                console.error('Error fetching customer:', error);
            }
        };

        getCustomerInfo();
    }, []);


    // Function to handle customer details
    const handleCustomerDetails = (userID: number) => {
        navigate('/manager/customer-details', { state: { userID } });
    };

    const actions = [
        {
            label: 'View Details',
            icon: 'fas fa-info-circle',
            onClick: handleCustomerDetails,
        },
    ];

    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: "6rem" }}>
                <div className="card" style={{ width: '100%' }}>
                    <div className="card-header">
                        <h5 className="text-start" style={{ fontWeight: "bold", color: "#02033B", fontSize: "2.7rem", padding: "1.2rem" }}>
                            Customer list
                        </h5>
                    </div>
                    <div className="card-body">
                        <TableComponent
                            columns={columns}
                            columnHeaders={columnHeaders}
                            data={customers}
                            actions={actions} // Actions for manager : manage customer
                            isKoiFishPage={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerManagementPage;
