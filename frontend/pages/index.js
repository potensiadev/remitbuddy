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
  logSendingCountrySwitch 
} from '../utils/analytics';

// API Configuration
const FORCE_API_BASE_URL = 'https://remitbuddy-production.up.railway.app';

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
    <div ref={dropdownRef} className="absolute top-full left-0 mt-2 w-full min-w-[280px] lg:min-w-[320px] h-auto max-h-[60vh] bg-white rounded-xl lg:rounded-2xl shadow-2xl border-2 border-[#00D26A] flex flex-col overflow-hidden z-50">
        <div className="flex-1 overflow-y-auto">
            {COUNTRIES.map(c => (
                <div
                    key={c.code}
                    className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 cursor-pointer hover:bg-[#E8F9F0] transition-colors text-lg"
                    onClick={(e) => {
                        e.stopPropagation();
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
      title: "해외송금 비교 | 한국 최저 수수료 실시간 환율 비교 - RemitBuddy",
      description: "한국 최대 해외송금 비교 플랫폼. 10개국 지원, 9개 공인 송금업체 실시간 환율·수수료 3초 비교. 베트남, 네팔, 필리핀, 태국, 미얀마, 인도네시아, 캄보디아, 우즈베키스탄, 스리랑카. 무료 이용, 최대 5% 절약.",
      keywords: "해외송금, 송금 비교, 환율 비교, 송금 수수료, 한국 송금, 베트남 송금, 네팔 송금, 필리핀 송금, 태국 송금, 미얀마 송금, 인도네시아 송금, 캄보디아 송금, 우즈베키스탄 송금, 스리랑카 송금, 외국인 노동자, 송금업체, 실시간 환율, RemitBuddy",
      ogLocale: "ko_KR"
    },
    en: {
      title: "Money Transfer Comparison | Best Exchange Rates from Korea - RemitBuddy",
      description: "Korea's largest international money transfer comparison platform. Support 10 countries, compare real-time rates from 9 licensed companies in 3 seconds. Vietnam, Nepal, Philippines, Thailand, Myanmar, Indonesia, Cambodia, Uzbekistan, Sri Lanka. Free service, save up to 5%.",
      keywords: "international money transfer, remittance comparison, exchange rate, transfer fee, send money from Korea, Korea to Vietnam, Korea to Nepal, Korea to Philippines, Korea to Thailand, Korea to Myanmar, Korea to Indonesia, Korea to Cambodia, Korea to Uzbekistan, Korea to Sri Lanka, foreign workers, RemitBuddy",
      ogLocale: "en_US"
    },
    vi: {
      title: "So sánh chuyển tiền quốc tế | Tỷ giá tốt nhất từ Hàn Quốc - RemitBuddy",
      description: "Nền tảng so sánh chuyển tiền quốc tế lớn nhất Hàn Quốc. Hỗ trợ 10 quốc gia, so sánh tỷ giá thực tế từ 9 công ty uy tín trong 3 giây. Việt Nam, Nepal, Philippines, Thái Lan, Myanmar, Indonesia, Campuchia, Uzbekistan, Sri Lanka. Miễn phí, tiết kiệm tối đa 5%.",
      keywords: "chuyển tiền quốc tế, so sánh chuyển tiền, tỷ giá hối đoái, phí chuyển tiền, chuyển tiền từ Hàn Quốc, gửi tiền về Việt Nam, lao động Việt Nam, RemitBuddy, tỷ giá VND",
      ogLocale: "vi_VN"
    },
    ne: {
      title: "अन्तर्राष्ट्रिय रेमिट्यान्स तुलना | कोरियाबाट सबैभन्दा राम्रो दर - RemitBuddy",
      description: "कोरियाको सबैभन्दा ठूलो अन्तर्राष्ट्रिय रेमिट्यान्स तुलना प्लेटफर्म। १० देशहरूको समर्थन, ९ वटा इजाजतपत्र प्राप्त कम्पनीहरूको वास्तविक समयको दर ३ सेकेन्डमा तुलना। नेपाल, भियतनाम, फिलिपिन्स, थाइल्यान्ड, म्यानमार, इन्डोनेसिया, कम्बोडिया, उजबेकिस्तान, श्रीलंका। निःशुल्क, ५% सम्म बचत।",
      keywords: "अन्तर्राष्ट्रिय रेमिट्यान्स, रेमिट्यान्स तुलना, विनिमय दर, रेमिट्यान्स शुल्क, कोरियाबाट पैसा पठाउने, नेपाल रेमिट्यान्स, नेपाली कामदार, RemitBuddy, एनआरएस दर",
      ogLocale: "ne_NP"
    },
    th: {
      title: "เปรียบเทียบการโอนเงินระหว่างประเทศ | อัตราแลกเปลี่ยนที่ดีที่สุดจากเกาหลี - RemitBuddy",
      description: "แพลตฟอร์มเปรียบเทียบการโอนเงินระหว่างประเทศที่ใหญ่ที่สุดในเกาหลี รองรับ 10 ประเทศ เปรียบเทียบอัตราเรียลไทม์จาก 9 บริษัทที่ได้รับใบอนุญาตใน 3 วินาที ไทย เวียดนาม เนปาล ฟิลิปปินส์ เมียนมาร์ อินโดนีเซีย กัมพูชา อุซเบกิสถาน ศรีลังกา ฟรี ประหยัดได้สูงสุด 5%",
      keywords: "โอนเงินระหว่างประเทศ, เปรียบเทียบการโอนเงิน, อัตราแลกเปลี่ยน, ค่าธรรมเนียมโอนเงิน, ส่งเงินจากเกาหลี, โอนเงินไปไทย, แรงงานไทยในเกาหลี, RemitBuddy",
      ogLocale: "th_TH"
    },
    my: {
      title: "နိုင်ငံတကာ လွှဲငွေ နှိုင်းယှဉ် | ကိုရီးယားမှ အကောင်းဆုံး နှုန်း - RemitBuddy",
      description: "ကိုရီးယားရှိ အကြီးဆုံး နိုင်ငံတကာ လွှဲငွေ နှိုင်းယှဉ် ပလပ်ဖောင်း။ ၁၀ နိုင်ငံ ပံ့ပိုး၊ လိုင်စင်ရ ကုမ္ပဏီ ၉ ခုမှ အချိန်နှင့်တပြေးညီ နှုန်းများကို ၃ စက္ကန့်တွင် နှိုင်းယှဉ်။ မြန်မာ၊ ဗီယက်နမ်၊ နီပေါ၊ ဖိလစ်ပိုင်၊ ထိုင်း၊ အင်ဒိုနီးရှား၊ ကမ္ဘောဒီးယား၊ ဥဇဘက်ကစ္စတန်၊ သီရိလင်္ကာ။ အခမဲ့၊ ၅% အထိ သက်သာ။",
      keywords: "နိုင်ငံတကာ လွှဲငွေ, လွှဲငွေ နှိုင်းယှဉ်, ငွေလဲနှုန်း, လွှဲငွေ ကုန်ကျစရိတ်, ကိုရီးယားမှ လွှဲငွေ, မြန်မာနိုင်ငံသို့ လွှဲငွေ, မြန်မာ အလုပ်သမား ကိုရီးယား, RemitBuddy",
      ogLocale: "my_MM"
    },
    id: {
      title: "Perbandingan Transfer Uang Internasional | Nilai Tukar Terbaik dari Korea - RemitBuddy",
      description: "Platform perbandingan transfer uang internasional terbesar di Korea. Mendukung 10 negara, bandingkan nilai tukar real-time dari 9 perusahaan berlisensi dalam 3 detik. Indonesia, Vietnam, Nepal, Filipina, Thailand, Myanmar, Kamboja, Uzbekistan, Sri Lanka. Gratis, hemat hingga 5%.",
      keywords: "transfer uang internasional, perbandingan remitansi, nilai tukar, biaya transfer, kirim uang dari Korea, transfer ke Indonesia, pekerja Indonesia di Korea, RemitBuddy, kurs rupiah",
      ogLocale: "id_ID"
    },
    km: {
      title: "ប្រៀបធៀបការផ្ញើប្រាក់អន្តរជាតិ | អត្រាប្តូរប្រាក់ល្អបំផុតពីកូរ៉េ - RemitBuddy",
      description: "វេទិកាប្រៀបធៀបការផ្ញើប្រាក់អន្តរជាតិធំបំផុតនៅកូរ៉េ។ គាំទ្រ ១០ ប្រទេស ប្រៀបធៀបអត្រាពេលវេលាជាក់ស្ដែងពីក្រុមហ៊ុនមានអាជ្ញាប័ណ្ណ ៩ ក្នុងរយៈពេល ៣ វិនាទី។ កម្ពុជា វៀតណាម នេប៉ាល់ ហ្វីលីពីន ថៃ មីយ៉ាន់ម៉ា ឥណ្ឌូនេស៊ី អ៊ូសបេគីស្ថាន ស្រីលង្កា។ ឥតគិតថ្លៃ សន្សំបាន ៥%។",
      keywords: "ការផ្ញើប្រាក់អន្តរជាតិ, ការប្រៀបធៀបការផ្ញើប្រាក់, អត្រាប្តូរប្រាក់, ថ្លៃសេវាផ្ញើប្រាក់, ផ្ញើប្រាក់ពីកូរ៉េ, ផ្ញើប្រាក់ទៅកម្ពុជា, កម្មករកម្ពុជានៅកូរ៉េ, RemitBuddy",
      ogLocale: "km_KH"
    },
    tl: {
      title: "Paghahambing ng International Money Transfer | Pinakamahusay na Exchange Rate mula sa Korea - RemitBuddy",
      description: "Pinakamalaking platform ng paghahambing ng international money transfer sa Korea. Sumusuporta sa 10 bansa, ihambing ang real-time rates mula sa 9 lisensyadong kumpanya sa loob ng 3 segundo. Pilipinas, Vietnam, Nepal, Thailand, Myanmar, Indonesia, Cambodia, Uzbekistan, Sri Lanka. Libre, makatipid ng hanggang 5%.",
      keywords: "international money transfer, paghahambing ng remittance, exchange rate, bayad sa transfer, magpadala ng pera mula sa Korea, padala sa Pilipinas, OFW sa Korea, RemitBuddy, palitan ng piso",
      ogLocale: "tl_PH"
    },
    uz: {
      title: "Xalqaro pul o'tkazish taqqoslash | Koreyadan eng yaxshi kurs - RemitBuddy",
      description: "Koreyadagi eng katta xalqaro pul o'tkazish taqqoslash platformasi. 10 davlatni qo'llab-quvvatlaydi, litsenziyalangan 9 kompaniyadan real vaqt kurslarini 3 soniyada solishtiring. O'zbekiston, Vyetnam, Nepal, Filippin, Tailand, Myanma, Indoneziya, Kambodja, Shri-Lanka. Bepul, 5% gacha tejash.",
      keywords: "xalqaro pul o'tkazish, remittans taqqoslash, valyuta kursi, pul o'tkazish to'lovi, Koreyadan pul yuborish, O'zbekistonga pul o'tkazish, O'zbek ishchilari Koreyada, RemitBuddy",
      ogLocale: "uz_UZ"
    },
    si: {
      title: "ජාත්‍යන්තර මුදල් හුවමාරු සංසන්දනය | කොරියාවේ සිට හොඳම විනිමය අනුපාතය - RemitBuddy",
      description: "කොරියාවේ විශාලතම ජාත්‍යන්තර මුදල් හුවමාරු සංසන්දන වේදිකාව. රටවල් 10ක් සහාය දක්වයි, බලපත්‍රිත සමාගම් 9කින් තත්‍ය කාල අනුපාත තත්පර 3කින් සංසන්දනය කරන්න. ශ්‍රී ලංකාව, වියට්නාමය, නේපාලය, පිලිපීනය, තායිලන්තය, මියන්මාරය, ඉන්දුනීසියාව, කාම්බෝජය, උස්බෙකිස්ථානය. නොමිලේ, 5% දක්වා ඉතිරි කරන්න.",
      keywords: "ජාත්‍යන්තර මුදල් හුවමාරුව, රේමිටන්ස් සංසන්දනය, විනිමය අනුපාතය, මුදල් හුවමාරු ගාස්තු, කොරියාවේ සිට මුදල් යැවීම, ශ්‍රී ලංකාවට මුදල් යැවීම, ශ්‍රී ලාංකික කම්කරුවන් කොරියාවේ, RemitBuddy",
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
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
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
                <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://remitbuddy-production.up.railway.app https://www.google-analytics.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';" />
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
                <meta property="og:image" content={`https://www.remitbuddy.com/og-image-${router.locale}.png`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="RemitBuddy - 해외송금 비교 플랫폼" />
                <meta property="og:site_name" content="RemitBuddy" />
                <meta property="og:locale" content={getLocalizedMeta(router.locale).ogLocale} />

                {/* 🐦 Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@RemitBuddy" />
                <meta name="twitter:creator" content="@RemitBuddy" />
                <meta name="twitter:title" content={getLocalizedMeta(router.locale).title} />
                <meta name="twitter:description" content={getLocalizedMeta(router.locale).description} />
                <meta name="twitter:image" content={`https://www.remitbuddy.com/twitter-card-${router.locale}.png`} />

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
            
            <div className="min-h-screen bg-white font-poppins">
                {/* Header with Logo */}
                <header className="px-4 md:px-8 py-4 md:py-6 bg-white">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#00D26A]">
                        RemitBuddy
                    </h1>
                </header>

                {/* Hero Section - Full Width Green Background */}
                <section className="bg-[#00D26A] pt-12 md:pt-16 pb-24 md:pb-32 px-4 md:px-8">
                    <div className="max-w-[1200px] mx-auto">
                        {/* Hero Title - White Text */}
                        <div className="text-center mb-10 md:mb-12">
                            <h2 className="text-4xl md:text-[56px] leading-tight md:leading-[68px] font-extrabold text-white mb-3 md:mb-4" dangerouslySetInnerHTML={{ __html: t('main_title') }} />
                            <p className="text-lg md:text-2xl leading-7 md:leading-8 font-normal text-white">
                                {t('main_subtitle')}
                            </p>
                        </div>

                        {/* White Input Card - Floating on Green Background */}
                        <div className="max-w-[620px] mx-auto bg-white rounded-3xl border-[3px] border-[#00D26A] p-8 md:p-10 shadow-2xl">
                            <form onSubmit={handleSubmit}>
                                {/* 🔒 CSRF Protection - Server must validate this token */}
                                <input type="hidden" name="_csrf" value={csrfToken} />

                                {/* Country Selector */}
                                <div className="mb-6 md:mb-8">
                                    <label className="block text-lg md:text-xl font-bold text-[#00D26A] mb-3 md:mb-4 text-left">
                                        {t('country_label')}
                                    </label>
                                    <div className="relative" ref={formRefDesktop}>
                                        <button
                                            type="button"
                                            onClick={() => setShowDropdown(prev => !prev)}
                                            className="w-full flex items-center justify-between px-5 md:px-6 py-3 rounded-full hover:border hover:border-[#00D26A] transition-colors"
                                        >
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <img src={selectedCountry.flag} alt={`${selectedCountry.name} flag`} width="32" height="32" className="w-8 h-8 rounded-full object-cover" />
                                                <span className="text-base md:text-lg font-semibold text-[#6B7280]">
                                                    {selectedCountry.name} ({selectedCountry.currency})
                                                </span>
                                            </div>
                                            <ChevronDownIcon className={`w-5 h-5 text-[#6B7280] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                        </button>
                                        {showDropdown && <CountryDropdown setSelectedCountry={setSelectedCountry} setShowDropdown={setShowDropdown} t={t} onCountryChange={handleCountryChange} dropdownRef={countryDropdownRef} />}
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div className="mb-6 md:mb-8" ref={formRef}>
                                    <label className="block text-lg md:text-xl font-bold text-[#00D26A] mb-3 md:mb-4 text-left">
                                        {t('amount_label')}
                                    </label>
                                    <div className="relative">
                                        {/* ⚠️ SECURITY: Client-side validation only! Server MUST validate */}
                                        <input
                                            type="text"
                                            value={amount ? parseInt(amount).toLocaleString('en-US') : ""}
                                            onChange={handleAmountChange}
                                            onBlur={handleAmountBlur}
                                            placeholder="1,000,000"
                                            className="w-full px-5 md:px-6 py-3 rounded-full text-base md:text-lg font-semibold text-[#6B7280] pr-20 hover:border hover:border-[#00D26A] focus:border focus:border-[#00D26A] focus:outline-none transition-colors"
                                        />
                                        <span className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 text-base md:text-lg font-semibold text-[#6B7280] pointer-events-none">
                                            KRW
                                        </span>
                                    </div>
                                    {amountError && (
                                        <div className="text-red-500 text-sm mt-2">
                                            {amountError}
                                        </div>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <button
                                    type="submit"
                                    disabled={!isAmountValid()}
                                    className="w-full py-3.5 md:py-4 bg-[#00D26A] text-white text-lg md:text-xl font-bold rounded-full hover:bg-[#00BD5F] transition-colors border-0 outline-none focus:outline-none active:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ border: 'none !important', outline: 'none !important', boxShadow: 'none' }}
                                >
                                    {hasComparedOnce ? t('compare_again_button') : t('compare_button')}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                {showResults && (
                    <div ref={resultsRef} className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
                        <ComparisonResults queryParams={queryParams} amount={amount} t={t} onCompareAgain={handleCompareAgain} forceRefresh={forceRefresh} />
                    </div>
                )}

                {/* Footer */}
                <footer className="bg-[#4B5563] text-white py-6 md:py-8 px-4 md:px-8 mt-auto">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs md:text-sm">© 2025 Potensia Inc. All Rights Reserved</p>
                            <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
                                <a href="#" className="hover:text-[#00D26A] transition-colors">About</a>
                                <a href="#" className="hover:text-[#00D26A] transition-colors">Contact</a>
                                <a href="#" className="hover:text-[#00D26A] transition-colors">Privacy</a>
                                <a href="#" className="hover:text-[#00D26A] transition-colors">Advertise</a>
                            </div>
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