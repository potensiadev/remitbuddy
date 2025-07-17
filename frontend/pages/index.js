import React, { useState, useEffect, useMemo, useRef } from 'react';

// 🔥 FORCE CONFIGURATION - 환경 변수 완전 무시
const FORCE_API_BASE_URL = 'https://sendhome.onrender.com';

// --- Icon Components ---
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

// --- i18n & Static Data ---
const translations = {
    en: { 
        title: "How much should your<br/>family receive?", 
        subtitle: "We'll find the best exchange rate for you", 
        amount_to_receive: "Amount to Receive", 
        compare_button: "Find out the Best Rate", 
        compare_again_button: "New Comparison", 
        best_rate_badge: "Best Rate", 
        real_time_summary: "Real-time Summary", 
        loading_text: "Comparing rates...", 
        fee: "Fee", 
        error_title: "Oops! Something went wrong.", 
        error_message: "We couldn't fetch the remittance data. Please try again later.", 
        select_country_title: "Select Country", 
        total_needed: "You Send (est.)" 
    },
    ko: { 
        title: "가족이 받을 금액은<br/>얼마인가요?", 
        subtitle: "최고의 환율을 찾아드릴게요", 
        amount_to_receive: "받는 금액", 
        compare_button: "최고 환율 찾아보기", 
        compare_again_button: "새로 비교하기", 
        best_rate_badge: "최고 환율", 
        real_time_summary: "실시간 비교 결과", 
        loading_text: "환율을 비교 중입니다...", 
        fee: "수수료", 
        error_title: "오류가 발생했습니다.", 
        error_message: "송금 정보를 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.", 
        select_country_title: "국가 선택", 
        total_needed: "예상 총 필요 원화" 
    },
};

const useTranslation = (lang) => (key) => translations[lang]?.[key] || key;

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

// --- Reusable Components ---
const ProviderCard = ({ providerData, isBest, currency, t }) => { 
    const { provider, recipient_gets, exchange_rate, fee } = providerData; 
    
    return ( 
        <a href={providerData.link} target="_blank" rel="noopener noreferrer" className={`block w-full p-4 mb-3 bg-white border rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isBest ? 'border-emerald-500 border-2' : 'border-slate-200'}`}> 
            <div className="flex justify-between items-start"> 
                <h3 className="text-xl font-bold text-slate-800">{provider}</h3> 
                {isBest && <span className="text-xs font-semibold text-white bg-emerald-500 px-3 py-1 rounded-full">{t('best_rate_badge')}</span>} 
            </div> 
            <div className="mt-3"> 
                <p className="text-sm text-slate-500">{t('amount_to_receive')}</p> 
                <p className="text-2xl font-extrabold text-indigo-600"> 
                    {Math.round(recipient_gets).toLocaleString('en-US')} 
                    <span className="ml-2 text-xl font-bold text-slate-700">{currency}</span> 
                </p> 
            </div> 
            <div className="mt-3 text-xs text-slate-500"> 
                <span>1 KRW ≈ {exchange_rate.toFixed(4)} {currency}</span> 
                <span className="mx-2">|</span> 
                <span>{t('fee')}: {fee.toLocaleString()} KRW</span> 
            </div> 
        </a> 
    );
};

const CountryDropdown = ({ setSelectedCountry, setShowDropdown, t, onCountryChange }) => ( 
    <div className="absolute top-full right-0 mt-2 w-[280px] h-auto max-h-[60vh] bg-white rounded-xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-40"> 
        <div className="flex-1 overflow-y-auto"> 
            {COUNTRIES.map(c => ( 
                <div key={c.code} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 text-lg" onClick={() => { setSelectedCountry(c); setShowDropdown(false); onCountryChange(c); }}> 
                    <img src={c.flag} alt={`${c.name} flag`} width="28" height="28" className="rounded-full" /> 
                    <div> 
                        <div className="font-bold text-sm text-slate-800">{c.name}</div> 
                        <div className="text-gray-500 text-xs">{c.currency}</div> 
                    </div> 
                </div> 
            ))} 
        </div> 
    </div> 
);

