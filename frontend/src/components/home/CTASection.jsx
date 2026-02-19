import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 lg:py-28 bg-emerald-800 text-white rounded-t-[3rem] lg:rounded-t-[4rem] relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to Transform Your Health?</h2>
                <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
                    Join thousands of others discovering the power of Ayurvedic living. Your personalized plan is just a few clicks away.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => navigate('/quiz')}
                        className="px-8 py-4 bg-white text-emerald-900 rounded-xl font-bold text-lg hover:bg-emerald-50 shadow-lg transition-transform hover:-translate-y-1"
                    >
                        Taken the Quiz Yet?
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-4 bg-emerald-700 text-white border border-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-transform hover:-translate-y-1"
                    >
                        Create Free Account
                    </button>
                </div>

                <p className="mt-8 text-sm text-emerald-200/60">No credit card required. Free 7-day trial included.</p>
            </div>
        </section>
    );
};

export default CTASection;
