import React, { useState } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import '../../styles/Sidebar.css';
import { useAuth } from "../../hooks/context/AuthContext"; // Import CSS nếu cần

const Sidebar: React.FC = () => {
    const { user , logout} = useAuth();  // Lấy thông tin user từ context
    const role = user?.roleId;   // Lấy role của người dùng
    const [isPricingOpen, setIsPricingOpen] = useState(false); // State để mở rộng submenu Pricing
    const location = useLocation();
    const togglePricingMenu = () => {
        setIsPricingOpen((prev) => !prev);
    };
    const navigate = useNavigate();
    const handleLogout = () => {
        logout(); // Gọi hàm logout
        navigate('/'); // Chuyển hướng đến trang login sau khi logout
    };

    const isActive = (path: string) => location.pathname === path ? 'mb-1 sidebar-select' : 'mb-1 text-dark';
    const isPricingPage = location.pathname === '/manager/service-pricing' || location.pathname === '/manager/transport-pricing';

    return (
        <div className="d-flex flex-column sidebar border-right fixed-left " style={{ minWidth: '272px', height: '100vh' }}>
            <div className="p-3 " style={{marginTop:"45px"}}>
                {/* Hiển thị các mục theo role */}
                {role === 'MAN' && (
                    <>

                        <Link to="/manager/dashboard" className={`nav-link ${isActive('/manager/dashboard')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-square-poll-vertical"></i>
                                <span className="fw-bold ms-3">Dashboard</span>
                            </div>
                        </Link>

                        <Link to="/manager/appointment-list" className={`nav-link ${isActive('/manager/appointment-list')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-regular fa-calendar-days"></i>
                                <span className="fw-bold ms-3">Appointment List</span>
                            </div>
                        </Link>

                        <Link to="/manager/booked-schedule"
                              className={`nav-link ${isActive('/manager/booked-schedule')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-calendar-check"></i>
                                <span className="fw-bold ms-3">Booked Schedule</span>
                            </div>
                        </Link>


                        <Link to="/manager/vet-list" className={`nav-link ${isActive('/manager/vet-list')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-user-doctor"></i>
                                <span className="fw-bold ms-3">Veterinarians</span>
                            </div>
                        </Link>

                        <Link to="/manager/customer" className={`nav-link ${isActive('/manager/customer')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-user"></i>
                                <span className="fw-bold ms-3">Customer</span>
                            </div>
                        </Link>


                        <Link to="/manager/staff-list" className={`nav-link ${isActive('/manager/staff-list')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-user-pen"></i>
                                <span className="fw-bold ms-3">Staff</span>
                            </div>
                        </Link>

                        <Link to="/manager/feedback" className={`nav-link ${isActive('/manager/feedback')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-comment"></i>
                                <span className="fw-bold ms-3">Feedback</span>
                            </div>
                        </Link>

                        {/* Pricing submenu */}
                        <div className={`nav-link ${isPricingPage ? 'sidebar-select' : 'text-dark'} mb-1`}
                             onClick={togglePricingMenu} style={{cursor: 'pointer'}}>
                            <div className="d-flex align-items-center ">
                                <i className="fa-solid fa-file-invoice-dollar"></i>
                                <span className="fw-bold ms-3 ">Pricing</span>
                                <i className={`fa ${isPricingOpen ? 'fa-caret-down' : 'fa-caret-right'} ms-auto`}></i> {/* Toggle icon */}
                            </div>
                        </div>
                        {isPricingOpen && (
                            <div className="ms-3"> {/* Submenu items */}
                                <Link to="/manager/service-pricing"
                                      className={`nav-link ${isActive('/manager/service-pricing')}`}>
                                    <div className="d-flex align-items-center">
                                        <i className="fa-solid fa-hand-holding-medical"></i>
                                        <span className="fw-bold ms-3">Service Pricing</span>
                                    </div>
                                </Link>
                                <Link to="/manager/transport-pricing"
                                      className={`nav-link ${isActive('/manager/transport-pricing')}`}>
                                    <div className="d-flex align-items-center">
                                        <i className="fa-solid fa-route"></i>
                                        <span className="fw-bold ms-3">Transport Pricing</span>
                                    </div>
                                </Link>
                            </div>
                        )}


                    </>
                )}

                {/* Customer Role */}
                {role === 'CUS' && (
                    <>

                        <Link to="/my-appointment" className={`nav-link ${isActive('/my-appointment')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-regular fa-calendar-days"></i>
                                <span className="fw-bold ms-3">My Appointment</span>
                            </div>
                        </Link>

                        <Link to="/koi/my-koi" className={`nav-link ${isActive('/koi/my-koi')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-fish"></i>
                                <span className="fw-bold ms-3">My Koi</span>
                            </div>
                        </Link>

                        <Link to="/address/my-address" className={`nav-link ${isActive('/address/my-address')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-location-dot"></i>
                                <span className="fw-bold ms-3">My Address</span>
                            </div>
                        </Link>
                    </>
                )}

                {/* Veterinarian Role */}
                {role === 'VET' && (
                    <>
                        <Link to="/veterinarian/schedule" className={`nav-link ${isActive('/veterinarian/schedule')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-regular fa-calendar-days"></i>
                                <span className="fw-bold ms-3">Schedule</span>
                            </div>
                        </Link>
                    </>
                )}

                {/* Staff Role */}
                {role === 'STA' && (
                    <>
                        <Link to="/staff/appointment-list"
                              className={`nav-link ${isActive('/staff/appointment-list')}`}>
                            <div className="d-flex align-items-center">
                                <i className="fa-regular fa-calendar-days"></i>
                                <span className="fw-bold ms-3">Appointment List</span>
                            </div>
                        </Link>
                    </>
                )}

                {/* Profile - available for all roles */}
                <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
                    <div className="d-flex align-items-center">
                        <i className="fa-solid fa-user-gear"></i>
                        <span className="fw-bold ms-3">Profile</span>
                    </div>
                </Link>

                <div className="nav-link text-dark mb-1" style={{cursor: 'pointer'}} onClick={handleLogout}>
                    <div className="d-flex align-items-center">
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span className="fw-bold ms-3">Logout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
