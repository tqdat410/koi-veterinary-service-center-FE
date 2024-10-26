import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAppointmentDetailsForCus } from '../../api/appointmentApi';
import { createPayment, fetchPayment } from '../../api/paymentApi';
import { createFeedback, getFeedbackDetailsCus } from '../../api/feedbackApi';
import '../../styles/CustomerAppointmentDetails.css';
import { Rating, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import Sidebar from "../../components/layout/Sidebar";

interface AppointmentDetailsProps {
    appointment_id: number;
    created_date: string;
    current_status: string;
    customer_name: string;
    slot: Slot;
    email: string;
    phone_number: string;
    description: string;
    total_price: number;
    service: Service;
    moving_surcharge: movingSurcharge;
    address: Address;
    veterinarian: Veterinarian;
    fish: Fish;
    payment: PaymentDetails;
    feedback_id: number
}

interface Service {
    service_id: number;
    service_name: string;
    service_price: number;
}

interface movingSurcharge {
    moving_surcharge_id: number;
    district: string;
    price: number;
}

interface Address {
    address_id: number;
    city: string;
    district: string;
    ward: string;
    home_number: string;
    status: boolean;
}

interface Veterinarian {
    user_id: number;
    first_name: string;
    last_name: string;
}

interface Fish {
    fish_id: number;
    gender: string;
    age: number;
    species: string;
    size: number;
    weight: number;
    color: string;
    origin: string;
    enable: boolean;
}

interface PaymentDetails {
    payment_id: number;
    payment_method: payment_method;
    payment_amount: number;
    description: string;
    status: payment_status;
}

interface Slot {
    slot_id: number,
    year: number,
    month: number,
    day: number,
    slot_order: number,
    description: string,
}

enum payment_method {
    CASH = 'CASH',
    VN_PAY = 'VN_PAY',
}

enum payment_status {
    NOT_PAID = 'NOT_PAID',
    PAID = 'PAID',
}

const CustomerAppointmentDetails: React.FC = () => {
    const location = useLocation();
    const appointment_id: number = location.state?.appointment_id;
    const [appointment, setAppointment] = useState<AppointmentDetailsProps | null>(null);
    const [PaymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
    // const [isPaymentVisible, setIsPaymentVisible] = useState(false);
    const paymentRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [feedbackDetails, setFeedbackDetails] = useState<any>(null); // New state

    // Fetch appointment details by ID
    //Fetch feedback details by ID of feedback
    useEffect(() => {
        const fetchDetails = async () => {
            if (appointment_id) {
                try {
                    const appointmentData = await getAppointmentDetailsForCus(Number(appointment_id));
                    const paymentData = await fetchPayment(appointment_id);
                    setAppointment(appointmentData);
                    setPaymentDetails(paymentData); // Update only PaymentDetails state                  
                } catch (error) {
                    console.error('Error fetching appointment details:', error);
                }
            }
        };

        fetchDetails();
    }, [appointment_id]);


    // Fetch feedback details by ID of feedback
    useEffect(() => {
        const fetchFeedbackDetails = async () => {
            if (appointment?.feedback_id) {
                try {
                    const feedbackData = await getFeedbackDetailsCus(appointment.feedback_id);
                    setFeedbackDetails(feedbackData);
                } catch (error) {
                    console.error('Error fetching feedback details:', error);
                }
            }
        };

        fetchFeedbackDetails();
    }, [appointment?.feedback_id]);
    if (!appointment) {
        return <div>Loading...</div>;
    }



    // Handle payment initiation
    const handlePayment = async () => {
        try {
            const paymentUrl = await createPayment(appointment_id);
            window.open(paymentUrl, '_blank'); // Open payment URL in a new tab
        } catch (error) {
            if (payment_method.CASH === PaymentDetails?.payment_method) {
                alert('You can not paid, only VN Pay can do this.');
            } else {
                alert('You have paid already.');
            }
            console.error('Error initiating payment:', error);
        }
    };

    //Use to handle submit feedback
    const handleFeedbackSubmit = async () => {
        // thêm thông báo bạn có muốn gửi phản hồi không
        const confirmFeedback = window.confirm('Do you want to submit feedback?');
        if (!confirmFeedback) {
            return; // Nếu người dùng bấm hủy, thoát khỏi hàm mà không gửi feedback
        }

        // Check if rating and comment are provided
        if (rating && comment) {
            const feedbackDto = {
                rating,
                comment,
            };

            try {
                // Call the createFeedback API function
                const response = await createFeedback(appointment_id, feedbackDto);

                // Đóng modal phản hồi sau khi gửi thành công
                setShowFeedbackModal(false);

                // Cập nhật appointment với feedback_id từ response
                if (response?.feedback_id) {
                    setAppointment(prevAppointment => prevAppointment ? {
                        ...prevAppointment,
                        feedback_id: response.feedback_id // Cập nhật feedback_id thực tế
                    } : null);
                }

                // Optionally, reset the feedback form
                setRating(null);
                setComment('');
            } catch (error) {
                console.error('Error submitting feedback:', error);
                // Optionally show an error message to the user
                alert('Failed to submit feedback.');
            }
        } else {
            alert('Please provide both a rating and a comment.');
        }
    };

    // Close feedback modal
    const handleCloseFeedback = () => {
        setShowFeedbackModal(false);
        setRating(null); // Reset rating and comment when canceled
        setComment('');
    };

    //Format date time
    const formatDateTime = (datetimeString: string) => {
        const date = new Date(datetimeString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần +1
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    return (
        <div className="d-flex flex-grow-1 gap-3" style={{marginLeft: '272px'}}>
            <Sidebar/>
            <div className="container">
                <h2 className="mb-4">Appointment Details</h2>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">
                            Appointment ID: {appointment.appointment_id}
                        </h5>

                        <div className="row">
                            <div className="col-md-6">
                                <p>Date: {appointment.slot?.day}/{appointment.slot?.month}/{appointment.slot?.year}</p>
                                <p>Time: {appointment.slot?.description || 'N/A'}</p>
                                <p>Status:
                                    <span
                                        className={`span-status ${appointment?.current_status === 'CANCELED' ? 'status-canceled' :
                                            appointment?.current_status === 'CHECKED_IN' ? 'status-checked-in' :
                                                appointment?.current_status === 'CONFIRMED' ? 'status-confirmed' :
                                                    appointment?.current_status === 'DONE' ? 'status-done' :
                                                        appointment?.current_status === 'ON_GOING' ? 'status-on-going' :
                                                            appointment?.current_status === 'PENDING' ? 'status-pending' :
                                                                'status-default'
                                        }`}>
                                    {/* Format lại chữ */}
                                        {appointment?.current_status ?
                                            appointment.current_status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
                                            : 'N/A'}
                                </span>
                                </p>


                                <h5 className="mt-3">Customer Information:</h5>
                                <p>Name: {appointment?.customer_name}</p>
                                <p>Email: {appointment?.email}</p>
                                <p>Phone: {appointment?.phone_number}</p>

                                <h5 className="mt-3">Service Information:</h5>
                                <p>Service name: {appointment.service?.service_name}</p>
                                <p>Service Price: {appointment.service?.service_price} VND</p>

                                <h5 className="mt-3">Veterinarian Information:</h5>
                                <p>Name: {appointment.veterinarian?.first_name} {appointment.veterinarian?.last_name}</p>

                                {/* Chỉ hiển thị khi có địa chỉ */}
                                {appointment.address && (
                                    <div>
                                        <h5 className="mt-3">Address Information: </h5>
                                        <p>{appointment.address?.home_number}, {appointment.address?.ward}, {appointment.address?.district}, {appointment.address?.city}</p>
                                    </div>
                                )}

                                {/* Chỉ hiển thị khi có thông tin cá */}
                                {appointment.fish && (
                                    <div>
                                        <h5 className="mt-3">Fish Information</h5>
                                        <p>Species: {appointment.fish?.species || 'NA'}</p>
                                        <p>Gender: {appointment.fish?.gender || 'NA'}</p>
                                        <p>Size: {appointment.fish?.size || 'NA'} cm </p>
                                        <p>Weight: {appointment.fish?.weight || 'NA'} kg</p>
                                        <p>Origin: {appointment.fish?.origin || 'NA'}</p>
                                    </div>
                                )}

                                {/* Chỉ hiển thị khi có thông tin moving surcharge */}
                                {appointment.moving_surcharge && (
                                    <div>
                                        <h5 className="mt-3">Moving Surcharge</h5>
                                        <p>District: {appointment.moving_surcharge?.district || 'Not available'}</p>
                                        <p>Price: {appointment.moving_surcharge?.price || '0'} VND</p>
                                    </div>
                                )}

                                <h5 className="mt-3">Total Price</h5>
                                <p>Total: {appointment?.total_price || ''} VND</p>

                                <h5 className="mt-3">Feedback Details</h5>
                                {feedbackDetails ? (
                                    <div>
                                        <p>Date time: {formatDateTime(feedbackDetails.date_time)}</p>
                                        <p>Rating: {feedbackDetails.rating}</p>
                                        <p>Comment: {feedbackDetails.comment}</p>
                                        {/* Bạn có thể thêm các chi tiết khác nếu có */}
                                    </div>
                                ) : (
                                    <p>No feedback available for this appointment.</p>
                                )}

                                <div ref={paymentRef}>
                                    <h5 className="mt-3">Payment Information</h5>
                                    <p>Payment Method: {PaymentDetails?.payment_method || 'N/A'}</p>
                                    <p>Payment Amount: {PaymentDetails?.payment_amount || 'N/A'} VND</p>
                                    <p>Description: {PaymentDetails?.description || 'N/A'}</p>

                                    <p>Status:
                                        <span className={`span-status ${
                                            PaymentDetails?.status === 'PAID' ? 'status-done' :
                                                PaymentDetails?.status === 'NOT_PAID' ? 'status-pending' :
                                                    'status-default'
                                        }`}
                                        >
                                        {/* Transform 'PAID' or 'NOT_PAID' to 'Paid' or 'Not paid' */}
                                            {PaymentDetails?.status
                                                ? PaymentDetails.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
                                                : 'N/A'}
                                    </span>
                                    </p>


                                    {/* Show Payment button only if payment method is VN PAY and curreny status is NOT_PAID */}
                                    {PaymentDetails?.payment_method === payment_method.VN_PAY && PaymentDetails?.status === payment_status.NOT_PAID && appointment.current_status === 'CONFIRMED' && (
                                        <button className="btn btn-primary mt-3" onClick={handlePayment}>Pay</button>
                                    )}
                                </div>

                                {/* Feedback Information */}
                                {/* Show Make Feedback button only if current_status is 'done' and don't have feedback id */}
                                {appointment.current_status === 'DONE' && PaymentDetails?.status === 'PAID' && !appointment.feedback_id && (
                                    <div className="mt-3">
                                        <button
                                            className="btn btn-success"
                                            onClick={() =>
                                                setShowFeedbackModal(true)
                                            }
                                        >
                                            Make Feedback
                                        </button>
                                    </div>
                                )}

                                {/* Feedback Modal */}
                                <Dialog open={showFeedbackModal} onClose={handleCloseFeedback}>
                                    <DialogTitle>Submit Feedback</DialogTitle>
                                    <DialogContent>
                                        <label>Rating: </label>
                                        <Rating
                                            name="feedback-rating"
                                            value={rating}
                                            onChange={(event, newValue) => {
                                                setRating(newValue);
                                            }}
                                        />
                                        <TextField
                                            label="Comment"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            style={{marginTop: '20px'}}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseFeedback} color="secondary">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleFeedbackSubmit} color="primary" variant="contained">
                                            Send
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                            </div>
                        </div>
                    </div>
                </div>

                {/*<div className='back-button'>*/}
                {/*    <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Back</button>*/}
                {/*</div>*/}
            </div>
            </div>
            );
            };


            export default CustomerAppointmentDetails;
