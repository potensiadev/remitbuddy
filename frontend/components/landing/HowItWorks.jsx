import React from 'react';
import { useTranslation } from 'next-i18next';

const HowItWorks = () => {
    const { t } = useTranslation('common');

    const steps = [
        {
            number: '01',
            title: t('how.s1_title'),
            description: t('how.s1_desc'),
            image: '/images/landing/step_compare.png'
        },
        {
            number: '02',
            title: t('how.s2_title'),
            description: t('how.s2_desc'),
            image: '/images/landing/step_choose.png'
        },
        {
            number: '03',
            title: t('how.s3_title'),
            description: t('how.s3_desc'),
            image: '/images/landing/step_send.png'
        }
    ];

    return (
        <section id="how-it-works" className="py-20 sm:py-28 bg-white overflow-hidden relative scroll-mt-24">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-3 block">{t('how.badge')}</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
                        {t('how.title')}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {t('how.subtitle')}
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
