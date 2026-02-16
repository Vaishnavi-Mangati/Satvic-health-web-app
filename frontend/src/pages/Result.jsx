import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBodyType } from "../utils/getBodyType";
import { resultData } from '../data/resultData';
import { UserContext } from '../context/UserContext';
import { ChevronRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Result = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const { saveBodyType, user } = useContext(UserContext);

  const {
    vataScore, pittaScore, kaphaScore,
    height, weight, healthConditions
  } = location.state || { vataScore: 0, pittaScore: 0, kaphaScore: 0, healthConditions: [] };

  const bodyType = getBodyType(vataScore, pittaScore, kaphaScore);
  const data = resultData[bodyType];

  useEffect(() => {
    if (bodyType) {
      saveBodyType(bodyType);
    }
  }, [bodyType]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="mt-4 font-black uppercase tracking-widest text-gray-400 text-xs text-center">Synthesizing Physical Markers...</p>
      </div>
    );
  }

  // Calculate BMI for display
  const bmi = (height && weight) ? (weight / (Math.pow(height / 100, 2))).toFixed(1) : 0;
  let bmiCategory = 'Normal';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi < 25) bmiCategory = 'Normal';
  else if (bmi < 30) bmiCategory = 'Overweight';
  else bmiCategory = 'Obese';

  return (
    <div className='min-h-screen bg-[#FDFCF9] py-16 px-6'>
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6 border border-indigo-100">
            <SparklesIcon className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">Assessment Complete</span>
          </div>
          <h1 className='text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-none mb-4'>Your Body Essence</h1>
          <p className="text-gray-500 font-medium text-lg">A personalized analysis based on your dosha and physical markers.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="animate-in fade-in slide-in-from-left-6 duration-700 delay-150">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-300 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img
                src={data.image}
                alt={data.title}
                className='relative z-10 w-full aspect-square object-cover rounded-[3.5rem] border-8 border-white shadow-2xl shadow-indigo-500/10'
                onError={(e) => { e.target.src = 'https://dummyimage.com/600/4f46e5/ffffff?text=' + bodyType; }}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center animate-in fade-in slide-in-from-right-6 duration-700 delay-300">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-4">Primary Constitution</h2>
            <h2 className="text-5xl font-black text-gray-900 mb-6">{data.title}</h2>

            <div className='flex flex-wrap gap-3 mb-8'>
              {data.traits && data.traits.map((trait, index) => (
                <span key={index} className='px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-gray-700 font-black text-[10px] uppercase tracking-widest shadow-sm'>
                  {trait}
                </span>
              ))}
            </div>

            {/* Smart Stats Summary */}
            <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-indigo-500/5 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Calculated BMI</p>
                  <p className="text-3xl font-black text-gray-900">{bmi}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${bmiCategory === 'Normal' ? 'text-green-500' : 'text-amber-500'}`}>{bmiCategory}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Conditions</p>
                  <p className="text-xl font-black text-gray-900 line-clamp-1">
                    {healthConditions.includes('None') ? 'Optimal' : healthConditions.join(', ')}
                  </p>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Smart Filter Active</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-500 font-medium leading-relaxed italic mb-8 border-l-4 border-indigo-100 pl-6">"{data.description}"</p>

            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl transition-all group-hover:bg-white/20"></div>
              <p className='text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-2'>Core Goal</p>
              <p className='text-xl font-black leading-tight'>{data.goal}</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col items-center mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500'>
          {user ? (
            <button
              onClick={() => navigate('/my-plan')}
              className='bg-gray-900 text-white px-12 py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-gray-900/10 hover:shadow-indigo-600/30 transform hover:-translate-y-1 active:scale-95 flex items-center gap-4'
            >
              Access My Smart Plan
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-full bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl shadow-indigo-500/5 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Generate Your Smart Protocol</h3>
              <p className="text-gray-500 font-medium mb-12 max-w-sm mx-auto">Create a profile to save your BMI-adjusted {data.title} plan and track daily healing markers.</p>

              <button
                onClick={() => navigate('/register', { state: { vataScore, pittaScore, kaphaScore, height, weight, healthConditions } })}
                className='bg-indigo-600 text-white px-16 py-6 rounded-3xl text-sm font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all shadow-2xl shadow-indigo-600/20 hover:shadow-gray-900/30 transform hover:-translate-y-1 active:scale-95'
              >
                Sign Up to Save Progress
              </button>

              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-${i * 100 + 100}`}></div>)}
                </div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-2">Joined by 12,400+ members this week</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Result
