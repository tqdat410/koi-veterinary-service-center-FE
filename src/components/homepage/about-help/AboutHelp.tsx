import React from 'react';

import {useNavigate} from "react-router-dom";

const AboutHelp: React.FC = () => {
    const navigate = useNavigate();  // Khai báo useNavigate để điều hướng

    const handleReadMore = () => {
        navigate('/FAQ');  // Chuyển hướng đến trang /services
    };

    return (
        <section className="about-help">
            <div className="d-flex justify-content-center align-items-center gap-5 px-5 py-4 bg-white"
                 style={{ flexWrap: "wrap" }}>
                {/* Left Card - Read Our Story */}
                <div className="position-relative"
                     style={{
                         width: '460px',
                         height: '290px',
                         borderRadius: '48px',
                         background: 'linear-gradient(to right, #f7c95f, #fdb235)',
                         padding: '30px',
                         boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.25)'
                     }}
                >
                    <h3 className="text-start fw-bold mt-2" style={{ fontSize: '1.9rem', color: '#02033B' }}>
                        Read our story
                    </h3>
                    <p className="text-start text-dark mt-3" style={{ fontSize: '1.12rem' }}>
                        We turned our passion for koi fish into <strong>Fantastic Five</strong>, offering expert
                        care and maintenance to keep your koi and ponds thriving.
                    </p>
                    <button className="btn btn-primary mt-2 btn-shadow"
                            onClick={() => navigate('/about')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '42px',
                                backgroundColor: '#4335de',
                                fontWeight: 700,
                                color: '#fff'
                            }}>
                        About us
                    </button>
                </div>

                {/* Right Card - Help Center */}
                <div className="position-relative bg-white "
                     style={{
                         width: '460px',
                         height: '260px',
                         borderRadius: '48px',
                         padding: '30px',
                         border: '1px solid #ddd',
                         boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.25)'
                     }}
                >
                    <h3 className="text-start fw-bold mt-2" style={{ fontSize: '1.9rem', color: '#02033B' }}>
                        Help Center
                    </h3>
                    <p className="text-start text-dark mt-3" style={{ fontSize: '1.12rem' }}>
                        Help topics, getting started guides, and FAQs.
                    </p>
                    <button className="btn btn-outline-primary mt-4 btn-shadow"
                            style={{
                                padding: '10px 20px',
                                borderRadius: '42px',
                                fontWeight: 700
                            }}
                    onClick={handleReadMore}
                    >
                        Visit help center
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AboutHelp;