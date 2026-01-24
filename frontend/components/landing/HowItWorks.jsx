import React from 'react';
import { useTranslation } from 'next-i18next';

const HowItWorks = () => {
    const { t } = useTranslation('common');

    const steps = [
        {
            number: '01',
            title: 'Compare Rates',
            description: 'Enter the amount you want to send and select the destination country. We instantly compare live exchange rates and fees from top providers.',
            image: '/images/landing/step_compare.png'
        },
        {
            number: '02',
            title: 'Choose Provider',
            description: 'See exactly how much the recipient will get. We highlight the best rates and lowest fees so you can make an informed decision.',
            image: '/images/landing/step_choose.png'
        },
        {
            number: '03',
            title: 'Send Money',
            description: 'Click "Go to Site" to visit your chosen provider directly. Complete your secure transfer on their official platform.',
            image: '/images/landing/step_send.png'
        }
    ];

    return (
        <section id="how-it-works" className="py-20 sm:py-28 bg-white overflow-hidden relative scroll-mt-24">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-3 block">Process</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
                        How RemitBuddy Works
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Finding the best exchange rate shouldn't be complicated.
                        We've simplified the process to help you save money in just three steps.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10 lg:gap-14 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative group">
                            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-center text-center overflow-hidden">
                                {/* Image Container */}
                                <div className="w-32 h-32 mb-8 group-hover:scale-110 transition-transform duration-500 ease-smooth">
                                    <img
                                        src={step.image}
                                        alt={step.title}
                                        className="w-full h-full object-contain drop-shadow-2xl"
                                    />
                                </div>

                                {/* Step Number */}
                                <span className="text-6xl font-black text-gray-100 absolute top-4 right-6 select-none -z-10 group-hover:text-brand-50/50 transition-colors">
                                    {step.number}
                                </span>

                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
