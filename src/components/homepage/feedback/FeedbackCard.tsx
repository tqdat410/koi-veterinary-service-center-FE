import React, {useRef} from 'react';

interface FeedbackCardProps {
    rating: number;
    text: string;
    datetime: string; // Đây sẽ là date_time
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ rating, text, datetime }) => {

    const truncateText = (input: string, length: number) => {
        if (input.length > length) {
            return input.substring(0, length) + '...';
        }
        return input;
    };



    return (

            <div className="card fb-in-card  bg-white p-4" style={{backgroundColor: '#fff',borderRadius: '40px', width: '300px', height: '250px'}}>
                <div className="d-flex justify-content-start mb-2">
                    {[...Array(rating)].map((_, index) => (
                        <span key={index} className="text-warning fs-4">&#9733;</span>
                    ))}
                </div>
                <p className="fb-text">{truncateText(text, 150)}</p>
                <div className="d-flex justify-content-end mt-auto">
                    <strong className="text-primary me-2 mt-3">{new Date(datetime).toLocaleDateString()}</strong>
                </div>
            </div>


    );
};

export default FeedbackCard;