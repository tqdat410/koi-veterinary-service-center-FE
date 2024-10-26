import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAppointmentDetails, updateAppointment } from '../../api/appointmentApi';
import { fetchPayment, updatePayment } from '../../api/paymentApi';
import { updateAppointmentStatus, fetchAppointmentAndVeterinariansDemo, updateAppointmentStatusCanceled } from '../../api/appointmentApi';
import { fetchVetBySlotId } from '../../api/vetApi';
import { useParams } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar";
interface AppointmentDetailsProps {
    appointment_id: number;
    created_date: string;
    current_status: string;
    customer_name: string;
    slot: time_Slot;
    email: string;
    phone_number: string;
    description: string;
    total_price: number;
    service: Service;
    moving_surcharge: movingSurcharge;
    address: Address
    veterinarian: Veterinarian;
    fish: Fish;
}

interface time_Slot {
    slot_id: number;
    year: number;
    month: number;
    day: number;
    slot_order: number;
    description: string;
}

interface Service {
    service_id: number;
    service_name: string;
    service_price: number;
};

interface movingSurcharge {
    moving_surcharge_id: number;
    district: string;
    price: number;
};

interface Address {
    address_id: number;
    city: string;
    district: string;
    ward: string;
    home_number: string;
    status: boolean;
};

interface Veterinarian {
    user_id: number;
    first_name: string;
    last_name: string;
};

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
};

interface PaymentDetails {
    payment_id: number;
    payment_method: payment_method;
    payment_amount: number;
    description: string;
    status: payment_status;
}

enum payment_method {
    CASH = 'CASH',
    VN_PAY = 'VN_PAY',
}

enum payment_status {
    NOT_PAID = 'NOT_PAID',
    PAID = 'PAID',
}


