import React from 'react';
import { useNavigate } from 'react-router-dom';
import VetShiftRow from './VetShiftRow';
import '../../styles/Schedule.css'
interface VetShiftTableProps {
    vets: {
        user_id: number;
        first_name: string;
        last_name: string;
        username: string;
        email: string | null;
        phone_number: string;
        avatar: string;
        address: string | null;
    }[];
}

const VetShiftTable: React.FC<VetShiftTableProps> = ({ vets }) => {
    const navigate = useNavigate();

    const handleButtonClick = (userId: number, fullName: string) => {
        navigate('/vetsche', { state: { userId, fullName } });
    };

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-small table-striped">
                <thead className="table-light">
                <tr>
                    <th scope="col">Vet ID</th>
                    <th scope="col">Vet Name</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Address</th>
                    <th scope="col" className="text-center">Schedule</th>
                </tr>
                </thead>
                <tbody>
                {vets.map((vet) => (
                    <VetShiftRow
                        key={vet.user_id}
                        userId={vet.user_id}
                        firstName={vet.first_name}
                        lastName={vet.last_name}
                        username={vet.username}
                        email={vet.email}
                        phoneNumber={vet.phone_number}
                        avatar={vet.avatar}
                        address={vet.address}
                        onButtonClick={handleButtonClick}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VetShiftTable;
