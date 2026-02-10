import React, { useState } from 'react'
import { questions } from '../data/questions';
import { useNavigate, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Quiz = () => {
  const navigate = useNavigate()
  const [vataScore, setVataScore] = useState(0);
  const [pittaScore, setPittaScore] = useState(0);
  const [kaphaScore, setKaphaScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState('');

  const { user } = useContext(UserContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const showNextQuestion = () => {
    if (selectedOption != null) {
      setError('');
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      }
      else {
        navigate('/result', { state: { vataScore, pittaScore, kaphaScore } })
      }
    }
    else {
      setError("Please select an option before continuing.");
    }
  }

  const selectOption = (type) => {
    if (selectedOption === type) return;

    // Dynamic score adjustment
    if (selectedOption === "Vata") setVataScore(s => s - 1);
    if (selectedOption === "Pitta") setPittaScore(s => s - 1);
    if (selectedOption === "Kapha") setKaphaScore(s => s - 1);

    if (type === "Vata") setVataScore(s => s + 1);
    if (type === "Pitta") setPittaScore(s => s + 1);
    if (type === "Kapha") setKaphaScore(s => s + 1);

    setSelectedOption(type);
    setError('');
  }

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm font-bold text-gray-500">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-indigo-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
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

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="h-6">
              {error && <p className="text-red-500 font-semibold text-sm animate-pulse">{error}</p>}
            </div>
            <button
              onClick={showNextQuestion}
              className="w-full md:w-auto bg-indigo-700 text-white px-16 py-4 rounded-xl text-lg font-bold hover:bg-indigo-800 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz
