import React from "react";
function Footer(){
    return (
        <footer className="footer-bg text-white text-center d-flex justify-content-center align-items-center" style={{ minHeight: "280px" }}>
        <div className="container">
            <p>&copy; {new Date().getFullYear()} Fantastic Five. All rights reserved.</p>
            <ul className="list-inline">
                <li className="list-inline-item">
                    <a href="/about" className="text-white">About Us</a>
                </li>
                <li className="list-inline-item">
                    <a href="/services" className="text-white">Services</a>
                </li>
                <li className="list-inline-item">
                    <a href="/contact" className="text-white">Contact</a>
                </li>
                <li className="list-inline-item">
                    <a href="/privacy" className="text-white">Privacy Policy</a>
                </li>
            </ul>
            <div className="mt-1">
                <p>
                    <strong>Phone:</strong> <a href="tel:+123456789" className="text-white">+1 (234) 567-89</a>
                </p>
                <p>
                    <strong>Email:</strong> <a href="mailto:info@yourcompany.com"
                                               className="text-white">koifish@gmail.com</a>
                </p>
                <p>
                    <strong>Address:</strong> 92, Nguyễn Trãi, Phường Bến Thành, Quận 1, Tp Hồ Chí Minh
                </p>
            </div>
        </div>
    </footer>);
}

export default Footer;