import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 bg-stone-900 text-white rounded-t-[3rem] lg:rounded-t-[4rem] -mx-2 lg:-mx-4 m-[200px]">
            <div className="container px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl lg:text-5xl font-bold mb-8 leading-tight">
                            Personalized Plans <br />
                            <span className="text-emerald-400">That Actually Work</span>
                        </h2>
                        <p className="text-stone-300 text-lg mb-8 leading-relaxed">
                            Stop guessing. Our algorithm analyses your unique body constitution to generate a comprehensive daily routine.
                        </p>

                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Dietary Guidelines</h4>
                                    <p className="text-stone-400">Foods to eat and avoid for your specific body type.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Tailored Workouts</h4>
                                    <p className="text-stone-400">Yoga and exercises that balance your energy, not deplete it.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Consistency Interaction</h4>
                                    <p className="text-stone-400">Track your meals and habits with our daily progress dashboard.</p>
                                </div>
                            </li>
                        </ul>

                        <button
                            onClick={() => navigate('/login')}
                            className="mt-10 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors"
                        >
                            Start Tracking Today
                        </button>
                    </div>

                    <div className="w-full lg:w-1/2">
                        {/* Contextual mock or illustration of the dashboard */}
                        <div className="relative bg-stone-800 rounded-3xl p-6 shadow-2xl border border-stone-700 aspect-video flex items-center justify-center overflow-hidden">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-stone-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    📊
                                </div>
                                <p className="text-stone-400 font-medium">Dashboard Preview</p>
                                <p className="text-xs text-stone-600 mt-2">Heatmaps & Daily Streaks</p>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
