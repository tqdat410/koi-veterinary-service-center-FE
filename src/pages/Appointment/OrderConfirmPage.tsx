import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {createAppointment} from "../../api/appointmentApi";
import {persistor} from "../../store/store";
import defaultImage from "../../assets/images/defaultImage.jpg";



const AppointmentOrderPage: React.FC = () => {
    const navigate = useNavigate();

    // Fetching data from Redux store
    const service = useSelector((state: any) => state.service);
    const doctor = useSelector((state: any) => state.doctor);
    const slot = useSelector((state: any) => state.slot);
    const formData = useSelector((state: any) => state.formData);
    const [surcharges, setSurcharges] = useState<any[]>([]);
    const [surchargePrice, setSurchargePrice] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const slotTimeMapping: { [key: number]: string } = {
        1: '7:30 - 9:30',
        2: '10:00 - 12:00',
        3: '13:00 - 15:00',
        4: '15:30 - 17:30',
    };

    useEffect(() => {
        if (!service) {
            alert("You should choose service first!!!")
            navigate('/appointment/service-selection');
        } else if (service && !slot) {
            alert("You should choose date to create appointment!!!")
            navigate('/appointment/slot-date-selection');
        } else if (!formData) {
            alert("You should choose fill your information!!!")
            navigate('/fill-information');
        }
    }, [service, slot, formData, navigate]);


    const fetchSurcharges = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/surcharges');
            setSurcharges(response.data);
        } catch (error) {
            console.error('Error fetching surcharges:', error);
        }
    };

    const findSurchargePrice = () => {
        const matchingSurcharge = surcharges.find(surcharge => surcharge.district === formData.district);
        if (matchingSurcharge) {
            setSurchargePrice(matchingSurcharge.price);
        } else {
            setSurchargePrice(0); // Set to 0 or handle as needed if no match is found
        }
    };



    // Fetch surcharges when the component mounts
    useEffect(() => {
        fetchSurcharges();
    }, []);

    // Update surcharge price when surcharges or formData changes
    useEffect(() => {
        if (surcharges.length > 0 && formData?.district) {
            findSurchargePrice();
        }
    }, [surcharges, formData?.district]);


    // Function to handle order confirmation
    const handleConfirmOrder = async () => {
        const appointmentData = {
            service_id: service?.service_id,
            address_id: formData?.address_id !== null ? formData.address_id : null, // Truyền null nếu giá trị là null
            slot_id: slot?.slot_id,
            veterinarian_id: doctor !== null ? doctor.user_id : null, // Truyền null nếu giá trị là null
            email: formData?.email , // Truyền chuỗi rỗng nếu không có email
            phone: formData?.phone , // Truyền chuỗi rỗng nếu không có phone
            customer_name: formData?.customer_name , // Truyền chuỗi rỗng nếu không có customer_name
            description: formData?.description , // Truyền chuỗi rỗng nếu không có description
            fish_id: formData?.fish_id !== null ? formData.fish_id : null, // Truyền null nếu giá trị là null
            payment: {
                payment_method: formData?.payment_method // Truyền chuỗi rỗng nếu không có payment_method
            }
        };


        try {
            console.log(appointmentData)
            const response = await createAppointment(appointmentData);
            setNotificationMessage('Appointment created successfully!'); // Set success message
            setShowModal(true); // Show modal
            persistor.purge();
        } catch (error) {
            alert('Error confirming order. Please try again.'); // Xử lý lỗi
        }
    };

    const servicePrice = service?.service_price || 0;
    const totalPrice = (surchargePrice !== null ? surchargePrice : 0) + servicePrice;
    const handleBackClick = () => {
        navigate('/appointment/fill-information'); // Navigate back to service selection page
    };

    const handleNavigateToMyAppointments = () => {
        navigate('/my-appointment'); // Navigate to my appointments
    };

    const closeModal = () => {

        navigate('/');
    };

    return (
        <div className="d-flex justify-content-center align-items-center "
             style={{minHeight: '100vh'}}>
            <div className="container mt-5">
                <button
                    className="btn btn-secondary mb-3"
                    style={{position: 'absolute', top: '12%', left: '3%'}}
                    onClick={handleBackClick}>
                    Back
                </button>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ position: 'relative' }}>
                            <button className="close-button" onClick={closeModal}>
                                &times; {/* This represents the "X" icon */}
                            </button>
                            <h5 className="fw-bold text-success" style={{fontSize:"3.8vw"}}>Success!</h5>
                            <p style={{fontSize:"2vw"}}>{notificationMessage}</p>
                            <button className="btn btn-primary mt-3" onClick={handleNavigateToMyAppointments} style={{fontSize:'1vw'}}>
                                Go to My Appointments
                            </button>
                        </div>
                    </div>
                )}

                {/*<h1 className="display-3 fw-bold text-center" style={{color: '#02033B'}}>Confirm Your Appointment</h1>*/}
                <div className="row mt-4">
                    {/* Doctor Card */}
                    {doctor && (
                        <div className="col-md-4 mb-3 d-flex justify-content-center align-items-center">
                            <div className="card shadow d-flex flex-column align-items-center justify-content-center"
                                 style={{borderRadius: '40px', width: '320px', height: '360px'}}>
                                <img
                                    src={doctor?.avatar  || defaultImage}
                                    className="card-img-top rounded-circle mt-5"
                                    alt={`${doctor?.first_name} ${doctor?.last_name}`}
                                    style={{width: '200px', height: '200px'}}
                                />
                                <div
                                    className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                                    <h5 className="card-title text-center"
                                        style={{
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            width: '100%', // Đảm bảo chiếm toàn bộ không gian bên trong
                                            maxWidth: '250px',
                                            margin: '10px 10px',
                                            fontSize: '1.6rem' // Giảm kích thước chữ để dễ thích ứng hơn
                                        }}>
                                        {`${doctor?.first_name} ${doctor?.last_name}`}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appointment Details */}
                    <div className={`col-md-${doctor ? '8' : '12'} mb-3 `}>
                        <div className="card shadow"
                             style={{
                                 borderRadius: '20px',
                                 padding: '20px 60px 20px 20px',
                                 maxWidth: '1000px',
                                 margin: '0 auto'
                             }}>
                            <h5 className="card-title ms-4" style={{
                                width: "400px",
                                fontSize: "2.5rem",
                                marginTop: '15px',
                                marginBottom: '15px'
                            }}>Appointment
                                Details</h5>
                            <div className="appointment-details text-start mb-3"
                                 style={{fontSize: "1.1em", marginLeft: "3.5rem", maxWidth: '850px'}}>
                                <div>
                                    <strong style={{fontSize: "1.2rem"}}>Service Name:</strong> {service?.service_name}
                                </div>
                                <div>
                                    <strong
                                        style={{fontSize: "1.2rem"}}>Date:</strong> {slot?.day}/{slot?.month}/{slot?.year} (Slot {slot?.slot_order} / {slotTimeMapping[slot?.slot_order]})
                                </div>
                                <div>
                                    <strong style={{fontSize: "1.2rem"}}>Customer
                                        Name:</strong> {formData?.customer_name}
                                </div>
                                <div>
                                    <strong style={{fontSize: "1.2rem"}}>Email:</strong> {formData?.email}
                                </div>
                                <div>
                                    <strong style={{fontSize: "1.2rem"}}>Phone:</strong> {formData?.phone}
                                </div>
                                {formData?.address && (
                                    <div>
                                        <strong style={{fontSize: "1.2rem"}}>Address:</strong> {formData.address}
                                    </div>
                                )}
                                {formData?.fish && (
                                    <div>
                                        <strong style={{fontSize: "1.2rem"}}>Fish:</strong> {formData.fish}
                                    </div>
                                )}


                                <div>
                                    <strong style={{fontSize: "1.2rem"}}>Descriptions:</strong> {formData?.description}
                                </div>


                                <hr style={{
                                    borderTop: '1px solid #02033B',
                                    margin: '15px 0',
                                    maxWidth: '550px',
                                    marginLeft: '-20px'
                                }}/>
                                <div>
                                    <strong style={{fontSize: "1.2rem"}}>Service
                                        Price:</strong> {service?.service_price.toLocaleString('vi-VN')} VND
                                </div>
                                <div>
                                    <strong style={{fontSize: "1.2rem"}}>Surcharge
                                        Price:</strong> {surchargePrice !== null ? surchargePrice.toLocaleString('vi-VN') : '0'} VND
                                </div>
                                <div>
                                    <strong style={{fontSize: "1.2rem"}}>Total Price:</strong> {totalPrice.toLocaleString('vi-VN')} VND ({formData?.payment_method})
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-end me-4">
                    <button className="btn btn-primary" onClick={handleConfirmOrder}>
                        Confirm Order
                    </button>
                </div>
            </div>

        </div>
    );
};

export default AppointmentOrderPage;
