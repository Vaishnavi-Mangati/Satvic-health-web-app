import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white pt-16 pb-20 lg:pt-24 lg:pb-28">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center">

                    <div className="w-full text-center">
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-emerald-100 text-emerald-800 font-medium text-sm tracking-wide">
                            DISCOVER YOUR TRUE NATURE
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-stone-900 mb-6 leading-tight">
                            Balance Body & Mind with <span className="text-emerald-700">Ayurveda</span>
                        </h1>
                        <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                            Unlock a personalized health journey tailored to your unique Dosha. Combine ancient wisdom with modern science to live your healthiest life.
                        </p>
                    </div>

                    <div className="w-auto relative mb-10">
                        <div className="aspect-square relative z-10 rounded-[400px] overflow-hidden shadow-2xl shadow-emerald-900/10 bg-white">
                            <img
                                src="/images/HeroImage.png"
                                alt="Ayurvedic Wellness"
                                className="h-[500px] object-contain p-8 hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative blobs */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl -z-10"></div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/quiz')}
                            className="px-8 py-4 bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                        >
                            Take the Dosha Quiz
                        </button>
                    </div>
                    <p className='mt-5 text-[#898989]'>"This takes lessthan 3 minutes"</p>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
