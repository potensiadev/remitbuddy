import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div
            className={`group relative transition-all duration-300 rounded-2xl border mb-5 overflow-hidden iso-isolate ${isOpen
                ? 'border-blue-500 bg-gradient-to-br from-white to-blue-50/50 shadow-[0_8px_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20'
                : 'border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:border-blue-200 hover:-translate-y-0.5'
                }`}
        >
            <button
                className="w-full px-6 py-5 sm:px-8 flex items-center justify-between gap-4 text-left focus:outline-none select-none relative z-10"
                onClick={onClick}
            >
                <span className={`text-lg sm:text-xl font-bold leading-snug transition-colors duration-200 ${isOpen ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-600'}`}>
                    {question}
                </span>

                <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-out border ${isOpen
                    ? 'bg-blue-600 border-blue-600 text-white rotate-180 shadow-lg shadow-blue-500/30'
                    : 'bg-white border-slate-100 text-slate-400 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out relative z-10 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-1">
                    <p className="text-slate-600 leading-relaxed text-base sm:text-lg font-medium">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const { t } = useTranslation('common');
    const [openIndex, setOpenIndex] = useState(-1);

    const faqs = [
        {
            question: "Is RemitBuddy free to use?",
            answer: "Yes! RemitBuddy is 100% free for users. We don't charge any fees for comparing rates. Our goal is to help you find the best remittance service without any extra cost."
        },
        {
            question: "Are the exchange rates real-time?",
            answer: "We strive to provide the most up-to-date rates possible. We update our data frequently throughout the day to reflect the latest market changes and provider offers."
        },
        {
            question: "Can I send money directly through RemitBuddy?",
            answer: "RemitBuddy is a comparison platform. Once you find the best deal, we direct you to the provider's official website or app to complete your transfer securely."
        },
        {
            question: "Which providers do you compare?",
            answer: "We compare rates from major trusted providers in Korea, including Hanpass, Sentbe, GmoneyTrans, E9Pay, Cross, and more. We only list licensed and regulated services."
        },
        {
            question: "Why do exchange rates vary between providers?",
            answer: "Each provider has their own network, partnerships, and fee structures. Some may offer better rates for large amounts, while others are cheaper for smaller transfers. That's why comparing is essential!"
        }
    ];

    return (
        <section id="faq" className="fluid-pb bg-white relative overflow-visible scroll-mt-32">
            {/* Soft Ambient Background Container */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/20 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto fluid-container relative z-10">
                <div className="text-center mb-16 sm:mb-24">
                    <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-3 block">
                        {t('support.badge', 'SUPPORT')}
                    </span>
                    <h2 className="text-[clamp(1.75rem,6vw,3.5rem)] font-black text-gray-900 mb-8 tracking-tight leading-tight">
                        Got Questions?
                    </h2>
                    <p className="text-[clamp(1rem,3vw,1.25rem)] text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        We've got answers to help you understand how RemitBuddy saves you money.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={index === openIndex}
                            onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
