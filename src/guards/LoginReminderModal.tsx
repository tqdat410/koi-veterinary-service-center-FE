import React from 'react';

interface LoginReminderModalProps {
    show: boolean;
    onClose: () => void;
}

const LoginReminderModal: React.FC<LoginReminderModalProps> = ({ show, onClose }) => {
    return (
        <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-2 fw-bold text-danger">Login Required !!</h5>
                        <button type="button" className="close border-0 fs-1" onClick={onClose} aria-label="Close"  style={{
                            fontSize: '2rem', // Tăng kích thước chữ cho dấu X
                            padding: '0.5rem 1rem', // Thêm khoảng cách cho nút
                            background: 'none', // Bỏ nền nếu có
                            border: 'none', // Bỏ viền
                        }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body mt-3">
                        <p className="fs-4">You are not logged in! Please login to access this page.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginReminderModal;
