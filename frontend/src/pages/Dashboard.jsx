import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { getProgressHistory } from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoverInfo, setHoverInfo] = useState({ visible: false, x: 0, y: 0, items: [], date: '' });
    const userId = user?.id;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getProgressHistory(userId, 42); // 6 weeks for better alignment
                setHistory(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (err) {
                setHistory([]);
                setLoading(false);
            }
        };
        if (userId) fetchHistory();
        else setLoading(false);
    }, [userId]);

    const getDates = () => {
        const dates = [];
        for (let i = 41; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };

    const dates = getDates();

    const getHistoryForDate = (date) => {
        if (!Array.isArray(history)) return null;
        return history.find(h => h.date === date);
    };

    const getIntensity = (date, type) => {
        const record = getHistoryForDate(date);
        if (!record || !record.completedItems) return 'bg-gray-50';

        const count = record.completedItems.filter(i => i.type === type).length;
        if (count === 0) return 'bg-gray-50';

        if (type === 'Meal') {
            if (count < 2) return 'bg-emerald-100';
            if (count < 4) return 'bg-emerald-300';
            return 'bg-emerald-500';
        } else {
            if (count < 1) return 'bg-indigo-100';
            if (count < 3) return 'bg-indigo-300';
            return 'bg-indigo-500';
        }
    };

    const handleMouseEnter = (e, date, type) => {
        const record = getHistoryForDate(date);
        const items = record ? record.completedItems.filter(i => i.type === type) : [];
        const rect = e.target.getBoundingClientRect();

        setHoverInfo({
            visible: true,
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY - 10,
            items: items.map(it => it.itemId.replace('item_', 'Habit ')), // Mocking better names
            date
        });
    };

    const totalCompletions = (type) => {
        if (!Array.isArray(history)) return 0;
        return history.reduce((acc, curr) => {
            return acc + (curr.completedItems?.filter(i => i.type === type).length || 0);
        }, 0);
    };

    const HeatmapField = ({ label, type, colorLabel }) => (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{label}</h3>
                    <p className="text-2xl font-black text-gray-900">{totalCompletions(type)} <span className="text-xs text-gray-400 font-bold uppercase">Done</span></p>
                </div>
                <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${colorLabel}`}></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Tracking</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1">
                {dates.map(date => (
                    <div
                        key={date}
                        onMouseEnter={(e) => handleMouseEnter(e, date, type)}
                        onMouseLeave={() => setHoverInfo({ ...hoverInfo, visible: false })}
                        className={`w-4 h-4 rounded-[3px] transition-all cursor-crosshair hover:scale-125 hover:z-10 ${getIntensity(date, type)}`}
                    ></div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            {/* Minimalist Tooltip */}
            {hoverInfo.visible && (
                <div
                    className="fixed z-[100] pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-2 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl border border-gray-800 backdrop-blur-md bg-opacity-90"
                    style={{ left: hoverInfo.x + 8, top: hoverInfo.y }}
                >
                    <p className="font-black border-b border-gray-700 pb-1 mb-1 text-gray-400 uppercase tracking-tighter">
                        {new Date(hoverInfo.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                    {hoverInfo.items.length > 0 ? (
                        <ul className="space-y-0.5">
                            {hoverInfo.items.map((item, id) => (
                                <li key={id} className="flex items-center gap-1.5 font-bold">
                                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="italic text-gray-500">No activity logged</p>
                    )}
                </div>
            )}

            <div className="container mx-auto px-4 pt-10">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Consistency Center</h1>
                        <p className="text-gray-500 font-medium">Monitoring your {user?.bodyType} lifestyle balance.</p>
                    </div>
                </header>

                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <HeatmapField label="Diet Consistency" type="Meal" colorLabel="bg-emerald-500" />
                        <HeatmapField label="Workout Intensity" type="Exercise" colorLabel="bg-indigo-500" />
                    </div>

                    {/* Overall Summary */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <h2 className="text-lg font-black text-gray-900 mb-4">Ayurvedic Journey Summary</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Habits</p>
                                    <p className="text-xl font-black text-gray-900">{totalCompletions('Meal') + totalCompletions('Exercise')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Active Since</p>
                                    <p className="text-xl font-black text-gray-900">42 Days</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Body Balance</p>
                                    <p className="text-xl font-black text-emerald-600">Stable</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-32 w-full md:w-64 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
                            <span className="text-xs font-bold text-gray-400 uppercase italic">Weekly Chart (Coming Soon)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
