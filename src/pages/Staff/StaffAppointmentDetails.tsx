import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointmentDetails, updateAppointment } from '../../api/appointmentApi';
import {fetchPayment, refundPayment, updatePayment} from '../../api/paymentApi';
import { updateAppointmentStatus, fetchAppointmentAndVeterinariansDemo, updateAppointmentStatusCanceled } from '../../api/appointmentApi';
import { fetchVetBySlotId } from '../../api/vetApi';
import '../../styles/StaffAppointmentDetails.css';
import { useParams } from 'react-router-dom';
import ProgressTimeline from './Timeline';
import AvailableSlot from "../../components/schedule/SlotDateSelection";
import UpdateAppointment from "./UpdateAppointment";
import RefundModal from "./RefundModal";

interface AppointmentDetailsProps {
    appointment_id: number;
    created_date: string;
    current_status: string;
    customer_name: string;
    customer_id: number;
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
    discount:number;
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
    REFUNDED= 'REFUNDED',
}


const StaffAppointmentDetails: React.FC = () => {
    const { appointment_id } = useParams<{ appointment_id: string }>();  // Get the appointment_id from the location state
    const appointmentIdNumber = Number(appointment_id); // Convert the appointment_id to a number
    const [appointment, setAppointment] = useState<AppointmentDetailsProps | null>(null); // Assuming your data structure
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null); // State for payment details
    const [isEditingPaymentMethod, setIsEditingPaymentMethod] = useState(false); // State to handle editing payment method
    const [appointmentStatus, setAppointmentStatus] = useState(false); // State to store selected appointment
    const [isEditingStatus, setIsEditingStatus] = useState(false); // New state for editing status
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(''); // State to store selected payment method
    const navigate = useNavigate(); // Hook for navigation
    const [vetList, setVetList] = useState<Veterinarian[]>([]); // List of vets
    const [selectedVetId, setSelectedVetId] = useState<number | null>(null); // Selected vet ID
    const [isVetSelected, setIsVetSelected] = useState(false); // Tạo trạng thái isVetSelected
    const [selectedStatus, setSelectedStatus] = useState(''); // Trạng thái được chọn
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalRefundOpen, setIsModalRefundOpen] = useState(false);
    const [phone_number, setPhoneNumber] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    // Fetch appointment details by ID
    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            if (appointmentIdNumber) {
                try {
                    const appointmentData = await getAppointmentDetails(appointmentIdNumber); // Fetch details by ID
                    setAppointment(appointmentData); // Set the appointment details
                    console.log(appointmentData)
                } catch (error) {
                    console.error('Error fetching appointment details:', error);
                }
            }
        };
        fetchAppointmentDetails();
    }, [appointmentIdNumber, appointmentStatus]); // Call the function when the appointment ID changes
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

    // Function to handle editing payment method
    const handleEditPaymentMethod = () => {
        setIsEditingPaymentMethod(true); // Switch to editing mode
    };


    // Function to update payment method
    const handleUpdatePaymentMethod = async () => {
        const confirmUpdate = window.confirm('Are you sure you want to update the payment status to PAID?'); // Hiển thị hộp thoại xác nhận
        if (confirmUpdate) {
            try {
                console.log('Updating payment method:', selectedPaymentMethod);
                const updatedPayment = await updatePayment(appointmentIdNumber,
                    {
                        status: 'PAID' // Update the payment status only                         
                    }
                );
                // console.log(selectedPaymentMethod);
                setPaymentDetails(updatedPayment); // Update the payment details

                setIsEditingPaymentMethod(false); // Exit editing mode
                window.location.reload();
            } catch (error) {
                console.error('Error updating payment method:', error);
            }
        }
    };
    // Function to update payment method
    const handleRefundPaymentMethod = async () => {
        const confirmUpdate = window.confirm('Are you sure you want to update the payment status to REFUND?'); // Hiển thị hộp thoại xác nhận
        if (confirmUpdate) {
            try {
                console.log('Updating payment method:', selectedPaymentMethod);
                const updatedPayment = await refundPayment(appointmentIdNumber,
                    {
                        status: 'REFUND' // Update the payment status only
                    }
                );
                // console.log(selectedPaymentMethod);
                setPaymentDetails(updatedPayment); // Update the payment details

                setIsEditingPaymentMethod(false); // Exit editing mode
                window.location.reload();
            } catch (error) {
                console.error('Error updating payment method:', error);
            }
        }
    };

    // Function to handle status selection
    const handleSelectStatus = (status: string) => {
        setSelectedStatus(status);
        console.log(`Selected status set to: ${status}`);
        const confirmUpdate = window.confirm(`Are you sure you want to update the status to: ${status}?`);
        if (confirmUpdate) {
            handleUpdateAppointmentStatus(status);  // Gọi hàm cập nhật
            navigate(0); // Tự động làm mới trang sau khi cập nhật
        }
    };


    // Function to cancel editing status
    const handleCancelEditStatus = () => {
        setIsEditingStatus(false);
        setSelectedStatus('');
    };
    // Function to update appointment status
    const handleUpdateAppointmentStatus = async (status: string) => {

        if (appointment) {
            try {
                console.log("Updating appointment status with:", status);

                // Gọi API để cập nhật trạng thái, truyền selectedStatus dưới dạng statusName
                const response = await updateAppointmentStatus(appointment.appointment_id, status);

                // Cập nhật lại thông tin trạng thái trong state appointment
                if (response) {
                    setAppointment(prevAppointment => {
                        if (prevAppointment) {
                            return {
                                ...prevAppointment,
                                current_status: selectedStatus // Cập nhật trạng thái mới
                            };
                        }
                        return prevAppointment;
                    });
                    console.log('Updated appointment status:', status);

                }
            } catch (error) {
                console.error('Error updating appointment status:', error);
                alert('Error updating appointment status.');
            }
        }
    };


    // Function to update status CANCLED
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


    // Function to format DateTime
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return 'Invalid date'; // Kiểm tra xem ngày có hợp lệ không
        }

        // Lấy từng phần của ngày và giờ
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        // Trả về chuỗi có dạng ngày trước giờ sau
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };


    const formattedDate = formatDateTime(appointment.created_date);

    const handleOpenModal = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);

    };

    const handleOpenRefundModal = () => {
        setIsModalRefundOpen(true); // Open the modal
    };

    const handleCloseRefundModal = () => {
        setIsModalRefundOpen(false);

    };
    const handleRefundSuccess = () => {
        // Logic to refresh the payment details or update the UI after a successful refund
        window.location.reload(); // Reload to reflect the changes
    };
    return (
        <div className="container container-details">
            <h2 className="mb-4">Appointment Details</h2>
            <div className="status-timeline-container">
                <ProgressTimeline currentStatus={appointment.current_status}/>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="card-body card-body-appointment">
                        <h5 className="card-title card-title-appointment">Appointment ID: {appointment.appointment_id}</h5>

                        <div className="row">
                            <div className="col-md-6">
                                <p>Date & time: {formattedDate}</p>
                                <p>
                                    Status:
                                    <span
                                        className={`span-status ${appointment?.current_status === 'CANCELED' ? 'canceled' :
                                            appointment?.current_status === 'CHECKED_IN' ? 'checked-in' :
                                                appointment?.current_status === 'CONFIRMED' ? 'confirmed' :
                                                    appointment?.current_status === 'DONE' ? 'done' :
                                                        appointment?.current_status === 'ON_GOING' ? 'on-going' :
                                                            appointment?.current_status === 'PENDING' ? 'pending' :
                                                                'default'
                                        }`}
                                    >
                                        {/* Format lại chữ */}
                                        {appointment?.current_status ?
                                            appointment.current_status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
                                            : 'N/A'}
                                    </span>
                                </p>

                                <h5 className="mt-3">Customer Information:</h5>
                                <p>Name: {appointment?.customer_name}</p>
                                <p>Slot ID: {appointment.slot.slot_id}</p>
                                <p>Email: {appointment?.email}</p>
                                <p>Phone: {appointment?.phone_number}</p>
                                <p>Description: {appointment?.description || 'N/A'}</p>

                                <h5 className="mt-3">Service Information</h5>
                                <p>Service id: {appointment.service?.service_id}</p>
                                <p>Service name: {appointment.service?.service_name}</p>
                                <p>Service Price: {appointment.service?.service_price.toLocaleString('vi-VN')} VND</p>
                                {appointment.discount && (
                                    <p>Discount: -{appointment.discount.toLocaleString('vi-VN')} VND</p>
                                )}
                                <h5 className="mt-3">Veterinarian Information</h5>

                                {/* thêm phần add bác sĩ ở đây */}
                                {
                                    appointment.veterinarian ? (
                                        <p>Name: {appointment.veterinarian?.first_name} {appointment.veterinarian?.last_name}</p>
                                    ) : (
                                        <div>
                                            <label htmlFor="vet-select">Select Veterinarian:</label>
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
                                                // style={{ backgroundColor: 'red' }}
                                            >
                                                Save changes
                                            </button>

                                        </div>
                                    )
                                }


                                {/* Chỉ hiển thị khi có địa chỉ */}
                                {appointment.address && (
                                    <div>
                                        <h5 className="mt-3">Address Information: </h5>
                                        <p>
                                            {appointment.address?.home_number}, {appointment.address?.ward}, {appointment.address?.district}, {appointment.address?.city}
                                        </p>
                                    </div>
                                )}


                                {appointment.current_status === 'PENDING' && (
                                    (paymentDetails?.status === 'NOT_PAID' && paymentDetails?.payment_method === 'CASH') ||
                                    (paymentDetails?.status === 'PAID' && (paymentDetails?.payment_method === 'CASH' || paymentDetails?.payment_method === 'VN_PAY'))
                                ) && (
                                    !isEditingStatus ? (
                                        <>
                                            <p style={{
                                                fontWeight: '900',
                                                color: 'brown',
                                                padding: '10px',
                                                fontSize: '20px'
                                            }}>Update Status</p>
                                            <button className="btn btn-info" onClick={handleEditStatus}>Click here to
                                                Update
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p style={{
                                                fontWeight: 'bold',
                                                fontSize: '24px',
                                                fontStyle: 'italic'
                                            }}>Update Status</p>
                                            <button style={{marginLeft: '4px'}} className="btn btn-primary"
                                                    onClick={() => handleSelectStatus("CONFIRMED")}>Confirmed
                                            </button>
                                            {/* CHECK IN KHI VÀ CHỈ KHI LÀ SERVICE ID = 3 VÀ ADDRESS = NULL */}
                                            {/* {appointment.service?.service_id === 3 && !appointment.address
                                                && <button style={{ marginLeft: '4px' }} className="btn btn-warning" onClick={() => handleSelectStatus("CHECKED_IN")}>Check in</button>} */}

                                            <button style={{marginLeft: '4px'}} className="btn btn-secondary"
                                                    onClick={handleCancelEditStatus}>Undo
                                            </button>
                                        </>
                                    ))}
                                {(appointment.current_status === 'PENDING' || appointment.current_status === 'ON_GOING') && (
                                    <button style={{marginLeft: '4px'}} className="btn btn-danger"
                                            onClick={handleUpdateAppointmentStatusCanceled}>Canceled
                                    </button>
                                )}
                                {/* Thêm điều kiện ngoài: ON_GOING, service id = 3, method = vn_pay, status pay = paid thì có nút mỗi nút ON_going */}
                                {appointment.current_status === 'ON_GOING' && appointment.service?.service_id === 3 && paymentDetails?.payment_method === 'VN_PAY' && paymentDetails?.status === 'PAID' && !appointment.address && (
                                    <button style={{marginLeft: '4px', fontSize: '16px'}} className="btn btn-warning"
                                            onClick={() => handleSelectStatus("CHECKED_IN")}>Check in</button>
                                )}

                                {/* CHECK IN KHI LÀ VN_PAY VÀ STATUS CỦA APPOINTMENT = PAID */}
                                {/* {  appointment.current_status ==='CHECKED_IN' &&  paymentDetails?.payment_method === 'VN_PAY' && paymentDetails?.status === 'PAID' && */}
                                {/* <button style={{ marginLeft: '4px' }} className="btn btn-warning" onClick={() => handleSelectStatus("CHECKED_IN")}>Check in</button>} */}


                            </div>

                            <div className="col-md-6">

                            {appointment.fish && (
                                    <div>
                                        <h5 className="mt-3">Fish Information</h5>
                                        <p>Species: {appointment.fish?.species}</p>
                                        <p>Gender: {appointment.fish?.gender}</p>
                                        <p>Size: {appointment.fish?.size} cm</p>
                                        <p>Weight: {appointment.fish?.weight} kg</p>
                                        <p>Origin: {appointment.fish?.origin}</p>
                                    </div>
                                )
                                }

                                {/* Chỉ show moving surcharge khi có */}
                                {appointment.moving_surcharge && (
                                    <div>
                                        <h5 className="mt-3" >Moving Surcharge</h5>
                                        <p>District: {appointment.moving_surcharge?.district || 'Not available'}</p>
                                        <p>Price: {appointment.moving_surcharge?.price.toLocaleString('vi-VN') || '0'} VND </p>
                                    </div>
                                )}

                                <h5 className="mt-3" >Total Price</h5>
                                <p>Total: {appointment?.total_price.toLocaleString('vi-VN') || '0'} VND</p>

                                {/* Conditionally render payment details */}
                                {paymentDetails?.payment_id && (
                                    <div>
                                        <h5 className="mt-3">Payment Details</h5>
                                        <p>Payment ID: {paymentDetails.payment_id}</p>
                                        <p>Payment method: {paymentDetails.payment_method}</p>
                                        <p>Payment amount: {paymentDetails.payment_amount.toLocaleString('vi-VN')} VND</p>
                                        <p>Status:
                                            <span className={`span-status ${paymentDetails?.status === 'PAID' ? 'payment-status-paid' :
                                                paymentDetails?.status === 'NOT_PAID' ? 'payment-status-not-paid' :
                                                    paymentDetails?.status === 'REFUNDED' ? 'payment-status-refund' :
                                                    'status-default'
                                                }`}
                                            >
                                                {/* Transform 'PAID' or 'NOT_PAID' to 'Paid' or 'Not paid' */}
                                                {paymentDetails?.status
                                                    ? paymentDetails.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
                                                    : 'N/A'}
                                            </span>
                                        </p>

                                        {/* Hiển thị phần update payment chỉ khi status là NOT_PAID và method là CASH */}
                                        {paymentDetails.status === "NOT_PAID" && paymentDetails.payment_method === "CASH" && appointment.current_status === 'ON_GOING' && (
                                            <div>
                                                <span style={{ fontWeight: 'bold', fontSize: '24px', fontStyle: 'italic' }}>Update Payment Status: </span>
                                                {!isEditingPaymentMethod ? (
                                                    <button className="btn btn-primary" onClick={handleEditPaymentMethod}>
                                                        Edit Payment Method
                                                    </button>
                                                ) : (
                                                    <div>
                                                        <button className="btn btn-success mt-2" onClick={handleUpdatePaymentMethod}>
                                                            Update PAID
                                                        </button>
                                                        <button className="btn btn-success mt-2" style={{ marginLeft: '12px', backgroundColor: 'red' }} onClick={() => setIsEditingPaymentMethod(false)}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {paymentDetails?.status === 'PAID' && appointment.current_status === 'CANCELED' &&(
                                            <button className="btn btn-warning mt-2 fw-bold"
                                                    onClick={handleOpenRefundModal}>
                                                Update Refund
                                            </button>

                                        )}
                                        {isModalRefundOpen && (
                                            <RefundModal
                                                appointmentId={appointmentIdNumber}
                                                customerId={Number(appointment.customer_id)}
                                                isOpen={isModalRefundOpen}
                                                onClose={handleCloseRefundModal}
                                                onRefundSuccess={handleRefundSuccess}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="d-flex gap-3 align-items-center">
                <div className='back-button'>
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
                </div>
                <button
                    className="btn btn-primary fs-5 fw-bold"

                    onClick={handleOpenModal}
                >
                    Update Appointment
                </button>
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content"
                         onClick={(e) => e.stopPropagation()}> {/* Prevent click event from bubbling up to the overlay */}
                        <div className="modal-header">
                            {/*<h5 className="modal-title appointment-title">Follow Up Appointment</h5>*/}

                            <span className="close-icon" onClick={handleCloseModal}>
                                                &times;
                                        </span>
                        </div>
                        <div className="modal-body" style={{marginLeft: "3%"}}>

                            {/* Pass vetId or any necessary data to AvailableSlot */}
                            <UpdateAppointment
                                appointmentId={Number(appointment_id)}
                                email={email}
                                phone_number={phone_number}

                            />
                            <label className="fw-bold" style={{fontSize:"15px"}}>Update email</label>
                            <input
                                type="text"
                                placeholder="Enter new email"
                                value={email || ''}
                                onChange={(e) => setEmail(e.target.value || null)} // Set to null if empty
                                className="form-control mb-1 fw-light"
                                style={{maxWidth: "930px"}}
                            />
                            <label className="fw-bold" style={{fontSize:"15px"}}>Update Phone number</label>
                            <input
                                type="text"
                                placeholder="Enter new phone number"
                                value={phone_number || ''}
                                onChange={(e) => setPhoneNumber(e.target.value || null)} // Set to null if empty
                                className="form-control mb-1 fw-light"
                                style={{maxWidth: "930px"}}
                            />
                        </div>

                    </div>
                </div>
            )}
        </div>

    );

};
export default StaffAppointmentDetails;

