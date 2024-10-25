import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import AvailableSlot from "../../components/schedule/SlotDateSelection"
import {

    getMedicalReport,
    createMedicalReport,
    getMedicines,
    createPrescription,
    fetchPrescriptionDetails, updateAppointmentStatus, updateDoneStatus, getAppointmentDetailsVet

} from '../../api/appointmentApi';
import "../../styles/Appointment.css";
import {useAuth} from "../../hooks/context/AuthContext";
import {MedicalReportComponent } from "../../components/vetAppointmentDetails/Report"
import CreateMedicalReport from "../../components/vetAppointmentDetails/CreateMedicalReport"
import {MedicalReport, Medicine,Prescription} from "../../types";

const VetAppointmentDetails: React.FC = () => {
    const { user } = useAuth();
    const vetId = user?.userId;
    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const [appointment, setAppointment] = useState<any | null>(null);
    const [medicalReport, setMedicalReport] = useState<MedicalReport | null>(null);
    const [isReportVisible, setIsReportVisible] = useState<boolean>(false);
    const [isCreatingReport, setIsCreatingReport] = useState<boolean>(false);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [prescription, setPrescription] = useState<Prescription | null>(null);
    const [isMedicineValid, setIsMedicineValid] = useState<boolean[]>([]);
    const [isQuantityValid, setIsQuantityValid] = useState<boolean[]>([]);
    const [isInstructionValid, setIsInstructionValid] = useState<boolean[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [description, setDescription] = useState<string>('');
    const [newReport, setNewReport] = useState<MedicalReport>({
        veterinarian_id: 0,
        conclusion: '',
        advise: '',
        prescription_id: 0
    });

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                const appointmentData = await getAppointmentDetailsVet(Number(appointmentId));
                setAppointment(appointmentData);

                // Fetch medical report if it exists
                const report = await getMedicalReport(Number(appointmentId));
                if (report) {
                    setMedicalReport(report);
                    if (report.prescription_id) {

                        const prescriptionData = await fetchPrescriptionDetails(report.prescription_id);
                        setPrescription(prescriptionData);
                    }
                }
            } catch (error) {
                console.error('Error fetching appointment details:', error);
            }
        };

        const fetchMedicines = async () => {
            try {
                const medicineData = await getMedicines();

                setMedicines(medicineData);
            } catch (error) {
                console.error('Error fetching medicines:', error);
            }
        };

        fetchAppointmentDetails();
        fetchMedicines();
    }, [appointmentId]);

    const toggleReportModal = () => {
        if (isCreatingReport) {
            setIsCreatingReport(false); // Đóng modal
        }
        setIsReportVisible(!isReportVisible); // Đóng modal
    };

    const handleCreateReport = async () => {
        try {
            let valid = true;

            if (!newReport.advise.trim()) {
                alert("Advise cannot be empty.");
                return;
            }

            if (!newReport.conclusion.trim()) {
                alert("Conclusion cannot be empty.");
                return;
            }

            if (prescription) {
                const medicineValidation = prescription.medicines.map((med) => {
                    return med.medicine_id !== 0;
                });
                const quantityValidation = prescription.medicines.map((med) => {
                    return med.quantity > 0;
                });
                const instructionValidation = prescription.medicines.map((med) => {
                    return med.instruction.trim() !== "";
                });
                setIsMedicineValid(medicineValidation);
                setIsQuantityValid(quantityValidation);
                setIsInstructionValid(instructionValidation);
                // Check overall validity
                valid = medicineValidation.every(Boolean) && quantityValidation.every(Boolean )&& instructionValidation.every(Boolean);
            }

            if (!valid) {

                alert('Please correct the highlighted fields.');
                return;
            }
            if (window.confirm('Are you sure you want to save the report?')) {
            let prescriptionData;
            if (prescription) {

                prescriptionData = await createPrescription(prescription);

            } else {
                prescriptionData = { prescription_id: null };
            }


            if (vetId === undefined) {
                alert('User ID is not available. Cannot create medical report.');
                return;
            }

            const newMedicalReport = {
                ...newReport,
                prescription_id: prescriptionData.prescription_id,
                veterinarian_id: vetId
            };
            await createMedicalReport(Number(appointmentId), newMedicalReport);
            alert('Report created successfully!');

            setIsCreatingReport(false);
            toggleReportModal();
            window.location.reload();
            }
        } catch (error) {
            console.error('Error creating report:', error);
        }
    };

    const handleAddMedicine = () => {
        if (!prescription) {
            setPrescription({
                prescription_id: null,
                instruction: '',
                medicines: [{ medicine_id: 0,medicine_name:'',instruction: '', quantity: 1 }]
            });
        } else {
            const updatedPrescription = {
                ...prescription,
                medicines: [...prescription.medicines, { medicine_id: 0,medicine_name:'',instruction: '',  quantity: 1 }]
            };
            setPrescription(updatedPrescription);
        }
        // Update validity state
        setIsMedicineValid([...isMedicineValid, true]); // Default to invalid
        setIsQuantityValid([...isQuantityValid, true]); // Quantity defaults to 1, which is valid
        setIsInstructionValid([...isQuantityValid, true]);
    };

    const handleRemoveMedicine = (index: number) => {
        if (prescription) {
            const updatedMedicines = prescription.medicines.filter((_, idx) => idx !== index);
            setPrescription({ ...prescription, medicines: updatedMedicines });
            // Remove validation for the removed medicine
            const updatedMedicineValid = [...isMedicineValid];
            updatedMedicineValid.splice(index, 1);
            setIsMedicineValid(updatedMedicineValid);
            const updatedQuantityValid = [...isQuantityValid];
            updatedQuantityValid.splice(index, 1);
            setIsQuantityValid(updatedQuantityValid);
            const updatedInstructionValid = [...isInstructionValid];
            updatedInstructionValid.splice(index, 1);
            setIsInstructionValid(updatedInstructionValid);
        }
    };

    const handleMedicineChange = (index: number, field: string, value: any) => {
        if (prescription) {
            const updatedMedicines = prescription.medicines.map((medicine, idx) =>
                idx === index ? { ...medicine, [field]: value === "" ? "" : value } : medicine
            );
            setPrescription({ ...prescription, medicines: updatedMedicines });

            // Update validity based on the change
            if (field === 'medicine_id') {
                const updatedValidity = [...isMedicineValid];
                updatedValidity[index] = value !== "0"; // Update validity based on selection
                setIsMedicineValid(updatedValidity);
            } else if (field === 'quantity') {
                const updatedValidity = [...isQuantityValid];
                updatedValidity[index] = Number(value) > 0; // Update validity based on quantity
                setIsQuantityValid(updatedValidity);
            }else if (field === 'instruction') {
                const updatedValidity = [...isInstructionValid];
                updatedValidity[index] = value.trim() !== null; // Update validity based on instruction
                setIsInstructionValid(updatedValidity);
            }
        }
    };

    const handleBack = () => {
        navigate('/veterinarian/schedule');
    };

    const handleUpdateStatus  = async (status: any) => {

        const confirmFinish = window.confirm(`Are you sure you want to mark this appointment as ${status}?`);
        if (!confirmFinish) {
            return; // Exit the function if the user cancels
        }
        try {
            const result = await updateDoneStatus(Number(appointmentId), status);
            alert(`Appointment marked as ${status}!`);
            console.log('Update Result:', result);
            window.location.reload();

        } catch (error: any) { // Chú ý: Sử dụng any nếu bạn không chắc chắn về kiểu lỗi
            console.error(`Error updating appointment status to ${status}:`, error);

            if (error.response && error.response.data) {
                const errorMessage: string = error.response.data;

                // Kiểm tra thông báo lỗi chứa thông tin về thanh toán chưa hoàn tất
                if (errorMessage.includes("Payment is not paid yet")) {
                    alert("Customer has not paid. Please wait for staff confirmation.!");
                } else {
                    alert(`Failed to mark appointment as ${status}. Please try again.`);
                }
            } else {
                alert(`Failed to mark appointment as ${status}. Please try again.`);
            }
        }
    };
    const handleOpenModal = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDescription('');
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const formatStatus = (status: string) => {
        switch (status) {
            case 'CHECKED_IN':
                return 'CHECKED IN';
            case 'ON_GOING':
                return 'ON GOING';
            default:
                return status;
        }
    };

    return (
        <div className="container-fluid vh-100 text-start d-flex align-items-center justify-content-center">
            <button
                className="btn btn-secondary mb-3"
                style={{position: 'absolute', top: '12%', left: '3%'}}
                onClick={handleBack}>
                Back
            </button>
            {appointment && (
                <div className="row " style={{width: "80%"}}>
                    {/* Left Column - Appointment Details */}
                    <div className="col-md-8">

                        <div className="appointment-info">
                            <h2 className="text-start appointment-title">Appointment Details</h2>
                            <p><strong>Appointment ID:</strong> {appointment.appointment_id}</p>
                            <p><strong>Status:</strong> <span className={`fw-bold ${
                                appointment.current_status === 'PENDING' ? 'text-warning' :
                                    appointment.current_status === 'CONFIRMED' ? 'text-primary' :
                                        appointment.current_status === 'CHECKED_IN' ? 'text-info' :
                                            appointment.current_status === 'CANCEL' ? 'text-danger' :
                                                appointment.current_status === 'ON_GOING' ? 'text-secondary' :
                                                    appointment.current_status === 'DONE' ? 'text-success' : ''
                            }`}>
                               {formatStatus(appointment.current_status)}
                            </span></p>
                            <p><strong>Customer Name:</strong> {appointment.customer_name}</p>
                            <p><strong>Customer Email:</strong> {appointment.email}</p>
                            <p><strong>Customer Phone:</strong> {appointment.phone_number}</p>

                            {appointment.address && (
                                <p><strong>Customer Address: </strong>
                                    {appointment.address.home_number}/ {appointment.address.ward}/ {appointment.address.district}/ {appointment.address.city}
                                </p>
                            )}

                            <p><strong>Service:</strong> {appointment.service.service_name}</p>
                            <p><strong>Description:</strong> {appointment.description}</p>
                            {appointment.current_status === 'ON_GOING' && (
                                <button className="btn btn-secondary mt-3" onClick={() => handleUpdateStatus("CHECKED_IN")}>
                                    Check In
                                </button>
                            )}

                            {medicalReport && appointment.current_status === 'CHECKED_IN'  && (
                                <button className="btn btn-success mt-3" onClick={() => handleUpdateStatus("DONE")}>
                                    Finish
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Fish Information & Medical Report */}
                    <div className="col-md-4">
                        {/* Fish Information */}
                        {appointment.fish && (
                            <div className="fish-info mb-4">
                                <h3 className="text-start appointment-title">Fish Information</h3>

                                <p><strong>Species:</strong> {appointment.fish.species}</p>
                                <p><strong>Gender:</strong> {appointment.fish.gender}</p>
                                <p><strong>Age:</strong> {appointment.fish.age}</p>
                                <p><strong>Size:</strong> {appointment.fish.size} cm</p>
                                <p><strong>Weight:</strong> {appointment.fish.weight} kg</p>
                                <p><strong>Color:</strong> {appointment.fish.color}</p>
                                <p><strong>Origin:</strong> {appointment.fish.origin}</p>
                            </div>
                        )}

                        <div className="col-md-12">
                            <h3 className="text-start appointment-title">Medical Report</h3>

                            {!medicalReport && (
                                <button className="btn btn-primary fs-5" onClick={() => setIsCreatingReport(true)}>
                                    Create Report
                                </button>
                            )}

                            {medicalReport && (
                                <button className="btn btn-success fs-5" onClick={toggleReportModal}>
                                    View Report
                                </button>
                            )}


                            {isReportVisible && medicalReport && (
                                <MedicalReportComponent
                                    medicalReport={medicalReport}
                                    prescription={prescription}
                                    toggleReportModal={toggleReportModal}
                                />
                            )}

                            <CreateMedicalReport
                                isCreatingReport={isCreatingReport}
                                toggleReportModal={toggleReportModal}
                                newReport={newReport}
                                setNewReport={setNewReport}
                                prescription={prescription}
                                setPrescription={setPrescription}
                                medicines={medicines}
                                handleMedicineChange={handleMedicineChange}
                                handleAddMedicine={handleAddMedicine}
                                handleRemoveMedicine={handleRemoveMedicine}
                                isMedicineValid={isMedicineValid}
                                setIsMedicineValid={setIsMedicineValid}
                                isQuantityValid={isQuantityValid}
                                setIsQuantityValid={setIsQuantityValid}
                                isInstructionValid={isInstructionValid}
                                setIsInstructionValid={setIsInstructionValid}
                                handleCreateReport={handleCreateReport}
                            />
                        </div>

                        {/* Modal for creating follow-up appointments */}
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
                                        <AvailableSlot vetId={vetId}
                                                       appointmentId={Number(appointmentId)}
                                                       description={description}/>
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={description}
                                            onChange={handleDescriptionChange}
                                            className="form-control mb-1 mt-3"
                                            style={{maxWidth:"930px"}}
                                        />
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                    <button
                        className="btn btn-primary mt-3 fs-5"

                        onClick={handleOpenModal}
                    >
                        Create Follow Up Appointment
                    </button>
                    </div>
                </div>

            )}
        </div>
    );
};

export default VetAppointmentDetails;
