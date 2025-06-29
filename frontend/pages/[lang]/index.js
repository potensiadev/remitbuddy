import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- 아이콘 컴포넌트 (React 속성에 맞게 수정됨) ---
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

const CurrencyIconPlaceholder = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="14" fill="#EF4444"/>
        <path d="M14.7551 16.2949C14.3051 16.5949 13.7851 16.7449 13.1951 16.7449C12.3351 16.7449 11.6251 16.5199 11.0651 16.0699C10.5051 15.6199 10.2251 14.9949 10.2251 14.1949C10.2251 13.3549 10.5051 12.6949 11.0651 12.2149C11.6251 11.7349 12.3251 11.4949 13.1651 11.4949C13.7751 11.4949 14.2951 11.6349 14.7251 11.9149V10.2349C14.2351 10.0249 13.7151 9.91992 13.1651 9.91992C12.0051 9.91992 11.0551 10.2349 10.3151 10.8649C9.5751 11.4949 9.20508 12.3549 9.20508 13.4449V14.5449C9.20508 15.6549 9.58508 16.5449 10.3451 17.2149C11.1051 17.8849 12.0551 18.2199 13.1951 18.2199C13.7151 18.2199 14.2351 18.1099 14.7551 17.8899V16.2949Z" fill="white"/>
    </svg>
);


// --- 다국어 처리 (i18n) ---
const translations = {
  en: {
    title: "How much should your<br/>family receive?",
    subtitle: "We’ll find the best exchange rate for you",
    amount_to_receive: "Amount to Receive",
    compare_button: "Find out the Best Rate",
    compare_again_button: "Compare Again",
    best_rate_badge: "Best Rate",
    real_time_summary: "Real-time Summary",
    loading_fast: "Finding best rates...",
    loading_slow: "Checking more options...",
    fee: "Fee",
    error_title: "Oops! Something went wrong.",
    error_message: "We couldn't fetch the remittance data. Please try again later.",
    select_country_title: "Select Country",
    total_needed: "Total KRW needed (estimation)",
  },
  ko: {
    title: "가족이 받을 금액은<br/>얼마인가요?",
    subtitle: "최고의 환율을 찾아드릴게요",
    amount_to_receive: "받는 금액",
    compare_button: "최고 환율 찾아보기",
    compare_again_button: "다시 비교하기",
    best_rate_badge: "최고 환율",
    real_time_summary: "실시간 비교 결과",
    loading_fast: "최고 환율을 찾고 있어요...",
    loading_slow: "더 많은 업체를 확인 중입니다...",
    fee: "수수료",
    error_title: "오류가 발생했습니다.",
    error_message: "송금 정보를 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
    select_country_title: "국가 선택",
    total_needed: "예상 총 필요 원화",
  },
};

const useTranslation = (lang) => (key, params = {}) => {
    let translation = translations[lang]?.[key] || key;
    if (params) {
      Object.keys(params).forEach(pKey => {
          translation = translation.replace(`{${pKey}}`, params[pKey]);
      });
    }
    return translation;
};

