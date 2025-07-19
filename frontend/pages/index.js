import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { 
  logClickedCTA, 
  logCompareAgain, 
  logClickedProvider, 
  logSendingCountrySwitch 
} from '../utils/analytics';

// API Configuration
const FORCE_API_BASE_URL = 'https://sendhome.onrender.com';

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
    { code: "PH", currency: "PHP", name: "Philippines", flag: "/images/flags/ph.png" },
    { code: "KH", currency: "KHR", name: "Cambodia", flag: "/images/flags/kh.png" },
    { code: "MM", currency: "MMK", name: "Myanmar", flag: "/images/flags/mm.png" },
    { code: "TH", currency: "THB", name: "Thailand", flag: "/images/flags/th.png" },
    { code: "UZ", currency: "UZS", name: "Uzbekistan", flag: "/images/flags/uz.png" },
    { code: "ID", currency: "IDR", name: "Indonesia", flag: "/images/flags/id.png" },
    { code: "LK", currency: "LKR", name: "SriLanka", flag: "/images/flags/lk.png" },
    { code: "BD", currency: "BDT", name: "Bangladesh", flag: "/images/flags/bd.png" },
    { code: 'NP', name: 'Nepal', currency: 'NPR', flag: '/images/flags/np.png' },
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

// Provider Card Component
const ProviderCard = ({ providerData, isBest, currency, t }) => { 
    const { provider, recipient_gets, exchange_rate, fee } = providerData; 
    
    const handleProviderClick = () => {
        const analyticsName = PROVIDER_ANALYTICS_MAP[provider] || provider.toLowerCase();
        logClickedProvider(analyticsName);
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
                <h3 className="text-xl lg:text-2xl font-bold text-slate-800">{provider}</h3> 
                {isBest && <span className="text-xs lg:text-sm font-semibold text-white bg-emerald-500 px-3 py-1 lg:px-4 lg:py-2 rounded-full">Most Amount Receive</span>} 
            </div> 
            <div className="mt-3 lg:mt-4"> 
                <p className="text-sm lg:text-base text-slate-500">{t('amount_to_receive')}</p> 
                <p className="text-2xl lg:text-3xl font-extrabold text-indigo-600"> 
                    {Math.round(recipient_gets).toLocaleString('en-US')} 
                    <span className="ml-2 text-xl lg:text-2xl font-bold text-slate-700">{currency}</span> 
                </p> 
            </div> 
            <div className="mt-3 lg:mt-4 text-xs lg:text-sm text-slate-500 flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-0"> 
                <span>100 {currency} = {(100 / exchange_rate).toFixed(2)} KRW</span> 
                <span className="hidden lg:inline mx-2">|</span> 
                <span>{t('fee')}: {formattedFeeInTarget} {currency} ({formattedFeeInKRW} KRW)</span> 
            </div> 
        </a> 
    );
};

// Country Dropdown Component
const CountryDropdown = ({ setSelectedCountry, setShowDropdown, t, onCountryChange, dropdownRef }) => ( 
    <div ref={dropdownRef} className="absolute top-full left-0 mt-2 w-full min-w-[280px] lg:min-w-[320px] h-auto max-h-[60vh] bg-white rounded-xl lg:rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-40"> 
        <div className="flex-1 overflow-y-auto"> 
            {COUNTRIES.map(c => ( 
                <div 
                    key={c.code} 
                    className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 cursor-pointer hover:bg-gray-50 text-lg" 
                    onClick={(e) => { 
                        e.stopPropagation();
                        console.log('🌍 Country clicked:', c.name);
                        setSelectedCountry(c); 
                        setShowDropdown(false); 
                        onCountryChange(c); 
                    }}
                > 
                    <img src={c.flag} alt={`${c.name} flag`} width="28" height="28" className="rounded-full" /> 
                    <div> 
                        <div className="font-bold text-sm lg:text-base text-slate-800">{c.name}</div> 
                        <div className="text-gray-500 text-xs lg:text-sm">{c.currency}</div> 
                    </div> 
                </div> 
            ))} 
        </div> 
    </div> 
);

