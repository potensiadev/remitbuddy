import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import { Button } from '../components/ui';

// API Configuration - CRITICAL: DO NOT REMOVE
// Dynamically determine API URL based on environment
const getApiBaseUrl = () => {
  // 1. Check for explicit environment variable (highest priority)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. In browser, detect if running locally and construct URL
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Local development: use same hostname with port 8000
    if (hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')) {
      return `${protocol}//${hostname}:8000`;
    }
  }

  // 3. Production fallback
  return 'https://remitbuddy-production.up.railway.app';
};

// Country data
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

// Provider logo mapping
const PROVIDER_LOGO_MAP = {
    'Hanpass': '/logos/hanpass.png',
    'GmoneyTrans': '/logos/gmoneytrans.png',
    'E9Pay': '/logos/e9pay.png',
    'Finshot': null,
    'Coinshot': '/logos/coinshot.png',
    'Cross': '/logos/cross.png',
    'GME Remit': '/logos/gme.png',
    'JRF': '/logos/JRF.png',
    'JP Remit': '/logos/JRF.png',
    'Wirebarley': '/logos/wirebarley.png',
    'Moin': '/logos/themoin.png',
    'The Moin': '/logos/themoin.png',
    'Sentbe': '/logos/sentbe.png'
};

// Icon Components
const ChevronDownIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ShieldIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const GlobeIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SparklesIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const CurrencyIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

