import React, { useState, useContext } from 'react'
import { questions } from '../data/questions';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ScaleIcon, ArrowsUpDownIcon, HeartIcon } from '@heroicons/react/24/outline';

const Quiz = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext);

  // Scoring State
  const [vataScore, setVataScore] = useState(0);
  const [pittaScore, setPittaScore] = useState(0);
  const [kaphaScore, setKaphaScore] = useState(0);

  // Health Metrics State
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [healthConditions, setHealthConditions] = useState([]);

  // Flow Control
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizStep, setQuizStep] = useState('ayurveda'); // 'ayurveda', 'stats', 'health'
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const conditionsList = [
    'Diabetes', 'High BP', 'Low BP', 'PCOS/PCOD', 'Thyroid', 'IBS', 'None'
  ];

  const handleNext = () => {
    if (quizStep === 'ayurveda') {
      if (selectedOption != null) {
        setError('');
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOption(null);
        } else {
          setQuizStep('stats');
        }
      } else {
        setError("Please select an option before continuing.");
      }
    } else if (quizStep === 'stats') {
      if (height > 0 && weight > 0) {
        setError('');
        setQuizStep('health');
      } else {
        setError("Please enter valid height and weight.");
      }
    } else if (quizStep === 'health') {
      if (healthConditions.length > 0) {
        navigate('/result', {
          state: {
            vataScore, pittaScore, kaphaScore,
            height: Number(height),
            weight: Number(weight),
            healthConditions
          }
        });
      } else {
        setError("Please select at least one option (select 'None' if applicable).");
      }
    }
  }

  const selectOption = (type) => {
    if (selectedOption === type) return;
    if (selectedOption === "Vata") setVataScore(s => s - 1);
    if (selectedOption === "Pitta") setPittaScore(s => s - 1);
    if (selectedOption === "Kapha") setKaphaScore(s => s - 1);

    if (type === "Vata") setVataScore(s => s + 1);
    if (type === "Pitta") setPittaScore(s => s + 1);
    if (type === "Kapha") setKaphaScore(s => s + 1);

    setSelectedOption(type);
    setError('');
  }

  const toggleCondition = (condition) => {
    if (condition === 'None') {
      setHealthConditions(['None']);
      return;
    }

    let newConditions = healthConditions.filter(c => c !== 'None');
    if (newConditions.includes(condition)) {
      newConditions = newConditions.filter(c => c !== condition);
    } else {
      newConditions.push(condition);
    }
    setHealthConditions(newConditions);
  }

  const renderAyurvedaStep = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 leading-tight">
        {questions[currentQuestion].question}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {['Vata', 'Pitta', 'Kapha'].map((type, idx) => (
          <button
            key={type}
            onClick={() => selectOption(type)}
            className={`group relative p-6 border-2 rounded-2xl transition-all duration-300 flex flex-col items-center text-center ${selectedOption === type ? 'border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600' : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm'}`}
          >
            <div className="mb-4 overflow-hidden rounded-xl bg-gray-50 w-full aspect-square flex items-center justify-center">
              <img
                src={questions[currentQuestion].options[idx].img}
                className="h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                alt={questions[currentQuestion].options[idx].text}
              />
            </div>
            <span className={`text-lg font-bold ${selectedOption === type ? 'text-indigo-900' : 'text-gray-700'}`}>
              {questions[currentQuestion].options[idx].text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStatsStep = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-4">
      <div className="text-center mb-10">
        <ScaleIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-3xl font-black text-gray-900 mb-2">Physical Measurements</h1>
        <p className="text-gray-500">We need these to calculate your BMI and adjust your plan energy needs.</p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Height (cm)</label>
          <div className="relative">
            <ArrowsUpDownIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              placeholder="e.g. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-5 pl-12 pr-4 text-xl font-bold focus:border-indigo-600 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Weight (kg)</label>
          <div className="relative">
            <ScaleIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              placeholder="e.g. 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-5 pl-12 pr-4 text-xl font-bold focus:border-indigo-600 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthStep = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-4">
      <div className="text-center mb-10">
        <HeartIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-black text-gray-900 mb-2">Health Markers</h1>
        <p className="text-gray-500">Do you have any common conditions we should account for?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {conditionsList.map(condition => (
          <button
            key={condition}
            onClick={() => toggleCondition(condition)}
            className={`p-5 rounded-2xl border-2 text-left transition-all ${healthConditions.includes(condition) ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-100 bg-white hover:border-indigo-100'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${healthConditions.includes(condition) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200'}`}>
                {healthConditions.includes(condition) && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <span className={`font-bold ${healthConditions.includes(condition) ? 'text-indigo-900' : 'text-gray-700'}`}>{condition}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const totalSteps = questions.length + 2;
  const currentStepIndex = quizStep === 'ayurveda' ? currentQuestion : quizStep === 'stats' ? questions.length : questions.length + 1;
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase">Step {currentStepIndex + 1} of {totalSteps}</span>
            <span className="text-sm font-bold text-gray-500">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-indigo-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
          {quizStep === 'ayurveda' && renderAyurvedaStep()}
          {quizStep === 'stats' && renderStatsStep()}
          {quizStep === 'health' && renderHealthStep()}

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-12 border-t pt-8">
            <div className="h-6">
              {error && <p className="text-red-500 font-semibold text-sm animate-pulse">{error}</p>}
            </div>
            <button
              onClick={handleNext}
              className="w-full md:w-auto bg-indigo-700 text-white px-16 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-indigo-800 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              {quizStep === 'health' ? 'Generate Smart Plan' : 'Continue'}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-400 text-sm font-medium">Your data is secured with Sathvic Protocol standards. 🌿</p>
      </div>
    </div>
  )
}

export default Quiz