function ComparisonResults({ queryParams, t, onCompareAgain }) {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!queryParams.receive_country) return;

        const fetchRealQuotes = async () => {
            setIsLoading(true);
            setError(null);
            setResults([]);

            console.log('🔥 FORCE DEBUG - Component Version:', Date.now());
            console.log('🔥 FORCE_API_BASE_URL:', FORCE_API_BASE_URL);
            console.log('🔥 Query Params:', queryParams);
            
            const url = `${FORCE_API_BASE_URL}/api/getRemittanceQuote?receive_country=${queryParams.receive_country}&receive_currency=${queryParams.receive_currency}&send_amount=${queryParams.send_amount}`;
            console.log('🎯 Final API URL:', url);
            
            // URL 안전성 검증
            if (!url.includes('sendhome.onrender.com')) {
                console.error('🚨 CRITICAL ERROR: URL is not using correct domain!');
                setError('Configuration error: Invalid API URL detected');
                setIsLoading(false);
                return;
            }

            try {
                console.log('🔍 Starting API call...');
                
                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
                
                console.log('📊 Response details:', {
                    status: response.status,
                    ok: response.ok,
                    url: response.url,
                    statusText: response.statusText
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ API Error Response:', errorText);
                    throw new Error(`API Error: ${response.status} - ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log('✅ API Success Response:', data);
                
                if (data.results && data.results.length > 0) {
                    setResults(data.results);
                } else {
                    setError('No exchange rate providers available');
                }
                
            } catch (err) {
                console.error('🚨 Fetch Error Details:', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
                
                // 매우 구체적인 에러 처리
                if (err.message.includes('127.0.0.1') || err.message.includes('localhost')) {
                    setError('CRITICAL: Code deployment failed. Still using localhost.');
                } else if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
                    setError('Network error: Cannot connect to server. Please check your internet connection.');
                } else if (err.message.includes('CORS')) {
                    setError('CORS error: Server configuration issue.');
                } else {
                    setError(`API Error: ${err.message}`);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchRealQuotes();
    }, [queryParams]);

    const bestRateProvider = useMemo(() => (!results || results.length === 0) ? null : results[0], [results]);
    
    const SkeletonCard = () => ( 
        <div className="w-full p-4 mb-3 bg-white border border-slate-200 rounded-xl shadow-sm animate-pulse"> 
            <div className="flex justify-between items-center">
                <div className="h-6 bg-slate-300 rounded-md w-1/3"></div>
                <div className="h-4 bg-slate-300 rounded-md w-1/4"></div>
            </div> 
            <div className="mt-4 h-8 bg-slate-300 rounded-md w-1/2"></div>
            <div className="mt-2 h-4 bg-slate-300 rounded-md w-3/4"></div> 
        </div> 
    );

    return ( 
        <div className="w-full"> 
            <div className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow-lg mb-6 sticky top-4 z-10"> 
                <h2 className="text-sm font-semibold text-slate-500">{t('real_time_summary')}</h2> 
                <p className="text-xl font-bold text-slate-800 flex items-center"> 
                    {parseInt(queryParams.send_amount).toLocaleString()} KRW → {queryParams.receive_country} 
                </p> 
                {isLoading && <p className="text-xs text-indigo-500 mt-1 animate-pulse">{t('loading_text')}</p>} 
            </div> 
            
            {error && (
                <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-xl font-bold text-red-700">{t('error_title')}</h3>
                    <p className="text-red-600 mt-2 text-sm">{error}</p>
                    <div className="mt-4 space-x-2">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            새로고침
                        </button>
                        <button 
                            onClick={() => {
                                console.log('🔧 Manual debug info:');
                                console.log('FORCE_API_BASE_URL:', FORCE_API_BASE_URL);
                                console.log('Current URL:', window.location.href);
                                console.log('User agent:', navigator.userAgent);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            디버그 정보
                        </button>
                    </div>
                </div>
            )} 
            
            <div className="space-y-3"> 
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
            
            <button 
                onClick={onCompareAgain} 
                className="mt-8 w-full bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition"
            >
                {t('compare_again_button')}
            </button> 
        </div> 
    );
}

// --- Main Page Component ---
export default function MainPage() {
    const [lang, setLang] = useState('en');
    const t = useTranslation(lang);
    const [showResults, setShowResults] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    const resultsRef = useRef(null);
    const [amount, setAmount] = useState("1000000");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const formRef = useRef(null);

    // 🔥 컴포넌트 로드 시 강제 디버깅
    useEffect(() => {
        console.log('🚨 MainPage Component Loaded');
        console.log('🚨 FORCE_API_BASE_URL:', FORCE_API_BASE_URL);
        console.log('🚨 Current timestamp:', new Date().toISOString());
        console.log('🚨 Window location:', window.location.href);
    }, []);

    useEffect(() => { 
        function handleClickOutside(event) { 
            if (formRef.current && !formRef.current.contains(event.target)) { 
                setShowDropdown(false); 
            } 
        } 
        document.addEventListener("mousedown", handleClickOutside); 
        return () => document.removeEventListener("mousedown", handleClickOutside); 
    }, [formRef]);

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
        console.log('🔥 Form submitted, API URL will be:', FORCE_API_BASE_URL);
        
        if (selectedCountry && amount) { 
            setQueryParams({ 
                receive_country: selectedCountry.name, 
                receive_currency: selectedCountry.currency, 
                send_amount: amount 
            }); 
            setShowResults(true); 
        } 
    };

    const handleCompareAgain = () => { 
        setShowResults(false); 
        window.scrollTo({ top: 0, behavior: 'smooth'}); 
    };

    // 🔥 Auto-trigger API call when country changes
    const handleCountryChange = (newCountry) => {
        console.log('🔥 Country changed to:', newCountry.name);
        if (amount) {
            setQueryParams({ 
                receive_country: newCountry.name, 
                receive_currency: newCountry.currency, 
                send_amount: amount 
            }); 
            setShowResults(true);
        }
    };

    // 🔥 Auto-trigger API call when amount changes (if country is already selected)
    useEffect(() => {
        if (selectedCountry && amount && showResults) {
            setQueryParams({ 
                receive_country: selectedCountry.name, 
                receive_currency: selectedCountry.currency, 
                send_amount: amount 
            });
        }
    }, [amount, selectedCountry, showResults]);
        
    return (
        <div className="bg-[#F5F7FA] min-h-screen font-sans flex flex-col items-center pt-8 px-4">
            <div className="w-full max-w-sm lg:max-w-3xl mx-auto">
                <header className="w-full flex items-center mb-10 pl-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20L19 12L5 4V20Z" fill="url(#paint0_linear_header_page)"/>
                        <defs>
                            <linearGradient id="paint0_linear_header_page" x1="5" y1="4" x2="25" y2="24" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4F46E5"/>
                                <stop offset="1" stopColor="#06B6D4"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="text-2xl font-extrabold text-[#1E293B] ml-2">SendHome</span>
                </header>

                <main className="w-full">
                    <div className="w-full">
                        <div className="bg-white rounded-[28px] shadow-2xl shadow-slate-200/60 p-6 sm:p-8 flex flex-col items-center">
                            <h1 className="text-center text-slate-800 text-3xl sm:text-4xl font-extrabold mb-8 leading-tight" dangerouslySetInnerHTML={{ __html: t('title') }} />
        
                            <form onSubmit={handleSubmit} className="w-full">
                                <label className="w-full text-left text-sm font-semibold text-slate-800 mb-2 block">You Send (KRW)</label>
                                
                                <div className="relative w-full mb-5" ref={formRef}>
                                    <input
                                        type="text"
                                        value={parseInt(amount || "0").toLocaleString()}
                                        onChange={handleAmountChange}
                                        className="w-full h-16 rounded-xl bg-[#F8FAFC] border-2 border-[#E2E8F0] px-4 text-2xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-32"
                                    />
                                    <div className="absolute right-2 top-2">
                                        <button
                                            type="button"
                                            className="flex items-center justify-between gap-2 px-3 h-12 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors"
                                            onClick={() => setShowDropdown(prev => !prev)}
                                        >
                                            <img src={selectedCountry.flag} alt={`${selectedCountry.name} flag`} width={28} height={28} className="rounded-full" />
                                            <span className="mx-1 font-semibold text-slate-800">{selectedCountry.currency}</span>
                                            <ChevronDownIcon className="h-4 w-4 text-slate-600" />
                                        </button>
                                        {showDropdown && <CountryDropdown setSelectedCountry={setSelectedCountry} setShowDropdown={setShowDropdown} t={t} onCountryChange={handleCountryChange} />}
                                    </div>
                                </div>
        
                                <div className="text-slate-500 text-center text-base mb-6">
                                    {t('subtitle')}
                                </div>

                                <div className="relative pt-10">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap">
                                        <div className="relative bg-[#FEF3C7] rounded-full py-1.5 px-4">
                                            <span className="flex items-center text-slate-600 font-semibold text-sm">
                                                <span>KRW</span>
                                                <ArrowRightIcon className="h-4 w-4 mx-1.5 text-slate-500" />
                                                <span>{selectedCountry.currency}</span>
                                            </span>
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#FEF3C7]"></div>
                                        </div>
                                    </div>
                                
                                    <button
                                        type="submit"
                                        className="w-full h-14 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                    >
                                        {t('compare_button')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div ref={resultsRef} className="w-full mt-8 transition-opacity duration-500" style={{ opacity: showResults ? 1 : 0, maxHeight: showResults ? '2000px' : '0' }}>
                        {showResults && <ComparisonResults queryParams={queryParams} t={t} onCompareAgain={handleCompareAgain} />}
                    </div>
                </main>
            </div>
        </div>
    );
}