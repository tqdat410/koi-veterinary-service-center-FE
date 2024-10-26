import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TableComponent from '../../components/table/TableComponent';
import { useNavigate } from 'react-router-dom';
import { fetchVets } from '../../api/vetApi';
import Pagination from '@mui/material/Pagination';
interface Vet {
    user_id: number;
    fullName: string;
    username: string;
    email: string;
    phone_number: string;
    address: string;
    avatar?: string;
    // Include other fields as needed
}
const VetShiftSchePage: React.FC = () => {
    const [vets, setVets] = useState<any[]>([]);
    const columns = ['user_id', 'fullName', 'username', 'email', 'phone_number'];
    const columnHeaders = ['ID', 'Full Name', 'Username', 'Email', 'Phone Number'];
    const navigate = useNavigate();


    useEffect(() => {
        const getVets = async () => {
            try {
                const data = await fetchVets();
                const filteredData = data.map((vet: any) => {
                    const { password, ...rest } = vet;
                    return rest;
                });
                const sortedData = filteredData.sort((a: Vet, b: Vet) => a.user_id - b.user_id);
                setVets(sortedData);
            } catch (error) {
                console.error('Error fetching veterinarians:', error);
            }
        };

        getVets();
    }, []);

    // Update the onClick function to have fullName as optional
    const handleVetScheduleClick = (vetId: number, fullName?: string) => {
        navigate(`/manager/vet-schedule`, { state: { vetId, fullName } });
    };

    const handleVetDetailsClick = (vetId: number) => {
        navigate('/manager/vet-details', { state: { vetId } });
    };

    const actions = [
        {
            label: 'View Schedule',
            icon: 'fas fa-calendar-alt',
            onClick: handleVetScheduleClick, // This is now compatible
        },
        {
            label: 'View Details',
            icon: 'fas fa-info-circle',
            onClick: handleVetDetailsClick,
        },
    ];

    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: "6rem" }}>
                <div className="card" style={{ width: '100%' }}>
                    <div className="card-header">
                        <h5 className="text-start" style={{ fontWeight: "bold", color: "#02033B", fontSize: "2.5rem", padding: "1.2rem" }}>
                            Veterinarians List
                        </h5>
                    </div>
                    <div className="card-body">
                        <TableComponent
                            columns={columns}
                            columnHeaders={columnHeaders}
                            data={vets}
                            actions={actions} // Actions for Veterinarians
                            isKoiFishPage={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VetShiftSchePage;
