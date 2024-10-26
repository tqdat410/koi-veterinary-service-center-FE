import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import '../../styles/Profile.css'
import { getStaffDetailsById, modifyStaffStatus, updateStaffProfile } from "../../api/staffApi";


// Define interfaces for user data

interface StaffData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    enable: boolean; // Thêm thuộc tính enabled
}

const StaffProfile: React.FC = () => {
    const location = useLocation();
    const userId = location.state?.userId;
    const [StaffData, setStaffData] = useState<StaffData | null>(null);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [enabled, setEnabled] = useState<boolean>(); // Khởi tạo đúng kiểu dữ liệu boolean

    const navigate = useNavigate();

    // Fetch user data from API on component mount
    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const staff = await getStaffDetailsById(userId); // Call authService function
                setStaffData(staff);
                setEnabled(staff.enable); // Lấy trạng thái enabled từ dữ liệu
                setFirstname(staff.first_name || '');
                setLastname(staff.last_name || '');
                setPhone(staff.phone_number || '');
                setEmail(staff.email || '');
                if(staff.avatar){
                    setSelectedImage(staff.avatar);
                }
                console.log(staff)
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchStaffData();
    }, [userId]);

    // Handle image upload
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);  // Append file image
            formData.append('user_id', userId);  // Append user ID
            
            try {
                const response = await axios.put('http://localhost:8080/api/v1/users/avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const updatedUser = response.data;  // Response will contain updated user data
                setSelectedImage(URL.createObjectURL(file));  // Update the UI with the new image
                console.log('Avatar updated successfully:', updatedUser);
            } catch (error) {
                console.error('Failed to update avatar:', error);
                alert('Failed to update avatar. Please try again.');
            }
        }
    };

    // Validate phone number
    const validatePhone = () => {
        const phonePattern = /^[0-9]{10}$/;
        if (phone.trim() !== "" && !phonePattern.test(phone)) {
            setErrorPhone("Contact number must be a 10-digit number.");
        } else {
            setErrorPhone("");
        }
    };

    //Validate email
    const validateEmail = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email.trim() !== "" && !emailPattern.test(email)) {
            setErrorPhone("Email is not valid, must have @ and '.' .");
        } else {
            setErrorPhone("");
        }
    };

    // Handle save action to update user data
    const handleSave = async () => {
        if (errorPhone || errorEmail) return;

        // Hiển thị cảnh báo khi người dùng nhấn nút "Save"
        const isConfirmed = window.confirm("Are you sure you want to save changes? This action will update the user data.");

        if (!isConfirmed) {
            // Nếu người dùng chọn "Cancel" trong cảnh báo, dừng quá trình lưu
            return;
        }

        try {
            const updatedData = {
                first_name: firstname,
                last_name: lastname,
                phone_number: phone,
                email: email
            };
            if (userId) {
                await updateStaffProfile(userId, updatedData); // Gọi hàm updateStaffProfile từ staffApi
                setEmail(email); // Cập nhật email              
                console.log("User StaffProfile updated successfully!");
                alert('User data updated successfully!');
            }
        } catch (error) {
            alert('Failed to update user data. Please try again later.');
            console.error('Failed to update user data:', error);
        }
    };

    // Function to change user status
    const handleChangeStatus = async () => {
        const isConfirmed = window.confirm("Are you sure you want to change this user's status?");
        if (!isConfirmed) return;
    
        try {
            await modifyStaffStatus(userId, !enabled); // Truyền giá trị enable mới (đảo ngược)
            setEnabled(prev => !prev); // Cập nhật trạng thái trên frontend
            alert('User status updated successfully!');
        } catch (error) {
            alert('Failed to update user status. Please try again later.');
            console.error('Failed to update user status:', error);
        }
    };
    

    // Handle cancel action to reset form values to original state
    const handleCancel = () => {
        if (StaffData) {
            setFirstname(StaffData.first_name || '');
            setLastname(StaffData.last_name || '');
            setPhone(StaffData.phone_number || '');
            return;
        }
    };


    return (
        <div className="d-flex profile-page flex-grow-1 gap-3" style={{marginLeft: '272px'}}>
            <Sidebar/>

            <div className="flex-grow-1 bg-light" style={{height: '100vh'}}>

                <div className="profile-container">
                    <div className="image-section">
                        <div className="image-background">
                            {selectedImage ? (

                                <img src={selectedImage} alt="Uploaded" className="uploaded-image"/>
                            ) : (
                                <div className="image-placeholder">No Image Selected</div>
                            )}
                        </div>
                        <label className="upload-btn">
                            {selectedImage ? "Change Image" : "Choose Image"}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}

                                style={{display: 'none'}}
                            />
                        </label>

                    </div>
                    <div className="form-section">
                        <form className="profile-form">
                            <div className="form-group">
                                <label className="fw-bold">Username</label>
                                <input type="text" className="form-control input-field"
                                       value={StaffData?.username || 'Loading...'} readOnly/>
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Email</label>
                                <input type="email" className="form-control input-field" value={email}
                                       onChange={e => setEmail(e.target.value)} onBlur={validateEmail}/>
                                {errorEmail && <div className="error-register">{errorEmail}</div>}
                            </div>
                            <div className="name-row">
                                <div className="form-group">
                                    <label className="fw-bold">First Name</label>

                                    <input type="text" className="form-control input-field" value={firstname}
                                           onChange={e => setFirstname(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label className="fw-bold">Last Name</label>
                                    <input type="text" className="form-control input-field" value={lastname}
                                           onChange={e => setLastname(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Contact Number</label>
                                <input type="text" className="form-control input-field" value={phone}
                                       onChange={e => setPhone(e.target.value)} onBlur={validatePhone}/>
                                {errorPhone && <div className="error-register">{errorPhone}</div>}
                            </div>

                            <div className="form-group">
                                <label className="fw-bold">Status: {StaffData?.enable}</label>
                                <p>{enabled ? "Enabled" : "Disabled"}</p> {/* Hiển thị trạng thái */}
                            </div>

                            <div className="button-group">
                                <div className="left-buttons">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleChangeStatus}
                                        style={{backgroundColor: enabled ? 'green' : 'red', marginTop: '10px'}}
                                    >
                                        {enabled ? "Disable" : "Enable"} {/* Thay đổi text nút */}
                                    </button>

                                </div>
                                <div className="right-buttons">
                                    <button type="button" className="btn btn-dark" onClick={() => navigate(-1)}>Back
                                    </button>
                                    <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                    <button type="button" className="save-btn" onClick={handleSave}>Save</button>
                                </div>


                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StaffProfile;
