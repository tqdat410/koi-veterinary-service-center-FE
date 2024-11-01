import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {IMAGE_API} from "../../api/baseApi"
import {setDoctor} from "../../store/actions";
import { useDispatch } from 'react-redux';
import {useNavigate} from "react-router-dom";
import { useSelector } from 'react-redux';
import defaultImage from "../../assets/images/defaultImage.jpg"
import {BASE_API} from "../../api/baseApi"

interface Doctor {
    user_id: number;
    first_name: string;
    last_name: string;
    avatar: string;
}

interface Feedback {
    rating: number;
}

const CustomerViewVetRatingPage: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const cardContainerRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const slot = useSelector((state: any) => state.slot);
    const service = useSelector((state: any) => state.service);


    const fetchDoctors = async () => {
        try {
            const response = await axios.get(`${BASE_API}/users/veterinarians`);

            setDoctors(response.data); // Assume the API response is an array of doctors


        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    useEffect(() => {
        fetchDoctors(); // Fetch the data when the component mounts
    }, []);


    // Function to scroll left
    const scrollLeft = () => {
        if (cardContainerRef.current) {
            cardContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' }); // Adjust the value as needed
        }
    };

    // Function to scroll right
    const scrollRight = () => {
        if (cardContainerRef.current) {
            cardContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' }); // Adjust the value as needed
        }
    };

    const handleCardClick = () => {

        navigate('/appointment/service-selection'); // Replace with react-router navigate if needed
    };




    return (
        <div
            className="veterinarian-section bg-light d-flex justify-content-center align-items-center"
            style={{minHeight: '80vh', marginTop: '75px'}} // Center the section vertically
        >

            <div className="container-fluid" style={{padding:"0px"}}>
                <div className="text-center my-4">
                    <h1 className="display-4 fw-bold" style={{color: '#02033B'}}>Our Veterinarians</h1>
                </div>


                {/* Doctors Grid */}
                <div
                    className={`d-flex ${doctors.length > 5 ? 'justify-content-start' : 'justify-content-center'}`}
                    ref={cardContainerRef} // Attach ref to the container
                    style={{
                        padding: '40px',
                        flexWrap: 'nowrap',
                        overflow: 'hidden',// Prevent wrapping to a new line
                    }}
                >
                    {doctors.map((doctor) => (
                        <div
                            key={doctor.user_id}
                            className="d-flex flex-column align-items-center" // Center cards vertically
                            style={{
                                flex: '0 0 200px',
                                margin: '0 10px',
                            }}
                        >
                            <div className="card vet-card"
                                 style={{borderRadius: '40px', width: '300px', height: '340px'}}
                                 onClick={(handleCardClick)}
                            >
                                <img
                                    src={`${IMAGE_API}/${doctor.avatar}` || defaultImage}
                                    className="card-img-top  rounded-circle mx-auto mt-5 mb-2"
                                    alt={`${doctor.first_name} ${doctor.last_name}`}
                                    style={{width: '190px', height: '190px'}}
                                />
                                <div className="row justify-content-center d-flex align-items-end text-center">
                                    <h5 className="card-title text-center font-weight-bold"
                                    >{`${doctor.first_name} ${doctor.last_name}`}</h5>

                                </div>
                                <div className="overlay">
                                    <span className="mt-0" style={{width:"180px"}}>Click to request appointment</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Navigation buttons */}

                {/* Show navigation buttons only if there are more than 5 doctors */}
                {doctors.length > 5 && (
                    <div className="d-flex justify-content-between mt-1" style={{ margin: "0px 20px" }}>
                        <button className="prev-next-button d-flex align-items-center fw-bold" onClick={scrollLeft}>
                            <i className="fa-solid fa-circle-chevron-left" style={{ marginRight: '8px' }}></i>
                            Prev
                        </button>
                        <button className="prev-next-button d-flex align-items-center fw-bold" onClick={scrollRight}>
                            Next
                            <i className="fa-solid fa-circle-chevron-right" style={{ marginLeft: '8px' }}></i>
                        </button>
                    </div>
                )}


            </div>
        </div>
    );
};

export default CustomerViewVetRatingPage;
