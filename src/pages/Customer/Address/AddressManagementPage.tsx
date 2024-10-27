import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import TableComponent from '../../../components/table/TableComponent';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../../../hooks/context/AuthContext";
import {fetchAddresses} from "../../../api/addressApi";
import {getUserInfo} from "../../../api/authService";

const AddressManagementPage: React.FC = () => {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [userCurrenAddress, setCurrentAddress] = useState<{ address_id:number, city: string; district: string; ward: string; home_number: string } | null>(null);


    const columns = ['address_id', 'district', 'city', 'ward', 'home_number'];
    const columnHeaders = ['ID', 'District', 'City', 'Ward', 'Home Number'];
    const navigate = useNavigate();
    const { user  } = useAuth(); // Use Auth context to get userId
    const userId = user?.userId;
    useEffect(() => {
        const getAddresses = async () => {
            if (userId) {  // Kiểm tra nếu userId không undefined
                try {
                    const userInfo = await getUserInfo(userId);
                    setCurrentAddress(userInfo.address);
                    const data = await fetchAddresses(); // Gọi API để lấy danh sách địa chỉ
                    setAddresses(data);
                } catch (err) {
                    setError('Failed to fetch addresses');
                } finally {
                    setLoading(false); // Tắt trạng thái loading sau khi dữ liệu đã được load
                }
            } else {
                setError('User ID is not available');
                setLoading(false);
            }
        };

        getAddresses();
    }, [userId]);

    // Update the onClick function to have fullName as optional


    const handleAddressDetailsClick = (addressId: number) => {

        navigate('/address/details', { state: { addressId } });
    };



    const actions = [

        {
            label: 'View Details',
            icon: 'fas fa-info-circle',
            onClick: handleAddressDetailsClick,
        },
    ];

    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: "6rem" }}>
                <div className="card" style={{ width: '100%' }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="text-start"
                            style={{fontWeight: "bold", color: "#02033B", fontSize: "2.7rem", padding: "1.2rem"}}>
                            Addresses List
                        </h5>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/address/add`)}
                        >
                            Add Address
                        </button>
                    </div>
                    <div className="card-body">
                        {userCurrenAddress && (
                            <h5 className="text-start address-list fw-bold">
                                Current Address: ID: {userCurrenAddress.address_id} | {userCurrenAddress.home_number}, {userCurrenAddress.ward}, {userCurrenAddress.district}, {userCurrenAddress.city}
                            </h5>
                        )}
                        <TableComponent
                            columns={columns}
                            columnHeaders={columnHeaders}
                            data={addresses}
                            actions={actions} // Actions for Veterinarians
                            isKoiFishPage={false}
                            isAddressPage={true}
                        />

                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddressManagementPage;
