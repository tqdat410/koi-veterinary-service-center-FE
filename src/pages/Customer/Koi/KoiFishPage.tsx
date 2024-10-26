import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';
import TableComponent from '../../../components/table/TableComponent';
import { useAuth } from "../../../hooks/context/AuthContext";
import Pagination from '@mui/material/Pagination';
const KoiFishPage: React.FC = () => {
    const [koiFishData, setKoiFishData] = useState<any[]>([]);
    const navigate = useNavigate();
    const { user  } = useAuth(); // Use Auth context to get userId
    const userId = user?.userId; // Access userId safely


    useEffect(() => {

        if (!userId) {
            alert("Bạn chưa đăng nhập! Vui lòng đăng nhập!!!");
            navigate('/login');
            return;
        }

        axios.get('http://localhost:8080/api/v1/fishes')
            .then(response => {
                const filteredData = response.data.filter((fish: { customer_id: number }) => fish.customer_id === Number(userId));
                setKoiFishData(filteredData);
                console.log(filteredData)
            })
            .catch(error => {
                console.error('Error fetching Koi Fish data:', error);
            });

    }, [navigate]);

    const handleKoiFishClick = (fishId: number) => {
        console.log("Clicked fish ID:", fishId); // Thêm dòng này để kiểm tra
        navigate(`/koi/details`, { state: { fishId } }); // Truyền fishId vào state
    };

    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: "6rem" }}>
                <div className="card" style={{ width: '100%' }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="text-start" style={{ fontWeight: "bold", color: "#02033B", fontSize: "2.5rem", padding: "1.2rem" }}>
                            Koi Fish List
                        </h5>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/koi/add?id=${userId}`)}
                        >
                            Add Koi Fish
                        </button>
                    </div>
                    <div className="card-body">
                        <TableComponent
                            columns={['fish_id', 'species', 'age', 'gender', 'color', 'size']}
                            columnHeaders={['ID', 'Species', 'Age', 'Gender', 'Color', 'Size (cm)']}
                            data={koiFishData}
                            actions={[{ label: 'View Details', icon: 'fas fa-info-circle', onClick: handleKoiFishClick }]} // Action for Koi Fish
                            isKoiFishPage={true} // Thêm prop này
                        />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default KoiFishPage;
