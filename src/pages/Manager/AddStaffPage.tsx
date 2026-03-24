import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStaff } from '../../api/staffApi';
import Sidebar from "../../components/layout/Sidebar";

const AddStaffPage: React.FC = () => {
    const navigate = useNavigate();
    const [staffData, setStaffData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        phoneNumber: '',
        password: ''
    });
    const [error, setError] = useState<boolean>(false); // State to track if there is an error
    const [passwordError, setPasswordError] = useState<boolean>(false); // State to track password error

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStaffData({
            ...staffData,
            [e.target.name]: e.target.value,
        });
    };


    const validatePassword = (password: string) => {
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Kiểm tra ký tự đặc biệt
        return password.length >= 8 && hasSpecialChar;
    };

    const handleSave = async () => {
        if (!staffData.firstName || !staffData.lastName || !staffData.username || !staffData. password ) {
            alert("Must input all field!");
            setError(true); // Set error state to true
            return;
        }
        if (!validatePassword(staffData.password)) {
            // alert("Password must be at least 8 characters long and include at least one special character.");
            setPasswordError(true); // Set password error state to true
            return;
        }

        setPasswordError(false); // Reset lỗi nếu password hợp lệ

        const confirmSave = window.confirm("Save the new staff?"); // Confirm before saving
        if (!confirmSave) {
            return; // Nếu người dùng chọn "Cancel", thoát khỏi hàm mà không thực hiện lưu
        }
        const newStaff = {
            first_name: staffData.firstName,
            last_name: staffData.lastName,
            username: staffData.username,
            // phone_number: staffData.phoneNumber,
            password: staffData.password
        }
        try {
            await createStaff(newStaff);
            // thêm điều kiện trước khi lưu, xác nhận lưu hay ko            
            navigate('/manager/staff-list'); // Go back to the staff list page after saving
        } catch (error) {
            console.error('Failed to save staff', error);
        }
    };

    const handleCancel = () => {
        navigate('/manager/staff-list'); // Go back to the staff list page without saving
    };

    return (
        <div className="d-flex flex-grow-1 gap-3" style={{marginLeft: '272px'}}>
            <Sidebar/>
            <div className="container" style={{marginTop: "6rem"}}>
                <div className="card mx-auto" style={{width: '50%', maxWidth: '600px', borderRadius: '40px'}}>
                    <div className="card-header">
                        <h5 className="text-start"
                            style={{fontWeight: "bold", color: "#02033B", fontSize: "2rem", padding: "1.2rem"}}>
                            Add New Staff
                        </h5>
                    </div>
                    <div className="card-body">
                        <form className="add-staff-form">
                            <div className=" row">
                                <label htmlFor="firstName" className="col-sm-3 col-form-label text-end">First
                                    Name</label>
                                <div className="col-sm-6 mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        name="firstName"
                                        value={staffData.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter First Name"
                                    />
                                </div>
                            </div>
                            <div className=" row">
                                <label htmlFor="lastName" className="col-sm-3 col-form-label text-end">Last Name</label>
                                <div className="col-sm-6 mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        name="lastName"
                                        value={staffData.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter Last Name"
                                    />
                                </div>
                            </div>
                            <div className=" row">
                                <label htmlFor="username" className="col-sm-3 col-form-label text-end">Username</label>
                                <div className="col-sm-6 mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        name="username"
                                        value={staffData.username}
                                        onChange={handleChange}
                                        placeholder="Enter Username"
                                    />
                                </div>
                            </div>
                            <div className=" row">
                                <label htmlFor="password" className="col-sm-3 col-form-label text-end">Password</label>
                                <div className="col-sm-6 mb-3">
                                    <input
                                        type="password"
                                        className={`form-control ${passwordError ? 'is-invalid' : ''}`} // Thêm class 'is-invalid' nếu có lỗi
                                        id="password"
                                        name="password"
                                        value={staffData.password}
                                        onChange={handleChange}
                                        placeholder="Enter Password"
                                    />
                                    {passwordError && (
                                        <small className="text-danger">
                                            Password must be at least 8 characters long and include at least one special
                                            character.
                                        </small>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex-end justify-content mt-4">
                                <button type="button" style={{marginLeft: '16px'}} className="btn btn-primary"
                                        onClick={handleSave}>
                                    Save
                                </button>
                                <button type="button" style={{marginLeft: '16px'}} className="btn btn-secondary"
                                        onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
            );
            };

            export default AddStaffPage;