// --- Mock API 데이터 및 로직 ---
const MOCK_DATA = { "Vietnam": [ { provider: "Sentbe", base_rate: 18.5, fee: 2500, link: "https://www.sentbe.com/" }, { provider: "Hanpass", base_rate: 18.4, fee: 3000, link: "https://www.hanpass.com/" }, { provider: "Wirebarley", base_rate: 18.45, fee: 2700, link: "https://www.wirebarley.com/" }, { provider: "GME", base_rate: 18.2, fee: 2800, link: "https://www.gmeremit.com/" }, { provider: "E9Pay", base_rate: 18.3, fee: 2200, link: "https://www.e9pay.co.kr/" }, ], "Philippines": [ { provider: "Sentbe", base_rate: 45.2, fee: 3000, link: "https://www.sentbe.com/" } ], "Cambodia": [{ provider: "Sentbe", base_rate: 33.1, fee: 5000, link: "https://www.sentbe.com/" }], "Myanmar": [{ provider: "Hanpass", base_rate: 15.2, fee: 5000, link: "https://www.hanpass.com/" }], "Thailand": [{ provider: "Wirebarley", base_rate: 3.0, fee: 4000, link: "https://www.wirebarley.com/" }], "Uzbekistan": [{ provider: "GME", base_rate: 10.5, fee: 6000, link: "https://www.gmeremit.com/" }], "Indonesia": [{ provider: "Sentbe", base_rate: 130.0, fee: 3500, link: "https://www.sentbe.com/" }], "SriLanka": [{ provider: "E9Pay", base_rate: 2.5, fee: 5500, link: "https://www.e9pay.co.kr/" }], "Bangladesh": [{ provider: "Hanpass", base_rate: 1.0, fee: 6000, link: "https://www.hanpass.com/" }], "Nepal": [ { provider: "Sentbe", base_rate: 110.5, fee: 4000, link: "https://www.sentbe.com/" } ] };
const COUNTRIES = [ { code: "VN", currency: "VND", name: "Vietnam", flag: "🇻🇳" }, { code: "PH", currency: "PHP", name: "Philippines", flag: "🇵🇭" }, { code: "KH", currency: "KHR", name: "Cambodia", flag: "🇰🇭" }, { code: "MM", currency: "MMK", name: "Myanmar", flag: "🇲🇲" }, { code: "TH", currency: "THB", name: "Thailand", flag: "🇹🇭" }, { code: "UZ", currency: "UZS", name: "Uzbekistan", flag: "🇺🇿" }, { code: "ID", currency: "IDR", name: "Indonesia", flag: "🇮🇩" }, { code: "LK", currency: "LKR", name: "SriLanka", flag: "🇱🇰" }, { code: "BD", currency: "BDT", name: "Bangladesh", flag: "🇧🇩" }, { code: 'NP', name: 'Nepal', currency: 'NPR', flag: '🇳🇵' }, ];

const mockApiCall = ({ receive_country, send_amount, mode }) => {
    return new Promise((resolve, reject) => {
        const delay = mode === 'fast' ? 800 : 1500;
        setTimeout(() => {
            const countryData = MOCK_DATA[receive_country];
            if (!countryData) return reject(new Error("No providers for this country"));
            const getDynamicRate = (base) => base + (Math.random() - 0.5) * 0.1;
            const providers = mode === 'fast' ? countryData.slice(0, 2) : countryData.slice(2);
            const results = providers.map(p => {
                const exchange_rate = getDynamicRate(p.base_rate);
                const recipient_gets = parseFloat(send_amount);
                const send_krw = (recipient_gets / exchange_rate) + p.fee;
                return { provider: p.provider, exchange_rate, fee: p.fee, recipient_gets, send_krw, transfer_method: "Bank Deposit", link: p.link };
            });
            resolve({ country: receive_country, currency: COUNTRIES.find(c => c.name === receive_country)?.currency || 'USD', amount: parseInt(send_amount), results });
        }, delay);
    });
};

