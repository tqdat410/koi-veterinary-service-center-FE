import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';
import TableComponent from '../../../components/table/TableComponent';
import FishSelectionModal from './FishSelectionModal';
import { useAuth } from "../../../hooks/context/AuthContext";

import { BASE_API } from "../../../api/baseApi"
const KoiFishPage: React.FC = () => {
    const [koiFishData, setKoiFishData] = useState<any[]>([]);
    const navigate = useNavigate();
    const { user } = useAuth(); // Use Auth context to get userId
    const userId = user?.userId;
    // const [selectedFishId, setSelectedFishId] = useState<number | null>(null);  
    const [showFishModal, setShowFishModal] = useState(false); // State for modal

    useEffect(() => {

        if (!userId) {
            alert("Bạn chưa đăng nhập! Vui lòng đăng nhập!!!");
            navigate('/login');
            return;
        }

        axios.get(`${BASE_API}/fishes`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    const filteredData = response.data.filter((fish: { customer_id: number }) => fish.customer_id === Number(userId));

                    if (filteredData.length > 0) {
                        setKoiFishData(filteredData);
                    } else {
                        console.log('No Koi Fish data available');
                        setKoiFishData([]); // Cập nhật lại dữ liệu trống nếu không có dữ liệu khớp
                    }


                } else {
                    console.log('Unexpected response format:', response.data);
                    setKoiFishData([]);
                }
            })
            .catch(error => {
                console.error('Error fetching Koi Fish data:', error);
            });

    }, [navigate]);

    const handleKoiFishClick = (fishId: number) => {
        console.log("Clicked fish ID:", fishId); // Thêm dòng này để kiểm tra
        navigate(`/koi/details`, { state: { fishId } }); // Truyền fishId vào state
    };

    const handleViewAppointmentClick = () => {
        setShowFishModal(true); // Show modal
    };

    const handleSelectFish = (fishId: number) => {
        setShowFishModal(false); // Hide modal
        navigate(`/appointments/fish/${fishId}`); // Navigate to appointments page
    };


    const actions = [
        {
            label: 'View Details',
            icon: 'fas fa-info-circle',
            onClick: handleKoiFishClick,
        },
    ]

    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: "6rem" }}>
                <div className="card" style={{ width: '100%' }}>
                    <div className="card-header d-flex  align-items-center">
                        <h5 className="text-start" style={{ fontWeight: "bold", color: "#02033B", fontSize: "2.5rem", padding: "1.2rem" }}>
                            Koi Fish List
                        </h5>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/koi/add?id=${userId}`)}
                            style={{ marginLeft: "auto" }}
                        >
                            Add Koi Fish
                        </button>
                        <button
                            style={{ marginLeft: "1rem" }}
                            className="btn btn-primary"
                            onClick={handleViewAppointmentClick} // Sử dụng hàm này để xử lý sự kiện khi click vào nút                             
                        >
                            View Koi Fish Appointment
                        </button>
                    </div>
                    <div className="card-body">
                        <TableComponent
                            columns={['fish_id', 'species', 'age', 'gender', 'color', 'size']}
                            columnHeaders={['ID', 'Species', 'Age', 'Gender', 'Color', 'Size (cm)']}
                            data={koiFishData}
                            actions={actions}
                            isKoiFishPage={true}
                        />

                    </div>
                    {showFishModal && (
                        <FishSelectionModal
                            koiFishData={koiFishData}
                            onSelectFish={handleSelectFish} // Handle fish selection
                            onClose={() => setShowFishModal(false)} // Close modal
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default KoiFishPage;
