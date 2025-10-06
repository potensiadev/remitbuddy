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

// 새로 디자인한 컴포넌트들 import
import Hero from '../components/Hero';
import CompareForm from '../components/CompareForm';
import ResultList from '../components/ResultList';
import Footer from '../components/Footer';

// API Configuration
const FORCE_API_BASE_URL = 'https://remitbuddy-production.up.railway.app';

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

// pages/index.js에서 가져온 메타데이터 함수
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
    }
  };
  
  return metaData[locale] || metaData.en;
};

// Main Page Component
export default function RedesignedMainPage() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [showResults, setShowResults] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    const [amount, setAmount] = useState("1000000");
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [hasComparedOnce, setHasComparedOnce] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0);
    const [csrfToken, setCsrfToken] = useState('');
    
    // Results state
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentApiCall, setCurrentApiCall] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const amountRef = useRef(amount);
    
    // Update ref when amount changes
    useEffect(() => {
        amountRef.current = amount;
    }, [amount]);

    // Page view tracking and CSRF token generation
    useEffect(() => {
        logViewMain();
        
        // Generate CSRF token for this session
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        setCsrfToken(token);
    }, [router.locale]);

    // API call effect
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

    // Form submit handler
    const handleFormSubmit = (submittedAmount, submittedCountry) => {
        setAmount(submittedAmount);
        setSelectedCountry(submittedCountry);
        
        if (hasComparedOnce) {
            // Compare again logic
            logCompareAgain(submittedAmount, submittedCountry.code, submittedCountry.currency);
        } else {
            // First time comparison
            logClickedCTA(submittedAmount, submittedCountry.code, submittedCountry.currency);
            setHasComparedOnce(true);
        }
        
        const newParams = { 
            receive_country: submittedCountry.name, 
            receive_currency: submittedCountry.currency
        };
        
        setQueryParams(newParams); 
        setShowResults(true);
        
        // Scroll to results
        setTimeout(() => {
            const resultsElement = document.getElementById('results-section');
            if (resultsElement) {
                resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    return (
        <>
            <Head>
                {/* 언어별 최적화된 메타 태그 */}
                <title>{getLocalizedMeta(router.locale).title}</title>
                <meta name="description" content={getLocalizedMeta(router.locale).description} />
                <meta name="keywords" content={getLocalizedMeta(router.locale).keywords} />

                {/* 완전한 다국어 hreflang */}
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

                {/* Security Headers */}
                <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://remitbuddy-production.up.railway.app https://www.google-analytics.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';" />
                <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
                <meta httpEquiv="X-Frame-Options" content="DENY" />
                <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
                <meta httpEquiv="Strict-Transport-Security" content="max-age=63072000; includeSubDomains; preload" />
                <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
                <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=()" />

                {/* 모바일 최적화 */}
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
                <meta name="format-detection" content="telephone=no" />

                {/* 검색엔진 크롤링 최적화 */}
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
                <meta name="googlebot" content="index, follow" />
                <link rel="canonical" href={`https://www.remitbuddy.com${router.asPath}`} />

                {/* Open Graph 최적화 */}
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

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@RemitBuddy" />
                <meta name="twitter:creator" content="@RemitBuddy" />
                <meta name="twitter:title" content={getLocalizedMeta(router.locale).title} />
                <meta name="twitter:description" content={getLocalizedMeta(router.locale).description} />
                <meta name="twitter:image" content={`https://www.remitbuddy.com/twitter-card-${router.locale}.png`} />

                {/* 비즈니스 정보 */}
                <meta name="author" content="RemitBuddy" />
                <meta name="publisher" content="RemitBuddy" />
                <meta name="application-name" content="RemitBuddy" />
                <meta name="theme-color" content="#34C759" />

                {/* 지역 타겟팅 */}
                <meta name="geo.region" content="KR" />
                <meta name="geo.placename" content="Seoul, South Korea" />
                <meta name="geo.position" content="37.5665;126.9780" />
                <meta name="ICBM" content="37.5665, 126.9780" />
            </Head>
            
            {/* 리디자인된 페이지 구조 */}
            <div className="min-h-screen bg-white font-poppins">
                {/* Hero Section */}
                <Hero />
                
                {/* Compare Form Section */}
                <section className="py-16 px-4 bg-gray-50">
                    <CompareForm 
                        onSubmit={handleFormSubmit}
                        isLoading={isLoading}
                    />
                </section>

                {/* Results Section */}
                {showResults && (
                    <section id="results-section" className="py-16 px-4">
                        <ResultList
                            results={results}
                            isLoading={isLoading}
                            error={error}
                            amount={amount}
                            currency={queryParams.receive_currency || ''}
                            receiveCountry={queryParams.receive_country || ''}
                        />
                    </section>
                )}

                {/* Footer */}
                <Footer />
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