const AppointmentDetails: React.FC = () => {
    const { appointment_id } = useParams<{ appointment_id: string }>();  // Get the appointment_id from the location state
    const appointmentIdNumber = Number(appointment_id);
    // const slot_id: number = location.state?.slot_id; // Get the slot_id from the location state
    const [appointment, setAppointment] = useState<AppointmentDetailsProps | null>(null); // Assuming your data structure
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null); // State for payment details
    // const [showDetails, setShowDetails] = useState(false); // State để quản lý hiển thị bảng view details
    const [isPaymentVisible, setIsPaymentVisible] = useState(false); // State to track if payment details are visible

    const [isEditingPaymentMethod, setIsEditingPaymentMethod] = useState(false); // State to handle editing payment method
    //State to handing appointment status
    const [appointmentStatus, setAppointmentStatus] = useState(false); // State to store selected appointment

    const [isEditingStatus, setIsEditingStatus] = useState(false); // New state for editing status

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(''); // State to store selected payment method

    const navigate = useNavigate();
    const paymentRef = useRef<HTMLDivElement>(null); // Ref for payment details section

    // NEW
    const [vetList, setVetList] = useState<Veterinarian[]>([]); // List of vets
    const [selectedVetId, setSelectedVetId] = useState<number | null>(null); // Selected vet ID

    // Tạo trạng thái isVetSelected
    const [isVetSelected, setIsVetSelected] = useState(false);

    // Tạo biến selectedStatus
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    console.log('Appointment id:', appointmentIdNumber);


    // Fetch appointment details by ID
    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            if (appointmentIdNumber) {
                try {
                    const appointmentData = await getAppointmentDetails(appointmentIdNumber); // Fetch details by ID
                    setAppointment(appointmentData); // Set the appointment details                
                } catch (error) {
                    console.error('Error fetching appointment details:', error);
                }
            }
        };
        fetchAppointmentDetails();
    }, [appointmentIdNumber]);
    console.log('Appointment slot id:', appointment);


    // Function to handle view payment details

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            if (appointmentIdNumber) {
                try {
                    const paymentData = await fetchPayment(appointmentIdNumber);
                    setPaymentDetails(paymentData);
                } catch (error) {
                    console.error('Error fetching payment details:', error);
                }
            }
        };

        fetchPaymentDetails();
    }, [appointmentIdNumber]);

    const handleEditPaymentMethod = () => {
        setIsEditingPaymentMethod(true); // Switch to editing mode
    };

    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPaymentMethod(e.target.value); // Update selected payment method
        // console.log(selectedPaymentMethod);
    };

    const handleUpdatePaymentMethod = async () => {
        const confirmUpdate = window.confirm('Are you sure you want to update the payment status to PAID?'); // Hiển thị hộp thoại xác nhận
        if (confirmUpdate) {
            try {
                console.log('Updating payment method:', selectedPaymentMethod);
                const updatedPayment = await updatePayment(appointmentIdNumber,
                    {
                        // Update the payment status only                        
                        status: 'PAID' // Chỉ cập nhật trạng thái thanh toán                        
                    }

                );
                console.log(selectedPaymentMethod);
                setPaymentDetails(updatedPayment); // Update the payment details
                setIsEditingPaymentMethod(false); // Exit editing mode
            } catch (error) {
                console.error('Error updating payment method:', error);
            }
        }
    };

    //Fucntion to update appointment status: current status
    const handleUpdateAppointmentStatus = async () => {
        if (appointment && selectedStatus === 'CONFIRMED') {
            const confirmUpdate = window.confirm(`Appointment status updated to: ${selectedStatus}, do you want to change it?`);
            if (confirmUpdate) {
                try {
                    // Gọi API để cập nhật trạng thái
                    await updateAppointmentStatus(appointment.appointment_id, selectedStatus);
                    // Cập nhật lại thông tin trạng thái trong state appointment
                    setAppointment(prevAppointment => {
                        if (prevAppointment) {
                            return {
                                ...prevAppointment,
                                current_status: selectedStatus
                            };
                        }
                        return prevAppointment;
                    });
                    // Đặt selectedStatus về giá trị mới
                    setSelectedStatus(selectedStatus);

                    console.log('Updated appointment status:', selectedStatus);
                } catch (error) {
                    console.error('Error updating appointment status:', error);
                }
            }
        } else if (appointment && selectedStatus === 'CANCELED') {
            const confirmUpdate = window.confirm(`Appointment status updated to: ${selectedStatus}, do you want to change it?`);
            if (confirmUpdate) {
                try {
                    // Gọi API để cập nhật trạng thái
                    await updateAppointmentStatusCanceled(appointment.appointment_id);
                    // Cập nhật lại thông tin trạng thái trong state appointment
                    setAppointment(prevAppointment => {
                        if (prevAppointment) {
                            return {
                                ...prevAppointment,
                                current_status: selectedStatus
                            };
                        }
                        return prevAppointment;
                    });
                    // Đặt selectedStatus về giá trị mới
                    setSelectedStatus(selectedStatus);
                    console.log('Updated appointment status:', selectedStatus);
                } catch (error) {
                    console.error('Error updating appointment status:', error);
                }
            }
        }
    };

    // xử lý khi bác sĩ được chọn, chỉ run khi chưa có bác sĩ!
    // Fetch vet by slot id
    useEffect(() => {
        const fetchVet = async () => {
            if (appointment?.slot?.slot_id) {
                try {
                    // Fetch danh sách bác sĩ theo slot_id

                    const vetData = await fetchVetBySlotId(appointment.slot.slot_id);
                    setVetList(vetData); // Lưu danh sách bác sĩ vào state vetList

                    // LẤY CẢ USER ID , FIRST LAST NAME
                } catch (error) {
                    console.error('Error fetching vet by slot ID:', error);
                }
            }
        };

        fetchVet();

    }, [appointment?.slot.slot_id]); // Chỉ gọi khi slot_id thay đổi


    // Gọi hàm lấy chi tiết cuộc hẹn và danh sách bác sĩ, và có thể gán bác sĩ cho cuộc hẹn
    useEffect(() => {
        // Nếu không có slot_id thì không cần fetch
        const fetchVetDetails = async () => {
            if (appointment?.slot?.slot_id && selectedVetId) {
                try {
                    const { appointmentDetails, veterinarians } = await fetchAppointmentAndVeterinariansDemo(appointment?.slot.slot_id, selectedVetId);
                    setAppointment(appointmentDetails);
                    setVetList(veterinarians); // Cập nhật danh sách bác sĩ
                } catch (error) {
                    console.error('Error fetching appointment details and veterinarians:', error);
                }
            }
        };

        fetchVetDetails();
    }, [appointment?.slot.slot_id]);


    // Function for submitting the selected veterinarian
    const handleSubmitOrder = async () => {       
        if (selectedVetId && appointment) {
            // thông báo điều chỉnh bác sĩ
            const confirmUpdate = window.confirm(`Are you sure you want to assign this veterinarian?`);
            if (!confirmUpdate) return; // Nếu không xác nhận thì không thực hiện gì cả
            try {
                await updateAppointment(appointmentIdNumber, selectedVetId); // Gửi selectedVetId trực tiếp

                // Cập nhật lại thông tin bác sĩ trong appointment
                setAppointment(prevAppointment => {
                    if (!prevAppointment) return null; // Kiểm tra nếu prevAppointment là null

                    return {
                        ...prevAppointment, // Giữ nguyên tất cả các trường hiện có
                        veterinarian: {
                            ...prevAppointment.veterinarian, // Giữ nguyên các trường trong veterinarian nếu có
                            user_id: selectedVetId, // Cập nhật ID của bác sĩ mới
                            ...vetList?.find(vet => vet.user_id === selectedVetId), // Gán lại thông tin bác sĩ từ danh sách bác sĩ
                        }
                    };
                });

                console.log('Updated appointment with selected veterinarian ID:', selectedVetId);
                setIsVetSelected(true); // Đặt trạng thái đã lưu thông tin bác sĩ
            } catch (error) {
                console.error('Error updating appointment:', error);
            }
        }

    };


    // Function to handle vet selection
    const handleVetSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const vetId = Number(e.target.value);
        setSelectedVetId(vetId);
        setIsVetSelected(vetId !== 0); // Đặt trạng thái khi bác sĩ được chọn
        console.log("Selected Vet ID:", vetId);
    };

    if (!appointment) {
        return <div>Loading...</div>;
    }

    const handleEditStatus = () => {
        if (appointment?.current_status === 'PENDING') { // Chỉ cho phép chỉnh sửa nếu trạng thái là 'PENDING'
            setIsEditingStatus(true); // Chuyển sang chế độ chỉnh sửa
        } else {
            console.log("Status is not 'PENDING', cannot edit.");
        }
    };


    const handleSaveClick = () => {
        // Thực hiện logic lưu lại status
        console.log('Status saved:', selectedStatus);
        setIsEditingStatus(false); // Sau khi lưu, quay lại chế độ ban đầu
    };

    const handleCancelEditStatus = () => {
        setIsEditingStatus(false); // Hide the status editor
    };

    // Function to format DateTime
    const formatDateTime = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleString('vi-VN', options);
    };

    const formattedDate = formatDateTime(appointment.created_date);



    return (
        <div className="d-flex flex-grow-1 gap-3" style={{marginLeft: '272px'}}>
            <Sidebar/>
            <div className="container" style={{marginTop: '2rem', textAlign: 'left'}}>
                <h2 className="mb-4" style={{paddingTop: '65px'}}>Appointment Details</h2>

                <div className="card">
                    <div className="card-body">
                        <div className="card-body">
                            <h5 className="card-title" style={{width: '100%'}}>*Appointment
                                ID: {appointment.appointment_id}</h5>

                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Date:</strong> {formattedDate}</p>
                                    {/* <p><strong>Status:</strong> {appointment?.current_status}</p> */}
                                    <p>
                                        <strong>Status:</strong>
                                        <span
                                            style={{
                                                backgroundColor:
                                                    appointment?.current_status === 'CANCELED' ? 'red' :
                                                        appointment?.current_status === 'CHECKED_IN' ? 'blue' :
                                                            appointment?.current_status === 'CONFIRMED' ? 'green' :
                                                                appointment?.current_status === 'DONE' ? 'gray' :
                                                                    appointment?.current_status === 'ON_GOING' ? 'orange' :
                                                                        appointment?.current_status === 'PENDING' ? 'purple' :
                                                                            'black',
                                                color: 'white',
                                                padding: '4px 8px',
                                                marginLeft: '10px',
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                        {appointment?.current_status}
                                    </span>
                                    </p>

                                    <h5 className="mt-3" style={{fontWeight: '900'}}>- Customer Information</h5>
                                    <p><strong>Name:</strong> {appointment?.customer_name}</p>
                                    {/* <p><strong>Slot ID:</strong> {appointment?.slot?.slot_id || 'NULL'}</p> */}
                                    <p><strong>Slot ID:</strong> {appointment.slot.slot_id}</p>


                                    <p><strong>Email:</strong> {appointment?.email}</p>
                                    <p><strong>Phone:</strong> {appointment?.phone_number}</p>
                                    <p><strong>Description:</strong> {appointment?.description}</p>

                                    <h5 className="mt-3" style={{fontWeight: '900'}}>- Service Information</h5>
                                    <p><strong>Service id:</strong> {appointment.service?.service_id}</p>
                                    <p><strong>Service name:</strong> {appointment.service?.service_name}</p>
                                    <p><strong>Service Price:</strong> {appointment.service?.service_price} VND</p>

                                    <h5 className="mt-3" style={{fontWeight: '900'}}>- Veterinarian Information</h5>

                                    {/* thêm phần add bác sĩ ở đây */}
                                    {
                                        appointment.veterinarian ? (
                                            <p>
                                                <strong>Name:</strong> {appointment.veterinarian?.first_name} {appointment.veterinarian?.last_name}
                                            </p>
                                        ) : (
                                            <div>
                                                <label htmlFor="vet-select"><strong>Select
                                                    Veterinarian:</strong></label>
                                                <select id="vet-select" onChange={handleVetSelection}
                                                        className="form-select">
                                                    <option value="">-- Select a veterinarian --</option>
                                                    {vetList && vetList.map(vet => (
                                                        <option key={vet.user_id} value={vet.user_id}>
                                                            {vet.first_name} {vet.last_name}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    className="btn btn-primary mt-3"
                                                    disabled={!selectedVetId} // Vô hiệu hóa nếu chưa chọn bác sĩ
                                                    onClick={handleSubmitOrder}
                                                    style={{backgroundColor: 'red'}}
                                                >
                                                    Save changes
                                                </button>

                                            </div>
                                        )
                                    }

                                    {/* Chỉ hiển thị khi có địa chỉ */}
                                    {appointment.address && (
                                        <div>
                                            <h5 className="mt-3" style={{fontWeight: '900', display: 'inline'}}>-
                                                Address Information: </h5>
                                            <span style={{fontWeight: '300'}}>
                                            {appointment.address?.home_number}, {appointment.address?.ward}, {appointment.address?.district}, {appointment.address?.city}
                                        </span>
                                        </div>
                                    )}

                                    {/* Hàm chỉnh appointment status */}
                                    {/* {appointment.current_status !== 'PENDING' && (
                                    <>
                                        <span style={{ fontWeight: '900', color: 'brown', backgroundColor: '', padding: '10px', fontSize: '20px' }}>Update status:</span>
                                        <select
                                            className="form-select"
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            style={{ marginLeft: '10px', width: '150px', marginTop: '15px' }}
                                        >

                                            <option value="CANCELED">CANCELED</option>
                                            <option value="CONFIRMED">CONFIRMED</option>
                                        </select>
                                        <button
                                            className="btn btn-primary mt-2"
                                            onClick={handleUpdateAppointmentStatus}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Save changes
                                        </button>

                                        <button
                                            className="btn btn-primary mt-2"
                                            onClick={handleCancelEditStatus}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )} */}

                                    {/* test */}
                                    {/* {appointment.current_status === 'PENDING'  ? (
                                    <>
                                        <p style={{ fontWeight: '900', color: 'brown', backgroundColor: '', padding: '10px', fontSize: '20px' }}>Update Status</p>
                                        <button className="btn btn-info" onClick={handleEditStatus}>Click here to Update</button>
                                    </>
                                ) : (
                                    <>
                                        <p style={{ fontWeight: '900', color: 'brown', backgroundColor: '', padding: '10px', fontSize: '20px' }}>Update Status</p>
                                        <select
                                            className='form-select'
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            style={{ marginLeft: '10px', width: '150px', marginTop: '15px' }}
                                        >
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <button className="btn btn-primary mt-2" style={{ marginLeft: '10px' }} onClick={handleSaveClick}>Save</button>
                                        <button className="btn btn-secondary mt-2" style={{ marginLeft: '10px' }} onClick={handleCancelEditStatus}>Cancel</button>
                                    </>
                                )} */}

                                    {appointment.current_status === 'PENDING' && (
                                        !isEditingStatus ? (
                                            <>
                                                <p style={{
                                                    fontWeight: '900',
                                                    color: 'brown',
                                                    padding: '10px',
                                                    fontSize: '20px'
                                                }}>Update Status</p>
                                                <button className="btn btn-info" onClick={handleEditStatus}>Click here
                                                    to Update
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <p style={{
                                                    fontWeight: '900',
                                                    color: 'brown',
                                                    padding: '10px',
                                                    fontSize: '20px'
                                                }}>Update Status</p>
                                                <select
                                                    className='form-select'
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    style={{marginLeft: '10px', width: '150px', marginTop: '15px'}}
                                                >
                                                    <option value="">Select status:</option>
                                                    <option value="CONFIRMED">CONFIRMED</option>
                                                    <option value="CANCELED">CANCELED</option>
                                                </select>
                                                <button className="btn btn-primary mt-2" style={{marginLeft: '10px'}}
                                                        onClick={handleUpdateAppointmentStatus}>Save
                                                </button>
                                                <button className="btn btn-secondary mt-2" style={{marginLeft: '10px'}}
                                                        onClick={handleCancelEditStatus}>Cancel
                                                </button>
                                            </>
                                        ))}

                                </div>

                                <div className="col-md-6">

                                    {appointment.fish && (
                                        <div>
                                            <h5 className="mt-3" style={{fontWeight: '900'}}>- Fish Information</h5>
                                            <p><strong>Species:</strong> {appointment.fish?.species}</p>
                                            <p><strong>Gender:</strong> {appointment.fish?.gender}</p>
                                            <p><strong>Size:</strong> {appointment.fish?.size} cm</p>
                                            <p><strong>Weight:</strong> {appointment.fish?.weight} kg</p>
                                            <p><strong>Origin:</strong> {appointment.fish?.origin}</p>
                                        </div>
                                    )
                                    }

                                    {/* Chỉ show moving surcharge khi có */}
                                    {appointment.moving_surcharge && (
                                        <div>
                                            <h5 className="mt-3" style={{fontWeight: '900'}}>- Moving Surcharge</h5>
                                            <p>
                                                <strong>District:</strong> {appointment.moving_surcharge?.district || 'Not available'}
                                            </p>
                                            <p><strong>Price:</strong> {appointment.moving_surcharge?.price || '0'} VND
                                            </p>
                                        </div>
                                    )}

                                    <h5 className="mt-3" style={{fontWeight: '900'}}>- Total Price</h5>
                                    <p><strong>Total:</strong> {appointment?.total_price || ''} VND</p>

                                    {/* Conditionally render payment details */}
                                    {paymentDetails?.payment_id && (
                                        <div className=""
                                             style={{marginBottom: '2rem'}}
                                        >
                                            <div className="">
                                                <h5 className="card-title">Payment Details</h5>
                                                <p><strong>Payment ID:</strong> {paymentDetails.payment_id}</p>
                                                <p><strong>Payment method: </strong>{paymentDetails.payment_method}</p>
                                                <p><strong>Payment amount:</strong> {paymentDetails.payment_amount} VND
                                                </p>
                                                <p>
                                                    <strong>Status:</strong>
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                paymentDetails.status === 'NOT_PAID' ? 'red' :
                                                                    paymentDetails.status === 'PAID' ? 'green' :
                                                                        'black',
                                                            color: 'white',
                                                            padding: '4px 8px',
                                                            marginLeft: '10px',
                                                            borderRadius: '4px',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                    {paymentDetails.status || 'Unknown'}
                                                </span>
                                                </p>

                                                {/* Hiển thị phần update payment chỉ khi status là NOT_PAID và method là CASH */}
                                                {appointment.current_status === 'CONFIRMED' && paymentDetails.status === "NOT_PAID" && paymentDetails.payment_method === "CASH" && (
                                                    <div>
                                                        <span style={{
                                                            fontWeight: 'bold',
                                                            fontSize: '24px',
                                                            fontStyle: 'italic'
                                                        }}>Update Payment Status: </span>
                                                        {!isEditingPaymentMethod ? (
                                                            <button className="btn btn-primary"
                                                                    onClick={handleEditPaymentMethod}>
                                                                Edit Payment Method
                                                            </button>
                                                        ) : (
                                                            <div>
                                                                <button className="btn btn-success mt-2"
                                                                        onClick={handleUpdatePaymentMethod}>
                                                                    Update CONFIRMED
                                                                </button>
                                                                <button className="btn btn-success mt-2" style={{
                                                                    marginLeft: '12px',
                                                                    backgroundColor: 'red'
                                                                }} onClick={() => setIsEditingPaymentMethod(false)}>
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<div*/}
                {/*    style={{marginTop: '2rem', marginBottom: '2rem'}}*/}
                {/*>*/}
                {/*    /!* Back Button *!/*/}
                {/*    <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Back</button>*/}

                {/*</div>*/}
            </div>
            </div>

            );
            };

            export default AppointmentDetails;

