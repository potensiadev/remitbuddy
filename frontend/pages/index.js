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

// Provider Card Component
const ProviderCard = ({ providerData, isBest, currency, t, amount, receiveCountry }) => { 
    const { provider, recipient_gets, exchange_rate, fee } = providerData;
    
    // Normalize provider names for display
    const displayName = provider === 'JP Remit' ? 'JRF' : 
                       provider === 'The Moin' ? 'Moin' : provider; 
    
    const handleProviderClick = (e) => {
        const analyticsName = PROVIDER_ANALYTICS_MAP[provider] || provider.toLowerCase();
        logClickedProvider(analyticsName, amount, receiveCountry, currency);
        
        // Use the original provider link from API data instead of referral link
        // The href attribute already handles the navigation to providerData.link
        // So we don't need to manually redirect here
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
            className={`provider-card ${isBest ? 'best' : ''}`}
        > 
            <div className="provider-header">
                <div className="provider-logo-container">
                    {PROVIDER_LOGO_MAP[provider] && (
                        <img 
                            src={PROVIDER_LOGO_MAP[provider]} 
                            alt={`${provider} logo`} 
                            className="provider-logo"
                        />
                    )}
                </div>
                <div className="provider-name">{displayName}</div>
                {isBest && <div className="best-badge">{t('most_amount_receive')}</div>} 
            </div> 
            <div className="amount-section"> 
                <div className="amount-label">{t('amount_to_receive')}</div> 
                <div>
                    <span className="amount-value">{Math.round(recipient_gets).toLocaleString('en-US')}</span>
                    <span className="amount-currency">{currency}</span> 
                </div>
            </div> 
            <div className="provider-details"> 
                <div className="detail-item">
                    <span className="detail-value">1 {currency.toUpperCase()} = {(1 / exchange_rate).toFixed(4)} KRW</span>
                </div>
            </div> 
            <div className="provider-details"> 
                <div className="detail-item">
                    {t('fee')}: <span className="detail-value">{formattedFeeInTarget} {currency} ({formattedFeeInKRW} KRW)</span>
                </div>
            </div> 
        </a> 
    );
};

// Country Dropdown Component
const CountryDropdown = ({ setSelectedCountry, setShowDropdown, t, onCountryChange, dropdownRef }) => ( 
    <div ref={dropdownRef} className="absolute top-full left-0 mt-2 w-full min-w-[280px] lg:min-w-[320px] h-auto max-h-[40vh] bg-white rounded-xl lg:rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-40"> 
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
        <div className="skeleton-card"> 
            <div className="skeleton-header">
                <div className="skeleton-name"></div>
                <div className="skeleton-badge"></div>
            </div> 
            <div className="skeleton-amount"></div>
            <div className="skeleton-details"></div> 
        </div> 
    );

    return ( 
        <div className="results-container"> 
            <div className="summary-header"> 
                <div className="summary-title">{t('real_time_summary')}</div> 
                <div className="summary-amount"> 
                    {parseInt(amount).toLocaleString()} KRW → {queryParams.receive_country} 
                </div> 
                {isLoading && (
                    <div className="loading-text">
                        {isRetrying ? t('retrying_text') || '서버 준비 중... 잠시만 기다려주세요' : t('loading_text')}
                    </div>
                )} 
            </div> 
            
            {error && (
                <div className="error-section">
                    <h3 className="error-title">{t('error_title')}</h3>
                    <p className="error-message">{error}</p>
                    <div className="error-buttons">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="error-button refresh-button"
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
                            className="error-button debug-button"
                        >
                            {t('debug_info')}
                        </button>
                    </div>
                </div>
            )} 
            
            <div className="provider-list"> 
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
                            <div className="no-results">
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
            // Add show class for animation after a brief delay
            setTimeout(() => {
                resultsRef.current.classList.add('show');
            }, 50);
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
            
            <div className="container">
                <div className="header">
                    <div className="logo">
                        <div className="logo-icon"></div>
                        <div className="logo-text">RemitBuddy</div>
                    </div>
                    <h1 className="main-title">{t('main_title')}</h1>
                    <p className="subtitle">{t('main_subtitle')}</p>
                </div>
                
                <div className="content-area">
                    <div className="form-section">
                    <div className="social-proof">
                        <div className="social-proof-text">{t('social_proof')}</div>
                        <div className="rating">
                            <div className="stars">
                                <span className="star">★</span>
                                <span className="star">★</span>
                                <span className="star">★</span>
                                <span className="star">★</span>
                                <span className="star">★</span>
                            </div>
                            <span>{t('rating')}</span>
                        </div>
                    </div>
                    
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
                                <span className="currency-label">KRW</span>
                            </div>
                            {amountError && (
                                <div className="error-message">
                                    {amountError}
                                </div>
                            )}
                        </div>
                        
                        <div className="destination-section">
                            <label className="form-label">{t('country_label')}</label>
                            <p className="form-helper">{t('country_helper')}</p>
                            <div className="destination-wrapper" ref={formRefDesktop}>
                                <button type="button" className="destination-select" onClick={() => setShowDropdown(prev => !prev)}>
                                    <div className="destination-content">
                                        <div className="flag">
                                            <img src={selectedCountry.flag} alt={`${selectedCountry.name} flag`} width="24" height="18" className="flag-img" />
                                        </div>
                                        <span>{selectedCountry.name}</span>
                                    </div>
                                    <ChevronDownIcon className="chevron" />
                                </button>
                                {showDropdown && <CountryDropdown setSelectedCountry={setSelectedCountry} setShowDropdown={setShowDropdown} t={t} onCountryChange={handleCountryChange} dropdownRef={countryDropdownRef} />}
                            </div>
                        </div>
                        
                        <button type="submit" className={`compare-button ${!isAmountValid() ? 'disabled' : ''}`} disabled={!isAmountValid()}>
                            <ArrowRightIcon className="button-icon" />
                            {hasComparedOnce ? t('compare_again_button') : t('compare_button')}
                        </button>
                        
                        <div className="disclaimer">
                            {t('cta_helper')}
                        </div>
                        
                        {!showResults && (
                            <div className="features">
                                <div className="feature">
                                    <div className="feature-icon">🏆</div>
                                    <div className="feature-title">{t('feature_rates_title')}</div>
                                    <div className="feature-description">{t('feature_rates_desc')}</div>
                                </div>
                                <div className="feature">
                                    <div className="feature-icon">⚡</div>
                                    <div className="feature-title">{t('feature_fast_title')}</div>
                                    <div className="feature-description">{t('feature_fast_desc')}</div>
                                </div>
                                <div className="feature">
                                    <div className="feature-icon">🔒</div>
                                    <div className="feature-title">{t('feature_secure_title')}</div>
                                    <div className="feature-description">{t('feature_secure_desc')}</div>
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