import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  logClickedCTA,
  logClickedProvider,
  logResultsImpression,
  logResultsScroll
} from '../utils/analytics';

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
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    ) {
      return `${protocol}//${hostname}:8000`;
    }
  }

  // 3. Production fallback
  return 'https://remitbuddy.up.railway.app';
};

// Country data
const COUNTRIES = [
  { code: 'VN', currency: 'VND', name: 'Vietnam', flag: '/images/flags/vn.png' },
  { code: 'NP', name: 'Nepal', currency: 'NPR', flag: '/images/flags/np.png' },
  { code: 'PH', currency: 'PHP', name: 'Philippines', flag: '/images/flags/ph.png' },
  { code: 'KH', currency: 'KHR', name: 'Cambodia', flag: '/images/flags/kh.png' },
  { code: 'MM', currency: 'MMK', name: 'Myanmar', flag: '/images/flags/mm.png' },
  { code: 'TH', currency: 'THB', name: 'Thailand', flag: '/images/flags/th.png' },
  { code: 'UZ', currency: 'UZS', name: 'Uzbekistan', flag: '/images/flags/uz.png' },
  { code: 'ID', currency: 'IDR', name: 'Indonesia', flag: '/images/flags/id.png' },
  { code: 'LK', currency: 'LKR', name: 'SriLanka', flag: '/images/flags/lk.png' },
  { code: 'BD', currency: 'BDT', name: 'Bangladesh', flag: '/images/flags/bd.png' },
  { code: 'US', currency: 'USD', name: 'United States', flag: '/images/flags/us.png' },
  { code: 'CA', currency: 'CAD', name: 'Canada', flag: '/images/flags/ca.png' },
  { code: 'SG', currency: 'SGD', name: 'Singapore', flag: '/images/flags/sg.png' },
  { code: 'CN', currency: 'CNY', name: 'China', flag: '/images/flags/cn.png' },
  { code: 'MY', currency: 'MYR', name: 'Malaysia', flag: '/images/flags/my.png' },
  { code: 'JP', currency: 'JPY', name: 'Japan', flag: '/images/flags/jp.png' },
  { code: 'HK', currency: 'HKD', name: 'Hong Kong', flag: '/images/flags/hk.png' },
  { code: 'GB', currency: 'GBP', name: 'United Kingdom', flag: '/images/flags/gb.png' },
  { code: 'MN', currency: 'MNT', name: 'Mongolia', flag: '/images/flags/mn.png' }
];

const FLAG_ASSETS = Array.from(new Set(COUNTRIES.map((country) => country.flag)));

// Provider logo mapping
const PROVIDER_LOGO_MAP = {
  Hanpass: '/logos/hanpass.png',
  GmoneyTrans: '/logos/gmoneytrans.png',
  E9Pay: '/logos/e9pay.png',
  Finshot: null,
  Coinshot: '/logos/coinshot.png',
  Cross: '/logos/cross.png',
  'GME Remit': '/logos/gme.png',
  JRF: '/logos/JRF.png',
  'JP Remit': '/logos/JRF.png',
  Wirebarley: '/logos/wirebarley.png',
  Moin: '/logos/themoin.png',
  'The Moin': '/logos/themoin.png',
  Sentbe: '/logos/sentbe.png'
};

// Icon Components
const ChevronDownIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

