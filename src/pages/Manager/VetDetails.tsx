import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useLocation } from "react-router-dom";
import {getUserProfile, updateUserProfile, updateUserAddress, getCertificates, uploadCertificate} from "../../api/vetApi";
import '../../styles/Profile.css';
import axios from "axios";
import {updateUserAvatarAPI} from "../../api/authService";
import defaultImage from "../../assets/images/defaultImage.jpg"
import {IMAGE_API} from "../../api/baseApi";
import { Tooltip } from '@mui/material'

interface VetAddress {
    district: string;
    city: string;
    ward: string;
    home_number: string;
}

interface VetData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: VetAddress;
    avatar?: string;
}

interface Certificate {
    certificate_id: number;
    certificate_name: string;
    file_path: string; // Assuming the response contains this field
}


const VetDetails: React.FC = () => {
    const location = useLocation();
    const { vetId } = location.state; // Get veterinarian ID passed via state
    const [vetData, setVetData] = useState<VetData | null>(null);
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [phone_number, setPhone] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [ward, setWard] = useState("");
    const [homeNumber, setHomeNumber] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorAddress, setErrorAddress] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [email, setEmail] = useState("");

    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [certificateName, setCertificateName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showCertificateDiv, setShowCertificateDiv] = useState(false);

    // Fetch veterinarian data from API on component mount
    useEffect(() => {
        const fetchVetData = async () => {
            try {
                const vet = await getUserProfile(vetId); // Call API to get vet details
                setVetData(vet);
                setFirstname(vet.first_name || '');
                setLastname(vet.last_name || '');
                setEmail(vet.email || '');
                setPhone(vet.phone_number || '');
                setDistrict(vet.address?.district || '');
                setCity(vet.address?.city || '');
                setWard(vet.address?.ward || '');
                setHomeNumber(vet.address?.home_number || '');
                if (vet.avatar) {
                    setSelectedImage(`${IMAGE_API}/${vet.avatar}`);
                }
            } catch (error) {
                console.error('Failed to fetch veterinarian data:', error);
            }
        };

        fetchVetData();
    }, [vetId]);

    // Fetch certificates from API
    const fetchCertificates = async () => {
        try {
            const fetchedCertificates = await getCertificates(vetId);
            setCertificates(fetchedCertificates);
        } catch (error) {
            console.error('Failed to fetch certificates:', error);
        }
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (!selectedFile || !certificateName) {
            alert('Please select a file and enter a certificate name.');
            return;
        }

        try {
            await uploadCertificate(vetId, certificateName, selectedFile);
            alert('Certificate uploaded successfully!');
            setSelectedFile(null); // Reset file đã chọn
            setCertificateName(''); // Reset tên chứng chỉ
            // Fetch the updated list of certificates
            fetchCertificates();
            window.location.reload();
        } catch (error) {
            console.error('Failed to upload certificate:', error);
        }
    };




    // Handle file download
    const token = localStorage.getItem("token")
    const handleDownload = async (filePath: string) => {
        console.log(filePath)
        try {
            const response = await axios.get(filePath, {
                responseType: 'blob',
                withCredentials: true,
                headers: {
                Authorization: `Bearer ${token}`,
            },
            });


            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filePath.split('/').pop() || 'certificate'); // Filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error: any) {
            console.error('Failed to download the file:', error.response ? error.response.data : error.message);
            alert('You need to log in to download this file.');
        }
    };



    // Handle image upload
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Để hiển thị hình ảnh ngay lập tức
            updateAvatar(file); // Gọi hàm cập nhật avatar
        }
    };

    const updateAvatar = async (image: File) => {
        if (vetId) {
            try {
                await updateUserAvatarAPI(vetId, image); // Gọi hàm API cập nhật avatar
                alert("Avatar updated successfully!");
                // Có thể gọi lại API để lấy lại thông tin người dùng mới nếu cần
            } catch (error) {
                console.error('Failed to update avatar:', error);
                alert("Failed to update avatar.");
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

    // Validate address fields
    const validateAddress = () => {
        const addressFieldsFilled = [district, city, ward, homeNumber].some(field => field.trim() !== "");
        const allAddressFieldsFilled = [district, city, ward, homeNumber].every(field => field.trim() !== "");

        if (addressFieldsFilled && !allAddressFieldsFilled) {
            setErrorAddress("Please fill all address fields if you enter one.");
            return false;
        } else {
            setErrorAddress("");
            return true;
        }
    };

    // Handle saving updated veterinarian profile and address info
    const handleSave = async () => {
        validatePhone();
        const isAddressValid = validateAddress();

        if (errorPhone || !isAddressValid) return;

        try {
            const updatedProfileData = {
                first_name,
                last_name,
                phone_number,
                email,
                avatar: selectedImage,
            };

            await updateUserProfile(vetId, updatedProfileData);


            const addressData = { district, city, ward, homeNumber };
            const anyAddressFieldFilled = [district, city, ward, homeNumber].some(field => field.trim() !== "");

            if (anyAddressFieldFilled) {
                await updateUserAddress(vetId, addressData); // Call the update address API
            }

            alert('Veterinarian profile updated successfully!');
        } catch (error) {
            console.error('Failed to update veterinarian data:', error);
        }
    };

    // Handle cancel action to reset form values to original state
    const handleCancel = () => {
        if (vetData) {
            setFirstname(vetData.first_name || '');
            setLastname(vetData.last_name || '');
            setEmail(vetData.email || '');
            setPhone(vetData.phone_number || '');
            setDistrict(vetData.address?.district || '');

            setCity(vetData.address?.city || '');
            setWard(vetData.address?.ward || '');
            setHomeNumber(vetData.address?.home_number || '');
            setSelectedImage(`${IMAGE_API}/${vetData.avatar}` || null);
        }
    };
    // Show/hide certificate input div

    const toggleCertificateDiv = () => {
        setShowCertificateDiv(!showCertificateDiv);
        if (!showCertificateDiv) {
            fetchCertificates(); // Fetch certificates when opening the modal
        }
    };



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
                        <label className="upload-btn">
                            {selectedImage ? "Change Image" : "Choose Image"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{display: 'none'}}
                            />
                        </label>
                        <button className="btn btn-success" onClick={toggleCertificateDiv}>
                            Certificate
                        </button>
                    </div>

                    <div className="form-section">
                        <form className="profile-form">
                            <div className="form-group">
                                <label className="fw-bold">Username</label>
                                <Tooltip title="You cannot change username" placement="top" arrow>
                                <input type="text" className="form-control input-field"
                                       value={vetData?.username || 'Loading...'} readOnly/>
                                </Tooltip>
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Email</label>
                                <Tooltip title="You cannot change email" placement="top" arrow>
                                <input
                                    type="text"
                                    className="form-control input-field"
                                    value={vetData?.email|| 'Loading...'}
                                    onChange={e => setEmail(e.target.value)} // Update email state
                                    placeholder="Enter your email"
                                    readOnly
                                />
                                </Tooltip>
                            </div>
                            <div className="name-row">
                                <div className="form-group">
                                    <label className="fw-bold">First Name</label>
                                    <input type="text" className="form-control input-field" value={first_name}
                                           onChange={e => setFirstname(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label className="fw-bold">Last Name</label>
                                    <input type="text" className="form-control input-field" value={last_name}
                                           onChange={e => setLastname(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Contact Number</label>
                                <input type="text" className="form-control input-field" value={phone_number}
                                       onChange={e => setPhone(e.target.value)} onBlur={validatePhone}/>
                                {errorPhone && <div className="error-register">{errorPhone}</div>}
                            </div>

                            <div className="address-row">
                                <div className="form-group">
                                    <label className="fw-bold">District</label>
                                    <input type="text" className="form-control input-field" value={district}
                                           onChange={e => setDistrict(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label className="fw-bold">City</label>
                                    <input type="text" className="form-control input-field" value={city}
                                           onChange={e => setCity(e.target.value)}/>
                                </div>
                            </div>
                            <div className="address-row">
                                <div className="form-group">
                                    <label className="fw-bold">Ward</label>
                                    <input type="text" className="form-control input-field" value={ward}
                                           onChange={e => setWard(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label className="fw-bold">Home Number</label>
                                    <input type="text" className="form-control input-field" value={homeNumber}
                                           onChange={e => setHomeNumber(e.target.value)}/>
                                </div>
                            </div>
                            {errorAddress && <div className="error-register">{errorAddress}</div>}
                            <div className="button-group">
                                <div className="right-buttons">
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>

                                </div>
                            </div>

                        </form>
                    </div>
                    {/* Certificate Button */}


                    {/* Certificate Modal */}
                    {showCertificateDiv && (
                        <div className="certificate-modal">
                            <div className="modal-backdrop" onClick={toggleCertificateDiv}></div>
                            <div className="modal-content">
                                <div className="certificate-upload">
                                    <h3>Upload Certificate</h3>
                                    <input
                                        type="text"
                                        value={certificateName}
                                        onChange={(e) => setCertificateName(e.target.value)}
                                        placeholder="Certificate Name"
                                    />
                                    <input
                                        type="file" accept="image/*,application/pdf"
                                        onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                                    />
                                    <button className="btn btn-primary" onClick={handleFileUpload}>
                                        Upload Certificate
                                    </button>
                                </div>
                                <h3>Existing Certificates:</h3>
                                <ul className="text-start">
                                    {Array.isArray(certificates) && certificates.length > 0 ? (
                                        certificates.map((cert) => (
                                              <li key={cert.certificate_id}>
                                                <span>
                                                    <button className="btn btn-success btn-sm mb-1" onClick={() => handleDownload(cert.file_path)}>
                                                        Download
                                                    </button> {cert.certificate_name}

                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <a className="text-danger fw-bold">No certificates found.</a>
                                    )}
                                </ul>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VetDetails;
