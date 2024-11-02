import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    getAppointmentDetailsForCus,
    getLinkMeetByVetId,
    getMedicalReport,
    fetchPrescriptionDetails,
    updateAppointmentStatusCanceled
} from '../../api/appointmentApi';
import { createPayment, fetchPayment } from '../../api/paymentApi';
import { createFeedback, getFeedbackDetailsCus } from '../../api/feedbackApi';
import '../../styles/CustomerAppointmentDetails.css';
import { MedicalReport, Medicine, Prescription } from "../../types";
import { Rating, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import Sidebar from "../../components/layout/Sidebar";
import ProgressTimeline from "../Staff/Timeline";


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
    discount: number;
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
    const [medicalReport, setMedicalReport] = useState<MedicalReport | null>(null);
    const [prescription, setPrescription] = useState<Prescription | null>(null);
    const [PaymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
    // const [isPaymentVisible, setIsPaymentVisible] = useState(false);
    const paymentRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [feedbackDetails, setFeedbackDetails] = useState<any>(null); // New state

    const [showFeedbackButton, setShowFeedbackButton] = useState(false);


    const [isEditingStatus, setIsEditingStatus] = useState(false);

    // Fetch appointment details by ID
    useEffect(() => {
        const fetchDetails = async () => {
            if (appointment_id) {
                try {
                    const appointmentData = await getAppointmentDetailsForCus(Number(appointment_id));
                    const paymentData = await fetchPayment(appointment_id);
                    setAppointment(appointmentData);
                    setPaymentDetails(paymentData); // Update only PaymentDetails state 

                    const report = await getMedicalReport(Number(appointment_id));  // Call the medical report
                    // console.log(report); 
                    if (report) {
                        setMedicalReport(report); // Update only MedicalReport state
                        if (report.prescription_id) {
                            const prescriptionData = await fetchPrescriptionDetails(report.prescription_id);
                            // console.log(prescriptionData);
                            setPrescription(prescriptionData); // Update only Prescription state
                        }
                    }

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

    // Check if the appointment is DONE and the payment is PAID
    // If true, show the feedback button in 7 days after the appointment completed

    useEffect(() => {
        if (appointment?.current_status === 'DONE' && PaymentDetails?.status === 'PAID' && !appointment.feedback_id) {
            const slotDescription = appointment.slot.description;
            const endTimeString = slotDescription.split(' - ')[1]; // Lấy phần thời gian kết thúc, "10:00"

            // Tách giờ và phút từ endTimeString
            const endHour = parseInt(endTimeString.split(':')[0]);
            const endMinute = parseInt(endTimeString.split(':')[1]);

            // Tạo đối tượng Date cho thời gian kết thúc trong slot
            const slotEndTime = new Date(
                appointment.slot.year,
                appointment.slot.month - 1, // Tháng trong JavaScript bắt đầu từ 0
                appointment.slot.day,
                endHour,   // Giờ kết thúc
                endMinute  // Phút kết thúc
            );

            const slotEndTimeGMT7 = slotEndTime.getTime();
            // console.log(new Date(slotEndTimeGMT7).toLocaleString()); // Hiển thị thời gian kết thúc của slot đó

            const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
            // console.log(sevenDaysInMilliseconds.toLocaleString()); // Hiển thị 7 ngày tính bằng milliseconds

            // Khởi tạo interval để kiểm tra thời gian
            const intervalId = setInterval(() => {
                const currentTime = Date.now();
                // console.log(new Date(currentTime).toLocaleString()); // Hiển thị thời gian hiện tại
                const timeDifference = currentTime - slotEndTimeGMT7;
                console.log(timeDifference.toLocaleString()); // Hiển thị thời gian chênh lệch

                if (timeDifference <= sevenDaysInMilliseconds) {
                    setShowFeedbackButton(true);
                } else {
                    setShowFeedbackButton(false);
                    clearInterval(intervalId); // Dừng kiểm tra khi nút đã biến mất
                }
            }, 1000); // Kiểm tra mỗi giây

            return () => clearInterval(intervalId); // Dọn dẹp khi component unmount
        }
    }, [appointment, PaymentDetails]);


    if (!appointment) {
        return <div>Loading...</div>;
    }

    //Fetch google meeting if the user id of veterinarian is available and the service id = 3
    const fetchGoogleMeeting = async () => {
        try {
            const linkMeet = await getLinkMeetByVetId(appointment.veterinarian.user_id);
            if (linkMeet) { // Kiểm tra linkMeet khác null
                window.open(linkMeet, '_blank');
            } else {
                console.warn('No Google Meet link available');
            }
        } catch (error) {
            console.error('Error fetching Google meeting:', error);
        }
    };
    const handleUpdateAppointmentStatusCanceled = async () => {
        if (appointment) {
            const confirmUpdate = window.confirm(`Appointment status updated to: CANCELED, do you want to change it?`);
            if (confirmUpdate) {
                try {
                    // Gọi API để cập nhật trạng thái
                    const response = await updateAppointmentStatusCanceled(appointment.appointment_id);

                    // Kiểm tra nếu response thành công
                    if (response && response.status === 200) {
                        // Cập nhật trạng thái trên giao diện
                        setAppointment(prevAppointment => {
                            if (prevAppointment) {
                                return {
                                    ...prevAppointment,
                                    current_status: 'CANCELED'
                                };
                            }
                            return prevAppointment;
                        });
                        console.log('Updated appointment status: CANCELED');
                        // navigate(0); // Tự động làm mới trang sau khi cập nhật
                        window.location.reload();
                    } else {
                        // Trường hợp response không thành công
                        navigate(0); // Tự động làm mới trang sau khi cập nhật
                        // alert('Failed to update appointment status due to server error.');
                    }
                } catch (error) {
                    console.error('Failed to update appointment status');
                }
            }
        }
    };


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
        <div className="d-flex flex-grow-1 gap-3" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container">
                <h2 className="mb-4">Appointment Details</h2>
                <div className="status-timeline-container">
                    <ProgressTimeline currentStatus={appointment.current_status} />
                </div>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">
                            Appointment ID: {appointment.appointment_id}
                        </h5>

                        <div className="row">
                            <div className="col-md-6">
                                <h5 className="mt-3">Appointment Information:</h5>
                                <p>Slot: {appointment.slot?.slot_id}</p>
                                <p>Date: {appointment.slot?.day}/{appointment.slot?.month}/{appointment.slot?.year}</p>
                                <p>Time: {appointment.slot?.description || 'N/A'}</p>
                                <p>Status:
                                    <span
                                        className={`span-status ${appointment?.current_status === 'CANCELED' ? 'status-canceled-cus' :
                                            appointment?.current_status === 'CHECKED_IN' ? 'status-checked-in-cus' :
                                                appointment?.current_status === 'CONFIRMED' ? 'status-confirmed-cus' :
                                                    appointment?.current_status === 'DONE' ? 'status-done-cus' :
                                                        appointment?.current_status === 'ON_GOING' ? 'status-on-going-cus' :
                                                            appointment?.current_status === 'PENDING' ? 'status-pending-cus' :
                                                                'status-default-cus'
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


                                {/* Chỉ hiển thị khi có thông tin cá */}
                                {appointment.fish && (
                                    <div>
                                        <h5 className="mt-3">Fish Information</h5>
                                        <p>Species: {appointment.fish?.species || 'N/A'}</p>
                                        <p>Gender: {appointment.fish?.gender || 'N/A'}</p>
                                        <p>Size: {appointment.fish?.size || 'N/A'} cm </p>
                                        <p>Weight: {appointment.fish?.weight || 'N/A'} kg</p>
                                        <p>Origin: {appointment.fish?.origin || 'N/A'}</p>
                                    </div>
                                )}

                                <h5 className="mt-3">Veterinarian Information:</h5>
                                <p>Name: {appointment.veterinarian?.first_name} {appointment.veterinarian?.last_name}</p>
                                <p>Vet ID: {appointment.veterinarian?.user_id}</p>
                                {(appointment.current_status === 'PENDING' || appointment.current_status === 'ON_GOING') && (
                                    <button style={{ marginLeft: '4px' }} className="btn btn-danger"
                                        onClick={handleUpdateAppointmentStatusCanceled}>Canceled
                                    </button>
                                )}
                            </div>

                            <div className="col-md-6">
                                {/* Chỉ hiển thị khi có địa chỉ */}
                                {appointment.address && (
                                    <div>
                                        <h5 className="mt-3">Address Information </h5>
                                        <p>{appointment.address?.home_number}, {appointment.address?.ward}, {appointment.address?.district}, {appointment.address?.city}</p>
                                    </div>
                                )}


                                <h5 className="mt-3">Service Information:</h5>
                                <p>Service name: {appointment.service?.service_name}</p>
                                <p>Service Price: {appointment.service?.service_price.toLocaleString('vi-VN')} VND</p>
                                {/* Tư vấn online (service id = 1) thì sẽ hiển thị nút tư vấn online qua gg meet */}
                                {appointment.service?.service_id === 1 && appointment?.current_status === "ON_GOING" && (
                                    <button className="btn btn-primary meet-btn" onClick={fetchGoogleMeeting}>Click here
                                        to Consult Online</button>
                                )}


                                {/* Hiển thị medical report khi có */}
                                {medicalReport && (
                                    <div>
                                        <h5 className="mt-3">Medical Report</h5>
                                        <p>ID: {medicalReport.veterinarian_id}</p>
                                        <p>Conclusion: {medicalReport?.conclusion || 'N/A'}</p>
                                        <p>Advise: {medicalReport?.advise || 'N/A'}</p>
                                    </div>
                                )}

                                {/* Hiển thị prescription khi có */}
                                {prescription && (
                                    <div>
                                        <h5 className="mt-3">Prescription</h5>
                                        <p>Medicines:</p>
                                        <ul>
                                            {prescription.medicines.map((medicine: Medicine) => (
                                                <li key={medicine.medicine_id} className='medicine-item'>
                                                    ID {medicine.medicine_id} : {medicine.medicine_name} - {medicine.instruction}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Chỉ hiển thị khi có thông tin moving surcharge */}
                                {appointment.moving_surcharge && (
                                    <div>
                                        <h5 className="mt-3">Moving Surcharge</h5>
                                        <p>District: {appointment.moving_surcharge?.district || 'Not available'}</p>
                                        <p>Price: {appointment.moving_surcharge?.price.toLocaleString('vi-VN') || '0'} VND</p>
                                    </div>
                                )}

                                <h5 className="mt-3">Total Price</h5>
                                <p>Total: {appointment?.total_price.toLocaleString('vi-VN') || ''} VND</p>

                                {/* Hiển thị thêm discount (nếu có) */}
                                {appointment.discount && (
                                    <div>
                                        <h5 className="mt-3">Discount</h5>
                                        <p>Discount: {appointment?.discount?.toLocaleString('vi-VN')} VND</p>
                                    </div>
                                )}

                                {feedbackDetails && (
                                    <div>
                                        <h5 className="mt-3">Feedback Details</h5>
                                        <p>Date & time: {formatDateTime(feedbackDetails.date_time)}</p>
                                        <p>Rating: {feedbackDetails.rating}</p>
                                        <p>Comment: {feedbackDetails.comment}</p>
                                        {/* Bạn có thể thêm các chi tiết khác nếu có */}
                                    </div>
                                )}

                                <div ref={paymentRef}>
                                    <h5 className="mt-3">Payment Information</h5>
                                    <p>Payment Method: {PaymentDetails?.payment_method || 'N/A'}</p>
                                    <p>Payment Amount: {PaymentDetails?.payment_amount.toLocaleString('vi-VN') || '0'} VND</p>
                                    <p>Description: {PaymentDetails?.description || 'N/A'}</p>

                                    <p>Status:
                                        <span className={`span-status ${PaymentDetails?.status === 'PAID' ? 'status-done-cus' :
                                            PaymentDetails?.status === 'NOT_PAID' ? 'status-canceled-cus' :
                                                'status-default-cus'
                                            }`}
                                        >
                                            {/* Transform 'PAID' or 'NOT_PAID' to 'Paid' or 'Not paid' */}
                                            {PaymentDetails?.status
                                                ? PaymentDetails.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
                                                : 'N/A'}
                                        </span>
                                    </p>


                                    {/* Show Payment button only if payment method is VN PAY and curreny status is NOT_PAID */}
                                    {PaymentDetails?.payment_method === payment_method.VN_PAY && PaymentDetails?.status === payment_status.NOT_PAID &&
                                        appointment.current_status !== 'CANCELED' &&
                                        (
                                            <button className="btn btn-primary pay-btn" onClick={handlePayment}>Click here
                                                to pay</button>
                                        )}
                                </div>

                                {/* Feedback Information */}
                                {/* Show Make Feedback for service button only if current_status is 'done' and don't have feedback id */}
                                {appointment.current_status === 'DONE' && PaymentDetails?.status === 'PAID' && !appointment.feedback_id && showFeedbackButton && (
                                    <div className="mt-3">
                                        <button
                                            className="btn btn-success"
                                            onClick={() =>
                                                setShowFeedbackModal(true)
                                            }
                                        >
                                            Make Feedback For Service
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
                                            style={{ marginTop: '20px' }}
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


                <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>Back</button>


            </div>
        </div>
    );
};


export default CustomerAppointmentDetails;
