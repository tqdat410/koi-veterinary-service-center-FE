import React from 'react';
import onlImage from "../../../assets/images/online.jpg";
import hosImage from "../../../assets/images/veterinarian.jpg";
import homeImage from "../../../assets/images/home.jpg";
import {useNavigate} from "react-router-dom";

const ServiceSection: React.FC = () => {
    const navigate = useNavigate();

    const handleReadMore = () => {
        navigate('/services');
    };
    return (
        <section className="service-section py-5 bg-light">
            <div className="container py-5 bg-light">
                <div className="text-center">
                    <h2 className=" fw-bold" style={{ fontSize: '3.6rem', color: '#02033B', marginTop: "-25px", marginBottom: "50px" }}>Our Services</h2>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-6 col-sm-7 d-flex justify-content-center mb-4">
                        <div className="card custom-card " >
                            <img src={onlImage} className="card-img-top custom-card-img" alt="Online Consulting" />
                            <div className="card-body">
                                <h5 className="card-title card-title-service"style={{margin:"15px 25px 0px 25px"}}>Online Consulting</h5>
                                <p className="card-text">Get expert koi care advice from the comfort of your home. Our virtual consultations help you address any pond or fish health concerns...</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-7 d-flex justify-content-center mb-4">
                        <div className="card custom-card ">
                            <img src={hosImage} className="card-img-top custom-card-img" alt="Veterinary Hospital" />
                            <div className="card-body">
                                <h5 className="card-title card-title-service" style={{margin:"15px 25px 0px 25px"}}>Veterinary Hospital</h5>
                                <p className="card-text">Bring your koi to our specialized facility for in-depth health assessments and treatments by experienced professionals...</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-7 d-flex justify-content-center mb-4">
                        <div className="card custom-card ">
                            <img src={homeImage} className="card-img-top custom-card-img" alt="At-Home Service" />
                            <div className="card-body">
                                <h5 className="card-title card-title-service" style={{margin:"15px 25px 0px 25px"}}>At-Home Service</h5>
                                <p className="card-text">We come to you! Enjoy convenient koi pond maintenance, health checks, and care right at your doorstep...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="btn btn-warning px-4 py-2 rounded-pill fw-bold text-dark btn-shadow"  onClick={handleReadMore} style={{ marginBottom: "-50px" }}>
                    <span className="fw-bold">Read more</span>
                    <i className="fas fa-arrow-right ms-2" />
                </button>
            </div>
        </section>
    );
};

export default ServiceSection;
