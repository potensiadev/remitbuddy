import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamic import for analytics to prevent SSR issues
const analytics = dynamic(() => import('../utils/analytics'), {
  ssr: false,
  loading: () => null
});

// API Configuration
const FORCE_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sendhome-production.up.railway.app';

// Safe analytics functions with fallbacks
const safeLogPageView = () => {
  if (typeof window !== 'undefined') {
    import('../utils/analytics').then(({ logPageView }) => {
      logPageView();
    }).catch(err => console.warn('Analytics error:', err));
  }
};

const safeLogClickedCTA = (amount, country, currency) => {
  if (typeof window !== 'undefined') {
    import('../utils/analytics').then(({ logClickedCTA }) => {
      logClickedCTA(amount, country, currency);
    }).catch(err => console.warn('Analytics error:', err));
  }
};

const safeLogCompareAgain = (amount, country, currency) => {
  if (typeof window !== 'undefined') {
    import('../utils/analytics').then(({ logCompareAgain }) => {
      logCompareAgain(amount, country, currency);
    }).catch(err => console.warn('Analytics error:', err));
  }
};

const safeLogClickedProvider = (providerName, amount, country, currency) => {
  if (typeof window !== 'undefined') {
    import('../utils/analytics').then(({ logClickedProvider }) => {
      logClickedProvider(providerName, amount, country, currency);
    }).catch(err => console.warn('Analytics error:', err));
  }
};

const safeLogSendingCountrySwitch = (currency) => {
  if (typeof window !== 'undefined') {
    import('../utils/analytics').then(({ logSendingCountrySwitch }) => {
      logSendingCountrySwitch(currency);
    }).catch(err => console.warn('Analytics error:', err));
  }
};

// Icon Components
const ChevronDownIcon = ({ className }) => ( 
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}> 
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /> 
    </svg> 
);

const ArrowRightIcon = ({ className }) => ( 
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" stroke="currentColor"> 
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3.33301 8H12.6663" /> 
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 3.33331L12.6667 7.99998L8 12.6666" /> 
    </svg> 
);

// Country data with supported currencies
const COUNTRIES = [
    { code: "VN", currency: "VND", name: "Vietnam", flag: "/images/flags/vn.png" },
    { code: 'NP', name: 'Nepal', currency: 'NPR', flag: '/images/flags/np.png' },
    { code: "PH", currency: "PHP", name: "Philippines", flag: "/images/flags/ph.png" },
    { code: "KH", currency: "KHR", name: "Cambodia", flag: "/images/flags/kh.png" },
    { code: "MM", currency: "MMK", name: "Myanmar", flag: "/images/flags/mm.png" },
    { code: "TH", currency: "THB", name: "Thailand", flag: "/images/flags/th.png" },
    { code: "UZ", currency: "UZS", name: "Uzbekistan", flag: "/images/flags/uz.png" },
    { code: "ID", currency: "IDR", name: "Indonesia", flag: "/images/flags/id.png" },
    { code: "LK", currency: "LKR", name: "SriLanka", flag: "/images/flags/lk.png" },
    { code: "BD", currency: "BDT", name: "Bangladesh", flag: "/images/flags/bd.png" },
];

// Provider name mapping for analytics
const PROVIDER_ANALYTICS_MAP = {
    'Hanpass': 'hanpass',
    'GmoneyTrans': 'gmoneytrans',
    'E9Pay': 'e9pay',
    'Finshot': 'finshot',
    'Cross': 'cross',
    'GME Remit': 'gmeremit',
    'JRF': 'JRF',
    'Wirebarley': 'wirebarley',
    'Moin': 'moin'
};

// RemitBuddy referral links mapping
const REMIT_BUDDY_REFERRAL_LINKS = {
    'Hanpass': 'https://remitbuddy.com/go/hanpass',
    'GmoneyTrans': 'https://remitbuddy.com/go/gmoneytrans',
    'E9Pay': 'https://remitbuddy.com/go/e9pay',
    'Finshot': 'https://remitbuddy.com/go/finshot',
    'Coinshot': 'https://remitbuddy.com/go/coinshot',
    'Cross': 'https://remitbuddy.com/go/cross',
    'GME Remit': 'https://remitbuddy.com/go/gmeremit',
    'JRF': 'https://remitbuddy.com/go/jrf',
    'JP Remit': 'https://remitbuddy.com/go/jrf',
    'Wirebarley': 'https://remitbuddy.com/go/wirebarley',
    'Moin': 'https://remitbuddy.com/go/moin',
    'The Moin': 'https://remitbuddy.com/go/moin',
    'Sentbe': 'https://remitbuddy.com/go/sentbe'
};

