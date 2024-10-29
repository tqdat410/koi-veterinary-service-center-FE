import defaultImage from "../../assets/images/defaultImage.jpg"
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useAuth } from "../../hooks/context/AuthContext";
import {getUserInfo, updateUserAddressAPI, updateUserInfoAPI, updateUserAvatarAPI} from "../../api/authService"; // Import authService functions
import { Link,useNavigate } from "react-router-dom";
import '../../styles/Profile.css'
import { Tooltip } from '@mui/material';
import {IMAGE_API} from "../../api/baseApi"


interface UserAddress {
    address_id:number;
    district: string;
    city: string;
    ward: string;
    home_number: string;
}


interface UserData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    avatar?: string;
    // address: UserAddress;
}

const Profile: React.FC = () => {
    const { user  } = useAuth(); // Use Auth context to get userId
    const userId = user?.userId;
    const roleId = user?.roleId;

    const [userData, setUserData] = useState<UserData | null>(null);
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [phone_number, setPhone] = useState("");

    const [errorPhone, setErrorPhone] = useState("");
    const [errorAddress, setErrorAddress] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);



    // Fetch user data from API on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {

                if (userId) {
                    const user = await getUserInfo(userId);
                    setUserData(user);
                    setFirstname(user.first_name || '');
                    setLastname(user.last_name || '');
                    setPhone(user.phone_number || '');

                    if (user.avatar) {
                        setSelectedImage(`${IMAGE_API}/${user.avatar}`);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    // Handle image upload
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Để hiển thị hình ảnh ngay lập tức
            updateAvatar(file); // Gọi hàm cập nhật avatar
        }
    };

    const updateAvatar = async (image: File) => {
        if (userId) {
            try {
                setIsUploading(true);
                await updateUserAvatarAPI(userId, image); // Gọi hàm API cập nhật avatar
                alert("Avatar updated successfully!");
                // Có thể gọi lại API để lấy lại thông tin người dùng mới nếu cần
            } catch (error) {
                console.error('Failed to update avatar:', error);
                alert("Failed to update avatar.");
            } finally {
                setIsUploading(false); // Stop loading
            }
        }
    };

    // Validate phone number
    const validatePhone = () => {
        const phonePattern = /^[0-9]{10}$/;
        if (phone_number.trim() !== "" && !phonePattern.test(phone_number)) {
            setErrorPhone("Contact number must be a 10-digit number.");
        } else {
            setErrorPhone("");
        }
    };


    // Handle saving updated user info
    const handleSave = async () => {
        if (errorPhone) return;
        try {
            const updatedData = {
                first_name,
                last_name,
                phone_number,

            };
            if (userId) {
                await updateUserInfoAPI(userId, updatedData); // Use authService function
                console.log("User profile updated successfully!");

                alert('User data updated successfully!');
            }
        } catch (error) {
            console.error('Failed to update user data:', error);
        }
    };

    // Handle cancel action to reset form values to original state
    const handleCancel = () => {
        if (userData) {
            setFirstname(userData.first_name || '');
            setLastname(userData.last_name || '');
            setPhone(userData.phone_number || '');

        }
    };

    const canEditProfile = roleId === 'CUS' || roleId === 'MAN';

    return (
        <div className="d-flex profile-page" style={{ marginLeft: '272px' }}>
            <Sidebar />

            <div className="flex-grow-1 bg-light" style={{ height: '100vh' }}>

                <div className="profile-container">
                    <div className="image-section">
                        <div className="image-background">
                            <img
                                src={selectedImage || defaultImage}
                                alt="User Avatar"
                                className="uploaded-image"
                            />
                        </div>
                        {canEditProfile &&(
                        <label className="upload-btn btn-shadow">
                            {selectedImage ? "Change Image" : "Choose Image"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                            )}
                    </div>
                    <div className="form-section">
                        <form className="profile-form">
                            <h2 className="text-start"
                                style={{
                                    fontWeight: "bold",
                                    color: "#02033B",
                                    fontSize: "2.4rem",
                                    marginBottom:"0px"

                                }}>Profile</h2>
                            <div className="form-group">
                                <label className="fw-bold">Username</label>

                                <Tooltip title="You cannot change username" placement="top" arrow>
                                    <input
                                        type="text"
                                        className="form-control input-field"
                                        value={userData?.username}
                                        readOnly
                                    />
                                </Tooltip>
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Email</label>
                                <Tooltip title="You cannot change email" placement="top" arrow>
                                    <input
                                        type="email"
                                        className="form-control input-field"
                                        value={userData?.email}
                                        readOnly
                                    />
                                </Tooltip>

                            </div>
                            <div className="name-row">
                                <div className="form-group">
                                    <label className="fw-bold">First Name</label>

                                    <input type="text" className="form-control input-field" value={first_name}
                                           onChange={e => setFirstname(e.target.value)} readOnly={!canEditProfile}/>
                                </div>
                                <div className="form-group">
                                    <label className="fw-bold">Last Name</label>
                                    <input type="text" className="form-control input-field" value={last_name}
                                           onChange={e => setLastname(e.target.value)} readOnly={!canEditProfile}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Contact Number</label>
                                <input type="text" className="form-control input-field" value={phone_number}
                                       onChange={e => setPhone(e.target.value)} onBlur={validatePhone}
                                       readOnly={!canEditProfile}/>
                                {errorPhone && <div className="error-register">{errorPhone}</div>}
                            </div>

                            {/* Conditionally render address management or address form based on role */}
                            {roleId === 'CUS' || roleId === 'MAN' ? (
                                <div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/address/my-address`)}
                                    >
                                        Address Management
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="address-row">
                                        <div className="form-group">
                                            <label className="fw-bold">District</label>
                                            <input type="text" className="form-control input-field" readOnly/>
                                        </div>
                                        <div className="form-group">
                                            <label className="fw-bold">City</label>
                                            <input type="text" className="form-control input-field" readOnly/>
                                        </div>
                                    </div>
                                    <div className="address-row">
                                        <div className="form-group">
                                            <label className="fw-bold">Ward</label>
                                            <input type="text" className="form-control input-field" readOnly/>
                                        </div>
                                        <div className="form-group">
                                            <label className="fw-bold">Home Number</label>
                                            <input type="text" className="form-control input-field" readOnly/>
                                        </div>
                                    </div>

                                </>
                            )}

                            <div className="button-group">
                                <div className="left-buttons">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => navigate(`/password-change`)}
                                    >
                                        Change Password
                                    </button>

                                </div>
                                <div className="right-buttons">
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

export default Profile;
