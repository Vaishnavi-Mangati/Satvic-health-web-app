import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBodyType } from "../utils/getBodyType";
import { resultData } from '../data/resultData';
import { UserContext } from '../context/UserContext';

const Result = () => {
  // used to read data that is sent from other page
  const location = useLocation()
  const navigate = useNavigate();
  const { saveBodyType, user } = useContext(UserContext);

  // get scores from quiz page
  const { vataScore, pittaScore, kaphaScore } = location.state;

  const bodyType = getBodyType(vataScore, pittaScore, kaphaScore);
  const data = resultData[bodyType];

  useEffect(() => {
    if (bodyType) {
      saveBodyType(bodyType);
    }
  }, [bodyType]);

  if (!data) {
    return <div className="text-center mt-20">Calculating result...</div>
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-gray-50 py-10'>
      <h1 className='text-4xl font-bold mb-8 text-gray-800'>Your Body Type Analysis</h1>

      <div className='flex flex-wrap justify-center gap-4 mb-6'>
        {data.traits && data.traits.map((trait, index) => (
          <p key={index} className='px-6 py-3 border-2 border-blue-200 bg-white rounded-full text-blue-800 font-medium shadow-sm'>
            {trait}
          </p>
        ))}
      </div>

      <div className="mb-8">
        <img
          src={data.image}
          alt={data.title}
          className='h-72 w-72 object-cover rounded-full border-8 border-white shadow-md'
          onError={(e) => { e.target.src = 'https://dummyimage.com/288/4f46e5/ffffff?text=Body+Type'; }} // Fallback
        />
      </div>

      <div className='text-center max-w-lg px-6'>
        <h2 className="text-3xl font-bold mb-3 text-gray-900 leading-tight">{data.title}</h2>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{data.description}</p>
        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
          <p className='text-lg font-semibold text-orange-900'>Goal: {data.goal}</p>
        </div>
      </div>

      <div className='flex flex-col items-center gap-4 mt-10'>
        {user ? (
          <button
            onClick={() => navigate('/my-plan')}
            className='bg-indigo-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-indigo-800 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
          >
            Go to My Dashboard
          </button>
        ) : (
          <div className="flex flex-col items-center gap-6 bg-white p-8 rounded-3xl border border-indigo-100 shadow-sm">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Save your progress?</h3>
              <p className="text-gray-500 text-sm max-w-xs">Create an account to save your {data.title} plan and track your daily habits.</p>
            </div>
            <button
              onClick={() => navigate('/register')}
              className='w-full bg-indigo-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-indigo-800 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
            >
              Sign Up to Get Routine
            </button>
            <p className="text-xs text-gray-400">Join 10,000+ people on their ayurvedic journey.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Result
