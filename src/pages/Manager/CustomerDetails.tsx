import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useLocation } from "react-router-dom";
import { getUserProfile } from "../../api/customerApi"; // Import the API function
import '../../styles/Profile.css';
import { useNavigate } from 'react-router-dom';
import defaultImage from "../../assets/images/defaultImage.jpg"
import {IMAGE_API} from "../../api/baseApi"
interface CustomerAddress {
    district: string;
    city: string;
    ward: string;
    home_number: string;
}

interface CustomerData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: CustomerAddress;
    avatar?: string;
}

const CustomerDetails: React.FC = () => {
    const location = useLocation();
    const { userID } = location.state; // Corrected to match your previous passing state
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [ward, setWard] = useState("");
    const [homeNumber, setHomeNumber] = useState("");
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    useEffect(() => {
        const fetchCustomerInfo = async () => {
            try {
                const customer = await getUserProfile(userID); // Call API with correct userID
                setCustomerData(customer);
                // Populate individual state fields after fetching
                setFirstname(customer.first_name);
                setLastname(customer.last_name);
                setPhone(customer.phone_number);
                setDistrict(customer.address?.district || '');
                setCity(customer.address?.city || '');
                setWard(customer.address?.ward || '');
                setHomeNumber(customer.address?.home_number || '');
                if (customer.avatar) {
                    setSelectedImage(`${IMAGE_API}/${customer.avatar}`);
                }
            } catch (error) {
                console.error('Failed to fetch customer data:', error);
            }
        };

        fetchCustomerInfo();
    }, [userID]);

    return (
        <div className="d-flex profile-page flex-grow-1 gap-3" style={{ marginLeft: '272px' }}>
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
                    </div>

                    <div className="form-section">
                        <form className="profile-form">
                            <div className="form-group">
                                <label className="fw-bold">Username</label>
                                <input type="text" className="form-control input-field"
                                    value={customerData?.username || 'Loading...'} readOnly />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Email</label>
                                <input
                                    type="email"
                                    className="form-control input-field"
                                    value={customerData?.email || 'Loading...'}
                                    readOnly
                                />
                            </div>
                            <div className="name-row">
                                <div className="form-group">
                                    <label className="fw-bold">First Name</label>
                                    <input type="text" className="form-control input-field" value={firstname}
                                        readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="fw-bold">Last Name</label>
                                    <input type="text" className="form-control input-field" value={lastname}
                                        readOnly />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Contact Number</label>
                                <input type="text" className="form-control input-field" value={phone}
                                    readOnly />
                            </div>

                            <div className="address-row">
                                <div className="form-group">
                                    <label className="fw-bold">District</label>
                                    <input type="text" className="form-control input-field" value={district}
                                        readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="fw-bold">City</label>
                                    <input type="text" className="form-control input-field" value={city}
                                        readOnly />
                                </div>
                            </div>
                            <div className="address-row">
                                <div className="form-group">
                                    <label className="fw-bold">Ward</label>
                                    <input type="text" className="form-control input-field" value={ward}
                                        readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="fw-bold">Home Number</label>
                                    <input type="text" className="form-control input-field" value={homeNumber}
                                        readOnly />
                                </div>
                            </div>
                        </form>
                        <button
                            onClick={() => navigate(-1)} className="btn btn-secondary mb-3"
                            style={{ width: '100px', marginTop: '1rem' }}
                        >
                            Back
                        </button>
                        {/* Nút Back */}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CustomerDetails;
