import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// Mapping of language codes to display names and flags
const LANGUAGES = [
    { code: 'en', name: 'English', flag: '/images/flags/us.png' }
];

const LanguageSwitcher = ({ isMobile = false }) => {
    const router = useRouter();
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLanguage = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[1];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale: langCode });
        setIsOpen(false);
    };

    if (isMobile) {
        return (
            <div className="py-4 border-t border-gray-100">
                <h3 className="px-6 mb-3 text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Language
                </h3>
                <div className="grid grid-cols-2 gap-2 px-6">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${i18n.language === lang.code
                                ? 'bg-blue-50 border-blue-200 text-blue-600 font-bold'
                                : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <img src={lang.flag} alt="" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                            <span className="text-sm truncate">{lang.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all group"
            >
                <img src={currentLanguage.flag} alt="" className="w-5 h-5 rounded-full object-cover border border-gray-300 shadow-sm" />
                <span className="text-sm font-bold text-gray-700">{currentLanguage.name}</span>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in-up">
                    <div className="max-h-80 overflow-y-auto no-scrollbar">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors group ${i18n.language === lang.code ? 'bg-blue-50/50' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={lang.flag} alt="" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                                    <span className={`text-sm ${i18n.language === lang.code ? 'text-blue-600 font-bold' : 'text-gray-700 font-medium'}`}>
                                        {lang.name}
                                    </span>
                                </div>
                                {i18n.language === lang.code && (
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
