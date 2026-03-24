import React from 'react';
import HeroSection from '../components/homepage/hero/HeroSection';
import NewsSection from '../components/homepage/news/NewsSection';
import ServiceSection from '../components/homepage/service/ServiceSection';
import FeedbackSection from '../components/homepage/feedback/FeedbackSection';
import Footer from '../components/layout/Footer';
import Navbar from "../components/layout/Navbar";
import AboutHelp from "../components/homepage/about-help/AboutHelp";
import Veterinarian from "../components/homepage/veterinarian/Veterinarian";

const HomePage: React.FC = () => {
    return (
        <div>
            <Navbar />
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