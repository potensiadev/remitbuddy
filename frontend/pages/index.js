import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// API Configuration - CRITICAL: DO NOT REMOVE
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://remitbuddy-production.up.railway.app';

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

// Provider Card Component - Enhanced
const ProviderCard = ({ provider, isBest, index }) => {
    const displayName = provider.provider === 'JP Remit' ? 'JRF' :
                       provider.provider === 'The Moin' ? 'Moin' : provider.provider;

    const feeInTargetCurrency = provider.fee * provider.exchange_rate;
    const formattedFeeInTarget = Math.round(feeInTargetCurrency).toLocaleString('en-US');
    const formattedFeeInKRW = provider.fee.toLocaleString('en-US');

    return (
        <a
            href={provider.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`block bg-white rounded-3xl p-6 mb-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                isBest ? 'border-3 border-blue-500 shadow-xl ring-4 ring-blue-100' : 'border border-gray-200 hover:border-blue-300'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {PROVIDER_LOGO_MAP[provider.provider] ? (
                        <img
                            src={PROVIDER_LOGO_MAP[provider.provider]}
                            alt={`${provider.provider} logo`}
                            className="w-14 h-14 rounded-xl object-contain bg-gray-50 p-2"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white">
                            {displayName.charAt(0)}
                        </div>
                    )}
                    <div>
                        <span className="text-xl font-bold text-gray-900 block">{displayName}</span>
                        {isBest && (
                            <span className="flex items-center gap-1 text-sm text-blue-600 font-semibold mt-1">
                                <SparklesIcon />
                                최고 환율
                            </span>
                        )}
                    </div>
                </div>
                {isBest && (
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg">
                        추천
                    </span>
                )}
            </div>

            <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5">
                <div className="text-gray-600 text-sm mb-2 font-medium">받는 금액</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {Math.round(provider.recipient_gets).toLocaleString('en-US')}
                    <span className="text-2xl ml-2 text-gray-700">{provider.currency}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">환율</div>
                    <div className="text-base font-bold text-gray-900">
                        {(1 / provider.exchange_rate).toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">KRW per {provider.currency}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">수수료</div>
                    <div className="text-base font-bold text-gray-900">
                        {formattedFeeInKRW}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">KRW</div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
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
            const url = `${API_BASE_URL}/api/getRemittanceQuote?receive_country=${queryParams.receive_country}&receive_currency=${queryParams.receive_currency}&send_amount=${amountRef.current}&_t=${Date.now()}`;

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
        <div className="max-w-4xl mx-auto">
            {/* Results Header */}
            <div className="mb-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    {parseInt(amount).toLocaleString()} KRW → {queryParams.receive_country}
                </h2>
                {snapshotTime && (
                    <p className="text-gray-500 flex items-center justify-center gap-2">
                        <ClockIcon />
                        <span>조회 시각: {snapshotTime}</span>
                    </p>
                )}
                {savings > 0 && (
                    <div className="mt-4 inline-block bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl px-6 py-3">
                        <p className="text-green-700 font-semibold">
                            최고 환율로 최대 <span className="text-2xl font-bold text-green-600">{savings.toLocaleString()}</span> {queryParams.receive_currency} 더 받을 수 있어요!
                        </p>
                    </div>
                )}
                <button
                    onClick={onCompareAgain}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mx-auto transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    다시 비교하기
                </button>
            </div>

            {isLoading && (
                <div className="text-center py-16">
                    <div className="inline-block relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    </div>
                    <p className="text-gray-600 text-lg font-medium">최적의 환율을 찾고 있습니다...</p>
                    <p className="text-gray-500 text-sm mt-2">10개 송금 업체를 비교하는 중</p>
                </div>
            )}

            {error && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-8 text-center">
                    <div className="text-5xl mb-4">😔</div>
                    <p className="text-red-600 text-lg font-semibold mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                    >
                        다시 시도하기
                    </button>
                </div>
            )}

            {!isLoading && !error && results.length > 0 && (
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-gray-600 font-medium">
                            <span className="text-2xl font-bold text-blue-600">{results.length}개</span> 업체 비교 결과
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
    const dropdownRef = useRef(null);
    const resultsRef = useRef(null);

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
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/logo.svg" alt="RemitBuddy" className="h-10 w-10" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">RemitBuddy</span>
                        </div>
                        <nav className="hidden md:flex gap-6">
                            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">이용방법</a>
                            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">특징</a>
                            <a href="#faq" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">FAQ</a>
                        </nav>
                    </div>
                </header>

                {/* Hero Section - Enhanced */}
                <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Column - Content */}
                            <div>
                                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                    <ShieldIcon />
                                    <span>안전하고 투명한 비교 서비스</span>
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                                    해외송금,<br />
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        더 똑똑하게
                                    </span>
                                </h1>

                                <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                                    10개국 주요 송금 업체의 환율과 수수료를<br />
                                    단 3초만에 비교하고 <span className="font-bold text-blue-600">최대 수만원</span>을 절약하세요
                                </p>

                                {/* Trust Indicators */}
                                <div className="flex flex-wrap gap-6 mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="text-blue-600"><CheckCircleIcon /></div>
                                        <span className="text-gray-700 font-medium">실시간 환율 정보</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-blue-600"><CheckCircleIcon /></div>
                                        <span className="text-gray-700 font-medium">숨은 수수료 없음</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-blue-600"><CheckCircleIcon /></div>
                                        <span className="text-gray-700 font-medium">100% 무료 비교</span>
                                    </div>
                                </div>

                                {/* Social Proof */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 inline-block">
                                    <div className="flex items-center gap-8">
                                        <div>
                                            <div className="text-3xl font-bold text-blue-600">10+</div>
                                            <div className="text-sm text-gray-600">송금 업체</div>
                                        </div>
                                        <div className="w-px h-12 bg-gray-200"></div>
                                        <div>
                                            <div className="text-3xl font-bold text-purple-600">10개국</div>
                                            <div className="text-sm text-gray-600">송금 가능</div>
                                        </div>
                                        <div className="w-px h-12 bg-gray-200"></div>
                                        <div>
                                            <div className="text-3xl font-bold text-green-600">3초</div>
                                            <div className="text-sm text-gray-600">비교 완료</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Form */}
                            <div>
                                <form onSubmit={handleSubmit} className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-2xl hover:shadow-3xl transition-shadow">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">환율 비교 시작하기</h2>

                                    <div className="space-y-6">
                                        {/* Country Selector */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                                받는 나라
                                            </label>
                                            <div ref={dropdownRef} className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDropdown(!showDropdown)}
                                                    className="w-full h-16 px-6 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all flex items-center justify-between"
                                                    aria-label="Select country"
                                                    aria-expanded={showDropdown}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <img src={selectedCountry.flag} alt="" className="w-8 h-8 rounded-full" />
                                                        <span className="text-lg font-semibold text-gray-900">
                                                            {selectedCountry.name} ({selectedCountry.currency})
                                                        </span>
                                                    </div>
                                                    <ChevronDownIcon />
                                                </button>

                                                {showDropdown && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-gray-200 shadow-2xl max-h-80 overflow-y-auto z-50">
                                                        {COUNTRIES.map((country) => (
                                                            <button
                                                                key={country.code}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedCountry(country);
                                                                    setShowDropdown(false);
                                                                }}
                                                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                            >
                                                                <span className="text-base font-semibold text-gray-900">
                                                                    {country.name} ({country.currency})
                                                                </span>
                                                                <img src={country.flag} alt="" className="w-8 h-8 rounded-full" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Amount Input */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                                보내는 금액
                                            </label>
                                            <div className="relative h-16 bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all px-6 flex items-center">
                                                <input
                                                    type="text"
                                                    value={amount ? parseInt(amount).toLocaleString('en-US') : ""}
                                                    onChange={handleAmountChange}
                                                    placeholder="1,000,000"
                                                    className="w-full bg-transparent text-2xl font-bold text-gray-900 text-right focus:outline-none pr-20"
                                                    aria-label="Amount to send in KRW"
                                                />
                                                <span className="absolute right-6 text-xl font-bold text-gray-500">KRW</span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">최소 금액: 100,000 KRW</p>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="w-full h-16 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xl font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                        >
                                            환율 비교하기
                                        </button>

                                        <p className="text-center text-sm text-gray-500">
                                            비교는 무료이며 개인정보를 요구하지 않습니다
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                이용 방법
                            </h2>
                            <p className="text-xl text-gray-600">
                                3단계로 끝나는 간단한 비교 과정
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                                    1
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">나라와 금액 입력</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    송금받을 나라를 선택하고<br />
                                    보낼 금액을 입력하세요
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                                    2
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">실시간 비교 결과</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    10개 이상 업체의 환율과<br />
                                    수수료를 한눈에 비교하세요
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                                    3
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">최적 업체 선택</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    가장 유리한 조건의 업체를<br />
                                    선택하고 바로 송금하세요
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                RemitBuddy의 특별한 점
                            </h2>
                            <p className="text-xl text-gray-600">
                                해외송금을 더 쉽고 저렴하게 만드는 핵심 기능
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                    <TrendingUpIcon />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">실시간 환율</h3>
                                <p className="text-gray-600">
                                    항상 최신 환율 정보로 정확한 비교가 가능합니다
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all">
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                                    <ShieldIcon />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">투명한 수수료</h3>
                                <p className="text-gray-600">
                                    숨겨진 비용 없이 모든 수수료를 명확하게 표시합니다
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                                    <GlobeIcon />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">10개국 지원</h3>
                                <p className="text-gray-600">
                                    베트남, 필리핀 등 주요 10개국으로의 송금을 지원합니다
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all">
                                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                                    <CurrencyIcon />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">최대 절약</h3>
                                <p className="text-gray-600">
                                    최적의 환율로 송금하여 수만원을 절약하세요
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                {showResults && (
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
                )}

                {/* FAQ Section */}
                <section id="faq" className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                자주 묻는 질문
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl p-6 shadow-md">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">RemitBuddy는 송금 서비스인가요?</h3>
                                <p className="text-gray-600">
                                    아니요, RemitBuddy는 여러 송금 업체의 환율과 수수료를 비교해주는 비교 플랫폼입니다.
                                    실제 송금은 선택하신 업체의 서비스를 통해 진행됩니다.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-md">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">비교 서비스는 무료인가요?</h3>
                                <p className="text-gray-600">
                                    네, RemitBuddy의 모든 비교 서비스는 100% 무료입니다.
                                    회원가입이나 개인정보 제공 없이 자유롭게 이용하실 수 있습니다.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-md">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">환율 정보는 얼마나 자주 업데이트되나요?</h3>
                                <p className="text-gray-600">
                                    환율 정보는 실시간으로 업데이트됩니다.
                                    비교 버튼을 클릭할 때마다 최신 환율과 수수료 정보를 가져옵니다.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-md">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">어떤 나라로 송금할 수 있나요?</h3>
                                <p className="text-gray-600">
                                    현재 베트남, 네팔, 필리핀, 캄보디아, 미얀마, 태국, 우즈베키스탄, 인도네시아, 스리랑카, 방글라데시 등
                                    10개국으로의 송금을 비교할 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            지금 바로 환율을 비교해보세요
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            3초면 충분합니다. 무료로 시작하세요.
                        </p>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="bg-white text-blue-600 px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
                        >
                            환율 비교 시작하기
                        </button>
                    </div>
                </section>

                {/* Footer - Enhanced */}
                <footer className="bg-gray-900 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src="/logo.svg" alt="RemitBuddy" className="h-10 w-10" />
                                    <span className="text-2xl font-bold">RemitBuddy</span>
                                </div>
                                <p className="text-gray-400 mb-6 max-w-md">
                                    해외송금을 더 쉽고 저렴하게. 10개 송금 업체의 환율을 한눈에 비교하고 최적의 선택을 하세요.
                                </p>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                        <span className="sr-only">Facebook</span>
                                        F
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                        <span className="sr-only">Twitter</span>
                                        T
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                        <span className="sr-only">Instagram</span>
                                        I
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-4">서비스</h3>
                                <ul className="space-y-3 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">환율 비교</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">수수료 계산기</a></li>
                                    <li><a href="#how-it-works" className="hover:text-white transition-colors">이용 방법</a></li>
                                    <li><a href="#features" className="hover:text-white transition-colors">특징</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-4">지원</h3>
                                <ul className="space-y-3 text-gray-400">
                                    <li><a href="#faq" className="hover:text-white transition-colors">자주 묻는 질문</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">고객 지원</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-800">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-gray-500 text-sm">
                                    © {new Date().getFullYear()} RemitBuddy. All Rights Reserved.
                                </p>
                                <p className="text-gray-500 text-sm">
                                    RemitBuddy는 비교 서비스이며 송금업체가 아닙니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
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
