import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div
            className={`transition-all duration-500 rounded-3xl border mb-4 overflow-hidden ${isOpen
                ? 'border-primary-200 bg-primary-50/40 shadow-xl shadow-primary-500/5'
                : 'border-gray-100 bg-white hover:border-primary-100 hover:shadow-lg hover:shadow-gray-200/30'
                }`}
        >
            <button
                className="w-full px-6 py-6 sm:px-10 flex items-center justify-between gap-6 text-left focus:outline-none group select-none"
                onClick={onClick}
            >
                <span className={`text-base sm:text-xl font-bold leading-tight transition-colors duration-300 ${isOpen ? 'text-primary-700' : 'text-gray-900 group-hover:text-primary-600'}`}>
                    {question}
                </span>
                <span className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-primary-600 rotate-180 shadow-lg shadow-primary-500/30' : 'bg-gray-50 group-hover:bg-primary-50'}`}>
                    <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div
                className={`transition-all duration-500 ease-smooth ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6 sm:px-10 sm:pb-10">
                    <div className="h-px w-full bg-primary-100 mb-6" />
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-lg font-medium">
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
            answer: "We compare rates from major trusted providers in Korea, including Hanpass, Sentbe, Wirebarley, GmoneyTrans, E9Pay, Cross, and more. We only list licensed and regulated services."
        },
        {
            question: "Why do exchange rates vary between providers?",
            answer: "Each provider has their own network, partnerships, and fee structures. Some may offer better rates for large amounts, while others are cheaper for smaller transfers. That's why comparing is essential!"
        }
    ];

    return (
        <section id="faq" className="fluid-pb bg-white relative overflow-visible">
            {/* Soft Ambient Background Container */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/20 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto fluid-container relative z-10">
                <div className="text-center mb-16 sm:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-xs sm:text-sm font-bold mb-6 border border-primary-100 animate-fade-in">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{t('support.badge', 'SUPPORT')}</span>
                    </div>
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
