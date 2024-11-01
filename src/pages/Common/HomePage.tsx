import React from 'react';
import HeroSection from '../../components/homepage/hero/HeroSection';
import NewsSection from '../../components/homepage/news/NewsSection';
import ServiceSection from '../../components/homepage/service/ServiceSection';
import FeedbackSection from '../../components/homepage/feedback/FeedbackSection';
import Footer from '../../components/layout/Footer';
import Navbar from "../../components/layout/Navbar";
import AboutHelp from "../../components/homepage/about-help/AboutHelp";
import Veterinarian from "../../components/homepage/veterinarian/Veterinarian";
import {useDispatch} from "react-redux";
import {resetState} from "../../store/actions";
import {persistor} from "../../store/store";

const HomePage: React.FC = () => {
    const dispatch = useDispatch();
    dispatch(resetState());
    persistor.purge();
    return (
        <div>

            <HeroSection />
            <NewsSection />
            <Veterinarian/>
            <AboutHelp/>
            <ServiceSection />
            <FeedbackSection />
            <Footer />
        </div>
    );
};

export default HomePage;