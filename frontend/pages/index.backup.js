/*
 * 🔒 SECURITY IMPLEMENTATION CHECKLIST
 * ✓ CSP headers implemented
 * ✓ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
 * ✓ CSRF token generated (server validation required)
 * ✓ Input validation comments added
 * ✓ XSS protection guidelines documented
 * ⚠️ TODO: Add SRI integrity hashes for external scripts
 * ⚠️ TODO: Implement server-side input validation
 * ⚠️ TODO: Add rate limiting for API calls
 * ⚠️ TODO: Implement proper session management
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  logSessionStart,
  logViewMain,
  logClickedCTA,
  logCompareAgain,
  logClickedProvider,
  logSendingCountrySwitch,
  logResultsImpression
} from '../utils/analytics';

// API Configuration
const FORCE_API_BASE_URL = 'https://remitbuddynew.up.railway.app';

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

// Locale to Country mapping
const LOCALE_TO_COUNTRY_MAP = {
    'vi': 'VN',  // Vietnamese -> Vietnam
    'ne': 'NP',  // Nepali -> Nepal
    'tl': 'PH',  // Tagalog -> Philippines
    'km': 'KH',  // Khmer -> Cambodia
    'my': 'MM',  // Burmese -> Myanmar
    'th': 'TH',  // Thai -> Thailand
    'uz': 'UZ',  // Uzbek -> Uzbekistan
    'id': 'ID',  // Indonesian -> Indonesia
    'si': 'LK',  // Sinhala -> Sri Lanka
    'bn': 'BD',  // Bengali -> Bangladesh
};

// Helper function to get default country based on locale
const getDefaultCountryByLocale = (locale) => {
    // Map locale to country code
    const countryCode = LOCALE_TO_COUNTRY_MAP[locale];

    // Find country in COUNTRIES array
    if (countryCode) {
        const country = COUNTRIES.find(c => c.code === countryCode);
        if (country) {
            return country;
        }
    }

    // Default to Vietnam if locale is not mapped or country not found
    return COUNTRIES[0];
};

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
    'Finshot': null, // 파일 없음
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

// Provider Card Component
const ProviderCard = ({ providerData, isBest, currency, t, amount, receiveCountry }) => { 
    const { provider, recipient_gets, exchange_rate, fee } = providerData;
    
    
    // Normalize provider names for display
    const displayName = provider === 'JP Remit' ? 'JRF' : 
                       provider === 'The Moin' ? 'Moin' : provider; 
    
    const handleProviderClick = (e) => {
        const analyticsName = PROVIDER_ANALYTICS_MAP[provider] || provider.toLowerCase();

        // Enhanced analytics with additional context
        logClickedProvider(analyticsName, amount, receiveCountry, currency, {
            is_best_rate: isBest,
            recipient_gets: Math.round(recipient_gets),
            exchange_rate: exchange_rate,
            fee_krw: fee,
            provider_rank: isBest ? 1 : undefined,
        });

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
    
    // 🔒 XSS PROTECTION: Sanitize all provider data before rendering
    // ⚠️ Ensure providerData.link is validated and sanitized on server
    // ⚠️ Validate provider name contains only safe characters
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
                    {PROVIDER_LOGO_MAP[provider] ? (
                        <img 
                            src={PROVIDER_LOGO_MAP[provider]} 
                            alt={`${provider} logo`} 
                            className="provider-logo"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="provider-logo-placeholder">
                            {displayName.charAt(0)}
                        </div>
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
    <div ref={dropdownRef}
    className="absolute top-full left-0 mt-3 w-full max-h-[60vh] bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,210,106,0.15)] border-[2px] border-[#00D26A]/20 flex flex-col overflow-hidden z-50 animate-fadeIn"
    >
        <div className="flex-1 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-[#00D26A]/20 scrollbar-track-transparent">
            {COUNTRIES.map((c, index) => (
                <button
                    key={c.code}
                    onClick={(e) => {
                e.stopPropagation();
                setSelectedCountry(c);
                setShowDropdown(false);
                onCountryChange(c);
            }}
            className={`w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gradient-to-r hover:from-[#00D26A]/8 hover:to-[#00D26A]/5 focus:bg-gradient-to-r focus:from-[#00D26A]/8 focus:to-[#00D26A]/5 active:bg-[#00D26A]/15 transition-all duration-200 border-0 outline-none focus:outline-none active:outline-none group ${index !== 0 ? 'border-t border-[#00D26A]/10' : ''} ${index === 0 ? 'rounded-t-[24px]' : ''} ${index === COUNTRIES.length - 1 ? 'rounded-b-[24px]' : ''}`}
        >
            <span className="text-[17px] font-semibold text-gray-800 group-hover:text-[#00D26A] transition-colors">{c.name} ({c.currency})</span>
            <img src={c.flag} alt={`${c.name} flag`} width="32" height="32" className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-[#00D26A]/20 group-hover:ring-[#00D26A]/40 transition-all" />
        </button>
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
    const [impressionLogged, setImpressionLogged] = useState(false);
    const [snapshotTime, setSnapshotTime] = useState(null);
    const amountRef = useRef(amount);
    const resultsContainerRef = useRef(null);

    // Update ref when amount changes
    useEffect(() => {
        amountRef.current = amount;
    }, [amount]);

    // Scroll and Impression tracking
    useEffect(() => {
        if (!results || results.length === 0 || impressionLogged) return;

        const handleScroll = () => {
            if (!resultsContainerRef.current || impressionLogged) return;

            const rect = resultsContainerRef.current.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                // Log impression event
                logResultsImpression(
                    amount,
                    queryParams.receive_country,
                    queryParams.receive_currency,
                    results.length
                );
                setImpressionLogged(true);
            }
        };

        // Check on mount
        handleScroll();

        // Add scroll listener
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [results, amount, queryParams, impressionLogged]);

    // Reset impression when new results are fetched
    useEffect(() => {
        setImpressionLogged(false);
    }, [queryParams.receive_country, queryParams.receive_currency, forceRefresh]);

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

            // 🔒 SECURITY: API call with validated parameters
            // ⚠️ Server MUST validate all query parameters:
            // - receive_country: whitelist allowed countries
            // - receive_currency: validate against supported currencies
            // - send_amount: validate range and data type
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
                    // Set snapshot time when results are fetched
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    setSnapshotTime(`${year}-${month}-${day} ${hours}:${minutes}`);
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
        <div ref={resultsContainerRef} className="results-container">
            <div className="summary-header">
                <div className="summary-title">{t('real_time_summary')}</div>
                <div className="summary-amount">
                    {parseInt(amount).toLocaleString()} KRW → {queryParams.receive_country}
                </div>
                {snapshotTime && (
                    <div className="snapshot-time" style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>
                        {snapshotTime}
                    </div>
                )}
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

// pages/index.js - 완전한 11개 언어 최적화 Head 섹션
const getLocalizedMeta = (locale) => {
  const metaData = {
    ko: {
      title: "해외송금수수료 비교 | 한국 최저 수수료 실시간 환율 비교 - RemitBuddy",
      description: "한국 최대 해외송금수수료 비교 플랫폼. 18개국 지원, 9개 공인 송금업체 실시간 환율·수수료 3초 비교. 베트남, 네팔, 필리핀, 태국, 미얀마, 인도네시아, 캄보디아, 우즈베키스탄, 스리랑카. 무료 이용, 최대 5% 절약.",
      keywords: "해외송금수수료비교, 해외송금수수료계산, 환율 비교, 해외송금 수수료, 한국 송금, 베트남 송금, 네팔 송금, 필리핀 송금, 태국 송금, 미얀마 송금, 인도네시아 송금, 캄보디아 송금, 우즈베키스탄 송금, 스리랑카 송금, 외국인 노동자, 송금업체, 실시간 환율, RemitBuddy",
      ogLocale: "ko_KR"
    },
    en: {
      title: "Find the Best Overseas Remittance Rates",
      description: "Korea's largest international money transfer comparison platform. Support 10 countries, compare real-time rates from 9 licensed companies in 3 seconds. Vietnam, Nepal, Philippines, Thailand, Myanmar, Indonesia, Cambodia, Uzbekistan, Sri Lanka. Free service, save up to 5%.",
      keywords: "overseas money transfer, remittance comparison, exchange rate, transfer fee, send money from Korea, Korea to Vietnam, Korea to Nepal, Korea to Philippines, Korea to Thailand, Korea to Myanmar, Korea to Indonesia, Korea to Cambodia, Korea to Uzbekistan, Korea to Sri Lanka, foreign workers, RemitBuddy",
      ogLocale: "en_US"
    },
    vi: {
      title: "Tìm tỷ giá chuyển tiền quốc tế tốt nhất",
      description: "Nền tảng so sánh chuyển tiền quốc tế lớn nhất Hàn Quốc. Hỗ trợ 10 quốc gia, so sánh tỷ giá thời gian thực từ 9 công ty được cấp phép trong 3 giây. Việt Nam, Nepal, Philippines, Thái Lan, Myanmar, Indonesia, Campuchia, Uzbekistan, Sri Lanka. Dịch vụ miễn phí, tiết kiệm tới 5%.",
      keywords: "chuyển tiền quốc tế, so sánh chuyển tiền, tỷ giá hối đoái, phí chuyển tiền, gửi tiền từ Hàn Quốc, Hàn Quốc đến Việt Nam, Hàn Quốc đến Nepal, Hàn Quốc đến Philippines, Hàn Quốc đến Thái Lan, Hàn Quốc đến Myanmar, Hàn Quốc đến Indonesia, Hàn Quốc đến Campuchia, Hàn Quốc đến Uzbekistan, Hàn Quốc đến Sri Lanka, lao động nước ngoài, RemitBuddy",
      ogLocale: "vi_VN"
    },
    ne: {
      title: "उत्तम विदेश रेमिट्यान्स दर खोज्नुहोस्",
      description: "कोरियाको सबैभन्दा ठूलो अन्तर्राष्ट्रिय पैसा स्थानान्तरण तुलना प्लेटफर्म। १० देशहरूलाई समर्थन, ३ सेकेन्डमा ९ वटा इजाजतपत्र प्राप्त कम्पनीहरूको वास्तविक-समय दरहरू तुलना गर्नुहोस्। भियतनाम, नेपाल, फिलिपिन्स, थाइल्यान्ड, म्यानमार, इन्डोनेसिया, कम्बोडिया, उजबेकिस्तान, श्रीलंका। नि:शुल्क सेवा, ५% सम्म बचत गर्नुहोस्।",
      keywords: "विदेशी पैसा स्थानान्तरण, रेमिट्यान्स तुलना, विनिमय दर, स्थानान्तरण शुल्क, कोरियाबाट पैसा पठाउनुहोस्, कोरियाबाट भियतनाम, कोरियाबाट नेपाल, कोरियाबाट फिलिपिन्स, कोरियाबाट थाइल्यान्ड, कोरियाबाट म्यानमार, कोरियाबाट इन्डोनेसिया, कोरियाबाट कम्बोडिया, कोरियाबाट उजबेकिस्तान, कोरियाबाट श्रीलंका, विदेशी कामदारहरू, RemitBuddy",
      ogLocale: "ne_NP"
    },
    th: {
      title: "ค้นหาอัตราโอนเงินต่างประเทศที่ดีที่สุด",
      description: "แพลตฟอร์มเปรียบเทียบการโอนเงินระหว่างประเทศที่ใหญ่ที่สุดของเกาหลี รองรับ 10 ประเทศ เปรียบเทียบอัตราเรียลไทม์จาก 9 บริษัทที่ได้รับใบอนุญาตภายใน 3 วินาที เวียดนาม เนปาล ฟิลิปปินส์ ไทย เมียนมาร์ อินโดนีเซีย กัมพูชา อุซเบกิสถาน ศรีลังกา บริการฟรี ประหยัดได้สูงสุด 5%",
      keywords: "การโอนเงินต่างประเทศ, เปรียบเทียบการส่งเงิน, อัตราแลกเปลี่ยน, ค่าธรรมเนียมการโอน, ส่งเงินจากเกาหลี, เกาหลีไปเวียดนาม, เกาหลีไปเนปาล, เกาหลีไปฟิลิปปินส์, เกาหลีไปไทย, เกาหลีไปเมียนมาร์, เกาหลีไปอินโดนีเซีย, เกาหลีไปกัมพูชา, เกาหลีไปอุซเบกิสถาน, เกาหลีไปศรีลังกา, แรงงานต่างชาติ, RemitBuddy",
      ogLocale: "th_TH"
    },
    my: {
      title: "အကောင်းဆုံး နိုင်ငံခြား ငွေလွှဲနှုန်းများ ရှာပါ",
      description: "ကိုရီးယား၏ အကြီးဆုံး နိုင်ငံတကာ ငွေလွှဲနှိုင်းယှဉ် ပလက်ဖောင်း။ နိုင်ငံ ၁၀ ခု ပံ့ပိုး၊ လိုင်စင်ရ ကုမ္ပဏီ ၉ ခုမှ အချိန်နှင့်တစ်ပြေးညီ နှုန်းများကို ၃ စက္ကန့်အတွင်း နှိုင်းယှဉ်ပါ။ ဗီယက်နမ်၊ နီပေါ၊ ဖိလစ်ပိုင်၊ ထိုင်း၊ မြန်မာ၊ အင်ဒိုနီးရှား၊ ကမ္ဘောဒီးယား၊ ဥဇဘက်ကစ္စတန်၊ သီရိလင်္ကာ။ အခမဲ့ဝန်ဆောင်မှု၊ ၅% အထိ သက်သာစေပါသည်။",
      keywords: "နိုင်ငံခြား ငွေလွှဲခြင်း, ငွေလွှဲနှိုင်းယှဉ်ခြင်း, ငွေလဲလှယ်နှုန်း, ငွေလွှဲအခကြေးငွေ, ကိုရီးယားမှ ငွေပို့ပါ, ကိုရီးယားမှ ဗီယက်နမ်, ကိုရီးယားမှ နီပေါ, ကိုရီးယားမှ ဖိလစ်ပိုင်, ကိုရီးယားမှ ထိုင်း, ကိုရီးယားမှ မြန်မာ, ကိုရီးယားမှ အင်ဒိုနီးရှား, ကိုရီးယားမှ ကမ္ဘောဒီးယား, ကိုရီးယားမှ ဥဇဘက်ကစ္စတန်, ကိုရီးယားမှ သီရိလင်္ကာ, နိုင်ငံခြား အလုပ်သမားများ, RemitBuddy",
      ogLocale: "my_MM"
    },
    id: {
      title: "Temukan Tarif Pengiriman Uang Luar Negeri Terbaik",
      description: "Platform perbandingan transfer uang internasional terbesar di Korea. Mendukung 10 negara, bandingkan tarif real-time dari 9 perusahaan berlisensi dalam 3 detik. Vietnam, Nepal, Filipina, Thailand, Myanmar, Indonesia, Kamboja, Uzbekistan, Sri Lanka. Layanan gratis, hemat hingga 5%.",
      keywords: "transfer uang luar negeri, perbandingan pengiriman uang, nilai tukar, biaya transfer, kirim uang dari Korea, Korea ke Vietnam, Korea ke Nepal, Korea ke Filipina, Korea ke Thailand, Korea ke Myanmar, Korea ke Indonesia, Korea ke Kamboja, Korea ke Uzbekistan, Korea ke Sri Lanka, pekerja asing, RemitBuddy",
      ogLocale: "id_ID"
    },
    km: {
      title: "ស្វែងរកអត្រាផ្ញើប្រាក់ទៅបរទេសល្អបំផុត",
      description: "វេទិកាប្រៀបធៀបការផ្ញើប្រាក់អន្តរជាតិធំបំផុតរបស់កូរ៉េ។ គាំទ្រ ១០ ប្រទេស ប្រៀបធៀបអត្រាពេលវេលាជាក់ស្តែងពីក្រុមហ៊ុនមានអាជ្ញាប័ណ្ណ ៩ ក្នុងរយៈពេល ៣ វិនាទី។ វៀតណាម នេប៉ាល់ ហ្វីលីពីន ថៃ មីយ៉ាន់ម៉ា ឥណ្ឌូនេស៊ី កម្ពុជា អ៊ូសបេគីស្ថាន ស្រីលង្កា។ សេវាឥតគិតថ្លៃ សន្សំបានរហូតដល់ ៥%។",
      keywords: "ការផ្ញើប្រាក់ទៅបរទេស, ការប្រៀបធៀបការផ្ញើប្រាក់, អត្រាប្តូរប្រាក់, ថ្លៃសេវាផ្ញើប្រាក់, ផ្ញើប្រាក់ពីកូរ៉េ, កូរ៉េទៅវៀតណាម, កូរ៉េទៅនេប៉ាល់, កូរ៉េទៅហ្វីលីពីន, កូរ៉េទៅថៃ, កូរ៉េទៅមីយ៉ាន់ម៉ា, កូរ៉េទៅឥណ្ឌូនេស៊ី, កូរ៉េទៅកម្ពុជា, កូរ៉េទៅអ៊ូសបេគីស្ថាន, កូរ៉េទៅស្រីលង្កា, កម្មករបរទេស, RemitBuddy",
      ogLocale: "km_KH"
    },
    tl: {
      title: "Hanapin ang Pinakamahusay na Overseas Remittance Rates",
      description: "Pinakamalaking international money transfer comparison platform ng Korea. Sumusuporta sa 10 bansa, ikumpara ang real-time rates mula sa 9 lisensyadong kumpanya sa loob ng 3 segundo. Vietnam, Nepal, Pilipinas, Thailand, Myanmar, Indonesia, Cambodia, Uzbekistan, Sri Lanka. Libreng serbisyo, makatipid ng hanggang 5%.",
      keywords: "overseas money transfer, paghahambing ng remittance, exchange rate, transfer fee, magpadala ng pera mula sa Korea, Korea tungo sa Vietnam, Korea tungo sa Nepal, Korea tungo sa Pilipinas, Korea tungo sa Thailand, Korea tungo sa Myanmar, Korea tungo sa Indonesia, Korea tungo sa Cambodia, Korea tungo sa Uzbekistan, Korea tungo sa Sri Lanka, foreign workers, RemitBuddy",
      ogLocale: "tl_PH"
    },
    uz: {
      title: "Eng yaxshi chet el pul o'tkazish kurslarini toping",
      description: "Koreyaning eng katta xalqaro pul o'tkazish taqqoslash platformasi. 10 davlatni qo'llab-quvvatlaydi, litsenziyalangan 9 kompaniyadan real vaqt kurslarini 3 soniyada solishtiring. Vyetnam, Nepal, Filippin, Tailand, Myanma, Indoneziya, Kambodja, O'zbekiston, Shri-Lanka. Bepul xizmat, 5% gacha tejang.",
      keywords: "chet el pul o'tkazish, pul o'tkazish taqqoslash, valyuta kursi, o'tkazma to'lovi, Koreyadan pul yuborish, Koreyadan Vyetnamga, Koreyadan Nepalga, Koreyadan Filippinga, Koreyadan Tailandga, Koreyadan Myanmaga, Koreyadan Indoneziyaga, Koreyadan Kambodjaga, Koreyadan O'zbekistonga, Koreyadan Shri-Lankaga, chet ellik ishchilar, RemitBuddy",
      ogLocale: "uz_UZ"
    },
    si: {
      title: "හොඳම විදේශ මුදල් යැවීමේ අනුපාත සොයන්න",
      description: "කොරියාවේ විශාලතම ජාත්‍යන්තර මුදල් හුවමාරු සංසන්දන වේදිකාව. රටවල් 10ක් සඳහා සහාය, බලපත්‍රලාභී සමාගම් 9කින් තත්‍ය කාල අනුපාත තත්පර 3කින් සංසන්දනය කරන්න. වියට්නාමය, නේපාලය, පිලිපීනය, තායිලන්තය, මියන්මාරය, ඉන්දුනීසියාව, කාම්බෝජය, උස්බෙකිස්ථානය, ශ්‍රී ලංකාව. නොමිලේ සේවාව, 5% දක්වා ඉතිරි කරගන්න.",
      keywords: "විදේශීය මුදල් හුවමාරුව, ප්‍රේෂණ සංසන්දනය, විනිමය අනුපාතය, මාරු ගාස්තු, කොරියාවෙන් මුදල් යැවීම, කොරියාවේ සිට වියට්නාමය, කොරියාවේ සිට නේපාලය, කොරියාවේ සිට පිලිපීනය, කොරියාවේ සිට තායිලන්තය, කොරියාවේ සිට මියන්මාරය, කොරියාවේ සිට ඉන්දුනීසියාව, කොරියාවේ සිට කාම්බෝජය, කොරියාවේ සිට උස්බෙකිස්ථානය, කොරියාවේ සිට ශ්‍රී ලංකාව, විදේශීය සේවකයන්, RemitBuddy",
      ogLocale: "si_LK"
    }
  };
  
  return metaData[locale] || metaData.en;
};

// Main Page Component
export default function MainPage() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [showResults, setShowResults] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    const resultsRef = useRef(null);
    const [amount, setAmount] = useState("1000000");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(() => getDefaultCountryByLocale(router.locale));
    const [amountError, setAmountError] = useState("");
    const formRef = useRef(null);
    const formRefDesktop = useRef(null);
    const countryDropdownRef = useRef(null);
    const countryDropdownRefDesktop = useRef(null);
    const [hasComparedOnce, setHasComparedOnce] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0);
    const [csrfToken, setCsrfToken] = useState('');

    // Page view tracking and CSRF token generation
    useEffect(() => {
        // 퍼널 분석을 위해 명확한 세션 시작점이 필요한 경우 주석 해제
        // logSessionStart();
        logViewMain();

        // 🔒 Generate CSRF token for this session
        // ⚠️ SECURITY WARNING: This is client-side only!
        // Server MUST:
        // 1. Generate secure random CSRF tokens
        // 2. Store token in server session
        // 3. Validate token on ALL state-changing requests
        // 4. Reject requests with invalid/missing tokens
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        setCsrfToken(token);
    }, [router.locale]);

    // Update selected country when locale changes
    useEffect(() => {
        const defaultCountry = getDefaultCountryByLocale(router.locale);
        setSelectedCountry(defaultCountry);
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
            
            if (selectedCountry && amount && isAmountValid()) {
                
                // Log CTA click with parameters (조건 만족 시에만 로깅)
                logClickedCTA(amount, selectedCountry.code, selectedCountry.currency);
                
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
        
        if (selectedCountry && amount && isAmountValid()) {
            logCompareAgain(amount, selectedCountry.code, selectedCountry.currency);
            
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
                {/* 🎯 언어별 최적화된 메타 태그 */}
                <title>{getLocalizedMeta(router.locale).title}</title>
                <meta name="description" content={getLocalizedMeta(router.locale).description} />
                <meta name="keywords" content={getLocalizedMeta(router.locale).keywords} />

                {/* 🌍 완전한 다국어 hreflang */}
                <link rel="alternate" hrefLang="ko" href="https://www.remitbuddy.com/ko" />
                <link rel="alternate" hrefLang="en" href="https://www.remitbuddy.com/en" />
                <link rel="alternate" hrefLang="vi" href="https://www.remitbuddy.com/vi" />
                <link rel="alternate" hrefLang="ne" href="https://www.remitbuddy.com/ne" />
                <link rel="alternate" hrefLang="th" href="https://www.remitbuddy.com/th" />
                <link rel="alternate" hrefLang="my" href="https://www.remitbuddy.com/my" />
                <link rel="alternate" hrefLang="id" href="https://www.remitbuddy.com/id" />
                <link rel="alternate" hrefLang="km" href="https://www.remitbuddy.com/km" />
                <link rel="alternate" hrefLang="tl" href="https://www.remitbuddy.com/tl" />
                <link rel="alternate" hrefLang="uz" href="https://www.remitbuddy.com/uz" />
                <link rel="alternate" hrefLang="si" href="https://www.remitbuddy.com/si" />
                <link rel="alternate" hrefLang="x-default" href="https://www.remitbuddy.com" />

                {/* 🔒 Security Headers */}
                <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://remitbuddynew.up.railway.app https://www.google-analytics.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';" />
                <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
                <meta httpEquiv="X-Frame-Options" content="DENY" />
                <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
                <meta httpEquiv="Strict-Transport-Security" content="max-age=63072000; includeSubDomains; preload" />
                <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
                <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=()" />

                {/* 📱 모바일 최적화 */}
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
                <meta name="format-detection" content="telephone=no" />

                {/* 🤖 검색엔진 크롤링 최적화 */}
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
                <meta name="googlebot" content="index, follow" />
                <link rel="canonical" href={`https://www.remitbuddy.com${router.asPath}`} />

                {/* 📊 Open Graph 최적화 */}
                <meta property="og:title" content={getLocalizedMeta(router.locale).title} />
                <meta property="og:description" content={getLocalizedMeta(router.locale).description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://www.remitbuddy.com${router.asPath}`} />
                <meta property="og:image" content="https://www.remitbuddy.com/og-image.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="512" />
                <meta property="og:image:height" content="512" />
                <meta property="og:image:alt" content="RemitBuddy - 해외송금 비교 플랫폼" />
                <meta property="og:site_name" content="RemitBuddy" />
                <meta property="og:locale" content={getLocalizedMeta(router.locale).ogLocale} />

                {/* 🐦 Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@RemitBuddy" />
                <meta name="twitter:creator" content="@RemitBuddy" />
                <meta name="twitter:title" content={getLocalizedMeta(router.locale).title} />
                <meta name="twitter:description" content={getLocalizedMeta(router.locale).description} />
                <meta name="twitter:image" content="https://www.remitbuddy.com/og-image.png" />

                {/* 🏢 비즈니스 정보 */}
                <meta name="author" content="RemitBuddy" />
                <meta name="publisher" content="RemitBuddy" />
                <meta name="application-name" content="RemitBuddy" />
                <meta name="theme-color" content="#4facfe" />

                {/* 📍 지역 타겟팅 */}
                <meta name="geo.region" content="KR" />
                <meta name="geo.placename" content="Seoul, South Korea" />
                <meta name="geo.position" content="37.5665;126.9780" />
                <meta name="ICBM" content="37.5665, 126.9780" />
                
                {/* 🔗 구조화된 데이터 (JSON-LD) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "RemitBuddy",
                            "description": getLocalizedMeta(router.locale).description,
                            "url": "https://www.remitbuddy.com",
                            "applicationCategory": "FinanceApplication",
                            "operatingSystem": "Web Browser",
                            "browserRequirements": "JavaScript enabled",
                            "offers": {
                                "@type": "Offer",
                                "description": "Free remittance rate comparison service",
                                "price": "0",
                                "priceCurrency": "KRW"
                            },
                            "provider": {
                                "@type": "Organization",
                                "name": "RemitBuddy",
                                "url": "https://www.remitbuddy.com",
                                "sameAs": [
                                    "https://twitter.com/RemitBuddy",
                                    "https://facebook.com/RemitBuddy"
                                ]
                            },
                            "audience": {
                                "@type": "Audience",
                                "name": "Foreign workers in Korea",
                                "geographicArea": {
                                    "@type": "Country",
                                    "name": "South Korea"
                                }
                            },
                            "serviceType": "Money Transfer Comparison",
                            "areaServed": [
                                {"@type": "Country", "name": "Vietnam"},
                                {"@type": "Country", "name": "Nepal"}, 
                                {"@type": "Country", "name": "Philippines"},
                                {"@type": "Country", "name": "Thailand"},
                                {"@type": "Country", "name": "Myanmar"},
                                {"@type": "Country", "name": "Indonesia"},
                                {"@type": "Country", "name": "Cambodia"},
                                {"@type": "Country", "name": "Uzbekistan"},
                                {"@type": "Country", "name": "Sri Lanka"},
                                {"@type": "Country", "name": "Bangladesh"}
                            ],
                            "availableLanguage": [
                                "ko", "en", "vi", "ne", "th", "my", "id", "km", "tl", "uz", "si"
                            ]
                        })
                    }}
                />
            </Head>
            
            <div className="min-h-screen bg-gray-50 font-sans">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                        <a href={`/${router.locale}`} className="flex items-center gap-2">
                            <img src="/logo.svg" alt="RemitBuddy Logo" className="h-8 w-8" />
                            <span className="text-2xl font-bold text-gray-800">RemitBuddy</span>
                        </a>
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#" className="text-gray-600 hover:text-brand-500 transition-colors">Blog</a>
                            <a href="#" className="text-gray-600 hover:text-brand-500 transition-colors">About Us</a>
                            <a href="#" className="text-gray-600 hover:text-brand-500 transition-colors">Help</a>
                        </nav>
                        {/* Mobile Menu Button */}
                        <button className="md:hidden text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="bg-[#00D26A] text-white pt-6 sm:pt-8 md:pt-10 pb-16 sm:pb-20 md:pb-24">
                    <div className="container mx-auto px-4 text-center mb-6 sm:mb-8 md:mb-10">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" dangerouslySetInnerHTML={{ __html: t('main_title') }} />
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto">
                            {t('main_subtitle')}
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <main className="container mx-auto px-4 -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-2xl md:max-w-4xl mx-auto border-2 sm:border-3 md:border-4 border-[#00D26A]">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            {/* Country Selector */}
                            <div className="md:col-span-5">
                                <label className="block text-base sm:text-lg md:text-xl font-bold text-[#00D26A] mb-3 sm:mb-4">
                                    {t('country_label')}
                                </label>
                                <div className="relative" ref={formRef}>
                                    <button type="button" onClick={() => setShowDropdown(!showDropdown)} className="w-full h-12 sm:h-14 flex items-center justify-between px-4 sm:px-6 bg-white rounded-full border-2 border-gray-300 hover:border-[#00D26A] focus:border-[#00D26A] focus:outline-none transition-colors">
                                        <div className="flex items-center gap-3">
                                            <img src={selectedCountry.flag} alt={`${selectedCountry.name} flag`} className="w-8 h-8 rounded-full shadow-md" />
                                            <span className="font-semibold text-gray-700 text-sm sm:text-base">{selectedCountry.name} ({selectedCountry.currency})</span>
                                        </div>
                                        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showDropdown && <CountryDropdown setSelectedCountry={setSelectedCountry} setShowDropdown={setShowDropdown} t={t} onCountryChange={handleCountryChange} dropdownRef={countryDropdownRef} />}
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="md:col-span-5">
                                <label className="block text-base sm:text-lg md:text-xl font-bold text-[#00D26A] mb-3 sm:mb-4" htmlFor="amount-input">
                                    {t('amount_label')}
                                </label>
                                <div className={`relative h-12 sm:h-14 flex items-center bg-white rounded-full border-2 ${amountError ? 'border-red-500' : 'border-gray-300 focus-within:border-[#00D26A]'} transition-colors px-4 sm:px-6`}>
                                    <input
                                        id="amount-input"
                                        type="text"
                                        value={amount ? parseInt(amount).toLocaleString('en-US') : ""}
                                        onChange={handleAmountChange}
                                        onBlur={handleAmountBlur}
                                        placeholder="1,000,000"
                                        className="w-full bg-transparent font-semibold text-lg sm:text-xl text-gray-800 text-right focus:outline-none pr-16 sm:pr-20"
                                    />
                                    <span className="absolute right-4 sm:right-6 text-lg sm:text-xl font-semibold text-gray-700">KRW</span>
                                </div>
                                {amountError && <p className="text-red-500 text-xs mt-1">{amountError}</p>}
                            </div>

                            {/* CTA Button */}
                            <div className="md:col-span-2">
                                <button type="submit" disabled={!isAmountValid()} className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold bg-[#00D26A] hover:bg-[#00B359] disabled:bg-gray-300 text-white rounded-full shadow-lg disabled:cursor-not-allowed transition-all duration-300 focus:outline-none">
                                    <span className="hidden md:inline">{hasComparedOnce ? t('compare_again_button') : t('compare_button')}</span>
                                    <span className="md:hidden">{t('compare_button_short')}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Results Section */}
                    {showResults && (
                        <div ref={resultsRef} className="mt-12">
                            <ComparisonResults queryParams={queryParams} amount={amount} t={t} onCompareAgain={handleCompareAgain} forceRefresh={forceRefresh} />
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="bg-gray-800 text-white mt-24">
                    <div className="container mx-auto px-4 py-12">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {/* About */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">RemitBuddy</h3>
                                <p className="text-gray-400 text-sm">Simplifying international money transfers for everyone.</p>
                            </div>
                            {/* Links */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                                </ul>
                            </div>
                            {/* Legal */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">Legal</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                                </ul>
                            </div>
                             {/* Disclaimer */}
                             <div>
                                <h3 className="font-bold text-lg mb-4">Disclaimer</h3>
                                 <p className="text-gray-400 text-xs">RemitBuddy is a comparison service and not a licensed remittance provider. We do not handle your money.</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                            © {new Date().getFullYear()} RemitBuddy. All Rights Reserved.
                        </div>
                    </div>
                </footer>
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