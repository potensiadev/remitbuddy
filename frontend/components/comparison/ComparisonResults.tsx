import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { trackEvent, ANALYTICS_EVENTS } from '../../utils/analytics';
import { ClockIcon } from './Icons';
import ProviderCard from './ProviderCard';
import { SavedCorridors, SaveCorridorButton } from './SavedCorridors';
import { ViewToggle, ResultsTable } from './ResultsTable';
import RateChart from './RateChart';
import { Quote, QueryParams } from '../../types';
import { useQuotes } from '../../hooks';

interface ComparisonResultsProps {
  queryParams: QueryParams;
  amount: string | number;
  forceRefresh: number;
  onCompareAgain: () => void;
  apiBaseUrl: string;
  isAutoScrolling?: boolean;
  view?: 'card' | 'table';
  onViewChange?: (view: 'card' | 'table') => void;
  onSaveCorridor?: () => void;
  isCorridorSaved?: boolean;
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  queryParams,
  amount,
  forceRefresh,
  onCompareAgain,
  apiBaseUrl,
  isAutoScrolling = false,
  view = 'card',
  onViewChange,
  onSaveCorridor,
  isCorridorSaved = false
}) => {
  const { t } = useTranslation('common');

  // Use React Query hook for data fetching
  const {
    results,
    bestProvider,
    worstProvider,
    savings,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt
  } = useQuotes({
    queryParams,
    amount,
    apiBaseUrl,
    enabled: Boolean(queryParams.receive_country)
  });

  const amountRef = useRef<string | number>(amount);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const [hasLoggedImpression, setHasLoggedImpression] = useState(false);
  const [hasLoggedScroll, setHasLoggedScroll] = useState(false);

  // Derive snapshot time from dataUpdatedAt
  const snapshotTime = useMemo(() => {
    if (!dataUpdatedAt) return null;
    const now = new Date(dataUpdatedAt);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }, [dataUpdatedAt]);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  // Reset analytics flags on query change
  useEffect(() => {
    setHasLoggedImpression(false);
    setHasLoggedScroll(false);
  }, [forceRefresh, queryParams.receive_country, queryParams.receive_currency, amount]);

  // Refetch when forceRefresh changes
  useEffect(() => {
    if (forceRefresh > 0) {
      refetch();
    }
  }, [forceRefresh, refetch]);

  const getAmountRange = (val: string | number): string => {
    const v = parseInt(String(val) || '0', 10);
    if (v < 100000) return '0-100k';
    if (v < 500000) return '100k-500k';
    if (v < 1000000) return '500k-1M';
    if (v < 3000000) return '1M-3M';
    return '3M+';
  };

  const handleProviderClick = (provider: Quote, index: number): void => {
    const amountVal = parseInt(String(amountRef.current) || '0', 10);
    trackEvent(ANALYTICS_EVENTS.CLICK_PROVIDER, {
      provider: provider.provider,
      rank: index + 1,
      corridor: `${queryParams.receive_country}-${queryParams.receive_currency}`,
      rate_offered: provider.exchange_rate,
      amount: amountVal,
      amount_range: getAmountRange(amountVal),
      recipient_gets: provider.recipient_gets,
      markup_spread: bestProvider ? (bestProvider.exchange_rate - provider.exchange_rate) : 0
    });
  };

  useEffect(() => {
    if (!isLoading && !isError && results.length > 0 && !hasLoggedImpression) {
      const amountVal = parseInt(String(amountRef.current) || '0', 10);
      trackEvent(ANALYTICS_EVENTS.VIEW_RESULTS, {
        provider_count: results.length,
        best_provider: bestProvider?.provider,
        amount: amountVal,
        amount_range: getAmountRange(amountVal),
        corridor: `${queryParams.receive_country}-${queryParams.receive_currency}`
      });
      setHasLoggedImpression(true);
    }
  }, [isLoading, isError, results.length, hasLoggedImpression, queryParams.receive_country, queryParams.receive_currency, bestProvider]);

  useEffect(() => {
    if (hasLoggedScroll || isLoading || isError || results.length === 0) return;

    const handleScroll = (): void => {
      if (hasLoggedScroll || isAutoScrolling) return;

      const sectionTop = resultsContainerRef.current?.offsetTop ?? 0;
      if (window.scrollY > sectionTop + 50) {
        setHasLoggedScroll(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [
    hasLoggedScroll,
    isAutoScrolling,
    isLoading,
    isError,
    results.length,
    queryParams.receive_country,
    queryParams.receive_currency,
    bestProvider?.provider
  ]);

  const formattedAmount = parseInt(String(amount) || '0', 10).toLocaleString();

  return (
    <div ref={resultsContainerRef} className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      {!isLoading && !isError && results.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-2 mb-6 text-center">
          <p className="text-gray-900 font-bold text-lg">
            {t('results.providers_found', { count: results.length })}
          </p>

          <div className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            {t('results.ranking_explanation')}
          </div>
        </div>
      )}

      {/* Ultra-Compact Summary Bar */}
      <div className="order-2 md:order-1 mb-4 md:mb-8 bg-gray-50/50 rounded-xl border border-gray-100 p-3 flex items-center justify-between gap-3">

        {/* Left: Info Group */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 overflow-hidden">
          {/* Amount Display */}
          <div className="flex items-baseline gap-1.5 flex-shrink-0">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider hidden sm:block">{t('results.sending')}</span>
            <span className="text-gray-900 text-lg sm:text-xl font-black">{formattedAmount}</span>
            <span className="text-gray-500 text-xs sm:text-sm font-bold">KRW</span>
            <span className="text-gray-400 text-xs sm:text-sm font-medium">{t('results.to_country', { country: queryParams.receive_country })}</span>
          </div>

          {/* Mini Badges */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {savings > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100/80 text-emerald-700 text-[10px] sm:text-xs font-bold whitespace-nowrap">
                {t('results.save_amount', { amount: savings.toLocaleString(), currency: queryParams.receive_currency })}
              </span>
            )}
            {snapshotTime && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                <ClockIcon className="w-3 h-3" />
                {snapshotTime.split(' ')[1]}
              </span>
            )}
          </div>
        </div>

        {/* Right: Minimal Action Button */}
        <button
          onClick={onCompareAgain}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all active:scale-95"
          aria-label={t('results.change_amount')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-12 w-full">
          <div className="inline-block relative mb-6">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-900 text-lg font-bold mb-1">
            {t('results.loading_title')}
          </p>
          <p className="text-gray-500 text-sm">
            {t('results.loading_sub')}
          </p>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-left w-full">
          <h3 className="text-lg font-bold text-red-700 mb-2">{t('results.unavailable')}</h3>
          <p className="text-red-600 text-sm mb-4">
            {error?.message?.includes('No providers')
              ? t('results.error_empty')
              : t('results.error_api', { message: error?.message })}
          </p>
          <button
            onClick={() => refetch()}
            className="text-sm font-bold text-red-700 hover:text-red-800 underline"
          >
            {t('results.retry')}
          </button>
        </div>
      )}

      {!isLoading && !isError && results.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
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
                  sendAmount={amount}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonResults;
