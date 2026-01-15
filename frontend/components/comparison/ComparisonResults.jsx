import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import {
  logClickedProvider,
  logResultsImpression,
  logResultsScroll
} from '../../utils/analytics';

import ProviderCard from './ProviderCard';
import ResultsTable from './ResultsTable';
import RateChart from './RateChart';
import ViewToggle from './ViewToggle';
import SaveCorridorButton from './SaveCorridorButton';
import ShareButton from './ShareButton';
import ResultsSkeleton from './ResultsSkeleton';
import { ClockIcon } from '../icons';

/**
 * ComparisonResults Component
 *
 * Main comparison results display with API integration
 * Supports both card and table view modes
 */
function ComparisonResults({
  queryParams,
  amount,
  forceRefresh,
  onCompareAgain,
  apiBaseUrl,
  isAutoScrolling,
  view,
  onViewChange,
  onSaveCorridor,
  isCorridorSaved,
  countryData // New: passed from compare page for sharing
}) {
  const { t } = useTranslation('common');

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      {/* Header Section */}
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

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <button
            onClick={onCompareAgain}
            className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-2xl text-base sm:text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('results.compare_again')}
          </button>

          {/* Share Button */}
          {countryData && (
            <ShareButton
              country={countryData.name}
              amount={amount}
              currency={queryParams.receive_currency}
              savings={savings}
            />
          )}
        </div>
      </div>

      {/* Loading State - Using ResultsSkeleton */}
      {isLoading && (
        <ResultsSkeleton
          count={4}
          view={view}
          showHeader={false}
        />
      )}

      {/* Error State */}
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

      {/* Results */}
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
              <ViewToggle view={view} onViewChange={onViewChange} />
            </div>

            {/* Actions Row */}
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

          {/* Rate Chart */}
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

export default ComparisonResults;
