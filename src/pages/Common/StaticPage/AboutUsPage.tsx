import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import vetImg from '../../../assets/images/veterinarian.jpg';
import serviceImg from '../../../assets/images/online.jpg';
import homepage2 from '../../../assets/images/homepage2.jpg';
import '../../../styles/AboutUs.css';
const AboutUsPage: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className="container my-5 d-flex flex-column content-about-us">
                <h1 className="content-header-about-us" >About Us</h1>
                <p className="content-body" >
                </p>
                <div className="container about-section">
                    <div className="row">
                        <div className="col-md-8 about-text">
                            <h2 className="fw-bold "> Introducing Our Koi Fish Care Specialists</h2>
                            <p>
                                We understand that Koi fish are not just pets; they are cherished companions that require expert care and attention. Our team of dedicated Koi fish care specialists includes experienced veterinarians and aquaculture professionals who are passionate about ensuring the health and well-being of your aquatic friends.
                            </p>
                        </div>
                        <div className="col-md-4 about-image">
                            <img src={`${vetImg}`} className="vet-img" alt="Veterinarian" />
                        </div>

                        <div className="col-md-8 about-text mt-3" >
                            <h2 className="fw-bold ">Our Mission</h2>
                            <p>
                                Our mission is to provide the highest quality care for your Koi fish, ensuring that they live long, healthy, and happy lives. We are committed to staying up-to-date on the latest advances in Koi fish health and wellness, and we strive to provide compassionate and personalized care for each fish that comes through our doors.
                            </p>
                        </div>
                        <div className="col-md-4 about-image mt-3" >
                            <img src={`${serviceImg}`} className="vet-img" alt="Veterinarian" />
                        </div>

                        <div className="col-md-8 about-text mt-3" >
                            <h2 className="fw-bold ">Our Commitment</h2>
                            <p>
                                Our specialists work together to provide a full range of services, from routine health check-ups to emergency care. We prioritize the well-being of your Koi and aim to educate owners about best practices in Koi husbandry.

                                Whether you’re a seasoned Koi keeper or a newcomer to the hobby, our team is here to support you every step of the way. Trust us to provide the expert care your Koi deserve!
                            </p>
                        </div>
                        <div className="col-md-4 about-image" style={{ marginTop: '3rem' }}>
                            <img src={`${homepage2}`} className="vet-img" alt="Veterinarian" />
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUsPage;