// Provider Card Component - mobile-first, high-emphasis layout with clear separation
const ProviderCard = ({ provider, isBest, index, onProviderClick }) => {
  const { t } = useTranslation('common');

  const displayName =
    provider.provider === 'JP Remit' ? 'JRF' : provider.provider === 'The Moin' ? 'Moin' : provider.provider;

  const formattedFeeInKRW = provider.fee.toLocaleString('en-US');

  const rateValue = provider.exchange_rate;
  const formattedRate = rateValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });

  // 1위는 특별한 스타일, 나머지는 명확하게 구분되는 카드 스타일
  const cardStyles = isBest
    ? 'border-2 border-blue-400 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-xl ring-4 ring-blue-100'
    : 'border-2 border-gray-200 bg-white shadow-lg hover:border-gray-300 hover:shadow-xl';

  return (
    <div
      className={`relative block w-full rounded-3xl transition-all duration-200 overflow-hidden ${cardStyles}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* 카드 상단 헤더 - Provider 정보 */}
      <div className={`px-5 py-4 sm:px-6 sm:py-5 ${isBest ? 'bg-blue-600' : 'bg-gray-800'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {PROVIDER_LOGO_MAP[provider.provider] ? (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white p-2 shadow-md">
                <img
                  src={PROVIDER_LOGO_MAP[provider.provider]}
                  alt={`${provider.provider} logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white flex items-center justify-center text-lg sm:text-xl font-bold text-gray-800 shadow-md">
                {displayName.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-white">{displayName}</span>
                <span
                  className={`inline-flex items-center rounded-full text-xs font-bold px-2.5 py-1 ${
                    isBest ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-600 text-gray-200'
                  }`}
                >
                  {index + 1}
                  {t('provider.rank_suffix', '위')}
                </span>
              </div>
              {isBest && (
                <span className="flex items-center gap-1 text-xs sm:text-sm text-blue-100 font-medium mt-0.5">
                  <SparklesIcon />
                  {t('provider.best_badge')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 카드 본문 - 금액 정보 */}
      <div className="p-5 sm:p-6">
        {/* 받는 금액 */}
        <div
          className={`rounded-2xl px-5 py-4 sm:px-6 sm:py-5 mb-4 ${
            isBest ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 border-2 border-gray-100'
          }`}
        >
          <div className="text-xs font-semibold text-gray-500 mb-1">{t('provider.recipient_gets')}</div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-base sm:text-lg font-bold ${
                isBest ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {provider.recipient_gets.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
              {provider.currency}
            </span>
          </div>
        </div>

        {/* 환율 & 수수료 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
          <div className="rounded-xl bg-gray-100 px-4 py-3">
            <div className="text-xs font-semibold text-gray-500 mb-1">
              {t('provider.exchange_rate')}
            </div>

            <div className="text-base sm:text-lg font-bold text-gray-800">
              1 {provider.currency} = {formattedRate} KRW
            </div>

            <div className="text-[10px] sm:text-xs text-gray-400 font-medium">
              {t('provider.exchange_unit', {
                currency: provider.currency,
                value: formattedRate
              })}
            </div>
          </div>
          <div className="rounded-xl bg-gray-100 px-4 py-3">
            <div className="text-xs font-semibold text-gray-500 mb-1">{t('provider.fee')}</div>
            <div className="text-base sm:text-lg font-bold text-gray-800">{formattedFeeInKRW}</div>
            <div className="text-[10px] sm:text-xs text-gray-400 font-medium">KRW</div>
          </div>
        </div>

        {/* CTA 버튼 */}
        <a
          href={provider.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onProviderClick}
          className={`flex w-full items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
            isBest ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-800 text-white hover:bg-gray-900'
          }`}
        >
          {t('provider.cta')}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

// Comparison Results Component - CRITICAL: Maintains API integration
function ComparisonResults({ queryParams, amount, forceRefresh, onCompareAgain, apiBaseUrl, isAutoScrolling }) {
  const { t } = useTranslation('common');

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // { type: 'empty' | 'api', message?: string }
  const [snapshotTime, setSnapshotTime] = useState(null);
  const amountRef = useRef(amount);
  const resultsContainerRef = useRef(null);
  const [hasLoggedImpression, setHasLoggedImpression] = useState(false);
  const [hasLoggedScroll, setHasLoggedScroll] = useState(false);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  useEffect(() => {
    setHasLoggedImpression(false);
    setHasLoggedScroll(false);
  }, [forceRefresh, queryParams.receive_country, queryParams.receive_currency, amount]);

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
            Accept: 'application/json'
          }
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
          setError({ type: 'empty' });
        }
      } catch (err) {
        setError({ type: 'api', message: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, [queryParams.receive_country, queryParams.receive_currency, forceRefresh, apiBaseUrl]);

  const bestProvider = results.length > 0 ? results[0] : null;
  const worstProvider = results.length > 1 ? results[results.length - 1] : null;
  const savings =
    bestProvider && worstProvider
      ? Math.round(bestProvider.recipient_gets - worstProvider.recipient_gets)
      : 0;

  const handleProviderClick = (provider, index) => {
    logClickedProvider(
      provider.provider,
      parseInt(amountRef.current || '0', 10),
      queryParams.receive_country,
      queryParams.receive_currency,
      {
        rank: index + 1,
        is_top_provider: index === 0,
        provider_count: results.length,
        recipient_gets: provider.recipient_gets,
        exchange_rate: provider.exchange_rate
      }
    );
  };

  useEffect(() => {
    if (!isLoading && !error && results.length > 0 && !hasLoggedImpression) {
      logResultsImpression(
        parseInt(amountRef.current || '0', 10),
        queryParams.receive_country,
        queryParams.receive_currency,
        results.length
      );
      setHasLoggedImpression(true);
    }
  }, [isLoading, error, results.length, hasLoggedImpression, queryParams.receive_country, queryParams.receive_currency]);

  useEffect(() => {
    if (hasLoggedScroll || isLoading || error || results.length === 0) return;

    const handleScroll = () => {
      if (hasLoggedScroll || isAutoScrolling) return;

      const sectionTop = resultsContainerRef.current?.offsetTop ?? 0;
      if (window.scrollY > sectionTop + 50) {
        logResultsScroll(
          parseInt(amountRef.current || '0', 10),
          queryParams.receive_country,
          queryParams.receive_currency,
          results.length,
          bestProvider?.provider,
          window.scrollY
        );
        setHasLoggedScroll(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [
    hasLoggedScroll,
    isAutoScrolling,
    isLoading,
    error,
    results.length,
    queryParams.receive_country,
    queryParams.receive_currency,
    bestProvider?.provider
  ]);

  const formattedAmount = parseInt(amount || '0', 10).toLocaleString();

  return (
    <div ref={resultsContainerRef} className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      {/* Mobile-first: tighter spacing and scalable typography to prevent overflow */}
      <div className="mb-6 sm:mb-8 text-center space-y-3 sm:space-y-4">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight break-words">
          {t('results.title', {
            amount: formattedAmount,
            country: queryParams.receive_country
          })}
        </h2>
        {snapshotTime && (
          <p className="text-gray-600 flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
            <ClockIcon />
            <span className="break-words">
              {t('results.snapshot', { time: snapshotTime })}
            </span>
          </p>
        )}
        {savings > 0 && (
          <div className="mt-2 sm:mt-4 inline-flex w-full sm:w-auto justify-center bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-300 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-toss-sm">
            <p className="text-accent-700 text-sm sm:text-base font-bold leading-snug">
              {t('results.savings_prefix', '가장 저렴하게 최대')}{' '}
              <span className="text-xl sm:text-2xl font-bold text-accent-600">
                {savings.toLocaleString()}
              </span>{' '}
              {queryParams.receive_currency}{' '}
              {t('results.savings_suffix', '더 보낼 수 있어요!')}
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
          {t('results.compare_again')}
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-12 sm:py-16 w-full px-4 sm:px-6">
          <div className="inline-block relative mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-900 text-base sm:text-lg font-bold mb-2">
            {t('results.loading_title')}
          </p>
          <p className="text-gray-600 text-sm font-medium">
            {t('results.loading_sub')}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 text-center w-full">
          <div className="text-4xl sm:text-5xl mb-4">😔</div>
          <p className="text-red-600 text-base sm:text-lg font-semibold mb-6 leading-snug">
            {error.type === 'empty'
              ? t('results.error_empty')
              : t('results.error_api', { message: error.message })}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            {t('results.retry')}
          </button>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-6">
            <p className="text-gray-600 font-medium text-base sm:text-lg">
              <span className="text-xl sm:text-2xl font-bold text-blue-600">
                {results.length}
              </span>{' '}
              {t('results.count_suffix', '개 업체 비교 결과')}
            </p>
          </div>
          <div className="space-y-6 sm:space-y-8">
            {results.map((provider, index) => (
              <ProviderCard
                key={provider.provider}
                provider={{ ...provider, currency: queryParams.receive_currency }}
                isBest={index === 0}
                index={index}
                onProviderClick={() => handleProviderClick(provider, index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Main Page Component
export default function HomePage() {
  const { t } = useTranslation('common');

  const [amount, setAmount] = useState('1000000');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [queryParams, setQueryParams] = useState({});
  const [forceRefresh, setForceRefresh] = useState(0);
  const [apiBaseUrl, setApiBaseUrl] = useState('https://remitbuddy.up.railway.app');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const dropdownRef = useRef(null);
  const resultsRef = useRef(null);

  // Set API URL on client side only
  useEffect(() => {
    const url = getApiBaseUrl();
    console.log('[RemitBuddy] API Base URL:', url);
    setApiBaseUrl(url);
  }, []);

  // Preload flag images so dropdown thumbnails render instantly
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const preloadedImages = FLAG_ASSETS.map((src) => {
      const img = new window.Image();
      img.decoding = 'async';
      img.src = src;
      return img;
    });

    return () => {
      preloadedImages.forEach((img) => {
        img.src = '';
      });
    };
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

  // 드롭다운 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (showDropdown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showDropdown]);

  const MAX_AMOUNT = 5000000;
  const [shakeInput, setShakeInput] = useState(false);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(value) && value.length <= 10) {
      const numValue = parseInt(value) || 0;
      if (numValue > MAX_AMOUNT) {
        // 최대 금액 초과 시 흔들림 효과 + 최대값으로 설정
        setShakeInput(true);
        setAmount(MAX_AMOUNT.toString());
        setTimeout(() => setShakeInput(false), 500);
      } else {
        setAmount(value);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCountry && amount) {
      const numericAmount = parseInt(amount.replace(/,/g, ''), 10) || 0;

      logClickedCTA(numericAmount, selectedCountry.code || selectedCountry.name, selectedCountry.currency);

      setQueryParams({
        receive_country: selectedCountry.name,
        receive_currency: selectedCountry.currency
      });
      setShowResults(true);
      setForceRefresh((prev) => prev + 1);

      setIsAutoScrolling(true);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => setIsAutoScrolling(false), 600);
      }, 100);
    }
  };

  const handleCompareAgain = () => {
    setIsAutoScrolling(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsAutoScrolling(false), 500);
  };

  const formattedAmount = amount ? parseInt(amount, 10).toLocaleString('en-US') : '';

  return (
    <>
      <Head>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={t('seo.keywords')} />
        <link rel="preconnect" href="https://www.remitbuddy.com" />
        {FLAG_ASSETS.map((flag) => (
          <link key={flag} rel="preload" as="image" href={flag} />
        ))}
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Navigation - Toss Style */}
        <Navigation />

        {/* Hero Section - Toss Style */}
        <section id="hero" className="bg-gradient-to-br from-brand-50 via-white to-brand-50/30 pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-32 md:pb-24 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-30 animate-float" />
            <div
              className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-20 animate-float"
              style={{ animationDelay: '1s' }}
            />
          </div>

          <div className="max-w-7xl mx-auto safe-px sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
              {/* Left Column - Content */}
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-brand-200 shadow-toss-sm hover:shadow-toss transition-all duration-300">
                  <ShieldIcon />
                  <span>{t('hero.badge')}</span>
                </div>

                <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-[1.1] tracking-tighter">
                  {t('hero.title_line1')}
                  <br className="md:hidden" /> {t('hero.title_line2')}
                </h1>

                <p className="text-[15px] sm:text-lg md:text-xl lg:text-2xl text-gray-500 mb-5 md:mb-7 leading-relaxed font-medium">
                  {t('hero.subtitle')}
                </p>

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="text-brand-600 flex-shrink-0">
                      <CheckCircleIcon />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm md:text-base">
                      {t('hero.trust_1')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="text-brand-600 flex-shrink-0">
                      <CheckCircleIcon />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm md:text-base">
                      {t('hero.trust_2')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="text-brand-600 flex-shrink-0">
                      <CheckCircleIcon />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm md:text-base">
                      {t('hero.trust_3')}
                    </span>
                  </div>
                </div>

                {/* Social Proof - Toss Style */}
                <div
                  className="bg-white rounded-xl border border-gray-150 p-4 sm:p-6 w-full sm:w-auto sm:inline-block shadow-toss-sm hover:shadow-toss transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6 md:gap-8">
                    <div className="text-center sm:text-left">
                      <div className="text-xl sm:text-2xl font-bold text-brand-500">8</div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        {t('hero.stats_companies')}
                      </div>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-gray-200" />
                    <div className="text-center sm:text-left">
                      <div className="text-xl sm:text-2xl font-bold text-accent-500">18</div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        {t('hero.stats_countries')}
                      </div>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-gray-200" />
                    <div className="text-center sm:text-left">
                      <div className="text-brand-500 font-bold">
                        <span className="text-xl sm:text-2xl">3</span>
                        <span className="text-xs sm:text-sm ml-0.5">{t('hero.stats_seconds')}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                        {t('hero.stats_seconds_label')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form - Toss Style */}
              <div
                className="animate-fade-in-up w-full sm:max-w-xl lg:max-w-2xl"
                style={{ animationDelay: '0.2s' }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="w-full bg-white rounded-2xl border border-gray-150 p-4 sm:p-6 md:p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    {t('form.title')}
                  </h2>

                  <div className="space-y-5 sm:space-y-6">
                    {/* Country Selector - Premium Dropdown */}
                    <div className="relative z-20">
                      <label className="block text-sm font-bold text-[#4e5968] mb-2 ml-1">
                        {t('form.label_country')}
                      </label>
                      <div ref={dropdownRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setShowDropdown(!showDropdown)}
                          className="w-full h-16 px-6 bg-white rounded-2xl border border-[#e5e8eb] hover:border-brand-300 hover:shadow-lg transition-all duration-300 flex items-center justify-between group outline-none focus:ring-4 focus:ring-brand-100/50"
                          aria-label={t('form.aria_select_country', 'Select country')}
                          aria-expanded={showDropdown}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={selectedCountry.flag}
                                alt=""
                                className="w-10 h-10 rounded-full shadow-sm object-cover border border-[#e5e8eb] group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 rounded-full ring-1 ring-black/5" />
                            </div>
                            <div className="text-left">
                              <span className="block text-lg font-bold text-[#191f28] leading-tight group-hover:text-brand-600 transition-colors">
                                {selectedCountry.name}
                              </span>
                              <span className="text-sm font-medium text-[#8b95a1] group-hover:text-brand-400 transition-colors">
                                {selectedCountry.currency}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`transform transition-transform duration-300 ${
                              showDropdown ? 'rotate-180 text-brand-500' : 'text-[#b0b8c1]'
                            } group-hover:text-brand-500`}
                          >
                            <ChevronDownIcon />
                          </div>
                        </button>

                        {showDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] max-h-[400px] overflow-y-auto z-50 animate-fade-in-up border border-[#e5e8eb] p-2 ring-1 ring-black/5">
                            {COUNTRIES.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowDropdown(false);
                                }}
                                className={`w-full px-5 py-4 flex items-center justify-between hover:bg-[#e8f3ff] rounded-2xl transition-all duration-200 group mb-1 ${
                                  selectedCountry.code === country.code
                                    ? 'bg-[#e8f3ff] ring-1 ring-brand-100'
                                    : ''
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <img
                                      src={country.flag}
                                      alt=""
                                      className="w-10 h-10 rounded-full shadow-sm object-cover border border-[#e5e8eb]"
                                    />
                                    <div className="absolute inset-0 rounded-full ring-1 ring-black/5" />
                                  </div>
                                  <span
                                    className={`text-lg font-bold transition-colors ${
                                      selectedCountry.code === country.code
                                        ? 'text-brand-600'
                                        : 'text-[#191f28] group-hover:text-brand-600'
                                    }`}
                                  >
                                    {country.name}
                                  </span>
                                </div>
                                <span
                                  className={`text-base font-bold ${
                                    selectedCountry.code === country.code
                                      ? 'text-brand-500'
                                      : 'text-[#8b95a1] group-hover:text-brand-400'
                                  }`}
                                >
                                  {country.currency}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amount Input - Toss Style */}
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">
                        {t('form.label_amount')}
                      </label>
                      <div
                        className={`relative h-14 sm:h-16 bg-[#f2f4f6] rounded-2xl hover:bg-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500 transition-all duration-200 px-4 sm:px-6 flex items-center gap-2 border-0 shadow-sm hover:shadow-toss ${
                          shakeInput ? 'animate-shake' : ''
                        }`}
                      >
                        <input
                          type="text"
                          value={formattedAmount}
                          onChange={handleAmountChange}
                          placeholder={t('form.placeholder_amount')}
                          className="flex-1 bg-transparent text-xl sm:text-2xl font-bold text-gray-900 text-right focus:outline-none placeholder-gray-400 border-0"
                          aria-label={t('form.aria_amount_label', 'Amount to send in KRW')}
                        />
                        <span className="text-lg sm:text-xl font-bold text-gray-500">KRW</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 font-medium ml-1">
                        {t('form.validation_minmax')}
                      </p>
                    </div>

                    {/* Submit Button - Toss Style */}
                    <button
                      type="submit"
                      className="w-full sm:w-full max-w-xl h-14 sm:h-16 bg-[#2D8CFF] hover:bg-[#1A75FF] text-white font-semibold text-base sm:text-lg rounded-[14px] shadow-[0_4px_12px_rgba(45,140,255,0.35)] transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      {t('form.submit')}
                    </button>

                    <p className="text-center text-sm text-gray-500 font-medium">
                      {t('form.disclaimer')}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Toss Style */}
        <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-brand-50/30">
          <div className="max-w-7xl mx-auto safe-px sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                {t('features.title')}
              </h2>
              <p className="text-xl text-gray-600 font-medium">{t('features.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUpIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('features.f1_title')}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {t('features.f1_desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShieldIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('features.f2_title')}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {t('features.f2_desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GlobeIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('features.f3_title')}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {t('features.f3_desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CurrencyIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('features.f4_title')}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {t('features.f4_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Toss Style */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto safe-px sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                {t('how.title')}
              </h2>
              <p className="text-xl text-gray-600 font-medium">{t('how.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-toss group-hover:shadow-toss-lg transition-all duration-300 group-hover:scale-110">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('how.s1_title')}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {t('how.s1_desc')}
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-toss group-hover:shadow-toss-lg transition-all duration-300 group-hover:scale-110">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('how.s2_title')}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {t('how.s2_desc')}
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-accent-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-toss group-hover:shadow-toss-lg transition-all duration-300 group-hover:scale-110">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('how.s3_title')}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {t('how.s3_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {showResults && (
          <section ref={resultsRef} className="bg-white py-20">
              <div className="max-w-7xl mx-auto safe-px sm:px-6 lg:px-8">
              <ComparisonResults
                queryParams={queryParams}
                amount={amount}
                forceRefresh={forceRefresh}
                onCompareAgain={handleCompareAgain}
                apiBaseUrl={apiBaseUrl}
                isAutoScrolling={isAutoScrolling}
              />
            </div>
          </section>
        )}

        {/* FAQ Section - Toss Style */}
        <section id="faq" className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                {t('faq.title')}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-gray-150">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t('faq.q1_title')}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {t('faq.q1_desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-gray-150">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t('faq.q2_title')}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {t('faq.q2_desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-gray-150">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t('faq.q3_title')}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {t('faq.q3_desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-gray-150">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t('faq.q4_title')}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {t('faq.q4_desc')}
                </p>
              </div>
            </div>
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
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-4px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(4px);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
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

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'en', ['common']))
  }
});
