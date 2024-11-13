import { useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import "../../../styles/Services.css";  // Đảm bảo rằng bạn đã tạo tệp này để tùy chỉnh kiểu dáng nếu cần
import onlImage from "../../../assets/images/online.jpg";
import hosImage from "../../../assets/images/veterinarian.jpg";
import homeImage from "../../../assets/images/home.jpg";
import Footer from "../../../components/layout/Footer";
import {getAverageRating} from "../../../api/ratingApi";
import Rating from '@mui/material/Rating';
import FeedbackModal from './FeedbackModal';

const servicesData = [
    {   id: 1,
        title: "Online Consultation",
        image: onlImage,
        description: `Our Koi Fish Consultation service offers tailored advice for your Koi’s health and wellbeing. 
        During the consultation, our experienced veterinarians will assess your Koi’s living conditions, diet, and overall health. 
        We provide insights on optimal pond conditions, feeding practices, and preventive measures to keep your Koi thriving. 
        Our veterinarians will also educate you on recognizing early signs of illness and how to maintain a healthy environment for your fish.`,
    },
    {   id: 2,
        title: "Fish Treatment",
        image: hosImage,
        description: `Our Health Check-Up service is essential for the longevity and vitality of your Koi. 
        We perform comprehensive health evaluations, including physical examinations and diagnostic tests to identify any underlying health issues. 
        Our team will monitor vital signs, inspect for signs of disease, and evaluate skin and fin conditions. 
        Following the examination, we will provide you with a detailed report of your Koi's health status and recommendations for any necessary treatments or care adjustments.`,
    },
    {   id: 3,
        title: "Pond Evaluation & Consultation",
        image: homeImage,
        description: `Our Emergency Care service is available for urgent situations requiring immediate attention. 
        Whether your Koi is experiencing distress, exhibiting unusual behavior, or has sustained an injury, our team is ready to respond swiftly. 
        We have the necessary facilities and expertise to manage critical cases effectively. 
        Upon arrival, our veterinarians will conduct an immediate assessment to determine the best course of action, ensuring that your Koi receives the necessary treatment without delay.`,
    },
];

const Services: React.FC = () => {
    const navigate = useNavigate();
    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

    useEffect(() => {
        const fetchRatings = async () => {
            const ratingsData: { [key: number]: number } = {};
            for (const service of servicesData) {
                const rating = await getAverageRating(service.id);
                ratingsData[service.id] = rating;
                console.log(rating)
            }
            setRatings(ratingsData);
        };
        fetchRatings();
    }, []);



    const handleBooking = () => {
        navigate('/appointment/service-selection');
    };

    const handleViewFeedbacks = (serviceId: number) => {
        setSelectedServiceId(serviceId); // Set the selected service ID to show the modal
    };

    const closeModal = () => {
        setSelectedServiceId(null); // Close the modal
    };

    return (
        <div>
        <div className="container my-5 " >
            <h1 className="text-center mb-4" style={{ fontWeight: "bold", color: "#02033B", fontSize: "4rem" , marginTop: '12vh'}} >Our Services</h1>
            {servicesData.map((service, index) => (
                <div className="row mb-5 align-items-center" key={index}>
                    <div className={`col-md-6 ${index % 2 === 0 ? 'order-md-1' : 'order-md-2'}`}>
                        <img src={service.image} alt={service.title} className="img-fluid" style={{ width: '500px', height: '300px', borderRadius:"15px" }} />
                    </div>
                    <div className={`col-md-6 ${index % 2 === 0 ? 'order-md-2' : 'order-md-1'}`}>
                        <h2 className="mb-3 fw-bold">{service.title}</h2>
                        <Rating name={`service-rating-${service.id}`} value={ratings[service.id] || 0} readOnly precision={0.5} />
                        <p>{service.description}</p>
                        <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-secondary me-2"
                                    onClick={() => handleViewFeedbacks(service.id)}>View Feedbacks
                            </button>
                            <button className="btn btn-primary" onClick={handleBooking}>Book Now <i
                                className="bi bi-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
            ))}

        </div>
            <Footer/>
            {selectedServiceId && (
                <FeedbackModal serviceId={selectedServiceId} onClose={closeModal} />
            )}
        </div>
    );
}

export default Services;
