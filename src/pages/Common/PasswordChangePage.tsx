import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import '../../styles/Profile.css';
import { changePassword } from '../../api/authService';
import {useAuth} from "../../hooks/context/AuthContext";

const PasswordChangePage: React.FC = () => {
    const { user  } = useAuth(); // Use Auth context to get userId
    const userId = user?.userId;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Regex for password validation
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // Validate passwords
    const validatePasswords = () => {
        if (!newPassword || !currentPassword) {
            setError('Please fill in all fields.');
            return false;
        }
        if (!passwordRegex.test(newPassword)) {
            setError('New password must be at least 8 characters long and include at least one special character.');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return false;
        }
        setError('');
        return true;
    };

    // Handle password change request
    const handlePasswordChange = async () => {
        if (validatePasswords()) {


            if (!userId) {
                setError('User ID not found. Please log in again.');
                return;
            }

            try {
                await changePassword(userId, currentPassword, newPassword);
                setSuccess('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                alert('Password changed successfully!');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError('Error changing password: ' + error.message);
                } else {
                    setError('An unknown error occurred.');
                }
                alert('Failed to change password. Please try again.');
            }
        }
    };

    return (
        <div className="d-flex" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="flex-grow-1 bg-light" style={{ height: '100vh' }}>
                <div className="profile-container profile-page">
                    <div className="form-section">
                        <form className="profile-form">
                            <div className="form-group">
                                <label className="fw-bold">Current Password</label>
                                <input type="password" className="form-control input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">New Password</label>
                                <input type="password" className="form-control input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Confirm New Password</label>
                                <input type="password" className="form-control input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            {error && <div className="error-register">{error}</div>}
                            {success && <div className="success-change">{success}</div>}
                            <div className="button-group">
                                <button type="button" className="cancel-btn">Cancel</button>
                                <button type="button" className="save-btn" onClick={handlePasswordChange}>Change Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangePage;
