import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { getPlan, getProgress, toggleProgress } from '../services/api';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SparklesIcon } from '@heroicons/react/24/outline';

const MyPlan = () => {
    const { bodyType, user } = useContext(UserContext);
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('today');
    const [subTab, setSubTab] = useState('diet');
    const [completedItems, setCompletedItems] = useState([]);

    // Temporary mock user ID until full auth is implemented
    const userId = user?.id || 'guest_user';
    const todayDate = new Date().toISOString().split('T')[0];
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

    useEffect(() => {
        if (bodyType) {
            setLoading(true);

            const healthData = {
                height: user?.physicalStats?.height,
                weight: user?.physicalStats?.weight,
                healthConditions: user?.healthConditions
            };

            Promise.all([
                getPlan(bodyType, healthData),
                getProgress(userId, todayDate)
            ])
                .then(([planData, progressData]) => {
                    setPlan(planData);
                    setCompletedItems(progressData.completedItems || []);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Failed to load your plan or progress');
                    setLoading(false);
                });
        }
    }, [bodyType, userId, todayDate, user]);

    const handleToggle = async (itemId, type) => {
        try {
            const updated = await toggleProgress(userId, todayDate, itemId, type);
            setCompletedItems(updated.completedItems);
        } catch (err) {
            console.error("Failed to toggle item:", err);
        }
    };

    const isCompleted = (itemId) => completedItems.some(item => item.itemId === itemId);

    if (!bodyType) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Plan Not Found</h2>
                    <p className="text-gray-600 mb-8">Please complete the body type analysis quiz to unlock your personalized health journey.</p>
                    <Link to="/quiz" className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">Take Quiz</Link>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading your plan...</span>
        </div>
    );

    if (error) return <div className="text-center mt-20 text-red-500 font-medium">{error}</div>;

    const todayPlan = plan?.schedule.find(d => d.day === dayName) || plan?.schedule[0];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            {/* Header Section */}
            <div className="bg-white border-b px-4 py-8 shadow-sm">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-2">My {plan?.bodyType} Wellness</h1>
                    <p className="text-center text-gray-500 max-w-2xl mx-auto">{plan?.description}</p>

                    {/* Tab Switcher */}
                    <div className="flex justify-center mt-8">
                        <div className="bg-gray-100 p-1 rounded-xl flex">
                            <button
                                onClick={() => setActiveTab('today')}
                                className={`px-8 py-2 rounded-lg font-semibold transition ${activeTab === 'today' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Today's Checklist
                            </button>
                            <button
                                onClick={() => setActiveTab('week')}
                                className={`px-8 py-2 rounded-lg font-semibold transition ${activeTab === 'week' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Weekly Overview
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-4 mt-8">
                {activeTab === 'today' ? (
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Today, {dayName}</h2>
                                <p className="text-sm text-gray-500 mt-1">Focus on consistency to see results.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {plan?.intelligenceActive && (
                                    <div className="text-[10px] bg-amber-500 text-white px-3 py-1.5 rounded-full font-black uppercase tracking-widest flex items-center gap-2 animate-pulse shadow-lg shadow-amber-500/20">
                                        <SparklesIcon className="w-3 h-3" />
                                        Health Intelligence Active
                                    </div>
                                )}
                                <div className="text-sm bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold shadow-sm">
                                    {completedItems.length} / {(todayPlan?.meals.length || 0) + (todayPlan?.exercises.length || 0)} Total Tasks
                                </div>
                            </div>
                        </div>

                        {/* Sub-Tab Switcher (Diet vs Workout) */}
                        <div className="flex space-x-4 mb-8">
                            <button
                                onClick={() => setSubTab('diet')}
                                className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 ${subTab === 'diet' ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-green-100'}`}
                            >
                                <span className="mr-2">🥗</span> Diet Plan
                            </button>
                            <button
                                onClick={() => setSubTab('workout')}
                                className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 ${subTab === 'workout' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-100'}`}
                            >
                                <span className="mr-2">🧘</span> Workout Plan
                            </button>
                        </div>

                        {subTab === 'diet' ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {todayPlan?.meals.map((meal, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleToggle(meal.item, 'Meal')}
                                        className={`group flex items-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${isCompleted(meal.item) ? 'bg-green-50 border-green-200 opacity-75' : 'hover:border-green-400 border-gray-100 bg-white shadow-sm hover:shadow-md'}`}
                                    >
                                        <div className={`w-7 h-7 rounded-full border-2 mr-5 flex items-center justify-center transition-all ${isCompleted(meal.item) ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 text-transparent'}`}>
                                            <span className="text-xs">✓</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className={`font-bold text-lg mb-1 ${isCompleted(meal.item) ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                    {meal.type}: {meal.item}
                                                </p>
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-bold">{meal.calories} kcal</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <p className="text-sm text-gray-500 leading-relaxed">{meal.ingredients.join(', ')}</p>
                                                {meal.diabetesOverlay && <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 uppercase tracking-widest flex items-center gap-1"><SparklesIcon className="w-2 h-2" /> Diabetes Swap</span>}
                                                {meal.hpnOverlay && <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 uppercase tracking-widest flex items-center gap-1"><SparklesIcon className="w-2 h-2" /> BP Optimized</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {todayPlan?.exercises.map((ex, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleToggle(ex.name, 'Exercise')}
                                        className={`group flex items-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${isCompleted(ex.name) ? 'bg-blue-50 border-blue-200 opacity-75' : 'hover:border-blue-400 border-gray-100 bg-white shadow-sm hover:shadow-md'}`}
                                    >
                                        <div className={`w-7 h-7 rounded-full border-2 mr-5 flex items-center justify-center transition-all ${isCompleted(ex.name) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-200 text-transparent'}`}>
                                            <span className="text-xs">✓</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className={`font-bold text-lg mb-1 ${isCompleted(ex.name) ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                    {ex.name}
                                                </p>
                                                <span className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-600 font-bold">{ex.duration}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">{ex.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-green-100 p-6 rounded-2xl border border-green-200">
                                <h3 className="text-xl font-bold mb-3 text-green-900 flex items-center">
                                    <span className="mr-2">🥑</span> Dietary Guidelines
                                </h3>
                                <ul className="space-y-2">
                                    {plan?.dietaryGuidelines.map((g, i) => (
                                        <li key={i} className="flex items-start text-green-800">
                                            <span className="mr-2">•</span> {g}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-blue-100 p-6 rounded-2xl border border-blue-200">
                                <h3 className="text-xl font-bold mb-3 text-blue-900 flex items-center">
                                    <span className="mr-2">💪</span> Workout Guidelines
                                </h3>
                                <ul className="space-y-2">
                                    {plan?.workoutGuidelines.map((g, i) => (
                                        <li key={i} className="flex items-start text-blue-800">
                                            <span className="mr-2">•</span> {g}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">7-Day Journey</h2>
                        <div className="grid lg:grid-cols-2 gap-6">
                            {plan?.schedule.map((dayPlan, index) => (
                                <div key={index} className="bg-white rounded-2xl p-6 border shadow-sm group hover:shadow-md transition">
                                    <h3 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2 group-hover:text-indigo-600 transition">{dayPlan.day}</h3>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Meals</h4>
                                            <ul className="space-y-3">
                                                {dayPlan.meals.map((meal, mIdx) => (
                                                    <li key={mIdx} className="text-sm">
                                                        <p className="font-semibold text-gray-800">{meal.type}</p>
                                                        <p className="text-gray-500">{meal.item}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Movement</h4>
                                            <ul className="space-y-3">
                                                {dayPlan.exercises.map((ex, eIdx) => (
                                                    <li key={eIdx} className="text-sm">
                                                        <p className="font-semibold text-gray-800">{ex.name}</p>
                                                        <p className="text-gray-500">{ex.duration} ({ex.category})</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPlan;
