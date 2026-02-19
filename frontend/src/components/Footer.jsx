import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-emerald-800 flex items-center gap-2 mb-4">
                            <span>Satvic Health</span>
                        </Link>
                        <p className="text-stone-600 mb-6">
                            Balancing ancient Ayurveda with modern science for your holistic well-being.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-stone-800 mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-stone-600 hover:text-emerald-700 transition-colors">Home</Link></li>
                            <li><Link to="/quiz" className="text-stone-600 hover:text-emerald-700 transition-colors">Take Quiz</Link></li>
                            <li><Link to="/login" className="text-stone-600 hover:text-emerald-700 transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-stone-800 mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><span className="text-stone-600 cursor-not-allowed">Ayurveda 101</span></li>
                            <li><span className="text-stone-600 cursor-not-allowed">Recipes</span></li>
                            <li><span className="text-stone-600 cursor-not-allowed">Yoga Guides</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-stone-800 mb-4">Contact</h4>
                        <p className="text-stone-600 mb-2">support@satvichealth.com</p>
                        <div className="flex space-x-4 mt-4">
                            {/* Social placeholders */}
                            <div className="w-8 h-8 rounded-full bg-stone-200 hover:bg-emerald-100 transition-colors cursor-pointer"></div>
                            <div className="w-8 h-8 rounded-full bg-stone-200 hover:bg-emerald-100 transition-colors cursor-pointer"></div>
                            <div className="w-8 h-8 rounded-full bg-stone-200 hover:bg-emerald-100 transition-colors cursor-pointer"></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-stone-500">
                    <p>&copy; {new Date().getFullYear()} Satvic Health. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="cursor-pointer hover:text-emerald-700">Privacy Policy</span>
                        <span className="cursor-pointer hover:text-emerald-700">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
