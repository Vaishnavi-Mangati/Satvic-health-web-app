import React from 'react';

const AboutSection = () => {
    return (
        <section className="py-20 bg-stone-50">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-6">
                        Why <span className="text-emerald-700">Satvic Health?</span>
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed mb-12">
                        In a world of generic diet plans and one-size-fits-all workouts, we return to the roots.
                        Ayurveda teaches us that every individual is unique. Your path to health shouldn't be the same as everyone else's.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                            🌿
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">Ancient Wisdom</h3>
                        <p className="text-stone-600">Based on 5,000-year-old Ayurvedic principles of balancing the three Doshas.</p>
                    </div>

                    <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                            🧬
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">Modern Science</h3>
                        <p className="text-stone-600">Actionable insights backed by nutritional science and modern fitness understanding.</p>
                    </div>

                    <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                            🧘
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">Holistic Balance</h3>
                        <p className="text-stone-600">We don't just focus on the body. We nurture your mind, body, and spirit together.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
