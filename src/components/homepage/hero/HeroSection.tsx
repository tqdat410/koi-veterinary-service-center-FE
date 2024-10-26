import React, { useState } from 'react';
import backgroundImage from '../../../assets/images/homepage.jpg'; // Adjust the path as needed
import koiImage from '../../../assets/images/homepage2.jpg'; // Adjust the path as needed
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from "../../../hooks/context/AuthContext";
import LoginReminderModal from "../../../guards/LoginReminderModal";
const HeroSection = () => {
    const [isHovered, setIsHovered] = useState(false);
    const { isAuthenticated } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleRequestAppointment = () => {
        if (!isAuthenticated) {
            setShowModal(true);
        } else {
            navigate('/appointment/service-selection');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/login');
    };




    return (
        <section className="hero">
            <div
                className="d-flex flex-column align-items-center justify-content-center min-vh-100"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100vh",

                }}
            >
                <div className="container-fluid h-100">
                    <div className="row h-100 justify-content-between align-items-center">
                        {/* Left Side - Text and Button */}
                        <div className="col-md-6 d-flex flex-column align-items-start ps-5">
                            {/* Request Appointment Button */}
                            <div className="mb-4" style={{ marginLeft: "5px" }}>

                                <button
                                    className="btn d-flex align-items-center btn-custom btn-shadow"
                                    style={{
                                        backgroundColor: "rgba(231, 204, 63, 0.05)",
                                        borderColor: "#7a6950",
                                        borderRadius: "42px",
                                        padding: "20px 30px",
                                        marginTop: "70px",
                                        outline: isHovered ? "2px solid orange" : "none",
                                    }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onClick={handleRequestAppointment}
                                >
                            <span className="text-white fw-bold" style={{fontSize: "1.3rem"}}>
                                Request appointment
                            </span>
                                    <i className="fas fa-arrow-right text-white ms-3 mt-1"
                                       style={{fontSize: "1.3rem"}}/>
                                </button>

                            </div>

                            {/* Description */}
                            <p className="text-white text-start"
                               style={{
                                   maxWidth: "100%",
                                   fontSize: "1.8rem",
                                   lineHeight: "1.5",
                                   marginTop: "1rem",
                                   textAlign: "left"
                               }}>
                                Book your koi fish service today! We offer water quality testing, koi health
                                assessments, pond cleaning, and filtration maintenance to keep your koi healthy and your pond looking great. Schedule now for expert care and advice.
                            </p>
                        </div>

                        {/* Right Side - Image Section */}
                        <div className="col-md-6 position-relative d-none d-md-block" style={{ height: "100%", maxWidth: "100%" }}>
                            <div
                                className="position-absolute"
                                style={{
                                    width: "65%",
                                    height: "75%",
                                    backgroundColor: "#edb664",
                                    top: "13%",
                                    left: "25%",
                                    borderRadius: "15px",
                                    boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.25)'
                                }}
                            />
                            <img
                                className="img-fluid position-absolute"
                                style={{
                                    width: "65%",
                                    height: "75%",
                                    left: "22.5%",
                                    top: "15.5%",
                                    objectFit: "cover",
                                    borderRadius: "15px",
                                    boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.25)'
                                }}
                                src={koiImage}
                                alt="Koi Fish Service"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <LoginReminderModal show={showModal} onClose={handleModalClose} />
        </section>
    );
};

export default HeroSection;