import React from 'react';
import newsImage from '../../../assets/images/news.jpg'
import { useNavigate } from 'react-router-dom';

const NewsSection: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="news">
            <div className="container py-5">
                <div className="row align-items-center">
                    {/* Text Section */}
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <div className="mb-4">
                            <h2 className="text-start fw-bold fs-1" style={{ color: '#02033B' }}>News</h2>
                        </div>
                        <p className="text-start text-dark mb-4 mt-5" style={{ fontSize: "1.5rem" }}>
                            Local Koi Fish Service Expands Offerings<br />
                            <strong>Fantastic five</strong>, a leading provider of koi fish care, has announced
                            the expansion of its services. The company now offers advanced water testing, health
                            assessments, and pond cleaning for koi enthusiasts. Customers can book appointments
                            online for convenient, expert care.
                        </p>
                        <div className="d-flex gap-3 mt-5 mb-5">
                            {/* Read more button */}
                            <button onClick={() => navigate('/about')}  className="btn btn-warning px-4 py-2 rounded-pill fw-bold text-dark btn-shadow" >
                                {/* <span className="fw-bold">Read more</span>
                                <i className="fas fa-arrow-right ms-2" /> */}
                                Read more
                            </button>

                            {/* News button: qua trang news.tsx */}
                            
                            <button onClick={() => navigate('/news')}
                            className="btn btn-outline-primary px-4 py-2 rounded-pill fw-bold btn-shadow" >
                                News
                            </button>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="col-lg-6 position-relative">
                        <div className="position-absolute" style={{
                            width: "460px",
                            height: "460px",
                            backgroundColor: "#edb664",
                            left: "120px",
                            top: "-22px",
                            zIndex: -1,
                            borderRadius: "10px",
                            boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.25)'
                        }}>
                        </div>
                        <img
                            src={newsImage}
                            alt="News Image"
                            className="img-fluid rounded"
                            style={{
                                width: "468px",
                                height: "468px",
                                objectFit: "cover", // Ensures the image fills the area
                                borderRadius: "10px",
                                boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.25)'
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;