// Provider logo mapping
const PROVIDER_LOGO_MAP = {
    'Hanpass': '/logos/hanpass.png',
    'GmoneyTrans': '/logos/gmoneytrans.png',
    'E9Pay': '/logos/e9pay.png',
    'Finshot': '/logos/finshot.png',
    'Coinshot': '/logos/coinshot.png',
    'Cross': '/logos/cross.png',
    'GME Remit': '/logos/gme.png',
    'JRF': '/logos/jrf.png',
    'JP Remit': '/logos/jrf.png',
    'Wirebarley': '/logos/wirebarley.png',
    'Moin': '/logos/moin.png',
    'The Moin': '/logos/moin.png',
    'Sentbe': '/logos/sentbe.png'
};

// Results Component
const ResultsComponent = ({ queryParams, amount, selectedCountry, forceRefresh, t }) => {
    const [providersData, setProvidersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const url = `${FORCE_API_BASE_URL}/api/compare?send_amount=${amount}&receive_country=${encodeURIComponent(queryParams.receive_country)}&receive_currency=${queryParams.receive_currency}`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.results && Array.isArray(data.results)) {
                    setProvidersData(data.results);
                } else {
                    setError(t('no_providers_found'));
                }
            } catch (error) {
                console.error('API Error:', error);
                setError(t('api_error'));
            } finally {
                setLoading(false);
            }
        };

        if (queryParams.receive_country && queryParams.receive_currency) {
            fetchProviders();
        }
    }, [queryParams, amount, forceRefresh, t]);

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-lg text-slate-600">{t('loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    if (!providersData || providersData.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600 text-lg">{t('no_providers_found')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-6">
                {t('comparison_results')}
            </h2>
            {providersData.map((provider, index) => (
                <ProviderCard
                    key={`${provider.provider}-${index}`}
                    providerData={provider}
                    isBest={index === 0}
                    currency={selectedCountry.currency}
                    t={t}
                    amount={amount}
                    receiveCountry={selectedCountry.code}
                />
            ))}
        </div>
    );
};

