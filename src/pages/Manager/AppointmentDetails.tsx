import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAppointmentDetails, updateAppointment } from '../../api/appointmentApi';
import { fetchMedicalReport, fetchLogs } from '../../api/appointmentApi';
import { fetchPrescription } from '../../api/prescriptionApi';
import '../../styles/ManagerAppointmentDetails.css';
import Sidebar from "../../components/layout/Sidebar";

interface AppointmentDetailsProps {
    appointment_id: number;
    created_date: string;
    current_status: string;
    customer_name: string;
    slot_id: number;
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

interface AppointmentReport {
    report_id: number,
    veterinarian_id: number,
    conclusion: string,
    advise: string,
    prescription_id: number
}

interface Log {
    status_id: number
    status: string
    time: string,
    note: string
}

interface Prescription {
    prescription_id: number,
    medicines: Medicines[],
    instruction: string
}

interface Medicines {
    medicine_id: number,
    medicine_name: string,
    quantity: number
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
    const location = useLocation(); // Get the location object
    const appointment_id: number = location.state?.appointment_id; // Get the appointment_id from the location state
    const [appointment, setAppointment] = useState<AppointmentDetailsProps | null>(null); // Assuming your data structure
    const [report, setReport] = useState<AppointmentReport | null>(null); // Assuming your data structure
    const [logs, setLogs] = useState<Log[]>([]); // Chuyển logs sang mảng
    const [prescription, setPrescription] = useState<Prescription | null>(null); // Assuming your data structure
    const [showLogsModal, setShowLogsModal] = useState(false); // State để hiển thị modal logs
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false); // State để hiển thị modal prescription
    const navigate = useNavigate();


    // Fetch appointment details by ID
    useEffect(() => {
        const fetchDetails = async () => {
            if (appointment_id) {
                try {
                    console.log('appointment id:', appointment_id);
                    const appointmentData = await getAppointmentDetails(Number(appointment_id)); // Fetch details by ID
                    setAppointment(appointmentData); // Set the appointment details                    
                } catch (error) {
                    console.error('Error fetching appointment details:', error);
                }
            }
        };

        fetchDetails();
    }, [appointment_id]);


    // Fetch report details by ID
    useEffect(() => {
        const fetchDetails = async () => {
            if (appointment_id) {
                try {
                    const reportData = await fetchMedicalReport(Number(appointment_id)); // Fetch details by ID
                    setReport(reportData); // Set the appointment details                    
                } catch (error) {
                    console.error('Error fetching report details:', error);
                }
            }
        };

        fetchDetails();
    }, [appointment_id]);


    // Fetch logs details by ID
    useEffect(() => {
        const fetchDetails = async () => {
            if (appointment_id) {
                try {
                    const logsData = await fetchLogs(Number(appointment_id)); // Fetch details by ID
                    setLogs(logsData); // Set the appointment details                    
                } catch (error) {
                    console.error('Error fetching logs details:', error);
                }
            }
        };

        fetchDetails();
    }, [appointment_id]);

    // Fetch prescription details by prescription_id
    const prevPrescription = useRef<Prescription | null>(null); // Lưu trữ prescription trước đó

    useEffect(() => {
        const fetchDetails = async () => {
            if (report?.prescription_id) {
                try {
                    const prescriptionData = await fetchPrescription(Number(report?.prescription_id));
                    // So sánh prescription mới với prescription hiện tại
                    if (prevPrescription.current?.prescription_id !== prescriptionData.prescription_id) {
                        prevPrescription.current = prescriptionData;
                        setPrescription(prescriptionData); // Cập nhật prescription khi khác nhau
                    }
                } catch (error) {
                    console.error('Error fetching prescription details:', error);
                }
            }
        };

        fetchDetails();
    }, [report?.prescription_id]);


    if (!appointment) {
        return <div>Loading...</div>;
    }

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

    const formattedCreatedDate = formatDateTime(appointment.created_date);
    // const formatLogsTime = formatDateTime(logs.time || '');

