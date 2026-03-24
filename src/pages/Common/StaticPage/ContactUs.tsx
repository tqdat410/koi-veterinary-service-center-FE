import Footer from '../../../components/layout/Footer';
import Navbar from '../../../components/layout/Navbar';
import '../../../styles/ContactUs.css';

const ContactUs = () => (
    <div>
        <Navbar />
        <div className="container my-5 content-contact-us min-h-auto">
            <h2 className="text-center mb-4 content-header-contact-us">Contact Us</h2>

            <div className="text-center mb-4">
                <h3>Get in Touch with Us</h3>
                <p className='content-body'>We are here to assist you with all your Koi health and care needs. Whether you have questions, need advice, or want to schedule an appointment, don’t hesitate to reach out!</p>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <h4>Our Contact Information</h4>
                    <p><strong>Phone:</strong> +1 (234) 567-89</p>
                    <p><strong>Email:</strong> koifish@gmail.com </p>
                    <p><strong>Address:</strong></p>
                    <p>92, Nguyễn Trãi,<br />
                     Phường Bến Thành, Quận 1, Tp Hồ Chí Minh</p>
                </div>

                <div className="col-md-6">
                    <h4>Operating Hours</h4>
                    <p><strong>Monday - Sunday:</strong> 7:30 AM - 17:30 PM</p>
                    <br/>
                    <h4>Top rated service</h4>
                    <p>Health Check-Up</p>
                </div>
            </div>

            <div className="my-4">
                <h4>Appointment Requests</h4>
                <p>To schedule an appointment, please call us or fill out our <a href="http://koi-fish-veterinary-interface.s3-website-ap-southeast-1.amazonaws.com/appointment/service-selection" target="_blank" rel="noopener noreferrer">online appointment request form</a>. We will get back to you as soon as possible to confirm your appointment.</p>
            </div>

            <div>
                <h4>Follow Us</h4>
                <p>Stay connected with us on social media for tips, updates, and Koi care insights!</p>
                <a  href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary me-2 mbt-1">Facebook</a>
                <a  href="https://chat.zalo.me/" target="_blank" rel="noopener noreferrer" className="btn btn-info  me-2 mbt-1">Zalo</a>
                <a  href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="btn btn-danger me-2 mbt-1">Youtube</a>
            </div>

        </div>
        <Footer />
    </div>


);

export default ContactUs;
