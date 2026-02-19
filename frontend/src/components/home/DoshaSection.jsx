import React from 'react';

const DoshaCard = ({ title, elements, description, color, icon }) => (
    <div className={`p-8 rounded-3xl bg-white border border-${color}-100 shadow-lg shadow-${color}-900/5 hover:-translate-y-2 transition-transform duration-300`}>
        <div className={`w-14 h-14 rounded-2xl bg-${color}-100 flex items-center justify-center text-2xl mb-6`}>
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-stone-800 mb-2">{title}</h3>
        <p className={`text-sm font-semibold text-${color}-600 mb-4 uppercase tracking-wider`}>{elements}</p>
        <p className="text-stone-600 leading-relaxed mb-6">
            {description}
        </p>
    </div>
);

const DoshaSection = () => {
    return (
        <section className="py-20 lg:py-28">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">The Three Energies</span>
                    <h2 className="text-3xl lg:text-5xl font-bold text-stone-900 mt-3 mb-6">Understand Your <span className="text-indigo-600">Dosha</span></h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        According to Ayurveda, everyone is born with a unique mix of three biological energies: Vata, Pitta, and Kapha.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Vata Card - using standard CSS classes for mapped colors might require specific tailwind classes if using dynamic strings.
              To be safe, I'm hardcoding classes or using minimal dynamic logic.
              Actually let's just hardcode the cards for better control.
          */}

                    <div className="p-8 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl mb-6">
                            🌬️
                        </div>
                        <h3 className="text-2xl font-bold text-stone-800 mb-2">Vata</h3>
                        <p className="text-sm font-semibold text-blue-600 mb-4 uppercase tracking-wider">Air & Ether</p>
                        <p className="text-stone-600 leading-relaxed">
                            Creative, energetic, and quick-moving. When out of balance, Vata types may experience anxiety, dryness, or irregularity.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-red-100 shadow-lg shadow-red-900/5 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-2xl mb-6">
                            🔥
                        </div>
                        <h3 className="text-2xl font-bold text-stone-800 mb-2">Pitta</h3>
                        <p className="text-sm font-semibold text-red-600 mb-4 uppercase tracking-wider">Fire & Water</p>
                        <p className="text-stone-600 leading-relaxed">
                            Intelligent, focused, and ambitious. Imbalanced Pitta can lead to irritability, inflammation, or perfectionism.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-green-100 shadow-lg shadow-green-900/5 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl mb-6">
                            🏔️
                        </div>
                        <h3 className="text-2xl font-bold text-stone-800 mb-2">Kapha</h3>
                        <p className="text-sm font-semibold text-green-600 mb-4 uppercase tracking-wider">Earth & Water</p>
                        <p className="text-stone-600 leading-relaxed">
                            Calm, loving, and steady. Excess Kapha may result in lethargy, weight gain, or resistance to change.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DoshaSection;