// --- 컴포넌트 ---
const SkeletonCard = () => ( <div className="w-full p-4 mb-3 bg-white border border-slate-200 rounded-xl shadow-sm animate-pulse"> <div className="flex justify-between items-center"><div className="h-6 bg-slate-300 rounded-md w-1/3"></div><div className="h-4 bg-slate-300 rounded-md w-1/4"></div></div> <div className="mt-4 h-8 bg-slate-300 rounded-md w-1/2"></div><div className="mt-2 h-4 bg-slate-300 rounded-md w-3/4"></div> </div> );
const ProviderCard = ({ providerData, isBest, currency, t }) => { const { provider, send_krw, exchange_rate, fee, link } = providerData; return ( <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full p-4 mb-3 bg-white border rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" style={isBest ? { borderColor: '#10B981', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.2)' } : { borderColor: '#E2E8F0' }}> <div className="flex justify-between items-start"> <h3 className="text-xl font-bold text-slate-800">{provider}</h3> {isBest && <span className="text-xs font-semibold text-white bg-emerald-500 px-3 py-1 rounded-full">{t('best_rate_badge')}</span>} </div> <div className="mt-3"> <p className="text-sm text-slate-500">{t('total_needed')}</p> <p className="text-2xl font-extrabold text-indigo-600"> {Math.round(send_krw).toLocaleString('en-US')} <span className="ml-2 text-xl font-bold text-slate-700">KRW</span> </p> </div> <div className="mt-3 text-xs text-slate-500"> <span>1 KRW ≈ {exchange_rate.toFixed(4)} {currency}</span> <span className="mx-2">|</span> <span>{t('fee')}: {fee.toLocaleString()} KRW</span> </div> </a> );};

const CountryDropdown = ({ setSelectedCountry, setShowDropdown, t }) => ( <div className="fixed inset-0 z-40 bg-black bg-opacity-20 flex justify-center items-center" onClick={() => setShowDropdown(false)}> <div className="w-[263px] h-auto max-h-[80vh] bg-white rounded-[15px] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} style={{ boxShadow: "0px 16px 40px rgba(0,0,0,0.09)" }}> <div className="p-4 border-b font-bold text-lg text-[#232B3A]">{t('select_country_title')}</div> <div className="flex-1 overflow-y-auto"> {COUNTRIES.map(c => ( <div key={c.code} className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-gray-50 text-lg" onClick={() => { setSelectedCountry(c); setShowDropdown(false); }}> <span className="text-2xl">{c.flag}</span> <div> <div className="font-bold text-sm text-slate-800">{c.name}</div> <div className="text-gray-500 text-xs">{c.currency}</div> </div> </div> ))} </div> </div> </div> );

function ComparisonResults({ queryParams, t, onCompareAgain }) {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loadingState, setLoadingState] = useState('fast'); 
    
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                setLoadingState('fast');
                const fastData = await mockApiCall({ ...queryParams, mode: 'fast' });
                setResults(fastData.results);
                
                setLoadingState('slow');
                const slowData = await mockApiCall({ ...queryParams, mode: 'slow' });
                setResults(prev => [...prev, ...slowData.results]);
                
                setLoadingState('done');
            } catch (err) {
                setError(err.message); setLoadingState('error');
            }
        };
        fetchQuotes();
    }, [queryParams]);
    
    const { sortedResults, bestRateProvider } = useMemo(() => {
        if (!results || results.length === 0) return { sortedResults: [], bestRateProvider: null };
        const sorted = [...results].sort((a, b) => a.send_krw - b.send_krw);
        return { sortedResults: sorted, bestRateProvider: sorted[0] };
    }, [results]);

    const currency = COUNTRIES.find(c => c.name === queryParams.receive_country)?.currency || 'USD';
    const skeletonCount = loadingState === 'fast' ? 5 : (loadingState === 'slow' ? 3 : 0);

    return (
        <div className="w-full max-w-sm mx-auto mt-8">
            <div className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow-lg mb-6 sticky top-4 z-10">
                <h2 className="text-sm font-semibold text-slate-500">{t('real_time_summary')}</h2>
                <p className="text-xl font-bold text-slate-800 flex items-center">
                    {parseInt(queryParams.send_amount).toLocaleString()} {currency}
                    <ArrowRightIcon className="inline-block mx-2 h-5 w-5 text-slate-400" />
                    {queryParams.receive_country}
                </p>
                 {loadingState === 'fast' && <p className="text-xs text-indigo-500 mt-1 animate-pulse">{t('loading_fast')}</p>}
                 {loadingState === 'slow' && <p className="text-xs text-indigo-500 mt-1 animate-pulse">{t('loading_slow')}</p>}
            </div>

            {loadingState === 'error' && (
                <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg"><h3 className="text-xl font-bold text-red-700">{t('error_title')}</h3><p className="text-red-600 mt-2">{t('error_message')}</p></div>
            )}
            <div className="space-y-3">
                {sortedResults.map(provider => <ProviderCard key={provider.provider} providerData={provider} isBest={bestRateProvider && provider.provider === bestRateProvider.provider} currency={currency} t={t} />)}
                {Array(skeletonCount).fill(0).map((_, index) => <SkeletonCard key={index} />)}
            </div>
            <button onClick={onCompareAgain} className="mt-8 w-full bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition">{t('compare_again_button')}</button>
        </div>
    );
}

