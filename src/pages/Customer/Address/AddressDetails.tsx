import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {fetchAddressById, updateAddressById, deleteAddress, fetchDistricts, setCurrentAddress} from "../../../api/addressApi";
import { useAuth } from "../../../hooks/context/AuthContext";
import '../../../styles/AddKoiFish.css';
import {getUserInfo} from "../../../api/authService";
import Sidebar from "../../../components/layout/Sidebar";
interface District {
    moving_surcharge_id: number;
    district: string;
}

interface Address {
    district: string;
    city: string;
    ward: string;
    home_number: string;
}

const AddressDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.userId; // Get userId from Auth context
    const addressId: number = location.state?.addressId; // Get addressId from state

    const [address, setAddress] = useState<Address | null>(null);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [ward, setWard] = useState<string>("");
    const [homeNumber, setHomeNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [errorSumbit, setErrorSumbit] = useState<boolean>(false);
    const [currentAddressId, setCurrentAddressId] = useState<number | null>(null);

    const fetchUserProfile = async () => {
        if (userId) {
            const profileData = await getUserInfo(userId); // Gọi API để lấy thông tin người dùng
            return profileData;
        }
        throw new Error('User ID is not provided');
    };

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const profileData = await fetchUserProfile();

                // Lưu address_id từ profile
                if (profileData && profileData.address && profileData.address.address_id) {
                    setCurrentAddressId(profileData.address.address_id);
                }
            } catch (error) {
                setError("Failed to fetch user profile");
            } finally {
                setLoading(false);
            }
        };

        getUserProfile();
    }, [userId]);

    // Fetch Address details by ID
    useEffect(() => {
        const getAddressDetails = async () => {
            if (userId) {
                try {
                const data = await fetchAddressById(addressId); // Pass customerId here
                setAddress(data);
                setSelectedDistrict(data.district);
                setWard(data.ward);
                setHomeNumber(data.home_number);

            } catch (error) {
                setError("Failed to fetch address details");
            } finally {
                setLoading(false);
            }
            }else {
                setError('User ID is not available');
                setLoading(false);
            }
        };

        getAddressDetails();
    }, [addressId, userId]); // Add userId as dependency

    // Fetch Districts using API
    useEffect(() => {
        const getDistricts = async () => {
            try {
                const response = await fetchDistricts();
                setDistricts(response);
            } catch (error) {
                setError("Failed to fetch districts");
            }
        };

        getDistricts();
    }, []);

    // Handle Save (Update Address)
    const handleUpdate = async () => {
        if (!selectedDistrict || !ward || !homeNumber) {
            alert("Phải nhập tất cả các field");
            setErrorSumbit(true); // Set error state to true
            return;
        }
        const updatedAddress = {
            district: selectedDistrict,
            city: "Hồ Chí Minh",
            ward,
            home_number: homeNumber,
        };
        if (userId) {
        try {
            await updateAddressById(addressId, updatedAddress); // Pass customerId here
            alert("Address updated successfully!");
            navigate('/address/my-address'); // Navigate back to address list
        } catch (error) {
            alert("Failed to update address");
        }
        }else {
            setError('User ID is not available');
            setLoading(false);
        }
    };

    // Handle Delete Address
    const handleDelete = async () => {
        if (userId) {
        try {
            await deleteAddress( addressId); // Pass customerId here
            alert("Address deleted successfully!");
            navigate('/address/my-address'); // Navigate back to address list
        } catch (error) {
            alert("You can not delete current address");
        }
        }else {
            setError('User ID is not available');
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/address/my-address');
    };

    const handleCancel = () => {
        if (address) {
            setSelectedDistrict(address.district);
            setWard(address.ward);
            setHomeNumber(address.home_number);
            setErrorSumbit(false);
        }
    };

    const handleSetCurrentAddress = async () => {
        try {
            await setCurrentAddress(addressId); // Call API to set the current address
            alert("Current address set successfully!");
            setCurrentAddressId(addressId);
        } catch (error) {
            alert("Failed to set current address");
        }
    };
    const isCurrentAddress = currentAddressId === addressId;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="d-flex flex-grow-1 gap-3" style={{marginLeft: '272px'}}>
            <Sidebar/>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
                {/*<button*/}
                {/*    className="btn btn-secondary mb-3"*/}
                {/*    style={{position: 'absolute', top: '12%', left: '3%'}}*/}
                {/*    onClick={handleBack}>*/}
                {/*    Back*/}
                {/*</button>*/}
                <div className="row w-100 h-100 d-flex justify-content-center align-items-center">

                    <div className="form-container card w-100">
                        <div className="card-body">
                            <h2 className="text-start"
                                style={{
                                    fontWeight: "bold",
                                    color: "#02033B",
                                    fontSize: "2.4rem",

                                }}>Address Details</h2>


                            {/* District Select */}
                            <div className="mb-3">
                                <label className="form-label ">District</label>
                                <select
                                    className={`form-control input-field-koi ${errorSumbit && !selectedDistrict ? 'border-danger' : ''}`}
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                >
                                    <option value="">Select a district</option>
                                    {districts.map((district) => (
                                        <option key={district.moving_surcharge_id} value={district.district}>
                                            {district.district}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* City Select */}
                            <div className="mb-3">
                                <label className="form-label ">City</label>
                                <select className="form-control" value="Hồ Chí Minh" disabled>
                                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                </select>
                            </div>

                            {/* Ward */}
                            <div className="mb-3">
                                <label className="form-label ">Ward</label>
                                <input
                                    type="text"
                                    name="ward"
                                    className={`form-control input-field-koi ${errorSumbit && !ward ? 'border-danger' : ''}`}
                                    value={ward}
                                    onChange={(e) => setWard(e.target.value)}
                                />
                            </div>

                            {/* Home Number */}
                            <div className="mb-3">
                                <label className="form-label ">Home Number</label>
                                <input
                                    type="text"
                                    name="home_number"
                                    className={`form-control input-field-koi ${errorSumbit && !homeNumber ? 'border-danger' : ''}`}
                                    value={homeNumber}
                                    onChange={(e) => setHomeNumber(e.target.value)}
                                />
                            </div>
                            {isCurrentAddress && ( // Hiển thị thông báo nếu là current address
                                <span className=" alert alert-info fw-bold "
                                      style={{display: "block", padding: "3px 10px"}}>
                                This is your current address
                            </span>
                            )}
                            {/* Action Buttons */}
                            <div className="d-flex gap-3">
                                <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
                                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                {!isCurrentAddress && (
                                    <button className="btn btn-success" onClick={handleSetCurrentAddress}>Set Current
                                        Address
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        );
      };
export default AddressDetail;
