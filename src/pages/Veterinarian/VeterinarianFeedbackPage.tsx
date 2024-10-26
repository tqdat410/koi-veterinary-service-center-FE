import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TableComponent from '../../components/table/TableComponent';
import { useNavigate } from 'react-router-dom';
import { fetchVetFeedbacks } from '../../api/feedbackApi'

interface Feedback {
    feedback_id: number;
    rating: number;
    comment: string;
    date_time: string;
    // Include other fields as needed
}

const VeterinarianFeedbackPage: React.FC = () => {
    const [Feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const columns = ['feedback_id', 'rating', 'comment', 'date_time'];
    const columnHeaders = ['ID', 'Rating', 'Comment', 'Date & time'];
    const navigate = useNavigate();

    useEffect(() => {
        const getFeedbacks = async () => {
            try {
                const data = await fetchVetFeedbacks();
                const filteredData = data.map((feedback: any) => {
                    const { date_time, ...rest } = feedback; // Exclude password
                    return {
                        ...rest,
                        date_time: formatDateTime(date_time), // Format created_date to desired format
                    }
                });
                const sortedData = filteredData.sort((a: Feedback, b: Feedback) => a.feedback_id - b.feedback_id);
                setFeedbacks(sortedData);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };

        getFeedbacks();
    }, []);

    // Update the onClick function to have fullName as optional
    // const handleVetScheduleClick = (userID: number, fullName?: string) => {
    //     navigate(`/vetsche`, { state: { userID, fullName } });
    // };
    console.log('Feedbacks:', Feedbacks);

    const handleFeedbackDetails = (feedback_id: number) => {
        console.log('Feedback ID:', feedback_id);
        navigate('/veterinarian/vet-feedback-details', { state: { feedback_id } });
    };

    // Function to format DateTime
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

    const actions = [
        {
            label: 'View Details',
            icon: 'fas fa-info-circle',
            onClick: handleFeedbackDetails,
        },
    ];

    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: "6rem" }}>
                <div className="card" >
                    <div className="card-header">
                        <h5 className="text-start" style={{fontWeight:'bold', fontSize: '40px'}} >
                            Feedback & rating lists
                        </h5>
                    </div>
                    <div className="card-body">
                        <TableComponent
                            columns={columns}
                            columnHeaders={columnHeaders}
                            data={Feedbacks}
                            actions={actions} // Actions for manager : manage customer
                            isFeedbackPage={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VeterinarianFeedbackPage;
