import React, { Fragment } from 'react';
import { Dialog, Transition, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon, FireIcon, BeakerIcon } from '@heroicons/react/24/outline';

const DaySummaryModal = ({ isOpen, onClose, date, items }) => {
    const formattedDate = date ? new Date(date).toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }) : '';

    const meals = items?.filter(i => i.type === 'Meal') || [];
    const exercises = items?.filter(i => i.type === 'Exercise') || [];
    const rituals = items?.filter(i => i.type === 'Ritual') || [];

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[150]" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel className="relative transform overflow-hidden rounded-[3rem] bg-white px-8 pb-10 pt-12 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100">
                                <div className="absolute right-8 top-8">
                                    <button
                                        type="button"
                                        className="rounded-full bg-gray-50 p-2 text-gray-400 hover:text-gray-500 transition-colors"
                                        onClick={onClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="mb-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full mb-4 border border-emerald-100">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Daily Log Summary</span>
                                    </div>
                                    <DialogTitle as="h3" className="text-3xl font-black text-gray-900 leading-tight">
                                        {formattedDate}
                                    </DialogTitle>
                                    <p className="mt-2 text-gray-500 font-medium">Tracking your Ayurvedic alignment journey.</p>
                                </div>

                                <div className="space-y-8">
                                    {/* Meals Section */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FireIcon className="w-5 h-5 text-amber-500" />
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Nourishment Log</h4>
                                        </div>
                                        {meals.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-3">
                                                {meals.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                                                        <span className="font-bold text-gray-800">{item.itemId}</span>
                                                        <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No meals logged</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Exercises Section */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <BeakerIcon className="w-5 h-5 text-indigo-500" />
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Movement Log</h4>
                                        </div>
                                        {exercises.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-3">
                                                {exercises.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                                                        <span className="font-bold text-gray-800">{item.itemId}</span>
                                                        <CheckCircleIcon className="w-5 h-5 text-indigo-500" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No exercises logged</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <button
                                        type="button"
                                        className="w-full bg-gray-900 text-white rounded-2xl py-4 font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                                        onClick={onClose}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DaySummaryModal;