// Comparison Results Component
function ComparisonResults({ queryParams, t, onCompareAgain, forceRefresh }) {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentApiCall, setCurrentApiCall] = useState(null);

    useEffect(() => {
        if (!queryParams.receive_country) return;

        // Cancel previous API call if it's still running
        if (currentApiCall) {
            currentApiCall.abort();
        }

        const abortController = new AbortController();
        setCurrentApiCall(abortController);

        const fetchRealQuotes = async () => {
            setIsLoading(true);
            setError(null);
            setResults([]);

            console.log('🔥 API Call - Query Params:', queryParams);
            
            const url = `${FORCE_API_BASE_URL}/api/getRemittanceQuote?receive_country=${queryParams.receive_country}&receive_currency=${queryParams.receive_currency}&send_amount=${queryParams.send_amount}`;
            console.log('🎯 API URL:', url);

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    signal: abortController.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} - ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log('✅ API Response:', data);
                
                if (data.results && data.results.length > 0) {
                    setResults(data.results);
                } else {
                    setError('No exchange rate providers available');
                }
                
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('🛑 API call was aborted');
                    return;
                }
                console.error('🚨 API Error:', err);
                setError(`API Error: ${err.message}`);
            } finally {
                setIsLoading(false);
                setCurrentApiCall(null);
            }
        };

        fetchRealQuotes();

        // Cleanup function to abort API call if component unmounts
        return () => {
            if (abortController) {
                abortController.abort();
            }
        };
    }, [queryParams.receive_country, queryParams.receive_currency, queryParams.send_amount, forceRefresh]);

    const bestRateProvider = useMemo(() => (!results || results.length === 0) ? null : results[0], [results]);
    
    const SkeletonCard = () => ( 
        <div className="w-full p-4 lg:p-6 mb-3 lg:mb-4 bg-white border border-slate-200 rounded-xl lg:rounded-2xl shadow-sm animate-pulse"> 
            <div className="flex justify-between items-center">
                <div className="h-6 lg:h-8 bg-slate-300 rounded-md w-1/3"></div>
                <div className="h-4 lg:h-6 bg-slate-300 rounded-md w-1/4"></div>
            </div> 
            <div className="mt-4 lg:mt-6 h-8 lg:h-10 bg-slate-300 rounded-md w-1/2"></div>
            <div className="mt-2 lg:mt-3 h-4 lg:h-5 bg-slate-300 rounded-md w-3/4"></div> 
        </div> 
    );

    return ( 
        <div className="w-full"> 
            <div className="bg-white/80 backdrop-blur-lg p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-lg mb-6 lg:mb-8 sticky top-4 z-10"> 
                <h2 className="text-sm lg:text-base font-semibold text-slate-500">{t('real_time_summary')}</h2> 
                <p className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center"> 
                    {parseInt(queryParams.send_amount).toLocaleString()} KRW → {queryParams.receive_country} 
                </p> 
                {isLoading && <p className="text-xs lg:text-sm text-indigo-500 mt-1 animate-pulse">{t('loading_text')}</p>} 
            </div> 
            
            {error && (
                <div className="text-center p-8 lg:p-12 bg-red-50 border border-red-200 rounded-lg lg:rounded-2xl">
                    <h3 className="text-xl lg:text-2xl font-bold text-red-700">{t('error_title')}</h3>
                    <p className="text-red-600 mt-2 text-sm lg:text-base">{error}</p>
                    <div className="mt-4 lg:mt-6 space-x-2 lg:space-x-4">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 lg:px-6 py-2 lg:py-3 bg-red-600 text-white rounded-lg lg:rounded-xl hover:bg-red-700 transition text-sm lg:text-base"
                        >
                            {t('refresh')}
                        </button>
                        <button 
                            onClick={() => {
                                console.log('🔧 Debug Info:');
                                console.log('API Base URL:', FORCE_API_BASE_URL);
                                console.log('Current URL:', window.location.href);
                                console.log('User Agent:', navigator.userAgent);
                            }}
                            className="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 text-white rounded-lg lg:rounded-xl hover:bg-blue-700 transition text-sm lg:text-base"
                        >
                            {t('debug_info')}
                        </button>
                    </div>
                </div>
            )} 
            
            <div className="space-y-3 lg:space-y-4"> 
                {isLoading ? ( 
                    Array(5).fill(0).map((_, index) => <SkeletonCard key={index} />) 
                ) : ( 
                    results.map(provider => 
                        <ProviderCard 
                            key={provider.provider} 
                            providerData={provider} 
                            isBest={bestRateProvider && provider.provider === bestRateProvider.provider} 
                            currency={queryParams.receive_currency} 
                            t={t} 
                        />
                    ) 
                )} 
            </div> 
            
 
        </div> 
    );
}

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
    const formRef = useRef(null);
    const formRefDesktop = useRef(null);
    const countryDropdownRef = useRef(null);
    const countryDropdownRefDesktop = useRef(null);
    const [hasComparedOnce, setHasComparedOnce] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0);

    // Debug logging
    useEffect(() => {
        console.log('🌍 Language:', router.locale);
        console.log('🔗 Current URL:', window.location.href);
    }, [router.locale]);

    useEffect(() => { 
        function handleClickOutside(event) { 
            const mobileFormContains = formRef.current && formRef.current.contains(event.target);
            const desktopFormContains = formRefDesktop.current && formRefDesktop.current.contains(event.target);
            const mobileDropdownContains = countryDropdownRef.current && countryDropdownRef.current.contains(event.target);
            const desktopDropdownContains = countryDropdownRefDesktop.current && countryDropdownRefDesktop.current.contains(event.target);
            
            if (!mobileFormContains && !desktopFormContains && !mobileDropdownContains && !desktopDropdownContains) { 
                setShowDropdown(false); 
            } 
        } 
        document.addEventListener("mousedown", handleClickOutside); 
        return () => document.removeEventListener("mousedown", handleClickOutside); 
    }, []);

    useEffect(() => { 
        if(showResults && resultsRef.current) { 
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        } 
    }, [showResults]);

    const handleAmountChange = (e) => { 
        const value = e.target.value.replace(/,/g, ''); 
        if (!isNaN(value) && value.length <= 10) { 
            setAmount(value); 
        } 
    };

    const handleSubmit = (e) => { 
        e.preventDefault();
        
        if (hasComparedOnce) {
            // If we've already compared once, use compare again logic
            handleCompareAgain();
        } else {
            // First time comparison
            // Log CTA click
            logClickedCTA();
            
            if (selectedCountry && amount) { 
                console.log('🚀 Form submitted - triggering first API call');
                setQueryParams({ 
                    receive_country: selectedCountry.name, 
                    receive_currency: selectedCountry.currency, 
                    send_amount: amount 
                }); 
                setShowResults(true);
                setHasComparedOnce(true); // Mark that we've compared at least once
            }
        }
    };

    const handleCompareAgain = () => { 
        console.log('🔄 Compare Again button clicked - triggering API call');
        
        // Log compare again click
        logCompareAgain();
        
        // Force API call with current parameters - DO NOT scroll to top
        if (selectedCountry && amount) {
            const newQueryParams = { 
                receive_country: selectedCountry.name, 
                receive_currency: selectedCountry.currency, 
                send_amount: amount 
            };
            
            console.log('🚀 Compare Again - triggering API with params:', newQueryParams);
            
            // Update query params to trigger new API call
            setQueryParams(newQueryParams);
            
            // Force refresh to ensure API call even with same params
            setForceRefresh(prev => prev + 1);
            
            // Keep focus on results section - no scrolling to top
            console.log('✅ Compare Again - API call triggered, staying in results section');
        } else {
            console.log('❌ Compare Again - missing selectedCountry or amount');
        }
    };

    // Handle country change - auto-trigger API only after first comparison
    const handleCountryChange = (newCountry) => {
        console.log('🔄 Country changed to:', newCountry.name, 'showResults:', showResults);
        
        // Log country switch
        logSendingCountrySwitch(newCountry.currency);
        
        // IMPORTANT: Only update selected country, do NOT trigger API on first visit
        setSelectedCountry(newCountry);
        
        // Only auto-trigger API if we have compared at least once
        if (hasComparedOnce && amount) {
            console.log('✅ Auto-triggering API because hasComparedOnce=true');
            const newQueryParams = { 
                receive_country: newCountry.name, 
                receive_currency: newCountry.currency, 
                send_amount: amount 
            };
            
            setQueryParams(newQueryParams);
            
            // Ensure results are visible
            setShowResults(true);
            
            // Scroll to results section
            if (resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            console.log('🚫 NOT triggering API - hasComparedOnce:', hasComparedOnce);
        }
    };

    // Removed auto-trigger API call when amount changes
    // API will only be called when:
    // 1. First time: button click
    // 2. After first call: country change OR button click (not amount change)

    return (
        <div className="bg-[#F5F7FA] min-h-screen font-sans flex flex-col items-center pt-8 px-4 lg:px-8">
            <div className="w-full max-w-sm lg:max-w-6xl xl:max-w-7xl mx-auto">
                <header className="w-full flex items-center mb-10 lg:mb-16 pl-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg:w-8 lg:h-8">
                        <path d="M5 20L19 12L5 4V20Z" fill="url(#paint0_linear_header_page)"/>
                        <defs>
                            <linearGradient id="paint0_linear_header_page" x1="5" y1="4" x2="25" y2="24" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4F46E5"/>
                                <stop offset="1" stopColor="#06B6D4"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="text-2xl lg:text-4xl font-extrabold text-[#1E293B] ml-2 lg:ml-4">SendHome</span>
                </header>

                <main className="w-full">
                    {/* Form Section */}
                    <div className="w-full mb-8 lg:mb-12">
                        <div className="w-full max-w-6xl xl:max-w-7xl mx-auto">
                            <div className="bg-white rounded-[28px] lg:rounded-[32px] shadow-2xl shadow-slate-200/60 p-6 sm:p-8 lg:p-12">
                                <h1 className="text-center text-slate-800 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-8 lg:mb-12 leading-tight" dangerouslySetInnerHTML={{ __html: t('title') }} />
            
                                <form onSubmit={handleSubmit} className="w-full">
                                    <div className="text-slate-500 text-center text-base lg:text-lg mb-6 lg:mb-8">
                                        {t('subtitle')}
                                    </div>

                                    {/* Mobile layout: improved UX design */}
                                    <div className="lg:hidden">
                                        {/* Single row with amount and country selection */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                            {/* Amount to send */}
                                            <div>
                                                <label className="w-full text-left text-sm font-semibold text-slate-800 mb-2 block">송금액 (한국에서 보내는 금액)</label>
                                                
                                                <div className="relative w-full" ref={formRef}>
                                                    <input
                                                        type="text"
                                                        value={parseInt(amount || "0").toLocaleString()}
                                                        onChange={handleAmountChange}
                                                        className="w-full h-16 rounded-xl bg-[#F8FAFC] border-2 border-[#E2E8F0] px-4 text-2xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-16"
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                        <span className="font-semibold text-slate-600 text-lg">KRW</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Receiving country selection */}
                                            <div className="relative">
                                                <label className="w-full text-left text-sm font-semibold text-slate-800 mb-2 block">수취 국가 선택</label>
                                                
                                                <button
                                                    type="button"
                                                    className="w-full h-16 bg-white border-2 border-[#E2E8F0] rounded-xl px-4 flex items-center justify-between hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    onClick={() => setShowDropdown(prev => !prev)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <img src={selectedCountry.flag} alt={`${selectedCountry.name} flag`} width={28} height={28} className="rounded-full" />
                                                        <div className="text-left">
                                                            <div className="font-semibold text-slate-800 text-sm">{selectedCountry.name}</div>
                                                            <div className="text-xs text-slate-500">{selectedCountry.currency}</div>
                                                        </div>
                                                    </div>
                                                    <ChevronDownIcon className="h-4 w-4 text-slate-600" />
                                                </button>
                                                {showDropdown && <CountryDropdown setSelectedCountry={setSelectedCountry} setShowDropdown={setShowDropdown} t={t} onCountryChange={handleCountryChange} dropdownRef={countryDropdownRef} />}
                                            </div>
                                        </div>

                                        {/* Mobile conversion flow indicator */}
                                        <div className="text-center mb-4">
                                            <div className="inline-block bg-[#FEF3C7] rounded-full py-2 px-4">
                                                <span className="flex items-center text-slate-600 font-semibold text-sm">
                                                    <span>한국 KRW</span>
                                                    <ArrowRightIcon className="h-4 w-4 mx-2 text-slate-500" />
                                                    <span>{selectedCountry.name} {selectedCountry.currency}</span>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            className="w-full h-14 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                        >
                                            {hasComparedOnce ? t('compare_again_button_new') : t('compare_button')}
                                        </button>
                                    </div>

                                    {/* Desktop layout: improved UX design */}
                                    <div className="hidden lg:block">
                                        {/* Single row with amount and country selection */}
                                        <div className="grid grid-cols-2 gap-6 mb-8">
                                            {/* Amount to send */}
                                            <div>
                                                <label className="w-full text-left text-base font-semibold text-slate-800 mb-3 block">송금액 (한국에서 보내는 금액)</label>
                                                <div className="relative w-full" ref={formRefDesktop}>
                                                    <input
                                                        type="text"
                                                        value={parseInt(amount || "0").toLocaleString()}
                                                        onChange={handleAmountChange}
                                                        className="w-full h-20 rounded-2xl bg-[#F8FAFC] border-2 border-[#E2E8F0] px-6 text-3xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-24"
                                                    />
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                        <span className="font-semibold text-slate-600 text-2xl">KRW</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Receiving country selection */}
                                            <div className="relative">
                                                <label className="w-full text-left text-base font-semibold text-slate-800 mb-3 block">수취 국가 선택</label>
                                                
                                                <button
                                                    type="button"
                                                    className="w-full h-20 bg-white border-2 border-[#E2E8F0] rounded-2xl px-6 flex items-center justify-between hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    onClick={() => setShowDropdown(prev => !prev)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <img src={selectedCountry.flag} alt={`${selectedCountry.name} flag`} width={40} height={40} className="rounded-full" />
                                                        <div className="text-left">
                                                            <div className="font-semibold text-slate-800 text-lg">{selectedCountry.name}</div>
                                                            <div className="text-slate-500">{selectedCountry.currency}</div>
                                                        </div>
                                                    </div>
                                                    <ChevronDownIcon className="h-6 w-6 text-slate-600" />
                                                </button>
                                                {showDropdown && <CountryDropdown setSelectedCountry={setSelectedCountry} setShowDropdown={setShowDropdown} t={t} onCountryChange={handleCountryChange} dropdownRef={countryDropdownRefDesktop} />}
                                            </div>
                                        </div>

                                        {/* Conversion flow indicator */}
                                        <div className="text-center mb-8">
                                            <div className="inline-block bg-[#FEF3C7] rounded-full py-3 px-8">
                                                <span className="flex items-center text-slate-600 font-semibold text-base">
                                                    <span>한국 KRW</span>
                                                    <ArrowRightIcon className="h-5 w-5 mx-3 text-slate-500" />
                                                    <span>{selectedCountry.name} {selectedCountry.currency}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Submit button */}
                                        <div>
                                            <button
                                                type="submit"
                                                className="w-full h-20 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-600 text-white font-bold text-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                            >
                                                {hasComparedOnce ? t('compare_again_button_new') : t('compare_button')}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    {/* Results Section */}
                    <div ref={resultsRef} className="w-full transition-opacity duration-500" style={{ opacity: showResults ? 1 : 0, maxHeight: showResults ? '2000px' : '0' }}>
                        {showResults && <ComparisonResults queryParams={queryParams} t={t} onCompareAgain={handleCompareAgain} forceRefresh={forceRefresh} />}
                    </div>
                </main>
            </div>
        </div>
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