// Provider Card Component
const ProviderCard = ({ providerData, isBest, currency, t, amount, receiveCountry }) => { 
    const { provider, recipient_gets, exchange_rate, fee } = providerData;
    
    // Normalize provider names for display
    const displayName = provider === 'JP Remit' ? 'JRF' : 
                       provider === 'The Moin' ? 'Moin' : provider; 
    
    const handleProviderClick = () => {
        const analyticsName = PROVIDER_ANALYTICS_MAP[provider] || provider.toLowerCase();
        safeLogClickedProvider(analyticsName, amount, receiveCountry, currency);
        
        // Redirect to RemitBuddy referral link
        const referralLink = REMIT_BUDDY_REFERRAL_LINKS[provider];
        if (referralLink) {
            window.open(referralLink, '_blank');
        } else {
            console.warn(`No referral link found for provider: ${provider}`);
        }
    };

    // Calculate fee in target currency
    // exchange_rate: how much target currency you get for 1 KRW
    // fee is in KRW, so convert to target currency
    const feeInTargetCurrency = fee * exchange_rate;
    const formattedFeeInTarget = Math.round(feeInTargetCurrency).toLocaleString('en-US');
    const formattedFeeInKRW = fee.toLocaleString('en-US');
    
    return ( 
        <a 
            href={providerData.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={handleProviderClick}
            className={`block w-full p-4 lg:p-6 mb-3 lg:mb-4 bg-white border rounded-xl lg:rounded-2xl shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isBest ? 'border-emerald-500 border-2' : 'border-slate-200'}`}
        > 
            <div className="flex justify-between items-start"> 
                <div className="flex items-center gap-3">
                    {PROVIDER_LOGO_MAP[provider] && (
                        <img 
                            src={PROVIDER_LOGO_MAP[provider]} 
                            alt={`${provider} logo`} 
                            width="32" 
                            height="32" 
                            className="rounded"
                        />
                    )}
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-800">{displayName}</h3>
                </div>
                {isBest && (
                    <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-white bg-emerald-500 
                                     px-2 py-1 sm:px-3 lg:px-4 lg:py-2 rounded-full 
                                     max-w-[100px] lg:max-w-none text-center leading-tight">
                        {t('most_amount_receive')}
                    </span>
            )}
            </div> 
            <div className="mt-3 lg:mt-4"> 
                <p className="text-sm lg:text-base text-slate-500">{t('amount_to_receive')}</p> 
                <p className="text-2xl lg:text-3xl font-extrabold text-indigo-600"> 
                    {Math.round(recipient_gets).toLocaleString('en-US')} 
                    <span className="ml-2 text-xl lg:text-2xl font-bold text-slate-700">{currency}</span> 
                </p> 
            </div> 
            <div className="mt-3 lg:mt-4 text-xs lg:text-sm text-slate-500 flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-0"> 
                <span>1 {currency.toUpperCase()} = {(1 / exchange_rate).toFixed(4)} KRW</span> 
                <span className="hidden lg:inline mx-2">|</span> 
                <span>{t('fee')}: {formattedFeeInTarget} {currency} ({formattedFeeInKRW} KRW)</span> 
            </div> 
        </a> 
    );
};

// Rest of the component code remains the same...
// [컴포넌트 코드는 원본과 동일하지만 analytics 함수 호출을 safe 버전으로 교체]

// Main Page Component
export default function MainPage() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [showResults, setShowResults] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    const resultsRef = useRef(null);
    const [amount, setAmount] = useState("1000000");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [amountError, setAmountError] = useState("");
    const formRef = useRef(null);
    const formRefDesktop = useRef(null);
    const countryDropdownRef = useRef(null);
    const countryDropdownRefDesktop = useRef(null);
    const [hasComparedOnce, setHasComparedOnce] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0);

    // Page view tracking and debug logging
    useEffect(() => {
        safeLogPageView();
    }, [router.locale]);

    // Input validation function
    const isAmountValid = () => {
        const numAmount = Number(amount);
        return numAmount >= 10000 && numAmount <= 10000000;
    };

    // Handle amount change with validation
    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        
        if (value && !isAmountValid()) {
            setAmountError(t('amount_error'));
        } else {
            setAmountError("");
        }
    };

    const handleSubmit = (e) => { 
        e.preventDefault();
        
        if (hasComparedOnce) {
            handleCompareAgain();
        } else {
            safeLogClickedCTA(amount, selectedCountry.code, selectedCountry.currency);
            
            if (selectedCountry && amount && isAmountValid()) { 
                const newParams = { 
                    receive_country: selectedCountry.name, 
                    receive_currency: selectedCountry.currency
                };
                
                setQueryParams(newParams); 
                setShowResults(true);
                setHasComparedOnce(true);
            }
        }
    };

    const handleCompareAgain = () => { 
        safeLogCompareAgain(amount, selectedCountry.code, selectedCountry.currency);
        
        if (selectedCountry && amount && isAmountValid()) {
            const newQueryParams = { 
                receive_country: selectedCountry.name, 
                receive_currency: selectedCountry.currency
            };
            
            setQueryParams(newQueryParams);
            setForceRefresh(prev => prev + 1);
        }
    };

    const handleCountryChange = (newCountry) => {
        safeLogSendingCountrySwitch(newCountry.currency);
        setSelectedCountry(newCountry);
        
        if (hasComparedOnce && amount && isAmountValid()) {
            const newQueryParams = { 
                receive_country: newCountry.name, 
                receive_currency: newCountry.currency
            };
            
            setQueryParams(newQueryParams);
            setShowResults(true);
            
            if (resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <>
            <Head>
                <title>{t('page_title')}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no, viewport-fit=cover" />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
                {/* Header */}
                <div className="text-center py-8 lg:py-12 px-4">
                    <h1 className="text-3xl lg:text-5xl font-bold text-slate-800 mb-3 lg:mb-4">
                        {t('main_title')}
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Main Form Container */}
                <div className="max-w-4xl mx-auto px-4 pb-8 lg:pb-16">
                    <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl p-6 lg:p-10 mb-8 lg:mb-12">
                        {/* Desktop Form */}
                        <form 
                            ref={formRefDesktop}
                            onSubmit={handleSubmit} 
                            className="hidden lg:block"
                        >
                            <div className="flex items-end gap-6">
                                {/* Amount Input */}
                                <div className="flex-1">
                                    <label className="block text-base font-medium text-slate-700 mb-3">
                                        {t('send_amount')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={amount.toLocaleString('en-US')}
                                            onChange={handleAmountChange}
                                            className={`w-full p-4 text-xl font-semibold border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all ${
                                                amountError ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-indigo-500'
                                            }`}
                                            placeholder="1,000,000"
                                        />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-slate-600">
                                            KRW
                                        </span>
                                    </div>
                                    {amountError && (
                                        <p className="text-red-500 text-sm mt-2">{amountError}</p>
                                    )}
                                </div>

                                {/* Arrow */}
                                <div className="flex items-center justify-center pb-4">
                                    <ArrowRightIcon className="w-8 h-8 text-slate-400" />
                                </div>

                                {/* Country Selector */}
                                <div className="flex-1 relative" ref={countryDropdownRefDesktop}>
                                    <label className="block text-base font-medium text-slate-700 mb-3">
                                        {t('receive_country')}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="w-full p-4 text-left border-2 border-slate-300 rounded-xl hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={selectedCountry.flag}
                                                alt={selectedCountry.name}
                                                className="w-6 h-6 rounded"
                                            />
                                            <span className="text-xl font-semibold text-slate-800">
                                                {selectedCountry.name}
                                            </span>
                                        </div>
                                        <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown */}
                                    {showDropdown && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                                            {COUNTRIES.map((country) => (
                                                <button
                                                    key={country.code}
                                                    type="button"
                                                    onClick={() => handleCountryChange(country)}
                                                    className={`w-full p-4 text-left hover:bg-indigo-50 flex items-center gap-3 transition-colors ${
                                                        selectedCountry.code === country.code ? 'bg-indigo-100' : ''
                                                    }`}
                                                >
                                                    <img
                                                        src={country.flag}
                                                        alt={country.name}
                                                        className="w-6 h-6 rounded"
                                                    />
                                                    <span className="text-lg font-medium text-slate-800">
                                                        {country.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pb-4">
                                    <button
                                        type="submit"
                                        disabled={!isAmountValid() || amountError}
                                        className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        {hasComparedOnce ? t('compare_again') : t('find_best_rate')}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Mobile Form */}
                        <form 
                            ref={formRef}
                            onSubmit={handleSubmit} 
                            className="lg:hidden space-y-6"
                        >
                            {/* Amount Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('send_amount')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={amount.toLocaleString('en-US')}
                                        onChange={handleAmountChange}
                                        className={`w-full p-4 text-lg font-semibold border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all ${
                                            amountError ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-indigo-500'
                                        }`}
                                        placeholder="1,000,000"
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg font-bold text-slate-600">
                                        KRW
                                    </span>
                                </div>
                                {amountError && (
                                    <p className="text-red-500 text-sm mt-2">{amountError}</p>
                                )}
                            </div>

                            {/* Country Selector */}
                            <div className="relative" ref={countryDropdownRef}>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('receive_country')}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="w-full p-4 text-left border-2 border-slate-300 rounded-xl hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={selectedCountry.flag}
                                            alt={selectedCountry.name}
                                            className="w-6 h-6 rounded"
                                        />
                                        <span className="text-lg font-semibold text-slate-800">
                                            {selectedCountry.name}
                                        </span>
                                    </div>
                                    <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Mobile Dropdown */}
                                {showDropdown && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                                        {COUNTRIES.map((country) => (
                                            <button
                                                key={country.code}
                                                type="button"
                                                onClick={() => handleCountryChange(country)}
                                                className={`w-full p-4 text-left hover:bg-indigo-50 flex items-center gap-3 transition-colors ${
                                                    selectedCountry.code === country.code ? 'bg-indigo-100' : ''
                                                }`}
                                            >
                                                <img
                                                    src={country.flag}
                                                    alt={country.name}
                                                    className="w-6 h-6 rounded"
                                                />
                                                <span className="text-lg font-medium text-slate-800">
                                                    {country.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!isAmountValid() || amountError}
                                className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {hasComparedOnce ? t('compare_again') : t('find_best_rate')}
                            </button>
                        </form>
                    </div>

                    {/* Results Section */}
                    {showResults && (
                        <div ref={resultsRef}>
                            <ResultsComponent 
                                queryParams={queryParams}
                                amount={amount}
                                selectedCountry={selectedCountry}
                                forceRefresh={forceRefresh}
                                t={t}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Server-side translations
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}