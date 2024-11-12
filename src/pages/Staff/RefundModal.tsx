import React, { useState } from 'react';
import { addVoucher } from '../../api/voucherApi'; // Ensure this path matches your structure
import { refundPayment } from '../../api/paymentApi'; // Ensure this path matches your structure

interface RefundModalProps {
    appointmentId: number;
    isOpen: boolean;
    onClose: () => void;
    onRefundSuccess: () => void; // Callback to be executed after a successful refund
    customerId: number;
}

const RefundModal: React.FC<RefundModalProps> = ({ appointmentId, customerId, isOpen, onClose, onRefundSuccess }) => {
    const [payment_amount, setAmount] = useState<number | string>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('CASH');
    const [description, setDescription] = useState('');
    const [isGiftVoucher, setIsGiftVoucher] = useState(false);
    const [transaction_id, setTransactionId] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); // Track if form has been submitted

    const handleRefund = async () => {
        setIsSubmitted(true); // Mark the form as submitted

        const confirmUpdate = window.confirm('Are you sure you want to update the payment status to REFUND?');
        if (confirmUpdate) {
            // Validation checks
            if (typeof payment_amount === 'number' && payment_amount <= 0) {
                return; // Do not proceed, already alerting the user
            }
            if (selectedPaymentMethod === 'VN_PAY' && !transaction_id) {
                return; // Do not proceed, already alerting the user
            }

            try {
                // If the gift voucher option is selected, call the addVoucher API
                if (isGiftVoucher) {
                    await addVoucher(customerId, 1); // Assuming 1 is the default voucher ID
                }

                // Call the refundPayment function
                const updatedPayment = await refundPayment(appointmentId, {
                    payment_amount,
                    payment_method: selectedPaymentMethod,
                    description,
                    ...(selectedPaymentMethod === 'VN_PAY' && { transaction_id })
                });

                // If successful, invoke the onRefundSuccess callback
                onRefundSuccess();
                onClose(); // Close the modal after successful refund
            } catch (error) {
                console.error('Error during refund:', error);
                alert('Error processing the refund. Please try again.');
            }
        }
    };

    if (!isOpen) return null; // Do not render if modal is not open

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Update Refund</h2>
                    <span className="close-icon" onClick={onClose}>&times;</span>
                </div>
                <div className="modal-body" style={{ marginLeft: '3%' }}>
                    <div className="d-flex align-content-center gap-3">
                        <div className="form-group mb-2">
                            <label className="fw-bold" style={{ fontSize: "16px" }}>Payment amount:</label>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={payment_amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className={`form-control mb-2 ${isSubmitted && (payment_amount === '' || Number(payment_amount) <= 0) ? 'is-invalid' : ''}`}
                                style={{ width: "15vw" }}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <label className="fw-bold" style={{ fontSize: "16px" }}>Payment Method:</label>
                            <select
                                className="form-select"
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                style={{ width: "12vw" }}
                            >
                                <option value="CASH">CASH</option>
                                <option value="VN_PAY">VN_PAY</option>
                            </select>
                        </div>
                        {selectedPaymentMethod === 'VN_PAY' && (
                            <div className="form-group mb-2">
                                <label className="fw-bold" style={{ fontSize: "16px" }}>Transaction ID:</label>
                                <input
                                    type="text"
                                    placeholder="Transaction ID"
                                    value={transaction_id}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className={`form-control ${isSubmitted && !transaction_id && selectedPaymentMethod === 'VN_PAY' ? 'is-invalid' : ''}`}
                                    style={{ width: "15vw" }}
                                />
                            </div>
                        )}
                    </div>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-control mb-2"
                    />
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="giftVoucher"
                            checked={isGiftVoucher}
                            onChange={() => setIsGiftVoucher(!isGiftVoucher)}
                            className="form-check-input"
                        />
                        <label className="form-check-label" htmlFor="giftVoucher">
                            Gift Voucher
                        </label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={handleRefund}>Refund</button>
                </div>
            </div>
        </div>
    );
};

export default RefundModal;