// --- 메인 페이지 컴포넌트 ---
export default function MainPage() {
    const [showResults, setShowResults] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    // 기본 언어를 'en'으로 설정
    const [lang, setLang] = useState('en');
    const t = useTranslation(lang);
    const resultsRef = useRef(null);

    const [amount, setAmount] = useState("1000000");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

    // 브라우저 언어 감지 로직 제거
    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         const browserLang = (navigator.language || navigator.userLanguage).split('-')[0];
    //         if (['en', 'ko'].includes(browserLang)) {
    //             setLang(browserLang);
    //         }
    //     }
    // }, [])

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
        if (selectedCountry && amount) {
            setQueryParams({ receive_country: selectedCountry.name, send_amount: amount });
            setShowResults(true);
        }
    }
    
    const handleCompareAgain = () => {
        setShowResults(false);
        window.scrollTo({ top: 0, behavior: 'smooth'});
    }

    return (
        <div className="bg-[#F5F7FA] min-h-screen font-sans flex flex-col items-start pt-8 px-4">
             <div className="w-full max-w-sm mx-auto">
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
                     <div className="w-full max-w-sm mx-auto">
                        <div className="bg-white rounded-[28px] shadow-2xl shadow-slate-200/60 p-6 sm:p-8 flex flex-col items-center">
                            <h1 className="text-center text-slate-800 text-3xl sm:text-4xl font-extrabold mb-8 leading-tight" dangerouslySetInnerHTML={{ __html: t('title') }} />
        
                            <form onSubmit={handleSubmit} className="w-full">
                                <label className="w-full text-left text-sm font-semibold text-slate-800 mb-2 block">{t('amount_to_receive')}</label>
                                
                                <div className="relative w-full mb-5">
                                    <input
                                        type="text"
                                        value={parseInt(amount || "0").toLocaleString()}
                                        onChange={handleAmountChange}
                                        className="w-full h-16 rounded-xl bg-[#F8FAFC] border-2 border-[#E2E8F0] px-4 text-2xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-32"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-2 flex items-center justify-between gap-2 px-3 h-12 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors"
                                        onClick={() => setShowDropdown(true)}
                                    >
                                        <CurrencyIconPlaceholder />
                                        <span className="mx-1 font-semibold text-slate-800">{selectedCountry.currency}</span>
                                        <ChevronDownIcon className="h-4 w-4 text-slate-600" />
                                    </button>
                                </div>
        
                                <div className="text-slate-500 text-center text-base mb-6">
                                  {t('subtitle')}
                                </div>

                                <div className="flex justify-center items-center mb-8">
                                    <div className="flex items-center text-slate-600 font-semibold bg-[#FEF3C7] rounded-full py-1.5 px-4 text-sm">
                                        <span>{selectedCountry.currency}</span>
                                        <ArrowRightIcon className="h-4 w-4 mx-1.5 text-slate-500" />
                                        <span>KRW</span>
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full h-14 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                >
                                    {t('compare_button')}
                                </button>
                            </form>
                        </div>
                        {showDropdown && <CountryDropdown setSelectedCountry={setSelectedCountry} setShowDropdown={setShowDropdown} t={t} />}
                    </div>
    
                    <div ref={resultsRef} className="w-full transition-opacity duration-500" style={{ opacity: showResults ? 1 : 0, maxHeight: showResults ? '2000px' : '0' }}>
                        {showResults && <ComparisonResults queryParams={queryParams} t={t} onCompareAgain={handleCompareAgain} />}
                    </div>
                </main>
            </div>
        </div>
    );
}