    const handleViewLogs = () => {
        setShowLogsModal(true);
    };

    const handleCloseLogsModal = () => {
        setShowLogsModal(false);
    };

    const handleViewPrescription = () => {
        setShowPrescriptionModal(true);
    };

    const handleClosePrescriptionModal = () => {
        setShowPrescriptionModal(false);
    };

    return (
        <div className="d-flex flex-grow-1 gap-3" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: '2rem', textAlign: 'left' }}>
                <h2 className="mb-4">Appointment Details</h2>

                <div className="card">
                    <div className="card-body">
                        <div className="card-body">
                            <h5 className="card-title title-appointment" >Appointment
                                ID: {appointment.appointment_id}</h5>

                            <div className="row">
                                <div className="col-md-6">
                                    <p>Date: {formattedCreatedDate}</p>
                                    <p>Status:
                                        <span
                                            className={`span-status ${appointment?.current_status === 'CANCELED' ? 'canceled' :
                                                appointment?.current_status === 'CHECKED_IN' ? 'checked-in' :
                                                    appointment?.current_status === 'CONFIRMED' ? 'confirmed' :
                                                        appointment?.current_status === 'DONE' ? 'done' :
                                                            appointment?.current_status === 'ON_GOING' ? 'on-going' :
                                                                appointment?.current_status === 'PENDING' ? 'pending' :
                                                                    ''
                                                }`}>
                                            {/* Format lại chữ */}
                                            {appointment?.current_status ?
                                                appointment.current_status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
                                                : 'N/A'}
                                        </span>
                                    </p>


                                    <h5 className="mt-3">Customer Information</h5>
                                    <p>Name: {appointment?.customer_name}</p>
                                    <p>Email: {appointment?.email}</p>
                                    <p>Phone: {appointment?.phone_number}</p>
                                    <p>Description: {appointment?.description || 'Nothing'}</p>

                                    <h5 className="mt-3">Service Information</h5>
                                    <p>Service name: {appointment.service?.service_name}</p>
                                    <p>Service Price: {appointment.service?.service_price} USD</p>

                                    <h5 className="mt-3">Veterinarian Information</h5>
                                    <p>
                                        Veterinarian name: {
                                            (appointment.veterinarian?.first_name || appointment.veterinarian?.last_name)
                                                ? `${appointment.veterinarian.first_name || ''} ${appointment.veterinarian.last_name || ''}`
                                                : 'No veterinarian assigned'
                                        }
                                    </p>

                                    <h5 className="mt-3" style={{ fontWeight: '900', display: 'inline' }}>
                                        Address Information:
                                        <p style={{ fontWeight: 'normal' }}>
                                            {
                                                (appointment.address?.home_number || appointment.address?.ward || appointment.address?.district || appointment.address?.city)
                                                    ? `${appointment.address.home_number}, ${appointment.address.ward}, ${appointment.address.district}, ${appointment.address.city}`
                                                    : ' No address assigned'
                                            }
                                        </p>
                                    </h5>


                                    <h5 className="mt-3">Report Information</h5>
                                    <p>Report ID: {report?.report_id || 'No id'}</p>
                                    <p>Veterinarian ID: {report?.veterinarian_id || 'No veterinarain'}
                                    </p>
                                    <p>Conclusion: {report?.conclusion || 'No conclusion'}</p>
                                    <p>Advise: {report?.advise || 'No advise'}</p>

                                </div>

                                <div className="col-md-6">
                                    {/* Tồn tại thì mới có hiển thị */}
                                    {appointment.fish && (
                                        <div>
                                            <h5 className="mt-3">Fish Information</h5>
                                            <p>Species: {appointment.fish?.species}</p>
                                            <p>Gender: {appointment.fish?.gender}</p>
                                            <p>Size: {appointment.fish?.size} cm</p>
                                            <p>Weight: {appointment.fish?.weight} kg</p>
                                            <p>Origin: {appointment.fish?.origin}</p>
                                        </div>
                                    )}

                                    <h5 className="mt-3">Moving Surcharge</h5>
                                    <p>
                                        District: {appointment.moving_surcharge?.district || 'Not available'}
                                    </p>
                                    <p>Price: {appointment.moving_surcharge?.price || '0'} USD </p>

                                    <h5 className="mt-3">Total Price</h5>
                                    <p>Total: {appointment?.total_price || ''} USD</p>

                                    <h5 className="mt-3">Prescription</h5>
                                    <button className="btn btn-primary" onClick={handleViewPrescription}>
                                        View prescription details
                                    </button>

                                    <h5 className="mt-3">Logs of appointment
                                        information</h5>
                                    <button className="btn btn-primary" onClick={handleViewLogs}>
                                        View Log Details
                                    </button>

                                </div>
                            </div>

                            {/* Modal để hiển thị logs */}
                            <div className={`modal ${showLogsModal ? 'open' : ''}`}
                                style={{ display: showLogsModal ? 'flex' : 'none' }}
                            >
                                <div className="modal-content">
                                    <h2>Logs Details</h2>
                                    {logs.length > 0 ? (
                                        <ul className="logs-list">
                                            {logs.map((log) => {
                                                // Tạo tên lớp dựa trên status
                                                let statusClass = "";
                                                switch (log.status) {
                                                    case "CANCELED":
                                                        statusClass = "status-cancelled";
                                                        break;
                                                    case "CHECKED_IN":
                                                        statusClass = "status-check-in";
                                                        break;
                                                    case "CONFIRMED":
                                                        statusClass = "status-confirmed";
                                                        break;
                                                    case "DONE":
                                                        statusClass = "status-done";
                                                        break;
                                                    case "ON_GOING":
                                                        statusClass = "status-on-going";
                                                        break;
                                                    case "PENDING":
                                                        statusClass = "status-pending";
                                                        break;
                                                    default:
                                                        statusClass = "";
                                                }

                                                return (
                                                    <li key={log.status_id} className="log-item">
                                                        <span className="label">Log ID:</span> {log.status_id} <br />
                                                        <span className="label">Status:</span>
                                                        <span className={` ${statusClass}`}>
                                                            {log.status}
                                                        </span><br />
                                                        <span className="label">Time:</span> {formatDateTime(log.time)} <br />
                                                        <span className="label">Note:</span> {log.note || 'No note'}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p>No logs available</p>
                                    )}
                                    <button className="btn btn-secondary close-btn" onClick={handleCloseLogsModal}>Close</button>
                                </div>
                            </div>


                            {/* Modal để hiển thị prescription */}

                            <div className={`modal ${showPrescriptionModal ? 'open' : ''}`}
                                style={{ display: showPrescriptionModal ? 'flex' : 'none' }}>
                                <div className="modal-content">
                                    <h2>Prescription Details</h2>
                                    {prescription ? ( // Kiểm tra nếu có prescription
                                        <>
                                            <p>Prescription
                                                ID: {prescription.prescription_id || 'No id'}</p>
                                            {prescription.medicines.length > 0 ? (
                                                <ul className='logs-list'>
                                                    {prescription.medicines.map((medicine) => (
                                                        <li key={medicine.medicine_id} className='log-item'>

                                                            <span className="label">Medicine ID:</span> {medicine.medicine_id} <br />
                                                            <span className="label">Medicine Name:</span> {medicine.medicine_name}<br />
                                                            <span className="label">Quantity:</span> {medicine.quantity}
                                                        </li>
                                                    ))}
                                                </ul>

                                            ) : (
                                                <p>No medicines available</p>
                                            )}
                                            <p>
                                                Instruction: {prescription.instruction || 'No instruction'}
                                            </p>
                                        </>
                                    ) : (
                                        <p>No prescription available</p>
                                    )}

                                    <button className="btn btn-secondary" onClick={handleClosePrescriptionModal}>Close
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


                {/* Back Button */}
                <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Back</button>
                </div>

            </div>
        </div>

    );
};


export default AppointmentDetails;

