import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// API Configuration - CRITICAL: DO NOT REMOVE
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://remitbuddy.up.railway.app';

// Country data
const COUNTRIES = [
    { code: 'VN', currency: 'VND', name: 'Vietnam', labelKey: 'countries.vn', flag: '/images/flags/vn.png' },
    { code: 'NP', name: 'Nepal', currency: 'NPR', labelKey: 'countries.np', flag: '/images/flags/np.png' },
    { code: 'PH', currency: 'PHP', name: 'Philippines', labelKey: 'countries.ph', flag: '/images/flags/ph.png' },
    { code: 'KH', currency: 'KHR', name: 'Cambodia', labelKey: 'countries.kh', flag: '/images/flags/kh.png' },
    { code: 'MM', currency: 'MMK', name: 'Myanmar', labelKey: 'countries.mm', flag: '/images/flags/mm.png' },
    { code: 'TH', currency: 'THB', name: 'Thailand', labelKey: 'countries.th', flag: '/images/flags/th.png' },
    { code: 'UZ', currency: 'UZS', name: 'Uzbekistan', labelKey: 'countries.uz', flag: '/images/flags/uz.png' },
    { code: 'ID', currency: 'IDR', name: 'Indonesia', labelKey: 'countries.id', flag: '/images/flags/id.png' },
    { code: 'LK', currency: 'LKR', name: 'SriLanka', labelKey: 'countries.lk', flag: '/images/flags/lk.png' },
    { code: 'BD', currency: 'BDT', name: 'Bangladesh', labelKey: 'countries.bd', flag: '/images/flags/bd.png' },
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

const SparklesIcon = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

// Provider Card Component - Toss Style Enhanced
const ProviderCard = ({ provider, isBest, rank }) => {
    const { t } = useTranslation('common');
    const displayName = provider.provider === 'JP Remit' ? 'JRF' :
                       provider.provider === 'The Moin' ? 'Moin' : provider.provider;

    const feeInKRW = provider.fee.toLocaleString('en-US');

    return (
        <a
            href={provider.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`block bg-white rounded-3xl p-8 mb-4 transition-all duration-300 hover:scale-[1.02] ${
                isBest
                    ? 'border-4 border-blue-500 shadow-2xl relative overflow-hidden'
                    : 'border-2 border-gray-200 hover:border-blue-300 shadow-md hover:shadow-xl'
            }`}
        >
            {isBest && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-bl-full"></div>
            )}

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {PROVIDER_LOGO_MAP[provider.provider] ? (
                            <img
                                src={PROVIDER_LOGO_MAP[provider.provider]}
                                alt={t('provider.logo_alt', { provider: displayName })}
                                className="w-16 h-16 rounded-2xl object-contain bg-white shadow-sm"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl font-bold text-blue-600 shadow-sm">
                                {displayName.charAt(0)}
                            </div>
                        )}
                        {isBest && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                                <SparklesIcon />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{displayName}</div>
                        {isBest && (
                            <div className="text-blue-600 text-sm font-semibold mt-1">{t('redesign.provider.best_badge')}</div>
                        )}
                    </div>
                </div>
                {!isBest && rank && (
                    <div className="text-4xl font-bold text-gray-300">#{rank}</div>
                )}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 mb-6">
                <div className="text-gray-600 text-sm mb-2 font-semibold">{t('redesign.provider.amount_received')}</div>
                <div className="text-5xl font-bold text-gray-900">
                    {Math.round(provider.recipient_gets).toLocaleString('en-US')}
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{provider.currency}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1 font-semibold">{t('provider.exchange_rate')}</div>
                    <div className="text-lg font-bold text-gray-900">
                        {(1 / provider.exchange_rate).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {t('redesign.provider.exchange_rate_unit', { currency: provider.currency })}
                    </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1 font-semibold">{t('provider.fee')}</div>
                    <div className="text-lg font-bold text-gray-900">
                        {feeInKRW}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{t('currency.krw_code')}</div>
                </div>
            </div>

            {isBest && (
                <div className="mt-6 bg-blue-500 text-white text-center py-3 rounded-xl font-bold">
                    {t('redesign.provider.cta')}
                </div>
            )}
        </a>
    );
};

// Comparison Results Component - CRITICAL: Maintains API integration
function ComparisonResults({ queryParams, amount, forceRefresh }) {
    const { t } = useTranslation('common');
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
                    throw new Error(String(response.status));
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
                    setError(t('redesign.errors.no_rates'));
                }
            } catch (err) {
                setError(t('redesign.errors.api', { message: err.message }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuotes();
    }, [queryParams.receive_country, queryParams.receive_currency, forceRefresh]);

    // Calculate savings
    const calculateSavings = () => {
        if (results.length < 2) return null;
        const best = results[0].recipient_gets;
        const worst = results[results.length - 1].recipient_gets;
        const difference = best - worst;
        const percentSaved = ((difference / worst) * 100).toFixed(1);
        return { difference: Math.round(difference), percentSaved };
    };

    const savings = calculateSavings();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
                <div className="inline-block bg-blue-50 border-2 border-blue-200 rounded-full px-6 py-2 mb-4">
                    <span className="text-blue-600 font-bold">
                        {t('redesign.results.count_badge', { count: results.length })}
                    </span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                    {parseInt(amount).toLocaleString()}
                    <span className="text-3xl text-gray-500 ml-2">{t('currency.krw_code')}</span>
                </h2>
                <div className="text-2xl text-gray-600 mb-2">
                    {t('redesign.results.destination', {
                        country: queryParams.receive_country_label || queryParams.receive_country,
                        currency: queryParams.receive_currency
                    })}
                </div>
                {snapshotTime && (
                    <p className="text-gray-400 text-sm">
                        {t('redesign.results.snapshot', { time: snapshotTime })}
                    </p>
                )}

                {savings && !isLoading && (
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 max-w-md mx-auto">
                        <div className="text-green-700 font-bold mb-2">{t('redesign.results.savings_title')}</div>
                        <div className="text-4xl font-bold text-green-600">
                            {savings.difference.toLocaleString()} {queryParams.receive_currency}
                        </div>
                        <div className="text-green-700 mt-2">
                            {t('redesign.results.savings_sub', { percent: savings.percentSaved })}
                        </div>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="text-center py-20">
                    <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="text-gray-600 text-xl font-semibold">{t('redesign.results.loading_title')}</p>
                    <p className="text-gray-400 mt-2">{t('redesign.results.loading_sub')}</p>
                </div>
            )}

            {error && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-12 text-center">
                    <div className="text-6xl mb-4">{t('redesign.results.error_icon')}</div>
                    <p className="text-red-600 text-xl font-bold mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg"
                    >
                        {t('results.retry')}
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
                            rank={index + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Main Page Component
export default function RedesignPage() {
    const { t } = useTranslation('common');
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
                receive_country_label: selectedCountry.labelKey ? t(selectedCountry.labelKey) : selectedCountry.name,
                receive_currency: selectedCountry.currency
            });
            setShowResults(true);
            setForceRefresh(prev => prev + 1);
        }
    };

    return (
        <>
            <Head>
                <title>{t('redesign.seo.title')}</title>
                <meta name="description" content={t('redesign.seo.description')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/logo.svg" alt={t('brand.name')} className="h-12 w-12" />
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {t('brand.name')}
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <span className="text-gray-600 font-medium">{t('redesign.header.tagline')}</span>
                        </div>
                    </div>
                </header>

                {/* Hero Section - Toss Style Enhanced */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50 opacity-50"></div>
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-block bg-blue-100 border-2 border-blue-300 rounded-full px-6 py-2 mb-6">
                                <span className="text-blue-600 font-bold text-sm">{t('redesign.hero.badge')}</span>
                            </div>
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
                                {t('redesign.hero.title_line1')}<br />
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {t('redesign.hero.title_line2')}
                                </span>
                            </h1>
                            <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto">
                                {t('redesign.hero.subtitle')}
                            </p>
                        </div>

                        {/* Main Form - Toss Style Enhanced */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border-3 border-gray-300 p-10 max-w-4xl mx-auto shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Country Selector */}
                                <div>
                                    <label className="block text-base font-bold text-gray-700 mb-4">
                                        {t('form.label_country')}
                                    </label>
                                    <div ref={dropdownRef} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowDropdown(!showDropdown)}
                                            className="w-full h-20 px-6 bg-gray-50 rounded-2xl border-3 border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-all flex items-center justify-between shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-4">
                                                <img src={selectedCountry.flag} alt="" className="w-10 h-10 rounded-full shadow-md" />
                                                <span className="text-xl font-bold text-gray-900">
                                                    {selectedCountry.labelKey ? t(selectedCountry.labelKey) : selectedCountry.name}
                                                </span>
                                            </div>
                                            <ChevronDownIcon />
                                        </button>

                                        {showDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border-3 border-gray-300 shadow-2xl max-h-96 overflow-y-auto z-50">
                                                {COUNTRIES.map((country) => (
                                                    <button
                                                        key={country.code}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedCountry(country);
                                                            setShowDropdown(false);
                                                        }}
                                                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                    >
                                                        <span className="text-lg font-bold text-gray-900">
                                                            {country.labelKey ? t(country.labelKey) : country.name} ({country.currency})
                                                        </span>
                                                        <img src={country.flag} alt="" className="w-10 h-10 rounded-full shadow-md" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div>
                                    <label className="block text-base font-bold text-gray-700 mb-4">
                                        {t('form.label_amount')}
                                    </label>
                                    <div className="relative h-20 bg-gray-50 rounded-2xl border-3 border-gray-300 focus-within:border-blue-500 transition-all px-6 flex items-center shadow-sm focus-within:shadow-md">
                                        <input
                                            type="text"
                                            value={amount ? parseInt(amount).toLocaleString('en-US') : ""}
                                            onChange={handleAmountChange}
                                            placeholder={t('redesign.form.placeholder_amount')}
                                            className="w-full bg-transparent text-3xl font-bold text-gray-900 text-right focus:outline-none pr-24"
                                        />
                                        <span className="absolute right-6 text-2xl font-bold text-gray-500">{t('currency.krw_code')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-2xl font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                            >
                                {t('redesign.form.submit')}
                            </button>
                        </form>

                        {/* Features */}
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-4xl mb-3">{t('redesign.features.f1_icon')}</div>
                                <div className="font-bold text-gray-900">{t('redesign.features.f1_title')}</div>
                                <div className="text-sm text-gray-500">{t('redesign.features.f1_desc')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-3">{t('redesign.features.f2_icon')}</div>
                                <div className="font-bold text-gray-900">{t('redesign.features.f2_title')}</div>
                                <div className="text-sm text-gray-500">{t('redesign.features.f2_desc')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-3">{t('redesign.features.f3_icon')}</div>
                                <div className="font-bold text-gray-900">{t('redesign.features.f3_title')}</div>
                                <div className="text-sm text-gray-500">{t('redesign.features.f3_desc')}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                {showResults && (
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-6">
                            <ComparisonResults
                                queryParams={queryParams}
                                amount={amount}
                                forceRefresh={forceRefresh}
                            />
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src="/logo.svg" alt={t('brand.name')} className="h-10 w-10" />
                                    <span className="text-2xl font-bold">{t('brand.name')}</span>
                                </div>
                                <p className="text-gray-400 text-base">
                                    {t('redesign.footer.description')}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-4">{t('redesign.footer.service_title')}</h3>
                                <ul className="space-y-3 text-gray-400">
                                    <li className="hover:text-white transition-colors cursor-pointer">{t('redesign.footer.service_item_1')}</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">{t('redesign.footer.service_item_2')}</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">{t('redesign.footer.service_item_3')}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-4">{t('redesign.footer.legal_title')}</h3>
                                <p className="text-gray-400 text-sm">
                                    {t('redesign.footer.legal_desc')}
                                </p>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                            {t('redesign.footer.copyright', { year: new Date().getFullYear() })}
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
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                .border-3 {
                    border-width: 3px;
                }

                .border-4 {
                    border-width: 4px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                .bg-clip-text {
                    -webkit-background-clip: text;
                    background-clip: text;
                }
            `}</style>
        </>
    );
}

export async function getStaticProps({ locale }) {
    const currentLocale = locale || 'en';

    return {
        props: {
            ...(await serverSideTranslations(currentLocale, ['common']))
        }
    };
}
