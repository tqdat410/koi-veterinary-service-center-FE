import React, {useEffect, useRef, useState} from 'react';
import FeedbackCard from './FeedbackCard';
import axios from "axios";
import {useAuth} from "../../../hooks/context/AuthContext";
import {useNavigate} from "react-router-dom"; // Adjust the import path as needed
import {BASE_API} from "../../../api/baseApi"
interface Feedback {
    feedback_id: number;
    rating: number;
    comment: string;
    date_time: string;
}

const FeedbackSection: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const { isAuthenticated } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get(`${BASE_API}/feedbacks/limited`);
                const feedbackData: Feedback[] = response.data;
                // Sắp xếp theo rating giảm dần và lấy 10 feedback
                const sortedFeedbacks = feedbackData.sort((a, b) => b.rating - a.rating).slice(0, 10);

                setFeedbacks(sortedFeedbacks);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };

        fetchFeedbacks();
    }, []);

    const cardContainerRef = useRef<HTMLDivElement>(null);


    const scrollLeft = () => {
        if (cardContainerRef.current) {
            cardContainerRef.current.scrollBy({ left: -600, behavior: 'smooth' });
        }
    };


    const scrollRight = () => {
        if (cardContainerRef.current) {
            cardContainerRef.current.scrollBy({ left: 600, behavior: 'smooth' });
        }
    };


    const handleRequestAppointment = () => {
        if (!isAuthenticated) {
            setShowModal(true);
        } else {
            navigate('/appointment/service-selection');
        }
    };

    return (
        <section className="feed-back d-flex justify-content-center align-items-center py-5"
                 style={{background: 'linear-gradient(to bottom, #F7C95F, #FDB235)'}}>
            <div className="container-fluid py-5" style={{padding: "0px"}}>
                <h2 className="fw-bold display-4 mb-5" style={{color: '#02033B'}}>Our Customers' Feedback</h2>
                {/* Feedback Cards Grid */}
                <div className="feedback-container" ref={cardContainerRef}>
                    {feedbacks.map((feedback) => (
                        <div key={feedback.feedback_id} className="d-flex flex-column align-items-center">
                            <FeedbackCard
                                rating={feedback.rating}
                                text={feedback.comment}
                                datetime={feedback.date_time}
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation buttons */}
                {feedbacks.length > 5 && (
                    <div className="d-flex justify-content-between mt-1" style={{margin: "0px 20px"}}>
                        <button className="prev-next-button d-flex align-items-center fw-bold" onClick={scrollLeft}>
                            <i className="fa-solid fa-circle-chevron-left" style={{marginRight: '8px'}}></i>
                            Prev
                        </button>
                        <button className="prev-next-button d-flex align-items-center fw-bold" onClick={scrollRight}>
                            Next
                            <i className="fa-solid fa-circle-chevron-right" style={{marginLeft: '8px'}}></i>
                        </button>
                    </div>
                )}
                <div className="button-container mt-4"> {/* New div for centering buttons */}
                    {/* Read More Button */}
                    <button className="btn rounded-pill custom-button-feedback read-more-btn btn-shadow mb-3">
                        <span className="fw-bold">Read more</span>
                        <i className="fas fa-arrow-right ms-2"/>
                    </button>
                    {/* Request Appointment Button */}
                    <button className="btn rounded-pill custom-button-feedback btn-shadow mt-3"
                            onClick={handleRequestAppointment}>
                        Request Appointment <i className="fas fa-arrow-right ms-3 mt-1" style={{fontSize: "1.3rem"}}/>
                    </button>
                </div>
            </div>
        </section>

    );
};

export default FeedbackSection;