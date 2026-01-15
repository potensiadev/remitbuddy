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

// Country data with popular flag
const COUNTRIES = [
  { code: 'VN', currency: 'VND', name: 'Vietnam', flag: '/images/flags/vn.png', popular: true },
  { code: 'PH', currency: 'PHP', name: 'Philippines', flag: '/images/flags/ph.png', popular: true },
  { code: 'NP', name: 'Nepal', currency: 'NPR', flag: '/images/flags/np.png', popular: true },
  { code: 'KH', currency: 'KHR', name: 'Cambodia', flag: '/images/flags/kh.png', popular: true },
  { code: 'TH', currency: 'THB', name: 'Thailand', flag: '/images/flags/th.png', popular: true },
  { code: 'MM', currency: 'MMK', name: 'Myanmar', flag: '/images/flags/mm.png' },
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

// Separate popular and other countries for dropdown
const POPULAR_COUNTRIES = COUNTRIES.filter(c => c.popular);
const OTHER_COUNTRIES = COUNTRIES.filter(c => !c.popular);

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

// Provider Card Component - Simplified with hero metric emphasis
const ProviderCard = ({ provider, isBest, index, onProviderClick, bestAmount, worstAmount }) => {
  const { t } = useTranslation('common');

  const displayName =
    provider.provider === 'JP Remit' ? 'JRF' : provider.provider === 'The Moin' ? 'Moin' : provider.provider;

  const formattedFeeInKRW = provider.fee.toLocaleString('en-US');

  const rateValue = provider.exchange_rate;
  const formattedRate = rateValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });

  // Simplified card styles - Best gets prominent styling
  const cardStyles = isBest
    ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 shadow-xl ring-2 ring-blue-100'
    : 'border border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-gray-300';

  // Calculate comparison bar percentage (relative to best)
  const range = bestAmount - worstAmount;
  const barPercentage = range > 0
    ? Math.round(((provider.recipient_gets - worstAmount) / range) * 100)
    : 100;

  // Calculate difference from best
  const diffFromBest = bestAmount - provider.recipient_gets;

  return (
    <div
      className={`relative block w-full rounded-2xl transition-all duration-200 overflow-hidden ${cardStyles}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Best Deal Banner - Only for #1 */}
      {isBest && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 flex items-center justify-center gap-2">
          <SparklesIcon />
          <span className="text-white font-bold text-sm">{t('results.best_choice', 'Best Choice')} — {t('results.you_receive', 'Your recipient gets the most')}</span>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Provider Info Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {PROVIDER_LOGO_MAP[provider.provider] ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 border border-gray-100 p-1.5 flex items-center justify-center">
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center text-base sm:text-lg font-bold text-gray-600">
                {displayName.charAt(0)}
              </div>
            )}
            <div>
              <span className="text-base sm:text-lg font-bold text-gray-900">{displayName}</span>
              <span
                className={`ml-2 inline-flex items-center rounded-full text-xs font-bold px-2 py-0.5 ${
                  isBest ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                #{index + 1}
              </span>
            </div>
          </div>
        </div>

        {/* HERO METRIC - Amount Received (Large & Prominent) */}
        <div
          className={`rounded-xl px-5 py-5 sm:px-6 sm:py-6 mb-4 text-center ${
            isBest ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-100'
          }`}
        >
          <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            {t('provider.recipient_gets', 'Recipient Gets')}
          </div>
          <div className="flex items-baseline justify-center gap-2">
            <span
              className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
                isBest ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {provider.recipient_gets.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </span>
            <span className={`text-base sm:text-lg font-semibold ${isBest ? 'text-blue-400' : 'text-gray-400'}`}>
              {provider.currency}
            </span>
          </div>

          {/* Visual Comparison Bar */}
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBest ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-gradient-to-r from-gray-400 to-gray-300'
                }`}
                style={{ width: `${barPercentage}%` }}
              />
            </div>
            {!isBest && diffFromBest > 0 && (
              <div className="mt-2 text-xs font-medium text-red-500">
                -{diffFromBest.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {provider.currency} vs best
              </div>
            )}
            {isBest && (
              <div className="mt-2 text-xs font-medium text-blue-600">
                Best rate available
              </div>
            )}
          </div>
        </div>

        {/* Secondary Info - Rate & Fee (Compact) with Trend Indicator */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500 mb-5">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{t('provider.exchange_rate', 'Rate')}:</span>
            <span className="font-semibold text-gray-700">{formattedRate}</span>
            {/* Rate trend indicator - simulated for now, can be connected to real historical data */}
            {isBest && (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Good
              </span>
            )}
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{t('provider.fee', 'Fee')}:</span>
            <span className="font-semibold text-gray-700">₩{formattedFeeInKRW}</span>
          </div>
        </div>

        {/* CTA Button - Contextual */}
        <a
          href={provider.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onProviderClick}
          className={`flex w-full items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5 ${
            isBest
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
          }`}
        >
          {t('provider.cta', 'Send with {{provider}}').replace('{{provider}}', displayName)}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

// Comparison Results Component - CRITICAL: Maintains API integration
function ComparisonResults({ queryParams, amount, forceRefresh, onCompareAgain, apiBaseUrl, isAutoScrolling, view, onViewChange, onSaveCorridor, isCorridorSaved }) {
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
          {/* Results Header with View Toggle and Actions */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-gray-600 font-medium text-base sm:text-lg">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                  {results.length}
                </span>{' '}
                {t('results.count_suffix', 'providers compared')}
              </p>
              {/* View Toggle */}
              <ViewToggle view={view} onViewChange={onViewChange} />
            </div>

            {/* Actions Row: Save Corridor + Ranking Explanation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <SaveCorridorButton
                amount={amount}
                country={queryParams.receive_country}
                onSave={onSaveCorridor}
                isSaved={isCorridorSaved}
              />
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-700">
                  {t('results.ranking_explanation', 'Ranked by total amount received')}
                </span>
              </div>
            </div>
          </div>

          {/* Rate Chart for Best Provider */}
          {bestProvider && (
            <div className="mb-6">
              <RateChart
                currency={queryParams.receive_currency}
                currentRate={bestProvider.exchange_rate}
              />
            </div>
          )}

          {/* Results - Card or Table View */}
          {view === 'table' ? (
            <ResultsTable
              results={results}
              currency={queryParams.receive_currency}
              onProviderClick={handleProviderClick}
              bestAmount={bestProvider?.recipient_gets || 0}
            />
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {results.map((provider, index) => (
                <ProviderCard
                  key={provider.provider}
                  provider={{ ...provider, currency: queryParams.receive_currency }}
                  isBest={index === 0}
                  index={index}
                  onProviderClick={() => handleProviderClick(provider, index)}
                  bestAmount={bestProvider?.recipient_gets || 0}
                  worstAmount={worstProvider?.recipient_gets || 0}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Saved Corridors Component
const SavedCorridors = ({ corridors, onSelectCorridor, onRemoveCorridor }) => {
  const { t } = useTranslation('common');

  if (!corridors || corridors.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        {t('user_profile.title', 'Your Saved Corridors')}
      </h3>
      <div className="flex flex-wrap gap-2">
        {corridors.map((corridor, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 rounded-lg px-3 py-2 transition-all group"
          >
            <button
              onClick={() => onSelectCorridor(corridor)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-brand-600"
            >
              <span>{parseInt(corridor.amount).toLocaleString()} KRW</span>
              <span className="text-gray-400">→</span>
              <span>{corridor.country}</span>
            </button>
            <button
              onClick={() => onRemoveCorridor(index)}
              className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors"
              title={t('user_profile.remove', 'Remove')}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Save Corridor Button
const SaveCorridorButton = ({ amount, country, onSave, isSaved }) => {
  const { t } = useTranslation('common');

  return (
    <button
      onClick={onSave}
      disabled={isSaved}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isSaved
          ? 'bg-green-50 text-green-600 border border-green-200'
          : 'bg-gray-100 hover:bg-brand-50 text-gray-600 hover:text-brand-600 border border-gray-200 hover:border-brand-200'
      }`}
    >
      {isSaved ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t('user_profile.saved', 'Saved!')}
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {t('user_profile.save_this', 'Save this corridor')}
        </>
      )}
    </button>
  );
};

