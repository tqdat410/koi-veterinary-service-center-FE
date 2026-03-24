import React from 'react';
import { useNavigate } from 'react-router-dom';

interface VetShiftRowProps {
    userId: number; // Change to number for user_id
    firstName: string;
    lastName: string;
    username: string;
    email: string | null;
    phoneNumber: string;
    avatar: string;
    address: string | null;
    onButtonClick: (userId: number, fullName: string) => void; // Updated to pass userId and fullName
}

const VetShiftRow: React.FC<VetShiftRowProps> = ({
                                                     userId,
                                                     firstName,
                                                     lastName,
                                                     username,
                                                     email,
                                                     phoneNumber,
                                                     avatar,
                                                     address,
                                                     onButtonClick,
                                                 }) => {
    const navigate = useNavigate(); // Moved this inside the component

    const fullName = `${firstName} ${lastName}`;

    const handleButtonClick = () => {
        onButtonClick(userId, fullName); // Call the onButtonClick function
        navigate(`/vetsche`, { state: { userId, fullName } }); // Navigate to the schedule page
    };

    return (
        <tr>
            <td className="text-muted">{userId}</td>
            <td>
                <img src={avatar} alt={fullName} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                {fullName}
            </td>
            <td>{username}</td>
            <td>{email || 'N/A'}</td>
            <td>{phoneNumber}</td>
            <td>{address || 'N/A'}</td>
            <td>
                <button onClick={handleButtonClick} className="btn btn-primary btn-sm">
                    View
                </button>
            </td>
        </tr>
    );
};

export default VetShiftRow;
