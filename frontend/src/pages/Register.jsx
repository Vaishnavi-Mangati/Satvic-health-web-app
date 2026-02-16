import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { registerUser } from '../services/api';
import { UserContext } from '../context/UserContext';

const Register = () => {
    const location = useLocation();
    const { login } = useContext(UserContext);
    const {
        vataScore = 0, pittaScore = 0, kaphaScore = 0,
        height = 0, weight = 0, healthConditions = [], bodyType = null
    } = location.state || {};

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bodyType,
        scores: { vata: vataScore, pitta: pittaScore, kapha: kaphaScore },
        height,
        weight,
        healthConditions
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await registerUser(formData);
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9] px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
                <div className="text-center">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">Join Sathvic</h2>
                    <p className="text-gray-500 font-medium">
                        Your personalized {bodyType} journey starts here.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-sm font-bold border border-red-100 animate-shake">{error}</div>}
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 placeholder-gray-300 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-bold"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 placeholder-gray-300 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-bold"
                                placeholder="name@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Security Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 placeholder-gray-300 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-bold"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-50 text-center">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Authenticated Snapshot</p>
                        <p className="text-xs text-indigo-900 font-bold opacity-80">{bodyType} Protocol • BMI {((formData.weight) / (Math.pow(formData.height / 100, 2))).toFixed(1)} • {formData.healthConditions.length} Health Markers</p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-5 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-gray-900 hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-xl shadow-gray-900/10 hover:shadow-indigo-600/30 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Syncing Protocol...
                                </span>
                            ) : 'Generate My Lifestyle'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/login" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-500 transition-colors">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
