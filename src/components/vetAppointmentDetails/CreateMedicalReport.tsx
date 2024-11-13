import React, { useState } from 'react';
import { Prescription, Medicine, MedicalReport } from '../../../src/types';
import "../../styles/AddKoiFish.css"
interface CreateMedicalReportProps {
    isCreatingReport: boolean;
    toggleReportModal: () => void;
    newReport: MedicalReport;
    setNewReport: (report: MedicalReport) => void;
    prescription: Prescription | null;
    setPrescription: (prescription: Prescription | null) => void;
    medicines: Medicine[];
    handleMedicineChange: (index: number, field: string, value: any) => void;
    handleAddMedicine: () => void;
    handleRemoveMedicine: (index: number) => void;
    isMedicineValid: boolean[];
    setIsMedicineValid: (validity: boolean[]) => void;
    isQuantityValid: boolean[];
    isInstructionValid: boolean[];
    setIsInstructionValid: (validity: boolean[]) => void;
    setIsQuantityValid: (validity: boolean[]) => void;
    handleCreateReport: () => void;
}

const CreateMedicalReport: React.FC<CreateMedicalReportProps> = ({
                                                                     isCreatingReport,
                                                                     toggleReportModal,
                                                                     newReport,
                                                                     setNewReport,
                                                                     prescription,
                                                                     setPrescription,
                                                                     medicines,
                                                                     handleMedicineChange,
                                                                     handleAddMedicine,
                                                                     handleRemoveMedicine,
                                                                     isMedicineValid,
                                                                     isInstructionValid,
                                                                     setIsMedicineValid,
                                                                     isQuantityValid,
                                                                     setIsInstructionValid,
                                                                     setIsQuantityValid,
                                                                     handleCreateReport,
                                                                 }) => {
    if (!isCreatingReport) return null;
    const handleInstructionChange = (index: number, part: string, value: string) => {
        const parsedValue = Number(value);
        if (parsedValue <= 0) {
            // Set is-invalid for negative values
            const updatedValidity = [...isInstructionValid];
            updatedValidity[index] = false;
            setIsInstructionValid(updatedValidity);
            return;
        }

        // Valid value, update validity and proceed
        const updatedValidity = [...isInstructionValid];
        updatedValidity[index] = true;
        setIsInstructionValid(updatedValidity);

        let instruction = prescription?.medicines[index]?.instruction || '';
        const parts = instruction.split(', ');

        // Update specific part (morning, noon, or evening)
        if (part === 'morning') {
            instruction = `sáng: ${value}, ${parts[1] || 'trưa: 0'}, ${parts[2] || 'chiều: 0'}`;
        } else if (part === 'noon') {
            instruction = `${parts[0] || 'sáng: 0'}, trưa: ${value}, ${parts[2] || 'chiều: 0'}`;
        } else if (part === 'evening') {
            instruction = `${parts[0] || 'sáng: 0'}, ${parts[1] || 'trưa: 0'}, chiều: ${value}`;
        }

        handleMedicineChange(index, 'instruction', instruction);
    };

    const isFormValid = !prescription || (prescription.medicines.length === 0 ) || prescription?.medicines.every((med, index) => isInstructionValid[index]);
    return (
        <div className="modal" tabIndex={-1} style={{ display: 'block', background: 'rgba(0, 0, 0, 0.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <span className="close-icon" onClick={toggleReportModal}>
                        &times;
                    </span>
                    <div className="modal-header">
                        <h5 className="modal-title appointment-title" style={{ fontSize: "1.9rem" }}>Create Medical Report</h5>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label-koi">Conclusion</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newReport.conclusion}
                                onChange={(e) => setNewReport({ ...newReport, conclusion: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label-koi">Advise</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newReport.advise}
                                onChange={(e) => setNewReport({ ...newReport, advise: e.target.value })}
                            />
                        </div>
                        <div>
                            <div className="modal-header">
                                <h5 className="modal-title appointment-title" style={{ fontSize: "1.4rem" }}>Prescription</h5>
                            </div>
                            <div className="modal-body">
                                {prescription?.medicines.map((med, index) => (
                                    <div key={index} className="mb-4">
                                        <div style={{outline: "1px solid grey", padding:"18px", borderRadius:"20px"}}>
                                        <div className="d-flex mb-2">
                                            <select
                                                className={`form-select ${!isMedicineValid[index] ? 'is-invalid' : ''}`}
                                                value={med.medicine_id}
                                                style={{width: "100%"}}
                                                onChange={(e) => {
                                                    handleMedicineChange(index, 'medicine_id', e.target.value);
                                                    const updatedValidity = [...isMedicineValid];
                                                    updatedValidity[index] = e.target.value !== "0";
                                                    setIsMedicineValid(updatedValidity);
                                                }}
                                            >
                                                <option value="">Select Medicine</option>
                                                {medicines.map((medicine) => (
                                                    <option key={medicine.medicine_id} value={medicine.medicine_id}>
                                                        {medicine.medicine_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                className={`form-control ms-2 ${!isQuantityValid[index] ? 'is-invalid' : ''}`}
                                                style={{width: "25%"}}
                                                value={med.quantity}
                                                onChange={(e) => {
                                                    const quantityValue = Number(e.target.value);
                                                    handleMedicineChange(index, 'quantity', quantityValue);
                                                    const updatedValidity = [...isQuantityValid];
                                                    updatedValidity[index] = quantityValue > 0;
                                                    setIsQuantityValid(updatedValidity);
                                                }}
                                            />
                                            <button className="btn btn-danger ms-2"
                                                    onClick={() => handleRemoveMedicine(index)}>
                                                X
                                            </button>
                                        </div>
                                            <div className="mb-2">
                                                <div className="row">
                                                    <div className="col">
                                                        <label style={{fontSize: "16px"}}>Sáng</label>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${!isInstructionValid[index] ? 'is-invalid' : ''}`}
                                                            placeholder="0"
                                                            onChange={(e) => handleInstructionChange(index, 'morning', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col">
                                                        <label style={{fontSize: "16px"}}>Trưa</label>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${!isInstructionValid[index] ? 'is-invalid' : ''}`}
                                                            placeholder="0"
                                                            onChange={(e) => handleInstructionChange(index, 'noon', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col">
                                                        <label style={{fontSize: "16px"}}>Chiều</label>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${!isInstructionValid[index] ? 'is-invalid' : ''}`}
                                                            placeholder="0"
                                                            onChange={(e) => handleInstructionChange(index, 'evening', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="btn btn-secondary mb-2" onClick={handleAddMedicine}>
                                    Add Medicine
                                </button>
                                {prescription && prescription.medicines.length > 0 && (
                                <div className="mb-3">
                                    <label className="form-label-koi">Instructions</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={prescription?.instruction || ''}
                                        onChange={(e) => setPrescription(prescription ? {
                                            ...prescription,
                                            instruction: e.target.value
                                        } : null)}
                                    />
                                </div>
                                )}
                                <div className="modal-footer">
                                    <button className="btn btn-primary" onClick={handleCreateReport} disabled={!isFormValid}>
                                        Save Report
                                    </button>
                                    <button className="btn btn-secondary" onClick={toggleReportModal}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateMedicalReport;
