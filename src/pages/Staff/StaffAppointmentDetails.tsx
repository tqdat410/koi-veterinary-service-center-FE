import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointmentDetails, updateAppointment } from '../../api/appointmentApi';
import { fetchPayment, updatePayment } from '../../api/paymentApi';
import { updateAppointmentStatus, fetchAppointmentAndVeterinariansDemo, updateAppointmentStatusCanceled } from '../../api/appointmentApi';
import { fetchVetBySlotId } from '../../api/vetApi';
import '../../styles/StaffAppointmentDetails.css';
import { useParams } from 'react-router-dom';
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


const StaffAppointmentDetails: React.FC = () => {
    const { appointment_id } = useParams<{ appointment_id: string }>();  // Get the appointment_id from the location state
    const appointmentIdNumber = Number(appointment_id); // Convert the appointment_id to a number
    const [appointment, setAppointment] = useState<AppointmentDetailsProps | null>(null); // Assuming your data structure
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null); // State for payment details
    const [isEditingPaymentMethod, setIsEditingPaymentMethod] = useState(false); // State to handle editing payment method
    //State to handing appointment status
    const [appointmentStatus, setAppointmentStatus] = useState(false); // State to store selected appointment
    const [isEditingStatus, setIsEditingStatus] = useState(false); // New state for editing status

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(''); // State to store selected payment method

    const navigate = useNavigate(); // Hook for navigation

    const [vetList, setVetList] = useState<Veterinarian[]>([]); // List of vets
    const [selectedVetId, setSelectedVetId] = useState<number | null>(null); // Selected vet ID

    // Tạo trạng thái isVetSelected
    const [isVetSelected, setIsVetSelected] = useState(false);

    // Tạo biến selectedStatus
    const [selectedStatus, setSelectedStatus] = useState(''); // Trạng thái được chọn

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

    // Function to handle editing payment method
    const handleEditPaymentMethod = () => {
        setIsEditingPaymentMethod(true); // Switch to editing mode
    };

    // Function to handle payment method change
    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPaymentMethod(e.target.value); // Update selected payment method
        // console.log(selectedPaymentMethod);
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
        }
    };


    // Function to cancel editing status
    const handleCancelEditStatus = () => {
        setIsEditingStatus(false);
        setSelectedStatus('');
    };
    // Function to update appointment status
    const handleUpdateAppointmentStatus = async (status: string) => {

        const confirmUpdate = window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái thành: ${status}?`);
        if (!confirmUpdate) return;

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
                                current_status: selectedStatus
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
                    await updateAppointmentStatusCanceled(appointment.appointment_id);
                    // Cập nhật lại thông tin trạng thái trong state appointment
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
        <div className="container container-details">
            <h2 className="mb-4">Appointment Details</h2>

            <div className="card">
                <div className="card-body">
                    <div className="card-body card-body-appointment">
                        <h5 className="card-title card-title-appointment">Appointment ID: {appointment.appointment_id}</h5>

                        <div className="row">
                            <div className="col-md-6">
                                <p>Date & time:  {formattedDate}</p>
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
                                <p>Service Price: {appointment.service?.service_price} VND</p>

                                <h5 className="mt-3">Veterinarian Information</h5>

                                {/* thêm phần add bác sĩ ở đây */}
                                {
                                    appointment.veterinarian ? (
                                        <p>Name: {appointment.veterinarian?.first_name} {appointment.veterinarian?.last_name}</p>
                                    ) : (
                                        <div>
                                            <label htmlFor="vet-select">Select Veterinarian:</label>
                                            <select id="vet-select" onChange={handleVetSelection} className="form-select">
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

                                {/*  Chỉ có PENDING mới chỉnh  */}
                                {appointment.current_status === 'PENDING' && (
                                    !isEditingStatus ? (
                                        <>
                                            <p style={{ fontWeight: '900', color: 'brown', padding: '10px', fontSize: '20px' }}>Update Status</p>
                                            <button className="btn btn-info" onClick={handleEditStatus}>Click here to Update</button>
                                        </>
                                    ) : (
                                        <>
                                            <p style={{ fontWeight: 'bold', fontSize: '24px', fontStyle: 'italic' }}>Update Status: {selectedStatus}</p>
                                            <button style={{ marginLeft: '4px' }} className="btn btn-primary" onClick={() => handleSelectStatus("CONFIRMED")}>Confirmed</button>
                                            {/* CHECK IN KHI VÀ CHỈ KHI LÀ SERVICE ID = 3 VÀ ADDRESS = NULL */}

                                            {appointment.service?.service_id === 3 && !appointment.address 
                                             && <button style={{ marginLeft: '4px' }} className="btn btn-warning" onClick={() => handleSelectStatus("CHECKED_IN")}>Check in</button>}                                            
                                            <button style={{ marginLeft: '4px' }} className="btn btn-danger" onClick={handleUpdateAppointmentStatusCanceled}>Canceled</button>
                                            <button style={{ marginLeft: '4px' }} className="btn btn-secondary" onClick={handleCancelEditStatus}>Undo</button>
                                        </>
                                    ))}

                            </div>

                            <div className="col-md-6">

                                {appointment.fish && (
                                    <div>
                                        <h5 className="mt-3" >Fish Information</h5>
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
                                        <p>Price: {appointment.moving_surcharge?.price || '0'} VND </p>
                                    </div>
                                )}

                                <h5 className="mt-3" >Total Price</h5>
                                <p>Total: {appointment?.total_price || '0'} VND</p>

                                {/* Conditionally render payment details */}
                                {paymentDetails?.payment_id && (
                                    <div>
                                        <h5 className="mt-3">Payment Details</h5>
                                        <p>Payment ID: {paymentDetails.payment_id}</p>
                                        <p>Payment method: {paymentDetails.payment_method}</p>
                                        <p>Payment amount: {paymentDetails.payment_amount} VND</p>
                                        <p>Status:
                                            <span className={`span-status ${paymentDetails?.status === 'PAID' ? 'payment-status-paid' :
                                                paymentDetails?.status === 'NOT_PAID' ? 'payment-status-not-paid' :
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
                                        {paymentDetails.status === "NOT_PAID" && paymentDetails.payment_method === "CASH" && (
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

                                    </div>
                                )}
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
            

            <div className='back-button'>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
            </div>

            </div>
       
    );

};
export default StaffAppointmentDetails;

