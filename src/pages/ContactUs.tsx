import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import '../styles/ContactUs.css';

const ContactUs = () => (
    <div>
        <Navbar />
        <div className="container my-5 content-contact-us">
            <h2 className="text-center mb-4" style={{ paddingTop: '2rem' }}>Contact Us</h2>

            <div className="text-center mb-4">
                <h3>Get in Touch with Us</h3>
                <p style={{ textAlign: 'left', marginLeft: '1rem' }}>We are here to assist you with all your Koi health and care needs. Whether you have questions, need advice, or want to schedule an appointment, don’t hesitate to reach out!</p>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <h4>Our Contact Information</h4>
                    <p><strong>Phone:</strong> 1234567890</p>
                    <p><strong>Email:</strong> koifishvetmaster@gmail.com </p>
                    <p><strong>Address:</strong></p>
                    <p>1 Đường số 1<br />
                        [Thành phố Hồ Chí Minh, Quận 1, 70000]</p>
                </div>

                <div className="col-md-6">
                    <h4>Operating Hours</h4>
                    <p><strong>Monday - Sunday:</strong> 7:30 AM - 17:30 PM</p>
                    {/* <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                    <p><strong>Sunday:</strong> Closed</p> */}
                </div>
            </div>

            <div className="my-4">
                <h4>Appointment Requests</h4>
                <p>To schedule an appointment, please call us or fill out our <a href="http://localhost:3000/appointment/service-selection" target="_blank" rel="noopener noreferrer">online appointment request form</a>. We will get back to you as soon as possible to confirm your appointment.</p>
            </div>

            <div className="" style={{ marginBottom: '0px' }}>
                <h4>Follow Us</h4>
                <p>Stay connected with us on social media for tips, updates, and Koi care insights!</p>
                <a style={{ marginBottom: '1rem' }} href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary me-2">Facebook</a>
                <a style={{ marginBottom: '1rem' }} href="https://chat.zalo.me/" target="_blank" rel="noopener noreferrer" className="btn btn-info  me-2">Zalo</a>
                <a style={{ marginBottom: '1rem' }} href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="btn btn-danger   me-2">Youtube</a>
            </div>

        </div>
        <Footer />
    </div>


);

export default ContactUs;