// Provider Card Component - mobile-first, high-emphasis layout
const ProviderCard = ({ provider, isBest, index }) => {
    const displayName = provider.provider === 'JP Remit' ? 'JRF' :
        provider.provider === 'The Moin' ? 'Moin' : provider.provider;

    const formattedFeeInKRW = provider.fee.toLocaleString('en-US');

    return (
        <a
            href={provider.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative block w-full rounded-2xl bg-white border transition-all duration-200 p-4 sm:p-5 md:p-6 hover:-translate-y-1 hover:shadow-xl ${isBest
                ? 'border-blue-300 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg ring-2 ring-blue-100'
                : 'border-gray-100 shadow-md hover:border-blue-200'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {isBest && (
                <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-blue-600 text-white text-xs font-semibold px-3 py-1 shadow-md">
                    추천
                </span>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {PROVIDER_LOGO_MAP[provider.provider] ? (
                        <img
                            src={PROVIDER_LOGO_MAP[provider.provider]}
                            alt={`${provider.provider} logo`}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-contain bg-gray-50 p-2"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-lg sm:text-xl font-bold text-white">
                            {displayName.charAt(0)}
                        </div>
                    )}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg sm:text-xl font-bold text-gray-900 break-keep">{displayName}</span>
                            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-[11px] font-semibold px-2 py-1">{index + 1}위</span>
                        </div>
                        {isBest && (
                            <span className="flex items-center gap-1 text-xs sm:text-sm text-blue-700 font-semibold mt-1">
                                <SparklesIcon />
                                가장 저렴하게 보낼 수 있어요
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 sm:mt-5 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-accent-50 px-4 sm:px-5 py-3 sm:py-4">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">받는 금액</div>
                <div className="flex items-baseline gap-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-600">
                    <span className="break-keep">{Math.round(provider.recipient_gets).toLocaleString('en-US')}</span>
                    <span className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold">{provider.currency}</span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-xl bg-gray-50 px-3 py-3 sm:px-4 sm:py-4">
                    <div className="text-[11px] sm:text-xs font-semibold text-gray-600 mb-1">환율</div>
                    <div className="text-base sm:text-lg font-bold text-gray-900">{(1 / provider.exchange_rate).toFixed(4)}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1">KRW per {provider.currency}</div>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-3 sm:px-4 sm:py-4">
                    <div className="text-[11px] sm:text-xs font-semibold text-gray-600 mb-1">수수료</div>
                    <div className="text-base sm:text-lg font-bold text-gray-900">{formattedFeeInKRW}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1">KRW</div>
                </div>
            </div>

            <div className="mt-4 sm:mt-5 flex justify-center sm:justify-end">
                <span className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm sm:text-base shadow-md hover:bg-blue-700 hover:shadow-lg transition-all">
                    송금하러 가기
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </a>
    );
};

// Comparison Results Component - CRITICAL: Maintains API integration
function ComparisonResults({ queryParams, amount, forceRefresh, onCompareAgain }) {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snapshotTime, setSnapshotTime] = useState(null);
    const amountRef = useRef(amount);

    useEffect(() => {
        amountRef.current = amount;
    }, [amount]);

    useEffect(() => {
        if (!queryParams.receive_country) return;

        const fetchQuotes = async () => {
            setIsLoading(true);
            setError(null);
            setResults([]);

            // CRITICAL: API call - DO NOT MODIFY
            const url = `${apiBaseUrl}/api/getRemittanceQuote?receive_country=${queryParams.receive_country}&receive_currency=${queryParams.receive_currency}&send_amount=${amountRef.current}&_t=${Date.now()}`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    setResults(data.results);
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    setSnapshotTime(`${year}-${month}-${day} ${hours}:${minutes}`);
                } else {
                    setError('환율 정보를 불러올 수 없습니다');
                }
            } catch (err) {
                setError(`오류가 발생했습니다: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuotes();
    }, [queryParams.receive_country, queryParams.receive_currency, forceRefresh]);

    const bestProvider = results.length > 0 ? results[0] : null;
    const worstProvider = results.length > 1 ? results[results.length - 1] : null;
    const savings = bestProvider && worstProvider ?
        Math.round(bestProvider.recipient_gets - worstProvider.recipient_gets) : 0;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
            {/* Mobile-first: tighter spacing and scalable typography to prevent overflow */}
            <div className="mb-6 sm:mb-8 text-center space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight break-words">
                    {parseInt(amount).toLocaleString()} KRW → {queryParams.receive_country}
                </h2>
                {snapshotTime && (
                    <p className="text-gray-600 flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
                        <ClockIcon />
                        <span className="break-words">조회 시각: {snapshotTime}</span>
                    </p>
                )}
                {savings > 0 && (
                    <div className="mt-2 sm:mt-4 inline-flex w-full sm:w-auto justify-center bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-300 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-toss-sm">
                        <p className="text-accent-700 text-sm sm:text-base font-bold leading-snug">
                            가장 저렴하게 최대 <span className="text-xl sm:text-2xl font-bold text-accent-600">{savings.toLocaleString()}</span> {queryParams.receive_currency} 더 보낼 수 있어요!
                        </p>
                    </div>
                )}
                <button
                    onClick={onCompareAgain}
                    className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-2xl text-base sm:text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 mx-auto shadow-sm hover:shadow-md active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    다시 비교하기
                </button>
            </div>

            {isLoading && (
                <div className="text-center py-12 sm:py-16 w-full px-4 sm:px-6">
                    <div className="inline-block relative mb-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-900 text-base sm:text-lg font-bold mb-2">최적의 환율을 찾고 있습니다...</p>
                    <p className="text-gray-600 text-sm font-medium">10개 송금 업체를 비교하는 중</p>
                </div>
            )}

            {error && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 text-center w-full">
                    <div className="text-4xl sm:text-5xl mb-4">😔</div>
                    <p className="text-red-600 text-base sm:text-lg font-semibold mb-6 leading-snug">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                    >
                        다시 시도하기
                    </button>
                </div>
            )}

            {!isLoading && !error && results.length > 0 && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <p className="text-gray-600 font-medium text-base sm:text-lg">
                            <span className="text-xl sm:text-2xl font-bold text-blue-600">{results.length}개</span> 업체 비교 결과
                        </p>
                    </div>
                    {results.map((provider, index) => (
                        <ProviderCard
                            key={provider.provider}
                            provider={{ ...provider, currency: queryParams.receive_currency }}
                            isBest={index === 0}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Main Page Component
export default function HomePage() {
    const [amount, setAmount] = useState("1000000");
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    const [forceRefresh, setForceRefresh] = useState(0);
    const [apiBaseUrl, setApiBaseUrl] = useState('https://remitbuddy-production.up.railway.app');
    const dropdownRef = useRef(null);
    const resultsRef = useRef(null);

    // Set API URL on client side only
    useEffect(() => {
        const url = getApiBaseUrl();
        console.log('[RemitBuddy] API Base URL:', url);
        setApiBaseUrl(url);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/,/g, '');
        if (!isNaN(value) && value.length <= 10) {
            setAmount(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCountry && amount) {
            setQueryParams({
                receive_country: selectedCountry.name,
                receive_currency: selectedCountry.currency
            });
            setShowResults(true);
            setForceRefresh(prev => prev + 1);

            // Smooth scroll to results
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const handleCompareAgain = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Head>
                <title>해외송금 비교 - RemitBuddy | 10개국 송금업체 실시간 환율 비교</title>
                <meta name="description" content="한국에서 해외송금할 때 가장 저렴한 업체를 찾아보세요. 10개국 송금업체의 환율과 수수료를 3초만에 비교하고 최대 수만원을 절약하세요." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="keywords" content="해외송금, 환율비교, 송금수수료, 베트남송금, 필리핀송금, 국제송금" />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header - Toss Style Refined */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">RemitBuddy</span>
                        </div>
                        {/* <nav className="hidden md:flex gap-8 lg:gap-12">
                            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-semibold transition-all duration-200 text-base lg:text-lg hover:scale-105">이용방법</a>
                            <a href="#features" className="text-gray-600 hover:text-gray-900 font-semibold transition-all duration-200 text-base lg:text-lg hover:scale-105">특징</a>
                            <a href="#faq" className="text-gray-600 hover:text-gray-900 font-semibold transition-all duration-200 text-base lg:text-lg hover:scale-105">FAQ</a>
                        </nav> */}
                    </div>
                </header>

                {/* Hero Section - Toss Style */}
                <section className="bg-gradient-to-br from-brand-50 via-white to-brand-50/30 pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-30 animate-float"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Column - Content */}
                            <div className="animate-fade-in-up">
                                <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-brand-200 shadow-toss-sm hover:shadow-toss transition-all duration-300">
                                    <ShieldIcon />
                                    <span>안전하고 투명한 비교 서비스</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-[1.1] tracking-tighter">
                                    해외송금<br className="md:hidden" /> 더 똑똑하게
                                </h1>

                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500 mb-5 md:mb-7 leading-relaxed font-medium">
                                    10개의 해외송금 업체의 환율과 수수료를<br className="hidden sm:block" />
                                    단 3초만에 비교하고 <span className="font-bold text-brand-500">최대 OO만원</span> 절약하세요
                                </p>

                                {/* Trust Indicators */}
                                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 md:gap-6 mb-6 md:mb-8">
                                    <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                        <div className="text-brand-600 flex-shrink-0"><CheckCircleIcon /></div>
                                        <span className="text-gray-700 font-semibold text-sm md:text-base">실시간 환율 정보</span>
                                    </div>
                                    <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                        <div className="text-brand-600 flex-shrink-0"><CheckCircleIcon /></div>
                                        <span className="text-gray-700 font-semibold text-sm md:text-base">숨은 수수료 없음</span>
                                    </div>
                                    <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                        <div className="text-brand-600 flex-shrink-0"><CheckCircleIcon /></div>
                                        <span className="text-gray-700 font-semibold text-sm md:text-base">100% 무료 비교</span>
                                    </div>
                                </div>

                                {/* Social Proof - Toss Style */}
                                <div className="bg-white rounded-xl border border-gray-150 p-4 sm:p-6 w-full sm:w-auto sm:inline-block shadow-toss-sm hover:shadow-toss transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                    <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6 md:gap-8">
                                        <div className="text-center sm:text-left">
                                            <div className="text-xl sm:text-2xl font-bold text-brand-500">10+</div>
                                            <div className="text-xs sm:text-sm text-gray-500 font-medium">송금 업체</div>
                                        </div>
                                        <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
                                        <div className="text-center sm:text-left">
                                            <div className="text-xl sm:text-2xl font-bold text-accent-500">10개국</div>
                                            <div className="text-xs sm:text-sm text-gray-500 font-medium">송금 가능</div>
                                        </div>
                                        <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
                                        <div className="text-center sm:text-left">
                                            <div className="text-xl sm:text-2xl font-bold text-brand-500">3초</div>
                                            <div className="text-xs sm:text-sm text-gray-500 font-medium">비교 완료</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Form - Toss Style */}
                            <div className="animate-fade-in-up w-full sm:max-w-xl lg:max-w-2xl" style={{ animationDelay: '0.2s' }}>
                                <form onSubmit={handleSubmit} className="w-full bg-white rounded-2xl border border-gray-150 p-4 sm:p-6 md:p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">환율 비교 시작하기</h2>

                            <div className="space-y-5 sm:space-y-6">
                                {/* Country Selector - Premium Dropdown */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">
                                        받는 나라
                                    </label>
                                    <div ref={dropdownRef} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowDropdown(!showDropdown)}
                                            className="w-full h-14 sm:h-16 px-4 sm:px-5 md:px-6 bg-white rounded-2xl border border-gray-200 shadow-md shadow-black/5 hover:border-blue-200 hover:shadow-lg transition-all duration-200 flex items-center justify-between group outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1"
                                            aria-label="Select country"
                                            aria-expanded={showDropdown}
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <span className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-50 border border-gray-100 shadow-inner">
                                                    <img src={selectedCountry.flag} alt="" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover" />
                                                </span>
                                                <div className="flex flex-col items-start leading-tight">
                                                    <span className="text-base sm:text-lg font-semibold text-gray-900">{selectedCountry.name}</span>
                                                    <span className="text-xs sm:text-sm font-medium text-gray-500">{selectedCountry.currency}</span>
                                                </div>
                                            </div>
                                            <ChevronDownIcon />
                                        </button>

                                        {showDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-2 w-full origin-top transform animate-fade-in-down z-50">
                                                <div className="w-full rounded-2xl bg-white shadow-lg shadow-black/5 ring-1 ring-gray-100 overflow-hidden border border-gray-100 transition-all duration-150">
                                                    <div className="max-h-80 overflow-y-auto py-2 sm:py-3 pr-1 scrollbar-thin scrollbar-thumb-gray-300/90 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded-full">
                                                        {COUNTRIES.map((country) => {
                                                            const isSelected = selectedCountry.code === country.code;
                                                            return (
                                                                <button
                                                                    key={country.code}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedCountry(country);
                                                                        setShowDropdown(false);
                                                                    }}
                                                                    className={`group relative w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 min-h-[56px] sm:min-h-[60px] text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1 border-l-4 ${
                                                                      isSelected
                                                                        ? 'bg-[#E8F1FF] border-blue-500 text-blue-700'
                                                                        : 'border-transparent hover:bg-[#F3F7FF] hover:text-blue-700'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                                        <span className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-50 border border-gray-100 shadow-sm">
                                                                            <img src={country.flag} alt="" className="w-6 h-6 sm:w-7 sm:h-7 object-cover rounded-full" />
                                                                        </span>
                                                                        <div className="flex flex-col items-start justify-center leading-tight">
                                                                            <span className="font-medium text-gray-900 group-hover:text-blue-700 text-sm sm:text-base">{country.name}</span>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-500 group-hover:text-blue-700">
                                                                        {country.currency}
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Amount Input - Toss Style */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">
                                        보내는 금액
                                    </label>
                                    <div className="relative h-14 sm:h-16 bg-[#f2f4f6] rounded-2xl hover:bg-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500 transition-all duration-200 px-4 sm:px-6 flex items-center gap-2 border-0 shadow-sm hover:shadow-toss">
                                        <input
                                            type="text"
                                            value={amount ? parseInt(amount).toLocaleString('en-US') : ""}
                                            onChange={handleAmountChange}
                                            placeholder="1,000,000"
                                            className="flex-1 bg-transparent text-xl sm:text-2xl font-bold text-gray-900 text-right focus:outline-none placeholder-gray-400 border-0"
                                            aria-label="Amount to send in KRW"
                                        />
                                        <span className="text-lg sm:text-xl font-bold text-gray-500">KRW</span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 font-medium ml-1">최소 금액: 100,000 KRW</p>
                                </div>

                                {/* Submit Button - Toss Style */}
                                <button
                                    type="submit"
                                    className="w-full sm:w-full max-w-xl h-14 sm:h-16 bg-[#2D8CFF] hover:bg-[#1A75FF] text-white font-semibold text-base sm:text-lg rounded-[14px] shadow-[0_4px_12px_rgba(45,140,255,0.35)] transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    최저 환율 비교하기
                                </button>

                                <p className="text-center text-sm text-gray-500 font-medium">
                                    비교는 무료이며 개인정보를 요구하지 않아요
                                </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section - Toss Style */}
                <section id="how-it-works" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                                이용 방법
                            </h2>
                            <p className="text-xl text-gray-600 font-medium">
                                3단계로 끝나는 간단한 비교 과정
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center group">
                        <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-toss group-hover:shadow-toss-lg transition-all duration-300 group-hover:scale-110">
                            1
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">송금 국가와 금액 입력</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            송금받을 나라를 선택하고<br />
                            보낼 금액을 입력하세요
                        </p>
                    </div>

                    <div className="text-center group">
                        <div className="w-20 h-20 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-toss group-hover:shadow-toss-lg transition-all duration-300 group-hover:scale-110">
                            2
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">실시간 비교 결과</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            10개 업체의 환율과<br />
                            수수료를 한눈에 비교하세요
                        </p>
                    </div>

                    <div className="text-center group">
                        <div className="w-20 h-20 bg-accent-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-toss group-hover:shadow-toss-lg transition-all duration-300 group-hover:scale-110">
                            3
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">최적 업체 선택</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            가장 유리한 조건을<br />
                            확인하고 바로 송금하세요
                        </p>
                    </div>
                </div>
            </div>
                </section >

        {/* Features Section - Toss Style */ }
        < section id = "features" className = "py-20 bg-gradient-to-br from-gray-50 to-brand-50/30" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        RemitBuddy 왜 써야할까요?
                    </h2>
                    <p className="text-xl text-gray-600 font-medium">
                        더이상 여러 앱을 비교하지 마세요
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUpIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">실시간 환율</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            항상 최신 환율 정보로 정확하게 비교할 수 있어요
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <ShieldIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">투명한 수수료</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            숨겨진 비용 없이 모든 수수료를 명확하게 표시해요
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-14 h-14 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <GlobeIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">10개국 지원</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            베트남, 필리핀 등 주요 10개국으로의 송금 환율과 수수료를 비교할 수 있어요
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-14 h-14 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <CurrencyIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">최대 절약</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            최적의 환율로 송금하여 수만원을 절약할 수 있어요
                        </p>
                    </div>
                </div>
            </div>
                </section >

        {/* Results Section */ }
    {
        showResults && (
            <section ref={resultsRef} className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ComparisonResults
                        queryParams={queryParams}
                        amount={amount}
                        forceRefresh={forceRefresh}
                        onCompareAgain={handleCompareAgain}
                    />
                </div>
            </section>
        )
    }

    {/* FAQ Section - Toss Style */ }
    <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                    자주 묻는 질문
                </h2>
            </div>

            <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-gray-150">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">RemitBuddy는 송금 서비스인가요?</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        아니요. RemitBuddy는 여러 송금 업체의 환율·수수료를 비교해주는 플랫폼이에요.
                        실제 송금은 선택한 업체에서 진행됩니다.
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-gray-150">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">해외송금비교 서비스는 무료인가요?</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        네. 100% 무료이며 회원가입이나 개인 정보 제공 없이 이용할 수 있어요.
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-gray-150">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">환율 정보는 얼마나 자주 업데이트되나요?</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        비교하기 버튼을 클릭할 때마다 최신 환율과 수수료 정보를 불러옵니다.
                    </p>
                </div>

                            <div className="bg-white rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-gray-150">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">어떤 국가의 송금 수수료를 비교할 수 있나요?</h3>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    현재 베트남, 네팔, 필리핀, 캄보디아, 미얀마 등 10개의 환율·수수료를 비교할 수 있어요. 다른 국가도 계속 추가될 예정이에요.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section - Toss Style Enhanced */}
                <section className="py-24 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 relative overflow-hidden">
                    {/* Sophisticated background decorations */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl opacity-20 animate-float"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-400 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}></div>

                    <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand mb-6 tracking-tight leading-tight">
                            지금 바로 환율을<br className="md:hidden" /> 비교해보세요
                        </h2>
                        <p className="text-xl md:text-2xl text-brand/90 mb-10 font-medium max-w-2xl mx-auto">
                            3초면 충분해요. 무료로 시작하세요.
                        </p>
                        <Button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            variant="secondary"
                            size="xl"
                            className="bg-blue-600 text-white hover:bg-brand-50 shadow-2xl hover:shadow-button-hover hover:scale-105 transition-all duration-300"
                        > 
                            최저 송금 수수료 비교하기
                        </Button>
                    </div>
                </section>

                {/* Footer - Enhanced Toss Style */}
                <Footer />
            </div>

            <style jsx global>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
                }

                .border-3 {
                    border-width: 3px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border-width: 0;
                }

                html {
                    scroll-behavior: smooth;
                }
            `}</style>
        </>
    );
}
