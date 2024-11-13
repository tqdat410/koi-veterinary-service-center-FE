import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_API } from '../../../api/baseApi';
import { fetchPrescriptionDetails } from '../../../api/appointmentApi';
import '../../../styles/FishAppointmentDetails.css';
import { MedicalReport, Prescription, Medicine } from "../../../types";

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
    const [medicalReports, setMedicalReports] = useState<{ [key: number]: MedicalReport }>({});
    const [prescriptions, setPrescriptions] = useState<{ [key: number]: Prescription }>({});

    const navigate = useNavigate();

    // Fetch appointments for a specific fish ID
    // useEffect(() => {
    //     if (fishId) {
    //         axios.get(`${BASE_API}/appointments/fish/${fishId}`)
    //             .then(response => {
    //                 const appointmentsData = Array.isArray(response.data) ? response.data : [response.data];
    //                 // Kiểm tra xem mảng appointments chỉ có một phần tử và phần tử đó có giá trị là 1
    //                 if (appointmentsData.length === 1 && appointmentsData[0] === 1) {

    //                 } else {
    //                     const sortedAppointments = appointmentsData.sort(
    //                         (a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    //                     );
    //                     setAppointments(sortedAppointments);
    //                 }
    //             })
    //             .catch(error => console.error("Error fetching appointments:", error))
    //             .finally(() => setLoading(false));
    //     }
    // }, [fishId]);
    // Fetch appointments for a specific fish ID
    useEffect(() => {
        if (fishId) {
            axios.get(`${BASE_API}/appointments/fish/${fishId}`)
                .then(response => {
                    if (response.status === 204) {
                        setError("No appointments available for this fish.");
                        setAppointments([]); // Đảm bảo appointments là mảng trống
                    } else {
                        const appointmentsData = Array.isArray(response.data) ? response.data : [response.data];
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


    console.log("Length appointment is:", appointments.length)

    // Fetch medical reports for each appointment
    useEffect(() => {
        const fetchMedicalReports = async () => {
            const reportPromises = appointments.map(async (appointment) => {
                try {
                    const response = await axios.get(`${BASE_API}/appointments/${appointment.appointment_id}/report`);
                    return { [appointment.appointment_id]: response.data };
                } catch (error) {
                    console.error(`Error fetching medical report for appointment ${appointment.appointment_id}:`, error);
                    return { [appointment.appointment_id]: null };
                }
            });

            const reportsArray = await Promise.all(reportPromises);
            const reports = Object.assign({}, ...reportsArray);
            setMedicalReports(reports);
        };

        if (appointments.length > 0) {
            fetchMedicalReports();
        }
    }, [appointments]);

    // Fetch prescription for each medical report
    useEffect(() => {
        const fetchPrescriptions = async () => {
            const prescriptionPromises = Object.values(medicalReports).map(async (report) => {
                if (report && report.prescription_id) {
                    try {
                        const prescriptionData = await fetchPrescriptionDetails(report.prescription_id);
                        return { [report.prescription_id]: prescriptionData };
                    } catch (error) {
                        console.error(`Error fetching prescription for report ${report.prescription_id}:`, error);
                        return { [report.prescription_id]: null };
                    }
                }
                return {};
            });

            const prescriptionsArray = await Promise.all(prescriptionPromises);
            const prescriptions = Object.assign({}, ...prescriptionsArray);
            setPrescriptions(prescriptions);
        };

        if (Object.keys(medicalReports).length > 0) {
            fetchPrescriptions();
        }
    }, [medicalReports]);

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
            {loading && <div>Loading...</div>}
            {!loading && error && (
                <div>
                    <h2 className="mb-4 header-content">Appointment Details</h2>
                    <p className="lead" style={{ fontSize: '48px', color:'red' }}>{error}</p>
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
            )}
            {!loading && !error && appointments.length >= 1 && (
                <div className="container">
                    <h2 className="mb-4 header-content">Appointment Details</h2>
                    {appointments.map((appointment) => (
                        <div key={appointment.appointment_id} className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">Appointment ID: {appointment.appointment_id || 'N/A'}</h5>
                                <details>
                                    <summary style={{ textAlign: 'left' }}>Show Full Appointment Details</summary>
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <h5 className='fw-900'>Appointment Information:</h5>
                                            <p>Slot: {appointment.time_slot?.description || 'N/A'}</p>
                                            <p>Date: 
                                                {appointment.time_slot?.day && appointment.time_slot?.month && appointment.time_slot?.year ?
                                                    ` ${appointment.time_slot?.day}/${appointment.time_slot?.month}/${appointment.time_slot?.year}` : 'N/A'
                                                }
                                            </p>
                                            <p>Status:
                                                <span
                                                    className={`${appointment.appointment_status === 'CANCELED' ? 'canceled' :
                                                        appointment.appointment_status === 'CHECKED_IN' ? 'checked-in' :
                                                            appointment.appointment_status === 'CONFIRMED' ? 'confirmed' :
                                                                appointment.appointment_status === 'DONE' ? 'done' :
                                                                    appointment.appointment_status === 'ON_GOING' ? 'on-going' :
                                                                        appointment.appointment_status === 'PENDING' ? 'pending' :
                                                                            'default'
                                                        }`}>
                                                    {appointment.appointment_status ?
                                                        appointment.appointment_status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
                                                        : 'N/A'}
                                                </span>
                                            </p>
                                            <h5 className='fw-900'>Payment Information:</h5>
                                            <p>Status:
                                                <span
                                                    className={`${appointment.payment_status === 'PAID' ? 'paid' :
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
                                            <h5 className='fw-900'>Service Information:</h5>
                                            <p>Name: {appointment.service_name}</p>
                                            <p>Veterinarian: {appointment.veterinarian_name || 'N/A'}</p>
                                            {/* Display corresponding medical report */}
                                            {medicalReports[appointment.appointment_id] && (
                                                <div>
                                                    <h5 className='fw-900'>Medical Report</h5>
                                                    <p>ID: {medicalReports[appointment.appointment_id].veterinarian_id || 'N/A'}</p>
                                                    <p>Conclusion: {medicalReports[appointment.appointment_id].conclusion || 'N/A'}</p>
                                                    <p>Advice: {medicalReports[appointment.appointment_id].advise || 'N/A'}</p>
                                                    {/* Hiển thị prescription khi có */}
                                                    {prescriptions[medicalReports[appointment.appointment_id].prescription_id]?.medicines && (
                                                        <div>
                                                            <h5 className='fw-900'>Medicines:</h5>
                                                            <ul>
                                                                {prescriptions[medicalReports[appointment.appointment_id].prescription_id].medicines.map((medicine: Medicine) => (
                                                                    <li key={medicine.medicine_id} className='medicine-item'>
                                                                        ID {medicine.medicine_id} : {medicine.medicine_name} - {medicine.instruction}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
                </div>
            )}
        </div>
    );
};

export default FishAppointmentDetails;
