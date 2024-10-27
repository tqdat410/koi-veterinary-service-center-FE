import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import '../styles/AboutUs.css';
const AboutUsPage: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className="container my-5 d-flex flex-column content-about-us">
                <h1 className="" style={{ marginTop: '10px' }}>About Us</h1>
                <p className="content-body" >
                    Our koi care service is committed to providing dedication and professionalism to ensure optimal health and beauty for your fish. With a team of experienced experts, we provide comprehensive services from regular health checks, diagnosis and treatment of koi diseases, to nutritional consulting packages and pond environment management. We understand that each koi fish is not only an ornamental creature but also the pride and love of the owner. Therefore, our service always puts quality first, bringing absolute peace of mind and satisfaction to customers.
                    <br />
                    Our service also provides comprehensive care solutions such as cleaning the pond, adjusting water parameters (pH, hardness, temperature) to maintain the ideal environment for koi fish to grow. We also support disease prevention by consulting and providing high-quality food, suitable for each stage of fish development. In addition, our team is ready to support you in building, designing and renovating your koi pond in a unique style, helping to create a relaxing and harmonious space right in your home.
                    <br />
                    Let us accompany you on your koi care journey - providing not only a service but also a dedicated and classy care experience.
                    <br />
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUsPage;