// View Toggle Component
const ViewToggle = ({ view, onViewChange }) => {
  const { t } = useTranslation('common');

  return (
    <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewChange('cards')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          view === 'cards'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          {t('view_toggle.cards', 'Cards')}
        </span>
      </button>
      <button
        onClick={() => onViewChange('table')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          view === 'table'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {t('view_toggle.table', 'Table')}
        </span>
      </button>
    </div>
  );
};

// Table View Component
const ResultsTable = ({ results, currency, onProviderClick, bestAmount }) => {
  const { t } = useTranslation('common');

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('view_toggle.provider', 'Provider')}
            </th>
            <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('view_toggle.amount_received', 'Amount Received')}
            </th>
            <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('view_toggle.rate', 'Rate')}
            </th>
            <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('view_toggle.fee', 'Fee')}
            </th>
            <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('view_toggle.action', 'Action')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {results.map((provider, index) => {
            const isBest = index === 0;
            const displayName = provider.provider === 'JP Remit' ? 'JRF' : provider.provider === 'The Moin' ? 'Moin' : provider.provider;
            const diffFromBest = bestAmount - provider.recipient_gets;

            return (
              <tr
                key={provider.provider}
                className={`hover:bg-gray-50 transition-colors ${isBest ? 'bg-blue-50/50' : ''}`}
              >
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    isBest ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{displayName}</span>
                    {isBest && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
                        Best
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="font-bold text-gray-900">
                    {provider.recipient_gets.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    <span className="text-gray-500 font-normal ml-1">{currency}</span>
                  </div>
                  {!isBest && diffFromBest > 0 && (
                    <div className="text-xs text-red-500">
                      -{diffFromBest.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 text-right text-gray-600">
                  {provider.exchange_rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </td>
                <td className="px-4 py-4 text-right text-gray-600">
                  ₩{provider.fee.toLocaleString('en-US')}
                </td>
                <td className="px-4 py-4 text-center">
                  <a
                    href={provider.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onProviderClick(provider, index)}
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isBest
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Send
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Mini Rate Chart Component (simulated data for now)
const RateChart = ({ currency, currentRate }) => {
  const { t } = useTranslation('common');

  // Simulated 7-day data (in production, this would come from API)
  const generateSimulatedData = () => {
    const baseRate = currentRate || 1;
    const variance = baseRate * 0.02; // 2% variance
    return Array.from({ length: 7 }, (_, i) => {
      const dayOffset = 6 - i;
      const randomVariance = (Math.random() - 0.5) * variance;
      return {
        day: dayOffset === 0 ? 'Today' : `${dayOffset}d`,
        rate: baseRate + randomVariance,
        isToday: dayOffset === 0
      };
    });
  };

  const data = generateSimulatedData();
  const rates = data.map(d => d.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const range = maxRate - minRate || 1;

  const isBetterThanAvg = currentRate >= avgRate;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-gray-900 text-sm">{t('rate_chart.title', 'Rate Trend')}</h4>
          <p className="text-xs text-gray-500">{t('rate_chart.subtitle', 'Last 7 days')}</p>
        </div>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isBetterThanAvg ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {isBetterThanAvg ? (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {t('rate_chart.better_than_avg', 'Better than average')}
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              {t('rate_chart.worse_than_avg', 'Below average')}
            </>
          )}
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-16 flex items-end gap-1">
        {data.map((point, index) => {
          const height = ((point.rate - minRate) / range) * 100;
          const normalizedHeight = Math.max(20, Math.min(100, height || 50));

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t transition-all ${
                  point.isToday ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                style={{ height: `${normalizedHeight}%` }}
              />
              <span className={`text-[10px] ${point.isToday ? 'font-bold text-blue-600' : 'text-gray-400'}`}>
                {point.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs">
        <div className="text-gray-500">
          <span className="font-medium">{t('rate_chart.avg', '7-day avg')}:</span>{' '}
          <span className="text-gray-700">{avgRate.toFixed(2)}</span>
        </div>
        <div className="text-gray-500">
          <span className="font-medium">{t('rate_chart.high', 'High')}:</span>{' '}
          <span className="text-green-600">{maxRate.toFixed(2)}</span>
        </div>
        <div className="text-gray-500">
          <span className="font-medium">{t('rate_chart.low', 'Low')}:</span>{' '}
          <span className="text-red-500">{minRate.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// PWA Install Prompt Component
const PWAInstallPrompt = ({ onDismiss }) => {
  const { t } = useTranslation('common');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">{t('pwa.install_title', 'Install RemitBuddy')}</h3>
            <p className="text-sm text-gray-600 mb-3">{t('pwa.install_desc', 'Add to home screen for faster access')}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-all"
              >
                {t('pwa.install_button', 'Install App')}
              </button>
              <button
                onClick={() => { setShowPrompt(false); onDismiss?.(); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-all"
              >
                {t('pwa.later', 'Maybe Later')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Rate Alert Component
const RateAlertCard = ({ country, onClose }) => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsLoading(true);
    // Simulate API call - in production, this would call a real endpoint
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitted(true);
    setIsLoading(false);

    // Store in localStorage as backup
    try {
      const alerts = JSON.parse(localStorage.getItem('rateAlerts') || '[]');
      alerts.push({ email, country, createdAt: new Date().toISOString() });
      localStorage.setItem('rateAlerts', JSON.stringify(alerts));
    } catch (e) {
      console.error('Failed to save rate alert:', e);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center animate-fade-in">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{t('rate_alert.success_title', "You're all set!")}</h3>
        <p className="text-gray-600">{t('rate_alert.success_message', "We'll email you when rates improve.").replace('{{country}}', country)}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{t('rate_alert.title', 'Get Rate Alerts')}</h3>
            <p className="text-sm text-gray-600">{t('rate_alert.subtitle', "We'll notify you when rates improve")}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('rate_alert.email_placeholder', 'your@email.com')}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t('rate_alert.submit', 'Set Alert')
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">{t('rate_alert.privacy', 'We respect your privacy. Unsubscribe anytime.')}</p>
      </form>
    </div>
  );
};

// Welcome Back Banner Component
const WelcomeBackBanner = ({ lastComparison, onUseLastComparison, onDismiss }) => {
  const { t } = useTranslation('common');

  if (!lastComparison) return null;

  const formattedAmount = parseInt(lastComparison.amount || 0, 10).toLocaleString();

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-5 mb-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{t('welcome_back.title', 'Welcome back!')}</h3>
            <p className="text-sm text-gray-600">
              {t('welcome_back.last_comparison', 'Your last comparison')}: {formattedAmount} KRW → {lastComparison.country}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onUseLastComparison}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-all"
          >
            {t('welcome_back.compare_again', 'Compare again').replace('{{amount}}', formattedAmount).replace('{{country}}', lastComparison.country)}
          </button>
          <button
            onClick={onDismiss}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [showRateAlert, setShowRateAlert] = useState(true);
  const [lastComparison, setLastComparison] = useState(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [savedCorridors, setSavedCorridors] = useState([]);
  const [resultsView, setResultsView] = useState('cards');
  const [isCorridorSaved, setIsCorridorSaved] = useState(false);
  const dropdownRef = useRef(null);
  const resultsRef = useRef(null);
  const heroRef = useRef(null);

  // Set API URL on client side only
  useEffect(() => {
    const url = getApiBaseUrl();
    console.log('[RemitBuddy] API Base URL:', url);
    setApiBaseUrl(url);
  }, []);

  // Load last comparison from localStorage (return visitor recognition)
  useEffect(() => {
    try {
      const savedComparison = localStorage.getItem('lastComparison');
      if (savedComparison) {
        const parsed = JSON.parse(savedComparison);
        // Only show if comparison was made in the last 7 days
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (parsed.timestamp && parsed.timestamp > sevenDaysAgo) {
          setLastComparison(parsed);
          setShowWelcomeBack(true);
        }
      }
    } catch (e) {
      console.error('Failed to load last comparison:', e);
    }
  }, []);

  // Save comparison to localStorage when user compares
  const saveComparison = (compAmount, country) => {
    try {
      const comparisonData = {
        amount: compAmount,
        country: country.name,
        countryCode: country.code,
        currency: country.currency,
        timestamp: Date.now()
      };
      localStorage.setItem('lastComparison', JSON.stringify(comparisonData));
    } catch (e) {
      console.error('Failed to save comparison:', e);
    }
  };

  // Handle using last comparison
  const handleUseLastComparison = () => {
    if (lastComparison) {
      setAmount(lastComparison.amount);
      const country = COUNTRIES.find(c => c.code === lastComparison.countryCode);
      if (country) {
        setSelectedCountry(country);
      }
      setShowWelcomeBack(false);
      // Trigger comparison
      setTimeout(() => {
        document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 100);
    }
  };

  // Load saved corridors from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedCorridors');
      if (saved) {
        setSavedCorridors(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved corridors:', e);
    }
  }, []);

  // Save corridor handler
  const handleSaveCorridor = () => {
    const newCorridor = {
      amount: amount,
      country: selectedCountry.name,
      countryCode: selectedCountry.code,
      currency: selectedCountry.currency
    };

    // Check if already saved
    const exists = savedCorridors.some(
      c => c.amount === newCorridor.amount && c.countryCode === newCorridor.countryCode
    );

    if (!exists) {
      const updated = [...savedCorridors, newCorridor].slice(-5); // Keep max 5
      setSavedCorridors(updated);
      localStorage.setItem('savedCorridors', JSON.stringify(updated));
      setIsCorridorSaved(true);
      setTimeout(() => setIsCorridorSaved(false), 2000);
    }
  };

  // Remove corridor handler
  const handleRemoveCorridor = (index) => {
    const updated = savedCorridors.filter((_, i) => i !== index);
    setSavedCorridors(updated);
    localStorage.setItem('savedCorridors', JSON.stringify(updated));
  };

  // Select saved corridor handler
  const handleSelectCorridor = (corridor) => {
    setAmount(corridor.amount);
    const country = COUNTRIES.find(c => c.code === corridor.countryCode);
    if (country) {
      setSelectedCountry(country);
    }
    // Trigger comparison
    setTimeout(() => {
      document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

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

  // Show floating CTA when scrolled past hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom || 0;
      // Show floating CTA when hero is scrolled out of view (with some buffer)
      setShowFloatingCTA(heroBottom < -100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      // Save comparison for return visitor recognition
      saveComparison(amount, selectedCountry);
      setShowWelcomeBack(false);

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

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={t('seo.title')} />
        <meta property="og:description" content={t('seo.description')} />
        <meta property="og:image" content="https://www.remitbuddy.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:url" content="https://www.remitbuddy.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RemitBuddy" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.title')} />
        <meta name="twitter:description" content={t('seo.description')} />
        <meta name="twitter:image" content="https://www.remitbuddy.com/og-image.png" />

        <link rel="preconnect" href="https://www.remitbuddy.com" />
        {FLAG_ASSETS.map((flag) => (
          <link key={flag} rel="preload" as="image" href={flag} />
        ))}
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Navigation - Toss Style */}
        <Navigation />

        {/* Hero Section - Toss Style */}
        <section ref={heroRef} id="hero" className="bg-gradient-to-br from-brand-50 via-white to-brand-50/30 pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-32 md:pb-24 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-30 animate-float" />
            <div
              className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-20 animate-float"
              style={{ animationDelay: '1s' }}
            />
          </div>

          <div className="max-w-7xl mx-auto safe-px sm:px-6 lg:px-8 relative z-10">
            {/* Welcome Back Banner for Return Visitors */}
            {showWelcomeBack && lastComparison && (
              <WelcomeBackBanner
                lastComparison={lastComparison}
                onUseLastComparison={handleUseLastComparison}
                onDismiss={() => setShowWelcomeBack(false)}
              />
            )}

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

                {/* Social Proof Stats - Toss Style */}
                <div
                  className="bg-white rounded-xl p-6 sm:p-8 shadow-toss border border-gray-100 w-full sm:w-auto sm:inline-block max-w-2xl hover:shadow-toss-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-brand-500">8</div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        {t('hero.stats_companies')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-brand-600">18</div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        {t('hero.stats_countries')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-brand-500 font-bold">
                        <span className="text-2xl sm:text-3xl">3</span>
                        <span className="text-xs sm:text-sm ml-1">{t('hero.stats_seconds')}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        {t('hero.stats_seconds_label')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-accent-500">₩32K</div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        {t('hero.stats_savings', 'avg. saved')}
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
                {/* Saved Corridors */}
                {savedCorridors.length > 0 && (
                  <SavedCorridors
                    corridors={savedCorridors}
                    onSelectCorridor={handleSelectCorridor}
                    onRemoveCorridor={handleRemoveCorridor}
                  />
                )}

                <form
                  onSubmit={handleSubmit}
                  className="w-full bg-white rounded-xl border border-gray-100 p-6 sm:p-8 shadow-toss hover:shadow-toss-lg transition-all duration-300"
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
                            {/* Popular Destinations */}
                            <div className="px-4 py-2 mb-1">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Popular</span>
                            </div>
                            {POPULAR_COUNTRIES.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowDropdown(false);
                                }}
                                className={`w-full px-5 py-3.5 flex items-center justify-between hover:bg-[#e8f3ff] rounded-2xl transition-all duration-200 group mb-1 ${
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
                                      className="w-9 h-9 rounded-full shadow-sm object-cover border border-[#e5e8eb]"
                                    />
                                    <div className="absolute inset-0 rounded-full ring-1 ring-black/5" />
                                  </div>
                                  <span
                                    className={`text-base font-bold transition-colors ${
                                      selectedCountry.code === country.code
                                        ? 'text-brand-600'
                                        : 'text-[#191f28] group-hover:text-brand-600'
                                    }`}
                                  >
                                    {country.name}
                                  </span>
                                </div>
                                <span
                                  className={`text-sm font-bold ${
                                    selectedCountry.code === country.code
                                      ? 'text-brand-500'
                                      : 'text-[#8b95a1] group-hover:text-brand-400'
                                  }`}
                                >
                                  {country.currency}
                                </span>
                              </button>
                            ))}

                            {/* Divider */}
                            <div className="my-2 mx-4 border-t border-gray-100" />

                            {/* All Other Countries */}
                            <div className="px-4 py-2 mb-1">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Countries</span>
                            </div>
                            {OTHER_COUNTRIES.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowDropdown(false);
                                }}
                                className={`w-full px-5 py-3.5 flex items-center justify-between hover:bg-[#e8f3ff] rounded-2xl transition-all duration-200 group mb-1 ${
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
                                      className="w-9 h-9 rounded-full shadow-sm object-cover border border-[#e5e8eb]"
                                    />
                                    <div className="absolute inset-0 rounded-full ring-1 ring-black/5" />
                                  </div>
                                  <span
                                    className={`text-base font-bold transition-colors ${
                                      selectedCountry.code === country.code
                                        ? 'text-brand-600'
                                        : 'text-[#191f28] group-hover:text-brand-600'
                                    }`}
                                  >
                                    {country.name}
                                  </span>
                                </div>
                                <span
                                  className={`text-sm font-bold ${
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
                      <label className="block text-base font-bold text-gray-600 mb-3 ml-1">
                        {t('form.label_amount')}
                      </label>
                      <div
                        className={`relative h-12 sm:h-14 bg-[#f2f4f6] rounded-xl hover:bg-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500 transition-all duration-200 px-4 sm:px-5 flex items-center gap-2 border-0 shadow-sm hover:shadow-toss ${
                          shakeInput ? 'animate-shake' : ''
                        }`}
                      >
                        <input
                          type="text"
                          value={formattedAmount}
                          onChange={handleAmountChange}
                          placeholder={t('form.placeholder_amount')}
                          className="flex-1 bg-transparent text-lg sm:text-xl font-bold text-gray-900 text-right focus:outline-none placeholder-gray-400 border-0"
                          aria-label={t('form.aria_amount_label', 'Amount to send in KRW')}
                        />
                        <span className="text-base sm:text-lg font-bold text-gray-500">KRW</span>
                      </div>
                      <p className="mt-3 text-sm sm:text-base text-gray-500 font-medium ml-1">
                        {t('form.validation_minmax')}
                      </p>
                    </div>

                    {/* Submit Button - Toss Style */}
                    <button
                      type="submit"
                      className="w-full sm:w-full max-w-xl h-12 sm:h-14 bg-[#2D8CFF] hover:bg-[#1A75FF] text-white font-semibold text-base sm:text-lg rounded-xl shadow-[0_4px_12px_rgba(45,140,255,0.35)] transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      {t('form.submit')}
                    </button>

                    <p className="text-center text-sm sm:text-base text-gray-500 font-medium">
                      {t('form.disclaimer')}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials Section */}
        <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto safe-px sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {t('social_proof.title', 'Trusted by thousands sending money home')}
              </h2>
              <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-brand-600">15,000+</div>
                  <div className="text-sm text-gray-500 font-medium">{t('social_proof.users_label', 'users trust RemitBuddy')}</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-brand-600">50,000+</div>
                  <div className="text-sm text-gray-500 font-medium">{t('social_proof.comparisons_label', 'comparisons made')}</div>
                </div>
              </div>
            </div>

            {/* Testimonial Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{t('social_proof.testimonial_1_text', 'I used to check 5 different apps before sending money. Now I just use RemitBuddy and save time and money.')}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">K</div>
                  <div>
                    <div className="font-semibold text-gray-900">{t('social_proof.testimonial_1_author', 'Kim S.')}</div>
                    <div className="text-sm text-gray-500">{t('social_proof.testimonial_1_role', 'Sends to Vietnam monthly')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{t('social_proof.testimonial_2_text', 'Found out I was overpaying ₩40,000 every transfer. RemitBuddy showed me the better option instantly.')}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 font-bold">P</div>
                  <div>
                    <div className="font-semibold text-gray-900">{t('social_proof.testimonial_2_author', 'Park J.')}</div>
                    <div className="text-sm text-gray-500">{t('social_proof.testimonial_2_role', 'Sends to Philippines')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{t('social_proof.testimonial_3_text', 'Simple, fast, and actually works. The comparison results are always accurate.')}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">L</div>
                  <div>
                    <div className="font-semibold text-gray-900">{t('social_proof.testimonial_3_author', 'Lee M.')}</div>
                    <div className="text-sm text-gray-500">{t('social_proof.testimonial_3_role', 'Sends to Nepal')}</div>
                  </div>
                </div>
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
                view={resultsView}
                onViewChange={setResultsView}
                onSaveCorridor={handleSaveCorridor}
                isCorridorSaved={isCorridorSaved}
              />

              {/* Rate Alert Card - Show after results */}
              {showRateAlert && (
                <div className="mt-10 max-w-2xl mx-auto">
                  <RateAlertCard
                    country={queryParams.receive_country}
                    onClose={() => setShowRateAlert(false)}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Educational Content Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto safe-px sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {t('education.title', 'Understanding Remittance')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('education.subtitle', 'Make smarter decisions with these quick tips')}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Tip 1 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('education.tip1_title', 'Exchange Rate vs. Fee')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('education.tip1_desc', 'A great exchange rate can be offset by high fees. Always compare the total amount received.')}
                </p>
              </div>

              {/* Tip 2 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('education.tip2_title', 'Best Time to Send')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('education.tip2_desc', 'Rates fluctuate throughout the day. Major news events can cause significant swings.')}
                </p>
              </div>

              {/* Tip 3 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('education.tip3_title', 'Transfer Speed')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('education.tip3_desc', 'Faster transfers often cost more. If you can wait 1-2 days, you might get better rates.')}
                </p>
              </div>

              {/* Tip 4 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('education.tip4_title', 'Hidden Fees to Watch')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('education.tip4_desc', 'Some providers charge receiving bank fees. RemitBuddy shows the true total.')}
                </p>
              </div>
            </div>
          </div>
        </section>

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

              {/* Transparency FAQ - How we make money */}
              <div className="bg-gradient-to-r from-blue-50 to-brand-50 rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{t('faq.q3_title')}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      {t('faq.q3_desc')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-gray-150">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t('faq.q4_title')}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {t('faq.q4_desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-toss hover:shadow-toss-lg transition-all duration-300 border border-gray-150">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t('faq.q5_title')}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {t('faq.q5_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Enhanced Toss Style */}
        <Footer />
      </div>

      {/* Floating CTA for Mobile - Shows when scrolled past hero */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-all duration-300 transform ${
          showFloatingCTA ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] safe-px py-3">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {t('form.submit', 'Show Me the Best Rates')}
          </button>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

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
