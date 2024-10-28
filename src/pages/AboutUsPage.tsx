import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import vetImg from '../assets/images/veterinarian.jpg';
import '../styles/AboutUs.css';
const AboutUsPage: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className="container my-5 d-flex flex-column content-about-us">
                <h1 className="" style={{ marginTop: '10px' }}>About Us</h1>
                <p className="content-body" >
                    {/* Our koi care service is committed to providing dedication and professionalism to ensure optimal health and beauty for your fish. With a team of experienced experts, we provide comprehensive services from regular health checks, diagnosis and treatment of koi diseases, to nutritional consulting packages and pond environment management. We understand that each koi fish is not only an ornamental creature but also the pride and love of the owner. Therefore, our service always puts quality first, bringing absolute peace of mind and satisfaction to customers.
                    <br />
                    Our service also provides comprehensive care solutions such as cleaning the pond, adjusting water parameters (pH, hardness, temperature) to maintain the ideal environment for koi fish to grow. We also support disease prevention by consulting and providing high-quality food, suitable for each stage of fish development. In addition, our team is ready to support you in building, designing and renovating your koi pond in a unique style, helping to create a relaxing and harmonious space right in your home.
                    <br />
                    Let us accompany you on your koi care journey - providing not only a service but also a dedicated and classy care experience.
                    <br /> */}
                </p>
                <div className="container about-section">
                    <div className="row">
                        <div className="col-md-8 about-text">
                            <h2> Introducing Our Koi Fish Care Specialists</h2>
                            <p>
                                We understand that Koi fish are not just pets; they are cherished companions that require expert care and attention. Our team of dedicated Koi fish care specialists includes experienced veterinarians and aquaculture professionals who are passionate about ensuring the health and well-being of your aquatic friends.
                            </p>
                        </div>
                        <div className="col-md-4 about-image">
                            <img src={`${vetImg}`} className="vet-img" alt="Veterinarian" />
                        </div>
                        
                        <div className="col-md-8 about-text" style={{marginTop:'12px'}}>
                            <h2> Introducing Our Koi Fish Care Specialists</h2>
                            <p>
                                We understand that Koi fish are not just pets; they are cherished companions that require expert care and attention. Our team of dedicated Koi fish care specialists includes experienced veterinarians and aquaculture professionals who are passionate about ensuring the health and well-being of your aquatic friends.
                            </p>
                        </div>
                        <div className="col-md-4 about-image">
                            <img src={`${vetImg}`} className="vet-img" alt="Veterinarian" />
                        </div>

                        <div className="col-md-12 about-text">
                            <h2>Our Mission</h2>
                            <p>
                                Our mission is to provide the highest quality care for your Koi fish, ensuring that they live long, healthy, and happy lives. We are committed to staying up-to-date on the latest advances in Koi fish health and wellness, and we strive to provide compassionate and personalized care for each fish that comes through our doors.
                            </p>
                            <h2>Our Commitment</h2>
                            <p>
                                Our specialists work together to provide a full range of services, from routine health check-ups to emergency care. We prioritize the well-being of your Koi and aim to educate owners about best practices in Koi husbandry.
                                Whether you’re a seasoned Koi keeper or a newcomer to the hobby, our team is here to support you every step of the way. Trust us to provide the expert care your Koi deserve!
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <Footer />
        </div>
    );
};

export default AboutUsPage;
