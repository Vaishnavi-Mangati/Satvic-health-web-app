import React, { useState, useEffect } from 'react';
import { getCart, getCatalog, addToCart, updateQuantity, removeFromCart, clearCart } from '../services/api';
import Navbar from '../components/Navbar';
import {
    ShoppingCartIcon,
    PlusIcon,
    MinusIcon,
    TrashIcon,
    ArchiveBoxIcon,
    SparklesIcon,
    ChevronRightIcon,
    FaceFrownIcon,
    ShoppingBagIcon,
    CakeIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

const MarketCart = () => {
    const [cart, setCart] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const [view, setView] = useState('shop'); // 'shop' or 'cart'
    const [activeMainCategory, setActiveMainCategory] = useState('Diet');
    const [activeSubCategory, setActiveSubCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cartData, catalogData] = await Promise.all([getCart(), getCatalog()]);
            setCart(cartData || []);
            setCatalog(catalogData || []);

            // Set initial sub-category for Diet
            const dietSubs = [...new Set(catalogData.filter(p => p.mainCategory === 'Diet').map(p => p.subCategory))];
            if (dietSubs.length > 0) setActiveSubCategory(dietSubs[0]);

            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setLoading(false);
        }
    };

    const handleMainCategoryChange = (cat) => {
        setActiveMainCategory(cat);
        const subs = [...new Set(catalog.filter(p => p.mainCategory === cat).map(p => p.subCategory))];
        if (subs.length > 0) setActiveSubCategory(subs[0]);
    };

    const handleAddToCart = async (product) => {
        try {
            const updatedCart = await addToCart(product);
            setCart(updatedCart);
        } catch (err) {
            console.error("Add to cart failed:", err);
        }
    };

    const handleUpdateQuantity = async (name, newQty) => {
        if (newQty < 1) return;
        try {
            const updatedCart = await updateQuantity(name, newQty);
            setCart(updatedCart);
        } catch (err) {
            console.error("Update quantity failed:", err);
        }
    };

    const handleRemove = async (name) => {
        try {
            const updatedCart = await removeFromCart(name);
            setCart(updatedCart);
        } catch (err) {
            console.error("Remove failed:", err);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm("Are you sure you want to clear your entire cart?")) {
            try {
                await clearCart();
                setCart([]);
            } catch (err) {
                console.error("Clear cart failed:", err);
            }
        }
    };

    const subCategories = [...new Set(catalog.filter(p => p.mainCategory === activeMainCategory).map(p => p.subCategory))];
    const catalogBySelection = catalog.filter(p => p.mainCategory === activeMainCategory && p.subCategory === activeSubCategory);
    const totalItemsInCart = (cart || []).reduce((acc, curr) => acc + (curr.quantity || 0), 0);

    return (
        <div className="min-h-screen bg-[#FDFCF9] pb-24">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 pt-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <SparklesIcon className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600/60">Sathvic Marketplace</span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">Market Store</h1>
                        <p className="text-gray-500 font-medium text-lg max-w-lg">Handpicked healing ingredients and tools to support your journey to health.</p>
                    </div>

                    <div className="flex bg-gray-100/80 backdrop-blur-md p-1.5 rounded-[2rem] w-fit border border-gray-200/50">
                        <button
                            onClick={() => setView('shop')}
                            className={`px-10 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-300 ${view === 'shop' ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-500/10' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Explore Shop
                        </button>
                        <button
                            onClick={() => setView('cart')}
                            className={`px-10 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${view === 'cart' ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-500/10' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Bag
                            {totalItemsInCart > 0 && (
                                <span className="bg-indigo-600 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-black animate-pulse shadow-lg shadow-indigo-500/20">
                                    {totalItemsInCart}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="py-32 text-center">
                        <div className="relative w-20 h-20 mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Stocking the shelves...</p>
                    </div>
                ) : view === 'shop' ? (
                    <div className="space-y-12 animate-in fade-in duration-700">
                        {/* Main Category Tabs */}
                        <div className="flex justify-center md:justify-start gap-4">
                            <button
                                onClick={() => handleMainCategoryChange('Diet')}
                                className={`flex items-center gap-3 px-8 py-4 rounded-[1.8rem] text-sm font-black uppercase tracking-widest transition-all ${activeMainCategory === 'Diet' ? 'bg-amber-100 text-amber-700 shadow-lg shadow-amber-500/10' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            >
                                <CakeIcon className="w-5 h-5" />
                                Diet Essentials
                            </button>
                            <button
                                onClick={() => handleMainCategoryChange('Workout')}
                                className={`flex items-center gap-3 px-8 py-4 rounded-[1.8rem] text-sm font-black uppercase tracking-widest transition-all ${activeMainCategory === 'Workout' ? 'bg-indigo-100 text-indigo-700 shadow-lg shadow-indigo-500/10' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            >
                                <BoltIcon className="w-5 h-5" />
                                Workout Gear
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Categories Sidebar */}
                            <div className="lg:w-64 space-y-2">
                                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{activeMainCategory} Sections</p>
                                {subCategories.map(subCat => (
                                    <button
                                        key={subCat}
                                        onClick={() => setActiveSubCategory(subCat)}
                                        className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all group flex items-center justify-between ${activeSubCategory === subCat ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/10 border border-indigo-50' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {subCat}
                                        <ChevronRightIcon className={`w-4 h-4 transition-transform ${activeSubCategory === subCat ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                    </button>
                                ))}
                            </div>

                            {/* Product Grid */}
                            <div className="flex-1 space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {catalogBySelection.map(product => (
                                        <div key={product.name} className="bg-white border border-gray-100 rounded-[2.5rem] p-4 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500 group relative">
                                            {/* Image Placeholder */}
                                            <div className="aspect-[4/5] bg-gray-50 rounded-[2rem] mb-6 flex items-center justify-center overflow-hidden border border-gray-50 group-hover:border-indigo-50 transition-colors relative">
                                                <ArchiveBoxIcon className="w-16 h-16 text-gray-200 group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                                    Organic Choice
                                                </div>
                                            </div>

                                            <div className="px-4 pb-6">
                                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                                    {product.subCategory}
                                                </p>
                                                <h4 className="text-xl font-black text-gray-900 mb-6 group-hover:text-indigo-600 transition-colors line-clamp-2 h-14">
                                                    {product.name}
                                                </h4>

                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-gray-900/10 hover:shadow-indigo-600/30 flex items-center justify-center gap-3"
                                                >
                                                    <PlusIcon className="w-4 h-4" />
                                                    Add to Bag
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {catalogBySelection.length === 0 && (
                                    <div className="py-20 text-center">
                                        <FaceFrownIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 font-medium italic">No products currently available in this section.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <ShoppingBagIcon className="w-6 h-6 text-indigo-600" />
                                Your Selection
                            </h2>
                            {cart.length > 0 && (
                                <button
                                    onClick={handleClearCart}
                                    className="text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Clear Bag
                                </button>
                            )}
                        </div>

                        {cart.length === 0 ? (
                            <div className="py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-100 to-transparent"></div>
                                <ArchiveBoxIcon className="w-20 h-20 text-gray-100 mx-auto mb-8 group-hover:rotate-12 transition-transform duration-500" />
                                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Your bag is empty</h2>
                                <p className="text-gray-400 font-medium mb-12 max-w-xs mx-auto">Start your healing journey by selecting tools from our marketplace.</p>
                                <button
                                    onClick={() => setView('shop')}
                                    className="bg-indigo-600 text-white px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:ring-8 hover:ring-indigo-100 transition-all shadow-xl shadow-indigo-600/20"
                                >
                                    Go Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.name} className="flex items-center justify-between p-7 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group">
                                        <div className="flex items-center gap-8">
                                            <div className="w-20 h-24 bg-gray-50 rounded-[1.5rem] flex items-center justify-center border border-gray-50 group-hover:border-indigo-50 transition-all">
                                                <ArchiveBoxIcon className="w-10 h-10 text-gray-200" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-gray-900 leading-tight mb-1">{item.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-indigo-100"></span>
                                                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{item.category}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <div className="flex items-center bg-gray-50/50 rounded-2xl p-1 gap-4 border border-gray-100">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.name, (item.quantity || 1) - 1)}
                                                    className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-indigo-600"
                                                >
                                                    <MinusIcon className="w-5 h-5" />
                                                </button>
                                                <span className="font-black text-xl w-6 text-center text-gray-900">{item.quantity || 1}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.name, (item.quantity || 1) + 1)}
                                                    className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-indigo-600"
                                                >
                                                    <PlusIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.name)}
                                                className="text-gray-200 hover:text-red-500 transition-colors p-3 hover:bg-red-50 rounded-2xl"
                                            >
                                                <TrashIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-16 p-12 bg-gray-900 rounded-[3.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-indigo-600/40"></div>
                                    <div className="relative z-10 text-center md:text-left">
                                        <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                                            <SparklesIcon className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Preparation Summary</span>
                                        </div>
                                        <h3 className="text-4xl font-black mb-2 tracking-tight">Ready for Change</h3>
                                        <p className="text-gray-400 font-bold opacity-80 uppercase tracking-[0.2em] text-[10px]">Start integrating these essentials into your daily life.</p>
                                    </div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Total Selection</span>
                                        <div className="text-7xl font-black text-white leading-none">
                                            {totalItemsInCart}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-8 mt-12 mb-20 rounded-[2.5rem] bg-indigo-600 text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Confirm Essentials List
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketCart;
