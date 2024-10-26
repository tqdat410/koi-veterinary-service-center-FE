import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Import images
import onlineImage from "../../../src/assets/images/online.jpg";
import veterinaryImage from "../../../src/assets/images/veterinarian.jpg";
import atHomeImage from "../../../src/assets/images/home.jpg";
import "../../styles/Appointment.css";
import { setService } from '../../store/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Define the interface for Service
interface Service {
    service_id: number;
    service_name: string;
    description: string;
    service_price: number;
}

// Mapping service IDs to images
const images: { [key: number]: string } = {
    1: onlineImage,
    3: veterinaryImage,
    2: atHomeImage,
};

const ServiceSection: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const dispatch = useDispatch(); // Initialize useDispatch
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get<Service[]>('http://localhost:8080/api/v1/services'); // Replace with your actual API URL
                console.log('Fetched services:', response.data); // Debugging
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    // Display only the first three services
    const displayedServices = services.slice(0, 3);

    // Function to handle card click
    const handleCardClick = (service: Service) => {
        dispatch(setService( service)); // Dispatch action to set service_id
        console.log('Selected service_id:', service);
        // Navigate to FishSelectionPage
        // window.location.href = '/appointment/vet-selection'; // Replace with react-router navigate if needed
        navigate('/appointment/slot-date-selection');
    };

    return (
        <div
            className="service-section bg-light d-flex justify-content-center align-items-center"
            style={{ minHeight: '80vh', marginTop: '75px' }} // Center the section vertically
        >
            <div className="container">
                <div className="text-center">
                    <h2 className="display-4 fw-bold" style={{ color: '#02033B'}}>Choose Services</h2>
                </div>
                <div className="row justify-content-center ">
                    {displayedServices.map(service => (
                        <div className="col-lg-4 col-md-6 col-sm-7 d-flex justify-content-center mb-1 mt-2" key={service.service_id}>
                            <div className="card custom-card service-card"  onClick={() => handleCardClick(service)}>
                                <img
                                    src={images[service.service_id]} // Use the service_id for image mapping
                                    className="card-img-top custom-card-img"
                                    alt={service.service_name}
                                />
                                <div className="card-body d-flex flex-column justify-content-between"
                                     style={{flex: '1 1 auto'}}>
                                    <div>
                                        <h5 className="card-title card-title-service">{service.service_name}</h5>
                                        <p className="card-text">{service.description}</p>
                                    </div>
                                    {/* Price positioned at the bottom of the card */}
                                    <p className="text-success fst-italic fw-bold">Price: {service.service_price.toLocaleString('vi-VN')} VND</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceSection;
