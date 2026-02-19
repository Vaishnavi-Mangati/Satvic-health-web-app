import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import DoshaSection from '../components/home/DoshaSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CTASection from '../components/home/CTASection';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
            <Navbar />
            <main>
                <HeroSection />
                <AboutSection />
                <DoshaSection />
                <FeaturesSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
