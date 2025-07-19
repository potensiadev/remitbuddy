import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Head from 'next/head';
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
                <span>1 {currency.toLowerCase()} = {(1 / exchange_rate).toFixed(4)} KRW</span> 
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
        <>
            <Head>
                <title>RemitBuddy - Best Remittance Rates</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
                    <h1 className="main-title">Compare the Best Rates</h1>
                    <h1 className="main-title">in 3 Seconds</h1>
                    <h3 className="subtitle">from Top Korean Remittance Providers</h3>
                </div>
                <div className="form-section">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">How much do you want to Send?</label>
                            <p className="form-help">Enter the Amount you want to Send From Korea</p>
                            <div className="amount-input-wrapper" ref={formRef}>
                                <input 
                                    type="text" 
                                    className="amount-input" 
                                    value={parseInt(amount || "0").toLocaleString()}
                                    onChange={handleAmountChange}
                                    placeholder="Enter amount"
                                />
                                <span className="currency-code">KRW</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Where are you Sending Money?</label>
                            <p className="form-help">Select your Destination country</p>
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

                        <button className="cta-button" type="submit">
                            🚀 {hasComparedOnce ? 'Compare Again' : 'Find Best Rates Now'}
                        </button>

                        {!showResults && (
                            <div className="features">
                                <div className="feature">
                                    <div className="feature-icon">💰</div>
                                    <div className="feature-title">Best Rates</div>
                                    <div className="feature-desc">Compare Rates from 9+ Licensed Korean Remittance Companies</div>
                                </div>
                                <div className="feature">
                                    <div className="feature-icon">⚡</div>
                                    <div className="feature-title">Fast & Easy</div>
                                    <div className="feature-desc">Get Instant Quotes in 3 Seconds</div>
                                </div>
                                <div className="feature">
                                    <div className="feature-icon">🛡️</div>
                                    <div className="feature-title">100% Secure</div>
                                    <div className="feature-desc">All providers are Licensed by Korean Authorities</div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Results Section */}
                {showResults && (
                    <div ref={resultsRef} className="results-section">
                        <ComparisonResults queryParams={queryParams} t={t} onCompareAgain={handleCompareAgain} forceRefresh={forceRefresh} />
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
                    font-size: 32px;
                    font-weight: bold;
                }

                .main-title {
                    font-size: 42px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    line-height: 1.2;
                }

                .subtitle {
                    font-size: 18px;
                    opacity: 0.9;
                    margin-bottom: 10px;
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
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 10px;
                }

                .form-help {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 15px;
                }

                .amount-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
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
                    flex: 1;
                    border: none;
                    background: transparent;
                    font-size: 24px;
                    font-weight: 600;
                    color: #333;
                    outline: none;
                    text-align: right;
                }

                .currency-code {
                    font-size: 16px;
                    font-weight: 600;
                    color: #4facfe;
                    background: rgba(79, 172, 254, 0.1);
                    padding: 5px 12px;
                    margin-left: 8px;
                    border-radius: 6px;
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
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 2px;
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
                    border-radius: 15px;
                    padding: 20px;
                    font-size: 20px;
                    font-weight: 700;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(79, 172, 254, 0.3);
                }

                .cta-button:active {
                    transform: translateY(0);
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
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }

                .feature-desc {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.4;
                }

                .results-section {
                    margin-top: 30px;
                    padding: 30px;
                    background: #f8f9fa;
                    border-radius: 0 0 20px 20px;
                }

                @media (max-width: 768px) {
                    .container {
                        margin: 0;
                        border-radius: 15px;
                        max-width: 100%;
                    }

                    .header {
                        padding: 30px 20px;
                    }

                    .main-title {
                        font-size: 28px;
                        line-height: 1.3;
                    }

                    .logo-text {
                        font-size: 24px;
                    }

                    .subtitle {
                        font-size: 16px;
                    }

                    .form-section {
                        padding: 30px 20px;
                    }

                    .form-group {
                        margin-bottom: 25px;
                    }

                    .amount-input-wrapper, .country-select-wrapper {
                        padding: 12px 16px;
                    }

                    .amount-input {
                        font-size: 20px;
                    }

                    .currency-symbol {
                        font-size: 16px;
                    }

                    .currency-code {
                        font-size: 14px;
                        padding: 4px 8px;
                    }

                    .flag {
                        width: 28px;
                        height: 28px;
                    }

                    .country-name {
                        font-size: 16px;
                    }

                    .currency-name {
                        font-size: 12px;
                    }

                    .cta-button {
                        padding: 16px;
                        font-size: 16px;
                        letter-spacing: 0.5px;
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
                        font-size: 14px;
                        margin-bottom: 6px;
                    }

                    .feature-desc {
                        font-size: 12px;
                        line-height: 1.3;
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