import React from 'react';
import { MedicalReport, Prescription } from '../../../src/types';

interface MedicalReportProps {
    medicalReport: MedicalReport;
    prescription: Prescription | null;
    toggleReportModal: () => void;
}

const MedicalReportComponent: React.FC<MedicalReportProps> = ({ medicalReport, prescription, toggleReportModal }) => {
    return (
        <div className="modal fade show" tabIndex={-1} style={{ display: 'block', background: 'rgba(0, 0, 0, 0.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <span className="close-icon" onClick={toggleReportModal}>
                        &times;
                    </span>
                    <div className="modal-header">
                        <h5 className="modal-title appointment-title" style={{ fontSize: "1.8rem" }}>Medical Report</h5>
                    </div>
                    <div className="modal-body">
                        <p><strong>Conclusion:</strong> {medicalReport.conclusion}</p>
                        <p><strong>Advise:</strong> {medicalReport.advise}</p>
                        {prescription && <PrescriptionComponent prescription={prescription} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrescriptionComponent: React.FC<{ prescription: Prescription }> = ({ prescription }) => {
    return (
        <div>
            <div className="modal-header">
                <h5 className="modal-title appointment-title" style={{ fontSize: "1.6rem" }}>Prescription</h5>
            </div>
            <div className="modal-body">
                <p><strong>Instructions:</strong> {prescription.instruction}</p>
                <ul>
                    {prescription.medicines.map((med, index) => (
                        <li key={index}>
                            {med.medicine_name} (Quantity: {med.quantity}) - {med.instruction}

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export { MedicalReportComponent };
