
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {useAuth} from '../../hooks/context/AuthContext'; // Import your custom hook
import '../../styles/Navbar.css'; // Import the CSS file

function Navbar() {
    const {user, logout } = useAuth(); // Get user and logout function from the custom hook
    const [bgColorClass, setBgColorClass] = useState('transparent');
    const [linkColorClass, setLinkColorClass] = useState('text-white');
    const [buttonStyleClass, setButtonStyleClass] = useState('btn-outline-warning');
    const location = useLocation();
    const navigate = useNavigate();
    const role = user?.roleId;
    useEffect(() => {
        const handleScroll = () => {
            if (location.pathname === '/' && window.scrollY > 50) {
                setBgColorClass('scrolled');
                setLinkColorClass('text-black');
                setButtonStyleClass('btn-outline-dark');
            } else if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
                // Default color for Home, Login, and Register pages
                setBgColorClass('transparent');
                setLinkColorClass('text-white');
                setButtonStyleClass('btn-outline-warning');
            } else {
                // For all other pages, set the background color to #ffc247
                setBgColorClass('bg-warning'); // You can create this class in CSS
                setLinkColorClass('text-dark'); // Adjust link color if needed
                setButtonStyleClass('btn-outline-dark'); // Adjust button color if needed
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call it once to set initial styles based on current scroll position
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.pathname]);

    const handleLogout = () => {
        logout(); // Call the logout function from the hook
        navigate('/login'); // Redirect to login page
    };

    const isActiveLink = (path: string): string =>
        location.pathname === path ? 'underline' : '';

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <nav className={`navbar navbar-expand-lg fixed-top ${bgColorClass}`}>
            <div className="container-fluid px-5">
                <div className="d-flex justify-content-start align-items-center" style={{ gap: '15px' }}>
                    {/* Always visible links */}
                    <Link className={`navbar-brand ${linkColorClass} ${isActiveLink('/')}`} to="/">Home</Link>
                    <Link className={`navbar-brand ${linkColorClass} ${isActiveLink('/about')}`} to="/about">About</Link>
                    <Link className={`navbar-brand ${linkColorClass} ${isActiveLink('/contact')}`} to="/contact">Contact Us</Link>

                    {/* Conditional links (only visible on pages other than login and register) */}
                    {!isAuthPage && (
                        <>
                            <Link className={`navbar-brand ${linkColorClass} ${isActiveLink('/news')}`} to="/news">News</Link>
                            <Link className={`navbar-brand ${linkColorClass} ${isActiveLink('/services')}`} to="/services">Services</Link>
                            <Link className={`navbar-brand ${linkColorClass} ${isActiveLink('/faq')}`} to="/faq">FAQ</Link>
                        </>
                    )}
                </div>

                <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                    {!user ? ( // Check if the user object exists
                        <>
                            <Link to="/login">
                                <button className={`btn btn-custom ${buttonStyleClass}`}>Log In</button>
                            </Link>
                            <Link to="/register">
                                <button className={`btn btn-custom ${buttonStyleClass}`}>Register</button>
                            </Link>
                        </>
                    ) : (
                        <div className="dropdown" >
                            <button className={`btn btn-custom dropdown-toggle ${buttonStyleClass}`} id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                Profile
                            </button>
                            <ul className="dropdown-menu mb-2"  aria-labelledby="dropdownMenuButton">
                                <li ><Link className="dropdown-item mb-1" to="/profile">Profile</Link></li>
                                {(role === 'STA' || role === 'CUS') && (
                                    <li><Link className="dropdown-item mb-1" to="/my-appointment">Appointments</Link></li>
                                )}
                                {role === 'MAN' && (
                                    <li><Link className="dropdown-item mb-1" to="/manager/appointment-list">Manager Appointments</Link></li>
                                )}
                                {role === 'VET' && (
                                    <li><Link className="dropdown-item mb-1" to="/veterinarian/schedule">My Schedule</Link></li>
                                )}
                                <li><button className="dropdown-item mb-1" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
