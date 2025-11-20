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

// Provider Card Component - Toss Style
const ProviderCard = ({ provider, isBest }) => {
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
            className={`block bg-white rounded-3xl p-6 mb-4 transition-all duration-200 hover:shadow-xl ${
                isBest ? 'border-3 border-blue-500 shadow-lg' : 'border border-gray-200 hover:border-gray-300'
            }`}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {PROVIDER_LOGO_MAP[provider.provider] ? (
                        <img
                            src={PROVIDER_LOGO_MAP[provider.provider]}
                            alt={`${provider.provider} logo`}
                            className="w-12 h-12 rounded-xl object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600">
                            {displayName.charAt(0)}
                        </div>
                    )}
                    <span className="text-xl font-bold text-gray-900">{displayName}</span>
                </div>
                {isBest && (
                    <span className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                        최고 환율
                    </span>
                )}
            </div>

            <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">받는 금액</div>
                <div className="text-4xl font-bold text-gray-900">
                    {Math.round(provider.recipient_gets).toLocaleString('en-US')}
                    <span className="text-2xl ml-2 text-gray-600">{provider.currency}</span>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div>
                    <div className="text-sm text-gray-500">환율</div>
                    <div className="text-base font-semibold text-gray-700">
                        1 {provider.currency} = {(1 / provider.exchange_rate).toFixed(4)} KRW
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500">수수료</div>
                    <div className="text-base font-semibold text-gray-700">
                        {formattedFeeInKRW} KRW
                    </div>
                </div>
            </div>
        </a>
    );
};

// Comparison Results Component - CRITICAL: Maintains API integration
function ComparisonResults({ queryParams, amount, forceRefresh }) {
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

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {parseInt(amount).toLocaleString()} KRW → {queryParams.receive_country}
                </h2>
                {snapshotTime && (
                    <p className="text-gray-500">조회 시각: {snapshotTime}</p>
                )}
            </div>

            {isLoading && (
                <div className="text-center py-12">
                    <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 text-lg">환율 정보를 가져오는 중...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
                    <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            )}

            {!isLoading && !error && results.length > 0 && (
                <div>
                    {results.map((provider, index) => (
                        <ProviderCard
                            key={provider.provider}
                            provider={{ ...provider, currency: queryParams.receive_currency }}
                            isBest={index === 0}
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
        }
    };

    return (
        <>
            <Head>
                <title>해외송금 비교 - RemitBuddy</title>
                <meta name="description" content="한국 최저 수수료 해외송금 비교 플랫폼" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/logo.svg" alt="RemitBuddy" className="h-10 w-10" />
                            <span className="text-2xl font-bold text-gray-900">RemitBuddy</span>
                        </div>
                    </div>
                </header>

                {/* Hero Section - Toss Style */}
                <section className="bg-white py-16 md:py-24">
                    <div className="max-w-6xl mx-auto px-6">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            해외송금,<br />
                            더 똑똑하게
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl">
                            10개국 송금 업체 환율을 3초 안에 비교하세요
                        </p>

                        {/* Main Form - Toss Style */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border-2 border-gray-200 p-8 max-w-3xl shadow-sm">
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
                                            className="w-full h-16 px-6 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-colors flex items-center justify-between"
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
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-gray-200 shadow-xl max-h-80 overflow-y-auto z-50">
                                                {COUNTRIES.map((country) => (
                                                    <button
                                                        key={country.code}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedCountry(country);
                                                            setShowDropdown(false);
                                                        }}
                                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
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
                                    <div className="relative h-16 bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors px-6 flex items-center">
                                        <input
                                            type="text"
                                            value={amount ? parseInt(amount).toLocaleString('en-US') : ""}
                                            onChange={handleAmountChange}
                                            placeholder="1,000,000"
                                            className="w-full bg-transparent text-2xl font-bold text-gray-900 text-right focus:outline-none pr-20"
                                        />
                                        <span className="absolute right-6 text-xl font-bold text-gray-500">KRW</span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-2xl transition-colors shadow-lg"
                                >
                                    환율 비교하기
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Results Section */}
                {showResults && (
                    <section className="bg-gray-50 py-16">
                        <div className="max-w-6xl mx-auto px-6">
                            <ComparisonResults
                                queryParams={queryParams}
                                amount={amount}
                                forceRefresh={forceRefresh}
                            />
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div>
                                <h3 className="font-bold text-lg mb-3">RemitBuddy</h3>
                                <p className="text-gray-400 text-sm">
                                    해외송금을 더 쉽고 저렴하게
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-3">서비스</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li>환율 비교</li>
                                    <li>수수료 계산</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-3">법적 고지</h3>
                                <p className="text-gray-400 text-xs">
                                    RemitBuddy는 비교 서비스이며 송금업체가 아닙니다.
                                </p>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                            © {new Date().getFullYear()} RemitBuddy. All Rights Reserved.
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
            `}</style>
        </>
    );
}
