import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Flame, Activity, Leaf, Dumbbell, Heart } from "lucide-react";
import { UserContext } from '../context/UserContext';
import { getProgressHistory, getPlan } from '../services/api';
import { ActivityHeatmapMonth } from "react-activity-heatmap";
import Navbar from '../components/Navbar';
import DaySummaryModal from '../components/DaySummaryModal';
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { doshaData as recommendations } from '../data/recommendations';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDayData, setSelectedDayData] = useState({ date: '', items: [] });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [plan, setPlan] = useState(null);
    const userId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProgressHistory(userId, 365);
                setHistory(Array.isArray(data) ? data : []);
                
                if (user?.bodyType) {
                    const userPlan = await getPlan(user.bodyType.toLowerCase());
                    setPlan(userPlan);
                }
                
                setLoading(false);
            } catch {
                setHistory([]);
                setPlan(null);
                setLoading(false);
            }
        };
        if (userId) fetchData();
        else setLoading(false);
    }, [userId, user?.bodyType]);

    // ---------- CALCULATIONS ----------

    const calculateCurrentStreak = () => {
        if (!history.length) return 0;

        const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
        let streak = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let checkDate = new Date(sorted[0].date);

        for (const record of sorted) {
            const recordDate = new Date(record.date);
            recordDate.setHours(0, 0, 0, 0);

            const diff = Math.floor((checkDate - recordDate) / (1000 * 60 * 60 * 24));

            if (diff === 0 && record.completedItems.length > 0) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    };

    const calculateActiveSince = () => {
        if (!history.length) return '0 Days';
        const earliest = Math.min(...history.map(h => new Date(h.date)));
        const diff = Math.ceil((new Date() - earliest) / (1000 * 60 * 60 * 24));
        return `${diff} Days`;
    };

    const calculateBodyBalance = () => {
        const last7 = history.filter(h => {
            const diff = (new Date() - new Date(h.date)) / (1000 * 60 * 60 * 24);
            return diff <= 7;
        });

        const total = last7.reduce((a, h) => a + h.completedItems.length, 0);
        const rate = total / (7 * 4);

        if (rate > 0.8) return 'Stable';
        if (rate > 0.4) return 'Adapting';
        return 'Needs Focus';
    };

    const getWeeklyData = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const record = history.find(h => h.date === dateStr);

            days.push({
                day: d.toLocaleDateString(undefined, { weekday: 'short' }),
                count: record ? record.completedItems.length : 0
            });
        }
        return days;
    };

    const weeklyData = getWeeklyData();
    const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.count, 0);
    const activeDays = history.filter(h => h.completedItems.length > 0).length;

    const wisdom = useMemo(() => {
        const type = user?.bodyType?.toLowerCase() || 'vata';
        const recs = recommendations[type];
        if (!recs) return "Balance is the key to a Satvic life.";
        const cat = ['diet', 'lifestyle', 'exercise'][Math.floor(Math.random() * 3)];
        return recs[cat][Math.floor(Math.random() * recs[cat].length)];
    }, [user?.bodyType]);

    const getActivities = () => {
        return history.map(record => {
            const [y, m, d] = record.date.split('-').map(Number);
            return {
                date: new Date(y, m - 1, d),
                count: record.completedItems.length,
                level: record.completedItems.length > 2 ? 3 : record.completedItems.length > 0 ? 2 : 0
            };
        });
    };

    const handleDayClick = (date) => {
        const record = history.find(h => h.date === date);
        setSelectedDayData({ date, items: record ? record.completedItems : [] });
        setIsModalOpen(true);
    };

    const getTodayStatus = () => {
        const todayStr = new Date().toISOString().split('T')[0];

        const todayRecord = history.find(h => h.date === todayStr);

        const completed = todayRecord ? todayRecord.completedItems.length : 0;

        let total = 4; // default fallback
        if (plan?.schedule) {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const todaySchedule = plan.schedule.find(d => d.day.toLowerCase() === today);
            if (todaySchedule) {
                total = todaySchedule.meals.length + todaySchedule.exercises.length;
            }
        }

        const percentage = Math.round((completed / total) * 100);

        return {
            completed,
            total,
            percentage
        };
    };

    const getGuidanceMeta = () => {
        const type = user?.bodyType?.toLowerCase() || 'vata';

        // simple mapping (you can expand later)
        if (type === 'vata') {
            return { icon: Leaf, color: "emerald", label: "Balance" };
        }
        if (type === 'pitta') {
            return { icon: Heart, color: "rose", label: "Cooling" };
        }
        return { icon: Dumbbell, color: "amber", label: "Activation" };
    };

        const getLastWeekTotal = () => {
        let total = 0;

        for (let i = 13; i >= 7; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const record = history.find(h => h.date === dateStr);
            if (record) total += record.completedItems.length;
        }

        return total;
    };

    const totalDays = history.length || 1;
    const activePercentage = Math.round((activeDays / totalDays) * 100);

    const activities = getActivities();
    const todayStatus = getTodayStatus();
    const guidanceMeta = getGuidanceMeta();
    const Icon = guidanceMeta.icon;
    const lastWeekTotal = getLastWeekTotal();
    const diff = weeklyTotal - lastWeekTotal;

    // ---------- UI ----------

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 pt-10 space-y-8">

                <div className="grid grid-cols-2 gap-6">
                    {/* 🟢 LEFT SIDE (Today + Guidance stacked) */}
                    <div className="flex flex-col gap-6">
                        {/* TODAY */}
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-[#e6efe6] flex-1">

                            <div className="flex items-center gap-2 mb-3 text-gray-600">
                                <Activity size={16} />
                                <h2 className="text-xs uppercase tracking-wider">Today</h2>
                            </div>

                            <div className="text-3xl font-bold text-gray-900">
                                {todayStatus.percentage}%
                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                                {todayStatus.completed}/{todayStatus.total} tasks completed
                            </p>

                            <p className="mt-4 text-xs font-medium text-emerald-600">
                                {todayStatus.percentage === 100
                                    ? "Streak secured for today"
                                    : "Complete today to maintain streak"}
                            </p>
                        </div>

                        {/* GUIDANCE */}
                        <div className="bg-white rounded-3xl p-6 border border-[#e6efe6] shadow-[0_8px_20px_rgba(0,0,0,0.04)] flex-1">

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Icon size={18} />
                                    <h3 className="text-sm font-semibold">Today’s Focus</h3>
                                </div>

                                <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold uppercase tracking-wide">
                                    {guidanceMeta.label}
                                </span>
                            </div>

                            <p className="text-gray-900 text-sm leading-normal font-medium">
                                {wisdom}
                            </p>

                            <p className="mt-4 text-xs text-gray-500">
                                {todayStatus.percentage < 50
                                    ? "Start small today — even 1 habit makes a difference"
                                    : todayStatus.percentage < 100
                                    ? "You're doing well — complete a few more to stay on track"
                                    : "Great job today — maintain this rhythm"}
                            </p>
                        </div>
                    </div>

                    {/* 🔴 RIGHT SIDE (STREAK) */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3 opacity-100">
                                <Flame size={16} />
                                <h2 className="text-xs uppercase tracking-wider">Current Streak</h2>
                            </div>

                            <div className="text-5xl font-black tracking-tight">
                                {calculateCurrentStreak()} Days
                            </div>

                            <p className="mt-2 text-sm text-white/90">
                                Your rhythm is building — stay consistent
                            </p>
                        </div>

                        {/* OPTIONAL subtle bottom indicator */}
                        <div className="text-xs opacity-70 mt-4">
                            Consistency builds long-term balance
                        </div>
                    </div>
                </div>

                {/* 🟢 WEEKLY */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-[#eef2ee]">

                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Weekly Momentum
                        </h3>

                        {/* 🔥 TREND */}
                        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            diff > 0 
                                ? "bg-emerald-100 text-emerald-700" 
                                : diff < 0 
                                ? "bg-rose-100 text-rose-600"
                                : "bg-gray-100 text-gray-600"
                        }`}>
                            {diff > 0 && `↑ +${diff}`}
                            {diff < 0 && `↓ ${diff}`}
                            {diff === 0 && `No change`}
                        </div>
                    </div>

                    {/* MAIN NUMBER */}
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {weeklyTotal}
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                        habits completed this week
                    </p>

                    {/* CHART */}
                    <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <XAxis dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10 }}
                            />
                            <ChartTooltip 
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '10px'
                                }}
                            />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                {weeklyData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={
                                            entry.count > 2
                                                ? '#10b981'
                                                : entry.count > 0
                                                ? '#6366f1'
                                                : '#e5e7eb'
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                </div>

                {/* HeatMap */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-[#eef2ee]">

                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Consistency
                        </h3>

                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                        >
                            {[2024, 2025, 2026].map(y => (
                                <option key={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    {/* 🔥 SUMMARY */}
                    <div className="mb-6">
                        <div className="text-3xl font-bold text-gray-900">
                            {activePercentage}%
                        </div>
                        <p className="text-sm text-gray-500">
                            days active this year
                        </p>
                    </div>

                    {/* HEATMAP */}
                    <div className="flex justify-center-safe gap-7 overflow-x-auto pb-2">

                        {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                            <div key={m} className="shrink-0">

                                <ActivityHeatmapMonth
                                    activities={activities}
                                    month={m}
                                    year={selectedYear}
                                    cellStyle={{
                                        borderRadius: "4px",
                                        width: "16px",
                                        height: "16px"
                                    }}
                                    cellLevel0Color="#edf2ed"
                                    customCellColors={{
                                        level1: "#86efac",
                                        level2: "#34d399",
                                        level3: "#059669"
                                    }}
                                    monthNameStyle={{
                                        fontSize: "10px",
                                        fontWeight: "600",
                                        color: "#6b7280",
                                        marginBottom: "6px"
                                    }}
                                    onCellClick={(cell) => {
                                        if (cell.date) {
                                            const y = cell.date.getFullYear();
                                            const mo = String(cell.date.getMonth()+1).padStart(2,'0');
                                            const d = String(cell.date.getDate()).padStart(2,'0');
                                            handleDayClick(`${y}-${mo}-${d}`);
                                        }
                                    }}
                                />

                            </div>
                        ))}

                    </div>

                </div>

            </motion.div>

            <DaySummaryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                date={selectedDayData.date}
                items={selectedDayData.items}
            />
        </div>
    );
};

export default Dashboard;