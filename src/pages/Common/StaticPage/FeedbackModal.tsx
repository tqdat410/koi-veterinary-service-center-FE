import React, { useEffect, useState, useRef } from 'react';
import FeedbackCard from '../../../components/homepage/feedback/FeedbackCard';
import { getServiceFeedbacks, Feedback } from '../../../api/ratingApi';

interface FeedbackModalProps {
    serviceId: number;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ serviceId, onClose }) => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const cardContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const data = await getServiceFeedbacks(serviceId);
                setFeedbacks(data);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };
        fetchFeedbacks();
    }, [serviceId]);

    const scrollLeft = () => {
        if (cardContainerRef.current) {
            cardContainerRef.current.scrollBy({ left: -650, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (cardContainerRef.current) {
            cardContainerRef.current.scrollBy({ left: 650, behavior: 'smooth' });
        }
    };

    return (
        <div className="modal show" tabIndex={-1}
             style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="modal-dialog modal-lg d-flex justify-content-center align-items-center"
                >
                <div className="modal-content" style={{width: "1000px", marginTop:"15vh"}}> {/* Adjust width as necessary */}
                    <div className="modal-header">
                        <h2 className="modal-title fw-bold" style={{ color: '#02033B' }}>Customer Feedbacks</h2>
                        <button type="button" className="btn-close fs-5" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">

                        {/* Feedback Cards Grid */}
                        <div className="feedback-container d-flex" ref={cardContainerRef} style={{overflowX: 'hidden'}}>
                            {feedbacks.map(feedback => (
                                <div key={feedback.feedback_id} className="d-flex flex-column align-items-center"
                                     style={{margin: '0 10px'}}>
                                    <FeedbackCard
                                        rating={feedback.rating}
                                        text={feedback.comment}
                                        datetime={feedback.date_time}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Navigation buttons */}
                        {feedbacks.length > 2 && (
                            <div className="d-flex justify-content-between mt-3 mb-3" style={{margin: "0px 20px"}}>
                                <button className="prev-next-button d-flex align-items-center fw-bold"
                                        onClick={scrollLeft}>
                                    <i className="fa-solid fa-circle-chevron-left" style={{marginRight: '8px'}}></i>
                                    Prev
                                </button>
                                <button className="prev-next-button d-flex align-items-center fw-bold"
                                        onClick={scrollRight}>
                                    Next
                                    <i className="fa-solid fa-circle-chevron-right" style={{marginLeft: '8px'}}></i>
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
