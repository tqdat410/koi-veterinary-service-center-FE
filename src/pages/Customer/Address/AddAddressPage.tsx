import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { fetchDistricts, addAddress } from '../../../api/addressApi';
import { useAuth } from "../../../hooks/context/AuthContext";
import "../../../styles/AddKoiFish.css"
import Sidebar from "../../../components/layout/Sidebar";
interface District {
    moving_surcharge_id: number;
    district: string;
}

const AddAddress: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.userId;
    const location = useLocation();
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [ward, setWard] = useState<string>("");
    const [homeNumber, setHomeNumber] = useState<string>("");
    const [error, setError] = useState<boolean>(false); // State to track if there is an error

    // Fetch Districts using API
    useEffect(() => {
        const getDistricts = async () => {
            try {
                const response = await fetchDistricts();
                setDistricts(response);
            } catch (error) {
                alert("Failed to fetch districts");
            }
        };

        getDistricts();
    }, []);

    // Handle Save (Add Address)
    const handleAdd = async () => {
        // Check for empty fields
        if (!selectedDistrict || !ward || !homeNumber) {
            alert("Phải nhập tất cả các field");
            setError(true); // Set error state to true
            return;
        }

        const newAddress = {
            district: selectedDistrict,
            city: "Hồ Chí Minh",
            ward,
            home_number: homeNumber,
        };

        if (userId) {
            try {
                await addAddress(newAddress);
                alert("Address added successfully!");
                navigate(location.state?.from ||'/addresses');
            } catch (error) {
                alert("Failed to add address");
            }
        } else {
            alert('User ID is not available');
        }
    };

    // Handle Cancel
    const handleCancel = () => {
        setSelectedDistrict("");
        setWard("");
        setHomeNumber("");
        setError(false); // Reset error state on cancel
    };
    const handleBack = () => {
        window.history.back();
    };
    return (
        <div className="d-flex flex-grow-1 gap-3" style={{marginLeft: '272px'}}>
            <Sidebar/>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
                {/*<button className="btn btn-secondary back-button" onClick={handleBack}>*/}
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

                                }}>Add Address</h2>
                            {/* District Select */}
                            <div className="mb-3">
                                <label className="form-label-koi ">District</label>
                                <select
                                    className={`form-control input-field-koi ${error && !selectedDistrict ? 'border-danger' : ''}`}
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
                                <label className="form-label-koi ">City</label>
                                <select className="form-control" value="Hồ Chí Minh" disabled>
                                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                </select>
                            </div>

                            {/* Ward */}
                            <div className="mb-3">
                                <label className="form-label-koi ">Ward</label>
                                <input
                                    type="text"
                                    name="ward"
                                    className={`form-control input-field-koi ${error && !ward ? 'border-danger' : ''}`}
                                    value={ward}
                                    onChange={(e) => setWard(e.target.value)}
                                />
                            </div>

                            {/* Home Number */}
                            <div className="mb-3">
                                <label className="form-label-koi ">Home Number</label>
                                <input
                                    type="text"
                                    name="home_number"
                                    className={`form-control input-field-koi ${error && !homeNumber ? 'border-danger' : ''}`}
                                    value={homeNumber}
                                    onChange={(e) => setHomeNumber(e.target.value)}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-3">
                                <button className="btn btn-primary" onClick={handleAdd}>Add Address</button>
                                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            );
            };

            export default AddAddress;
