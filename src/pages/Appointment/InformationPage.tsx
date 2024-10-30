import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/Profile.css';
import { useAuth } from "../../hooks/context/AuthContext";
import { fetchAddresses } from "../../api/addressApi";
import { fetchFishes } from "../../api/koiApi";
import { getUserInfo } from "../../api/authService";
import {useLocation, useNavigate} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setForm } from '../../store/actions';


const FillInformationPage: React.FC = () => {
    const { user } = useAuth(); // Use Auth context to get userId
    const userId = user?.userId;
    const navigate = useNavigate();
    const location = useLocation();
    const [fishes, setFishes] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [serviceLocation, setServiceLocation] = useState<string>('at_home');
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [selectedFish, setSelectedFish] = useState<string>("");
    const service = useSelector((state: any) => state.service);
    const slotDate = useSelector((state: any) => state.slot);
    const dispatch = useDispatch();

    const [error, setError] = useState<string | null>(null);
    const [errorPhone, setErrorPhone] = useState<string>('');
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [errorName, setErrorName] = useState<string>('');

    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        email: '',
        address:null as string | null,
        fish: '',
        description: '',
        payment_method: 'VN_PAY', // Default to online payment if service_id is 1
        address_id: null as number | null,
        fish_id: null as number | null,
        district: null as string | null,
    });

    // Validation states
    const [validity, setValidity] = useState({
        name: true,
        phone: true,
        email: true,
        address: true,
        fish: true,
    });



    useEffect(() => {
        // If service is null, navigate to service selection
        if (!service) {
            alert("You need to choose a service first!");
            navigate('/appointment/service-selection');
        }
        // If service is present but slotDate is null, navigate to slot date selection
        else if (!slotDate) {
            alert("You should choose a slot first!");
            navigate('/appointment/slot-date-selection');
        }
    }, [service, slotDate, navigate]);
    const service_id = service?.service_id;

    useEffect(() => {
        const getUserProfile = async () => {
            if (userId) {
                try {
                    const userData = await getUserInfo(userId); // Fetch user profile

                    const { address } = userData;
                    setFormData((prevData) => ({
                        ...prevData,
                        customer_name: `${userData.first_name} ${userData.last_name}`, // Combine first and last name
                        phone: userData.phone_number, // Use the user's phone number
                        email: userData.email, // Use the user's email
                        district: address?.district || null,
                        address: address ? `${address.home_number}, ${address.district}, ${address.ward}, ${address.city}` : '',
                        address_id: address?.address_id || null,
                    }));
                    if (address) {
                        setSelectedAddress(`${address.home_number}, ${address.district}, ${address.ward}, ${address.city}`);
                    } else {
                        setSelectedAddress("Select an address");
                    }
                } catch (err) {
                    setError('Failed to fetch user profile');
                } finally {
                    setLoading(false);
                }
            } else {
                setError('User ID is not available');
                setLoading(false);
            }
        };

        getUserProfile();
    }, [userId]);

    useEffect(() => {
        const getAddresses = async () => {
            if (userId) {
                try {
                    const data = await fetchAddresses(); // Gọi API để lấy danh sách địa chỉ
                    setAddresses(Array.isArray(data) ? data : []); // Cập nhật state với dữ liệu địa chỉ
                } catch (err) {
                    setError('Failed to fetch addresses');
                } finally {
                    setLoading(false); // Tắt trạng thái loading sau khi dữ liệu đã được load
                }
            } else {
                setError('User ID is not available');
                setLoading(false);
            }
        };

        getAddresses();
    }, [userId]);

    useEffect(() => {
        const getFishes = async () => {
            if (userId) {
                try {
                    const data = await fetchFishes(userId);
                    setFishes(data);
                } catch (err) {
                    setError('Failed to fetch fishes');
                } finally {
                    setLoading(false);
                }
            } else {
                setError('User ID is not available');
                setLoading(false);
            }
        };
        getFishes();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        console.log("addresses",addresses)
        const address = addresses.find(address => `${address.home_number}, ${address.district}, ${address.ward}, ${address.city}` === selectedValue);
        const addressId = address?.address_id || 0;
        setSelectedAddress(selectedValue);

        setFormData({ ...formData, address: selectedValue, district: address?.district || '', address_id: addressId });
        console.log("chon", {
            address: selectedValue,
            district: address?.district || '',
            address_id: addressId,
        });
    };

    const handleFishChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const fishId = fishes.find(fish => `${fish.species}/ ${fish.origin}/ ${fish.color} (${fish.gender})` === selectedValue)?.fish_id || 0;
        setSelectedFish(selectedValue);
        setFormData({ ...formData, fish: selectedValue, fish_id: fishId });
    };

    const validateFields = () => {
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();
        const isAddressValid =
            (service_id === 1) || // Service 1 does not need an address
            (serviceLocation === 'at_hospital' && formData.address_id === null) || // No address needed for hospital
            (serviceLocation === 'at_home' && selectedAddress.trim() !== '' && addresses.length > 0);
        const isFishValid = service_id === 1 || service_id === 2 ||  (selectedFish.trim() !== '' && formData.fish_id !== null);

        setValidity({
            name: isNameValid,
            phone: isPhoneValid,
            email: isEmailValid,
            address: isAddressValid,
            fish: isFishValid,
        });
        console.log('Validation Results:', { isNameValid, isPhoneValid, isEmailValid, isAddressValid, isFishValid });
        return isNameValid && isPhoneValid && isEmailValid && isAddressValid && isFishValid;
    };
    // Handle validation for Name
    const validateName = () => {
        if (formData.customer_name.trim() === '') {
            setErrorName('Name is required.'); // Set error message for name
            return false;
        } else {
            setErrorName(''); // Clear error if name is valid
            return true;
        }
    };

    // Handle validation for phone number
    const validatePhone = () => {
        const phoneValue = formData.phone; // Lấy giá trị điện thoại từ formData

        // Kiểm tra xem phoneValue có tồn tại và không phải là chuỗi rỗng
        if (!phoneValue || phoneValue.trim() === '') {
            setErrorPhone('Phone number is required.'); // Cài đặt thông báo lỗi nếu không có giá trị
            return false; // Trả về false nếu không hợp lệ
        }
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phoneValue)) {
            setErrorPhone('Contact number must be a 10-digit number.'); // Kiểm tra số điện thoại có đúng định dạng không
            return false; // Trả về false nếu không hợp lệ
        }

        setErrorPhone(''); // Xóa thông báo lỗi nếu hợp lệ
        return true; // Trả về true nếu hợp lệ
    };

    // Handle validation for email
    const validateEmail = () => {
        // Regex to ensure email contains "@" and at least one "." after the "@"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if the email matches the regex and does not include spaces
        if (!emailRegex.test(formData.email) || formData.email.includes(' ')) {
            setErrorEmail('Please enter a valid email.');
            return false;
        }

        setErrorEmail(''); // Clear error if email is valid
        return true;
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) {
            return; // Don't proceed with submission if any fields are invalid
        }

        // Kiểm tra điều kiện service_id
        if (service_id === 1 || (service_id === 3 && serviceLocation === "at_hospital")) {
            setFormData((prevData) => ({
                ...prevData,
                address: null,    // Đặt address thành null
                district: null,   // Đặt district thành null
                address_id: null, // Đặt address_id thành null
            }));
        }

        // Sử dụng formData đã được cập nhật
        const updatedFormData = {
            ...formData,
            address: service_id === 1 || (service_id === 3 && serviceLocation === "at_hospital") ? null : formData.address,
            district: service_id === 1 || (service_id === 3 && serviceLocation === "at_hospital") ? null : formData.district,
            address_id: service_id === 1 || (service_id === 3 && serviceLocation === "at_hospital") ? null : formData.address_id,
        };

        try {
            dispatch(setForm(updatedFormData)); // Dispatch dữ liệu đã cập nhật
            navigate('/appointment/order-confirm'); // Redirect to the order page using navigate
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    const handleBackClick = () => {
        navigate('/appointment/vet-selection'); // Navigate back to service selection page
    };

    const handleServiceLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const location = e.target.value;
        setServiceLocation(location);

        if (location === 'at_home') {
            setFormData({ ...formData, address_id: formData.address_id });
        } else {
            setSelectedAddress(""); // Clear the selected address
            setFormData({ ...formData, address: '', address_id: null }); // Set address to empty and address_id to null
        }
    };


    const handleAddFish = () => {
        dispatch(setForm(formData));
        navigate('/koi/add', { state: { from: location.pathname } });
    };

    const handleAddAddress = () => {
        dispatch(setForm(formData));
        navigate('/address/add', { state: { from: location.pathname } });
    };

    return (
        <div className="container profile-page d-flex flex-grow-1 align-items-center justify-content-center">
            <div className="form-section w-100" style={{width: "100%", maxWidth: 900}}>
                <button
                    className="btn btn-secondary mb-3"
                    style={{position: 'absolute', top: '12%', left: '3%'}}
                    onClick={handleBackClick}>
                    Back
                </button>
                <form onSubmit={handleNext} className="profile-form ">
                    <div className="row">
                        <div>
                            <h5 className="mb-3" style={{fontWeight: "bold", color: "#02033B", fontSize: "2.7rem"}}>
                                Fill Information
                            </h5>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label className="fw-bold form-label-koi">Your Name</label>
                                <input
                                    type="text"
                                    className={`form-control input-field ${!validity.name ? 'border-danger' : ''}`}
                                    name="customer_name"
                                    placeholder="Enter your name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                />
                                {errorName && <small className="text-danger">{errorName}</small>}
                            </div>

                            <div className="form-group mb-3">
                                <label className="fw-bold form-label-koi">Phone</label>
                                <input
                                    type="text"
                                    className={`form-control input-field ${!validity.phone ? 'border-danger' : ''}`}
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                {errorPhone && <small className="text-danger">{errorPhone}</small>}
                            </div>

                            <div className="form-group mb-3">
                                <label className="fw-bold form-label-koi">Email</label>
                                <input
                                    type="email"
                                    className={`form-control input-field ${!validity.email ? 'border-danger' : ''}`}
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errorEmail && <small className="text-danger">{errorEmail}</small>}
                            </div>
                            {service_id !== 1 && service_id !== 2 && (
                                <div className="form-group mb-3 position-relative">
                                    <div className="d-flex justify-content-between mb-1">
                                        <label className="fw-bold form-label-koi">Fish</label>
                                        <button type="button" className="btn btn-sm btn-primary ms-2"
                                                onClick={handleAddFish}>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div className="position-relative">
                                        <select
                                            className={`form-control input-field ${!validity.fish ? 'border-danger' : ''}`}
                                            id="fish"
                                            name="fish"
                                            value={selectedFish}
                                            onChange={handleFishChange}
                                        >
                                            <option value=""
                                                    disabled>{fishes.length ? "Select an fish" : "No fish available"}</option>
                                            {fishes.length > 0 ? (
                                                fishes.map(fish => (
                                                    <option key={fish.fish_id} value={`${fish.species}/ ${fish.origin}/ ${fish.color} (${fish.gender})`}>
                                                        {`${fish.species}/ ${fish.origin}/ ${fish.color} (${fish.gender})`}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No fishes available</option>
                                            )}
                                        </select>
                                        <i className="bi bi-chevron-down dropdown-icon"></i>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-md-6">
                            {service_id !== 1 && service_id !== 2 && (
                                <div className="form-group mb-3">

                                    <label className="fw-bold form-label-koi">Service Location</label>
                                    <div className="d-flex align-items-center">
                                        <div className="form-check me-3">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="serviceLocation"
                                                value="at_home"
                                                checked={serviceLocation === 'at_home'}
                                                onChange={handleServiceLocationChange}
                                            />
                                            <label className="form-check-label">At Home</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="serviceLocation"
                                                value="at_hospital"
                                                checked={serviceLocation === 'at_hospital'}
                                                onChange={handleServiceLocationChange}
                                            />
                                            <label className="form-check-label">At Hospital</label>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {service_id !== 1 && serviceLocation === 'at_home' && ( // Chỉ hiển thị địa chỉ khi chọn 'At Home' và service_id không phải 1
                                <div className="form-group mb-3 position-relative">
                                    <div className="d-flex justify-content-between mb-1">
                                        <label className="fw-bold form-label-koi">Address</label>
                                        <button type="button" className="btn btn-sm btn-primary ms-2"
                                                onClick={handleAddAddress}>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div className="position-relative">
                                        <select
                                            className={`form-control input-field ${!validity.address ? 'border-danger' : ''}`}
                                            id="address"
                                            name="address"
                                            value={selectedAddress}
                                            onChange={handleAddressChange}
                                        >
                                            <option value=""
                                                    disabled>{addresses.length ? "Select an address" : "No addresses available"}</option>
                                            {addresses.map((addr) => (
                                                <option
                                                    key={addr.address_id}
                                                    value={`${addr.home_number}, ${addr.district}, ${addr.ward}, ${addr.city}`}
                                                >
                                                    {addr.home_number}, {addr.district}, {addr.ward}, {addr.city}
                                                </option>
                                            ))}
                                        </select>
                                        <i className="bi bi-chevron-down dropdown-icon"></i>
                                    </div>

                                </div>
                            )}

                            <div className="form-group mb-3">
                                <label className="fw-bold form-label-koi">Description</label>
                                <textarea
                                    className="form-control input-field"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                />
                            </div>

                            <div className=" form-group mb-3">
                                <label className="fw-bold form-label-koi">Payment Method</label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="payment_method"
                                        value="VN_PAY"
                                        checked={formData.payment_method === 'VN_PAY'}
                                        onChange={handleChange}

                                    />
                                    <label className="form-check-label">Pay Online</label>
                                </div>


                                {service_id !== 1 && service_id !== 2 && serviceLocation === 'at_hospital' && (
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="payment_method"
                                            value="CASH"
                                            checked={formData.payment_method === 'CASH'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Pay with Cash</label>
                                    </div>
                                )}
                            </div>


                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">
                                    Next
                                </button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
        ;
};

export default FillInformationPage;