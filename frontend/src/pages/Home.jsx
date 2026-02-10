import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'


const Home = () => {
    const navigate = useNavigate();

    const takeQuiz = () => {
        navigate("/quiz")
    }

    // direct navigation to result page
    const goToResultPage = () => {
        navigate("/result", {
            state: { vataScore: 8, pittaScore: 2, kaphaScore: 5 }
        });
    };
    // remove this function after completing the development

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <main className="container mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight max-w-4xl">
                    Discover your unique Ayurvedic body type.
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl">
                    Unlock a personalized 7-day health journey tailored to your Dosha—balancing ancient wisdom with modern science.
                </p>

                <div className="relative mb-12">
                    <img
                        src='/images/HeroImage.png'
                        alt="Hand-drawn Ayurvedic herbs and wellness illustration"
                        className='h-[480px] w-auto rounded-3xl object-contain'
                    />
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <button
                        className='bg-indigo-700 text-white px-10 py-5 rounded-xl text-xl font-bold shadow-sm hover:shadow-md hover:bg-indigo-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0'
                        onClick={takeQuiz}
                    >
                        Start Your Wellness Quiz
                    </button>
                    <p className="text-gray-500 font-medium">Detailed results in less than 3 minutes.</p>
                </div>
            </main>
        </div>
    )
}

export default Home
