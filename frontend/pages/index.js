import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  logPageView,
  logClickedCTA, 
  logCompareAgain, 
  logClickedProvider, 
  logSendingCountrySwitch 
} from '../utils/analytics';

// API Configuration
const FORCE_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sendhome-production.up.railway.app';

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

// Provider Card Component
const ProviderCard = ({ providerData, isBest, currency, t, amount, receiveCountry }) => { 
    const { provider, recipient_gets, exchange_rate, fee } = providerData;
    
    // Normalize provider names for display
    const displayName = provider === 'JP Remit' ? 'JRF' : 
                       provider === 'The Moin' ? 'Moin' : provider; 
    
    const handleProviderClick = () => {
        const analyticsName = PROVIDER_ANALYTICS_MAP[provider] || provider.toLowerCase();
        logClickedProvider(analyticsName, amount, receiveCountry, currency);
        
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
                {isBest && <span className="text-xs lg:text-sm font-semibold text-white bg-emerald-500 px-3 py-1 lg:px-4 lg:py-2 rounded-full">{t('most_amount_receive')}</span>} 
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
function ComparisonResults({ queryParams, amount, t, onCompareAgain, forceRefresh }) {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentApiCall, setCurrentApiCall] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const amountRef = useRef(amount);
    
    // Update ref when amount changes
    useEffect(() => {
        amountRef.current = amount;
    }, [amount]);

    useEffect(() => {
        if (!queryParams.receive_country) {
            return;
        }

        // Cancel previous API call if it's still running
        if (currentApiCall) {
            currentApiCall.abort();
        }

        const abortController = new AbortController();
        setCurrentApiCall(abortController);

        const fetchRealQuotes = async (retryCount = 0) => {
            setIsLoading(true);
            setError(null);
            setResults([]);

            const url = `${FORCE_API_BASE_URL}/api/getRemittanceQuote?receive_country=${queryParams.receive_country}&receive_currency=${queryParams.receive_currency}&send_amount=${amountRef.current}&_t=${Date.now()}`;

            try {
                // 첫 번째 시도는 15초, 재시도는 30초 타임아웃
                const timeoutDuration = retryCount === 0 ? 15000 : 30000;
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Request timeout')), timeoutDuration);
                });
                
                const fetchPromise = fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-store',
                    signal: abortController.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    },
                });
                
                const response = await Promise.race([fetchPromise, timeoutPromise]);
                
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} - ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.results && data.results.length > 0) {
                    setResults(data.results);
                    setIsLoading(false);
                } else {
                    setError('No exchange rate providers available');
                    setIsLoading(false);
                }
                
            } catch (err) {
                if (err.name === 'AbortError') {
                    return;
                }
                
                // 콜드 스타트 오류인 경우 재시도 (최대 1회)
                if (retryCount === 0 && (err.message.includes('timeout') || err.message.includes('fetch') || err.message.includes('Failed to fetch'))) {
                    setIsRetrying(true);
                    setTimeout(() => fetchRealQuotes(1), 2000);
                    return;
                }
                
                setError(`API Error: ${err.message}`);
                setIsLoading(false);
                setCurrentApiCall(null);
            } finally {
                if (retryCount > 0) {
                    setIsLoading(false);
                    setCurrentApiCall(null);
                    setIsRetrying(false);
                }
            }
        };

        fetchRealQuotes();

        // Cleanup function to abort API call if component unmounts
        return () => {
            if (abortController) {
                abortController.abort();
            }
        };
    }, [queryParams.receive_country, queryParams.receive_currency, forceRefresh]);

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
                    {parseInt(amount).toLocaleString()} KRW → {queryParams.receive_country} 
                </p> 
                {isLoading && (
                    <p className="text-xs lg:text-sm text-indigo-500 mt-1 animate-pulse">
                        {isRetrying ? t('retrying_text') || '서버 준비 중... 잠시만 기다려주세요' : t('loading_text')}
                    </p>
                )} 
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
                    <>
                        {results && results.length > 0 ? (
                            results.map(provider => 
                                <ProviderCard 
                                    key={provider.provider} 
                                    providerData={provider} 
                                    isBest={bestRateProvider && provider.provider === bestRateProvider.provider} 
                                    currency={queryParams.receive_currency} 
                                    amount={amount}
                                    receiveCountry={queryParams.receive_country}
                                    t={t} 
                                />
                            )
                        ) : (
                            <div className="text-center p-8">
                                <p>No results available</p>
                            </div>
                        )}
                    </>
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
    const [amountError, setAmountError] = useState("");
    const formRef = useRef(null);
    const formRefDesktop = useRef(null);
    const countryDropdownRef = useRef(null);
    const countryDropdownRefDesktop = useRef(null);
    const [hasComparedOnce, setHasComparedOnce] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0);

    // Page view tracking and debug logging
    useEffect(() => {
        logPageView();
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
            
            // Check validation immediately while typing
            const numValue = parseInt(value) || 0;
            if (numValue > 0 && numValue < 10000) {
                setAmountError(t('amount_min_error'));
            } else if (numValue > 5000000) {
                setAmountError(t('amount_max_error'));
            } else {
                // Only clear error if there actually is an error to avoid unnecessary re-renders
                if (amountError) {
                    setAmountError("");
                }
            }
        } 
    };

    const isAmountValid = () => {
        const numValue = parseInt(amount) || 0;
        return numValue >= 10000 && numValue <= 5000000;
    };

    const handleAmountBlur = () => {
        const numValue = parseInt(amount) || 0;
        
        if (numValue > 0 && numValue < 10000) {
            setAmountError(t('amount_min_error'));
            // Don't auto-correct, just show error
        } else if (numValue > 5000000) {
            setAmountError(t('amount_max_error'));
            // Don't auto-correct, just show error
        } else {
            setAmountError("");
        }
    };

    const handleSubmit = (e) => { 
        e.preventDefault();
        
        if (hasComparedOnce) {
            // If we've already compared once, use compare again logic
            handleCompareAgain();
        } else {
            // First time comparison
            // Log CTA click with parameters
            logClickedCTA(amount, selectedCountry.code, selectedCountry.currency);
            
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
        logCompareAgain(amount, selectedCountry.code, selectedCountry.currency);
        
        if (selectedCountry && amount && isAmountValid()) {
            const newQueryParams = { 
                receive_country: selectedCountry.name, 
                receive_currency: selectedCountry.currency
            };
            
            setQueryParams(newQueryParams);
            setForceRefresh(prev => prev + 1);
        }
    };

    // Handle country change - auto-trigger API only after first comparison
    const handleCountryChange = (newCountry) => {
        logSendingCountrySwitch(newCountry.currency);
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

    // Removed auto-trigger API call when amount changes
    // API will only be called when:
    // 1. First time: button click
    // 2. After first call: country change OR button click (not amount change)

    return (
        <>
            <Head>
                <title>{t('page_title')}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no, viewport-fit=cover" />
            </Head>
            <style jsx global>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 20px;
                    -webkit-text-size-adjust: 100%;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                /* 웹뷰 호환성 개선 */
                html {
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -webkit-tap-highlight-color: rgba(0,0,0,0);
                }
                
                body, input, button, select, textarea {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                @media (max-width: 768px) {
                    body {
                        padding: 10px;
                    }
                }
            `}</style>
            
            <div className="container">
                <div className="header">
                    <div className="logo">
                        <div className="logo-icon"></div>
                        <div className="logo-text">RemitBuddy</div>
                    </div>
                    <h1 className="main-title">{t('main_title')}</h1>
                    <p className="subtitle">{t('main_subtitle')}</p>
                </div>
                <div className="form-section">
                    <center><div className="social-proof">
                        <div className="social-proof-text">{t('social_proof')}</div>
                        <div className="rating">{t('rating')} </div>
                    </div></center>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">{t('amount_label')}</label>
                            <p className="form-helper">{t('amount_helper')}</p>
                            <div className="amount-input-wrapper" ref={formRef}>
                                <input 
                                    type="text" 
                                    className="amount-input" 
                                    value={amount ? parseInt(amount).toLocaleString() : ""}
                                    onChange={handleAmountChange}
                                    onBlur={handleAmountBlur}
                                    placeholder={t('amount_placeholder')}
                                />
                                <span className="currency-code">KRW</span>
                            </div>
                            {amountError && (
                                <div className="error-message">
                                    {amountError}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('country_label')}</label>
                            <p className="form-helper">{t('country_helper')}</p>
                            <div className="country-select-wrapper relative" ref={formRefDesktop} onClick={() => setShowDropdown(prev => !prev)}>
                                <div className="country-display">
                                    <div className="country-left-content">
                                        <div className="flag">
                                            <img src={selectedCountry.flag} alt={`${selectedCountry.name} flag`} width={32} height={32} className="rounded-full" />
                                        </div>
                                        <div className="country-info">
                                            <div className="country-name">{selectedCountry.name}</div>
                                        </div>
                                    </div>
                                    <div className="dropdown-arrow"></div>
                                </div>
                                {showDropdown && <CountryDropdown setSelectedCountry={setSelectedCountry} setShowDropdown={setShowDropdown} t={t} onCountryChange={handleCountryChange} dropdownRef={countryDropdownRef} />}
                            </div>
                        </div>

                        <button className={`cta-button ${!isAmountValid() ? 'disabled' : ''}`} type="submit" disabled={!isAmountValid()}>
                            {hasComparedOnce ? t('compare_again_button') : t('compare_button')}
                        </button>

                        <center><div className="cta-helper">
                            <strong>{t('cta_helper')}</strong>
                        </div></center>

                        {!showResults && (
                            <div className="features">
                                <div className="feature">
                                    <div className="feature-icon">💰</div>
                                    <div className="feature-title">{t('feature_rates_title')}</div>
                                    <div className="feature-desc">{t('feature_rates_desc')}</div>
                                </div>
                                <div className="feature">
                                    <div className="feature-icon">⚡</div>
                                    <div className="feature-title">{t('feature_fast_title')}</div>
                                    <div className="feature-desc">{t('feature_fast_desc')}</div>
                                </div>
                                <div className="feature">
                                    <div className="feature-icon">🛡️</div>
                                    <div className="feature-title">{t('feature_secure_title')}</div>
                                    <div className="feature-desc">{t('feature_secure_desc')}</div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Results Section */}
                {showResults && (
                    <div ref={resultsRef} className="results-section">
                        <ComparisonResults queryParams={queryParams} amount={amount} t={t} onCompareAgain={handleCompareAgain} forceRefresh={forceRefresh} />
                    </div>
                )}
            </div>

            <style jsx>{`
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .header {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    padding: 40px 30px;
                    text-align: center;
                    color: white;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 30px;
                }

                .logo-icon {
                    width: 0;
                    height: 0;
                    border-left: 15px solid transparent;
                    border-right: 15px solid transparent;
                    border-bottom: 25px solid white;
                    transform: rotate(90deg);
                }

                .logo-text {
                    font-size: 36px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .main-title {
                    font-size: 42px;
                    font-weight: 800;
                    margin-bottom: 18px;
                    line-height: 1.15;
                    letter-spacing: -0.5px;
                    white-space: normal;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }

                .subtitle {
                    font-size: 20px;
                    font-weight: 500;
                    opacity: 0.95;
                    margin-bottom: 15px;
                    letter-spacing: 0.2px;
                }

                .trust-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    margin-top: 15px;
                }

                .form-section {
                    padding: 50px 30px;
                }

                .form-group {
                    margin-bottom: 30px;
                }

                .form-label {
                    display: block;
                    font-size: 18px;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 12px;
                    letter-spacing: 0.2px;
                }

                .form-helper {
                    font-size: 15px;
                    font-weight: 500;
                    color: #64748b;
                    margin-bottom: 25px;
                    line-height: 1.4;
                }

                .amount-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    background: #f8f9fa;
                    border: 2px solid #e9ecef;
                    border-radius: 12px;
                    padding: 15px 20px;
                    transition: all 0.3s ease;
                }

                .amount-input-wrapper:focus-within {
                    border-color: #4facfe;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
                }

                .currency-symbol {
                    font-size: 18px;
                    font-weight: 600;
                    color: #666;
                    margin-right: 10px;
                }

                .amount-input {
                    border: none;
                    background: transparent;
                    font-size: 28px;
                    font-weight: 700;
                    color: #1a202c;
                    outline: none;
                    text-align: right;
                    letter-spacing: 0.5px;
                    min-width: 120px;
                    max-width: 200px;
                    width: auto;
                }

                .currency-code {
                    font-size: 18px;
                    font-weight: 700;
                    color: #3182ce;
                    background: rgba(79, 172, 254, 0.15);
                    padding: 6px 14px;
                    margin-left: 10px;
                    border-radius: 8px;
                    letter-spacing: 0.5px;
                    flex-shrink: 0;
                    white-space: normal;
                }

                .country-select-wrapper {
                    position: relative;
                    background: #f8f9fa;
                    border: 2px solid #e9ecef;
                    border-radius: 12px;
                    padding: 15px 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .country-select-wrapper:hover {
                    border-color: #4facfe;
                    background: white;
                }

                .country-display {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                }

                .country-left-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex: 1;
                    justify-content: flex-end;
                }

                .flag {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .country-info {
                    text-align: right;
                }

                .country-name {
                    font-size: 20px;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 3px;
                    letter-spacing: 0.2px;
                }

                .currency-name {
                    font-size: 14px;
                    color: #666;
                }

                .dropdown-arrow {
                    width: 0;
                    height: 0;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 8px solid #666;
                    transition: transform 0.3s ease;
                }

                .exchange-preview {
                    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                    border-radius: 12px;
                    padding: 20px;
                    margin: 30px 0;
                    text-align: center;
                }

                .exchange-text {
                    font-size: 18px;
                    font-weight: 600;
                    color: #8b4513;
                }

                .exchange-arrow {
                    margin: 0 15px;
                    font-size: 20px;
                }

                .cta-button {
                    width: 100%;
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    border: none;
                    border-radius: 16px;
                    padding: 22px;
                    font-size: 22px;
                    font-weight: 800;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }

                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(79, 172, 254, 0.3);
                }

                .cta-button:active {
                    transform: translateY(0);
                }

                .cta-button.disabled,
                .cta-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background: #9ca3af;
                    transform: none;
                    box-shadow: none;
                }

                .cta-button.disabled:hover,
                .cta-button:disabled:hover {
                    transform: none;
                    box-shadow: none;
                }

                .social-proof {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 30px;
                    text-align: center;
                }

                .social-proof-text {
                    font-size: 16px;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 10px;
                    letter-spacing: 0.1px;
                    white-space: normal;
                }

                .rating {
                    font-size: 16px;
                    font-weight: 600;
                    color: #4a5568;
                    letter-spacing: 0.5px;
                }

                .cta-helper {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    padding: 18px;
                    margin-top: 25px;
                    font-size: 14px;
                    color: #4a5568;
                    text-align: center;
                    letter-spacing: 0.2px;
                    white-space: normal;
                }

                .features {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-top: 40px;
                    padding-top: 30px;
                    border-top: 1px solid #e9ecef;
                }

                .feature {
                    text-align: center;
                    padding: 20px;
                }

                .feature-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                    color: white;
                    font-size: 24px;
                }

                .feature-title {
                    font-size: 17px;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 10px;
                    letter-spacing: 0.2px;
                }

                .feature-desc {
                    font-size: 15px;
                    font-weight: 500;
                    color: #64748b;
                    line-height: 1.5;
                    letter-spacing: 0.1px;
                }

                .error-message {
                    color: #dc2626;
                    font-size: 12px;
                    font-weight: 500;
                    margin-top: 8px;
                    text-align: right;
                    margin-right: 4px;
                }

                .results-section {
                    margin-top: 30px;
                    padding: 30px;
                    background: #f8f9fa;
                    border-radius: 0 0 20px 20px;
                }

                @media (max-width: 768px) {
                    .social-proof-text {
                        font-size: 14px;
                        letter-spacing: 0.05px;
                    }

                    .cta-helper {
                        font-size: 11px;
                        padding: 12px 8px;
                        letter-spacing: 0.05px;
                        white-space: normal;
                        line-height: 1.3;
                    }
                    .container {
                        margin: 0;
                        border-radius: 15px;
                        max-width: 100%;
                    }

                    .header {
                        padding: 30px 20px;
                    }

                    .main-title {
                        font-size: 22px;
                        font-weight: 800;
                        line-height: 1.2;
                        letter-spacing: -0.5px;
                        white-space: normal;
                    }

                    .logo-text {
                        font-size: 28px;
                        font-weight: 800;
                        letter-spacing: -0.3px;
                    }

                    .subtitle {
                        font-size: 18px;
                        font-weight: 500;
                        letter-spacing: 0.1px;
                    }

                    .form-section {
                        padding: 30px 20px;
                    }

                    .form-group {
                        margin-bottom: 25px;
                    }

                    .amount-input-wrapper, .country-select-wrapper {
                        padding: 10px 12px;
                    }

                    .amount-input {
                        font-size: 20px;
                        font-weight: 700;
                        letter-spacing: 0.2px;
                        min-width: 0;
                        max-width: 70%;
                    }

                    .currency-symbol {
                        font-size: 16px;
                    }

                    .currency-code {
                        font-size: 14px;
                        font-weight: 700;
                        padding: 4px 8px;
                        letter-spacing: 0.2px;
                        margin-left: 6px;
                        flex-shrink: 0;
                    }

                    .flag {
                        width: 28px;
                        height: 28px;
                    }

                    .country-name {
                        font-size: 18px;
                        font-weight: 700;
                        letter-spacing: 0.1px;
                    }

                    .currency-name {
                        font-size: 12px;
                    }

                    .cta-button {
                        padding: 18px;
                        font-size: 18px;
                        font-weight: 800;
                        letter-spacing: 1px;
                    }

                    .features {
                        grid-template-columns: 1fr;
                        gap: 15px;
                        margin-top: 30px;
                        padding-top: 20px;
                    }

                    .feature {
                        padding: 15px 10px;
                    }

                    .feature-icon {
                        width: 50px;
                        height: 50px;
                        font-size: 20px;
                        margin-bottom: 10px;
                    }

                    .feature-title {
                        font-size: 15px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        letter-spacing: 0.1px;
                    }

                    .feature-desc {
                        font-size: 13px;
                        font-weight: 500;
                        line-height: 1.4;
                        letter-spacing: 0.05px;
                    }

                    .results-section {
                        padding: 20px;
                        margin-top: 20px;
                    }
                }

                @media (max-width: 480px) {
                    .features {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 10px;
                    }

                    .feature {
                        padding: 10px 5px;
                    }

                    .feature-icon {
                        width: 40px;
                        height: 40px;
                        font-size: 16px;
                        margin-bottom: 8px;
                    }

                    .feature-title {
                        font-size: 12px;
                        margin-bottom: 4px;
                    }

                    .feature-desc {
                        font-size: 10px;
                        line-height: 1.2;
                    }
                }
            `}</style>
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