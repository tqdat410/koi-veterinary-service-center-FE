import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, replace, useLocation } from 'react-router-dom';   // Import useNavigate
import { fecthFeedbackDetails } from '../../api/feedbackApi'
import Sidebar from "../../components/layout/Sidebar";

interface FeedbackDetails {
    feedback_id: number;
    rating: number;
    comment: string;
    date_time: string;
    appointment: Appointment;
}

interface Appointment {
    appointment_id: number;
    created_date: string;
    service_name: string;
    customer_name: string;
    email: string;
    phone_number: string;
    time_slot: timeSlot;
    current_status: string;
}

interface timeSlot {
    slot_id: number,
    year: number,
    month: number
    day: number
    slot_order: number,
    description: string
}

const FeedbackDetailPageForManager: React.FC = () => {
    const location = useLocation();
    const feedbackId: number = location.state?.feedback_id;
    const [feedback, setFeedback] = useState<FeedbackDetails | null>(null);
    const navigate = useNavigate();  // Khởi tạo useNavigate

    useEffect(() => {
        const fetchDetails = async () => {
            if (feedbackId) {
                try {
                    const appointmentData = await fecthFeedbackDetails(feedbackId);
                    setFeedback(appointmentData);
                } catch (error) {
                    console.error('Error fetching appointment details:', error);
                }
            }
        };

        fetchDetails();
    }, [feedbackId]);

    // Function to format DateTime
    const formatDateTime = (dateString: any) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleString('vi-VN', options);
    };

    const formattedDate = formatDateTime(feedback?.date_time);
    const formatedCreatedDate = formatDateTime(feedback?.appointment.created_date);

    return (
        <div className="d-flex flex-grow-1 gap-3" style={{marginLeft: '272px'}}>
            <Sidebar/>
            <div className="container" style={{marginTop: '2rem', textAlign: 'left'}}>
                <h2 className="mb-4" style={{paddingTop: '65px'}}>Feedback Details</h2>

                <div className="card">
                    <div className="card-body">
                        <div className="card-body">
                            <h5 className="card-title" style={{width: '100%'}}>*Feedback
                                ID: {feedback?.feedback_id}</h5>
                            <p className="card-text">
                                Rating: {feedback?.rating} <br/>
                                Comment: {feedback?.comment} <br/>
                                Date & Time: {formattedDate} <br/>
                            </p>

                            <h5 className="card-title" style={{width: '100%'}}>*Appointment: </h5>
                            <p className="card-text">
                                Appointment ID: {feedback?.appointment.appointment_id} <br/>
                                Created date: {formatedCreatedDate} <br/>
                                Service name: {feedback?.appointment.service_name} <br/>
                                Customer name: {feedback?.appointment.customer_name} <br/>
                                Email: {feedback?.appointment.email} <br/>
                                Phone number: {feedback?.appointment.phone_number} <br/>
                            </p>

                            <h5 className="card-title" style={{width: '100%'}}>*Time Slot: </h5>
                            <p className="card-text">
                                Slot ID: {feedback?.appointment.time_slot.slot_id} <br/>
                                Year: {feedback?.appointment.time_slot.year} <br/>
                                Month: {feedback?.appointment.time_slot.month} <br/>
                                Day: {feedback?.appointment.time_slot.day} <br/>
                                Slot order: {feedback?.appointment.time_slot.slot_order} <br/>
                                Description: {feedback?.appointment.time_slot.description} <br/>
                            </p>

                            <h5 className="card-title" style={{width: '100%'}}>*Current
                                Status: {feedback?.appointment.current_status}</h5>

                        </div>
                    </div>
                </div>

                <div
                    style={{marginTop: '2rem', marginBottom: '2rem'}}
                >
                    {/* Back Button */}
                    <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Back</button>
                </div>

            </div>
        </div>
            );
            };

            export default FeedbackDetailPageForManager;
