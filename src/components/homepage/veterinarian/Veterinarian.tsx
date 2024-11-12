import React from 'react';
import { useNavigate } from 'react-router-dom';
import vetImage from '../../../assets/images/veterinarian.jpg'; // Adjust the path as needed

const Veterinarian: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="vet bg-light">
            <div className="container py-5">
                <div className="row align-items-center">
                    {/* Image Section */}
                    <div className="col-lg-6 position-relative">
                        {/* Background color */}
                        <div className="position-absolute" style={{
                            width: "460px",
                            height: "460px",
                            backgroundColor: "#edb664",
                            zIndex: 0,
                            borderRadius: "10px",
                            top: "-22px",
                            left: "120px",
                            boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.25)'
                        }}>
                        </div>
                        {/* Image above the background */}
                        <img
                            src={vetImage}
                            alt="Veterinarian"
                            className="img-fluid rounded mb-4"
                            style={{
                                width: "468px",
                                height: "468px",
                                objectFit: "cover",
                                objectPosition: "right",
                                borderRadius: "10px",
                                position: "relative", // Ensure the image is above the background
                                zIndex: 1, // Bring image above the background
                                boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.25)'
                            }}
                        />
                    </div>

                    {/* Text Section */}
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <h2 className="text-start fs-1 fw-bold mb-5 mt-4"
                            style={{marginLeft: "50px", color: '#02033B'}}>
                            Veterinarian
                        </h2>
                        <p className="text-start text-dark mb-5" style={{fontSize: '1.5rem'}}>
                            At <strong>Fantastic five</strong>, we provide expert koi fish care and pond maintenance.
                            Our team
                            is committed to keeping your koi healthy and your pond beautiful with services like
                            water testing, health checks, and cleaning. Trust us for reliable, professional care for
                            your koi pond.
                        </p>
                        <div className="mt-4 text-center">
                            <button onClick={() => navigate('/veterinarians-rating')}  className="btn btn-warning rounded-pill px-4 mb-5 btn-shadow">
                                <span className="fw-bold">Read more</span>
                                <i className="fas fa-arrow-right ms-2"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Veterinarian;