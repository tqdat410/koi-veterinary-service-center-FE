import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_API } from '../../../api/baseApi';
import '../../../styles/FishAppointmentDetails.css';

interface Appointment {
    appointment_id: number;
    created_date: string;
    time_slot?: TimeSlot;
    service_name: string;
    veterinarian_name: string;
    appointment_status: string;
    payment_status: string;
}

interface TimeSlot {
    slot_id: number;
    year: number;
    month: number;
    day: number;
    slot_order: number;
    description: string;
}

const FishAppointmentDetails: React.FC = () => {
    const { fishId } = useParams<{ fishId: string }>();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (fishId) {
            axios.get(`${BASE_API}/appointments/fish/${fishId}`)
                .then(response => {
                    const appointmentsData = Array.isArray(response.data) ? response.data : [response.data];

                    // Kiểm tra xem mảng appointments chỉ có một phần tử và phần tử đó có giá trị là 1
                    if (appointmentsData.length === 1 && appointmentsData[0] === 1) {
                        setAppointments([]);  // Đặt thành mảng trống khi không có lịch hẹn thực sự
                    } else {
                        const sortedAppointments = appointmentsData.sort(
                            (a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
                        );
                        setAppointments(sortedAppointments);
                    }
                })
                .catch(error => console.error("Error fetching appointments:", error))
                .finally(() => setLoading(false));
        }
    }, [fishId]);

    console.log(appointments.length);

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
            {/* Loading State */}
            {loading && <div>Loading...</div>}

            {/* Error State */}
            {!loading && error && <div>{error}</div>}

            {/* No Appointments Available */}

            {appointments.length < 1 && (
                <div>
                    <p className="lead" style={{ fontSize: '48px' }}>No appointments available for this fish.</p>
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
            )}

            {/* Appointments List */}
            {!loading && !error && appointments.length >= 1 && (
                <div className="container">
                    <h2 className="mb-4 header-content">Appointment Details</h2>
                    {appointments.map((appointment) =>
                        appointment.appointment_id ? (
                            <div key={appointment.appointment_id} className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Appointment ID: {appointment.appointment_id || 'N/A'}</h5>
                                    <details>
                                        <summary style={{ textAlign: 'left' }}>Show Full Appointment Details</summary>
                                        <div className="row mt-3">
                                            <div className="col-md-6">
                                                <h5>Appointment Information:</h5>
                                                <p>Slot: {appointment.time_slot?.description || 'N/A'}</p>
                                                <p>Date:
                                                    {appointment.time_slot?.day && appointment.time_slot?.month && appointment.time_slot?.year ?
                                                        `${appointment.time_slot?.day}/${appointment.time_slot?.month}/${appointment.time_slot?.year}` : 'N/A'
                                                    }
                                                </p>
                                                <p>Status:
                                                    {/* Thay đổi theo điều kiện css */}
                                                    <span
                                                        className={` ${appointment.appointment_status === 'CANCELED' ? 'canceled' :
                                                            appointment.appointment_status === 'CHECKED_IN' ? 'checked-in' :
                                                                appointment.appointment_status === 'CONFIRMED' ? 'confirmed' :
                                                                    appointment.appointment_status === 'DONE' ? 'done' :
                                                                        appointment.appointment_status === 'ON_GOING' ? 'on-going' :
                                                                            appointment.appointment_status === 'PENDING' ? 'pending' :
                                                                                'default'
                                                            }`}>
                                                        {/* Format lại chữ */}
                                                        {appointment.appointment_status ?
                                                            appointment.appointment_status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
                                                            : 'N/A'}
                                                    </span>
                                                </p>

                                                <h5>Payment Information:</h5>
                                                <p>
                                                    Status:
                                                    <span
                                                        className={` ${appointment.payment_status === 'PAID' ? 'paid' :
                                                            appointment.payment_status === 'NOT_PAID' ? 'not-paid' :                                        
                                                                    'default'
                                                        }`}>
                                                        {appointment.payment_status ?
                                                            appointment.payment_status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
                                                            : 'N/A'}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <h5>Service Information:</h5>
                                                <p>Name: {appointment.service_name}</p>
                                                <p>Veterinarian: {appointment.veterinarian_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="lead text-danger" style={{ fontSize: '48px', paddingTop:'-12px' }}>No appointments available for this fish.</p>
                            </div>
                        )
                    )}
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
                </div>
            )}
        </div>
    );
};

export default FishAppointmentDetails;
