import { useNavigate } from 'react-router-dom';
import React from 'react';
import "../../../styles/Services.css";  // Đảm bảo rằng bạn đã tạo tệp này để tùy chỉnh kiểu dáng nếu cần
import onlImage from "../../../assets/images/online.jpg";
import hosImage from "../../../assets/images/veterinarian.jpg";
import homeImage from "../../../assets/images/home.jpg";
import Footer from "../../../components/layout/Footer";
const servicesData = [
    {
        title: "Koi Fish Consultation",
        image: onlImage,
        description: `Our Koi Fish Consultation service offers tailored advice for your Koi’s health and wellbeing. 
        During the consultation, our experienced veterinarians will assess your Koi’s living conditions, diet, and overall health. 
        We provide insights on optimal pond conditions, feeding practices, and preventive measures to keep your Koi thriving. 
        Our veterinarians will also educate you on recognizing early signs of illness and how to maintain a healthy environment for your fish.`,
    },
    {
        title: "Health Check-Up",
        image: hosImage,
        description: `Our Health Check-Up service is essential for the longevity and vitality of your Koi. 
        We perform comprehensive health evaluations, including physical examinations and diagnostic tests to identify any underlying health issues. 
        Our team will monitor vital signs, inspect for signs of disease, and evaluate skin and fin conditions. 
        Following the examination, we will provide you with a detailed report of your Koi's health status and recommendations for any necessary treatments or care adjustments.`,
    },
    {
        title: "Emergency Care",
        image: homeImage,
        description: `Our Emergency Care service is available for urgent situations requiring immediate attention. 
        Whether your Koi is experiencing distress, exhibiting unusual behavior, or has sustained an injury, our team is ready to respond swiftly. 
        We have the necessary facilities and expertise to manage critical cases effectively. 
        Upon arrival, our veterinarians will conduct an immediate assessment to determine the best course of action, ensuring that your Koi receives the necessary treatment without delay.`,
    },
];

const Services: React.FC = () => {
    const navigate = useNavigate();

    const handleBooking = () => {
        navigate('/appointment/service-selection');
    };

    return (
        <div>
        <div className="container my-5 " >
            <h1 className="text-center mb-4" style={{ fontWeight: "bold", color: "#02033B", fontSize: "3rem" , marginTop: '12vh'}} >Our Services</h1>

            {servicesData.map((service, index) => (
                <div className="row mb-5 align-items-center" key={index}>
                    <div className={`col-md-6 ${index % 2 === 0 ? 'order-md-1' : 'order-md-2'}`}>
                        <img src={service.image} alt={service.title} className="img-fluid" style={{ width: '500px', height: '300px', borderRadius:"15px" }} />
                    </div>
                    <div className={`col-md-6 ${index % 2 === 0 ? 'order-md-2' : 'order-md-1'}`}>
                        <h2 className="mb-3 fw-bold">{service.title}</h2>
                        <p>{service.description}</p>
                        <button className="btn btn-primary mb-4"  onClick={handleBooking}>Book Now</button>
                    </div>
                </div>
            ))}

        </div>
            <Footer />
        </div>
    );
}

export default Services;
