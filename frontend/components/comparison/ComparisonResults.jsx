import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { logClickedProvider, logResultsImpression, logResultsScroll } from '../../utils/analytics';
import { ClockIcon } from './Icons';
import ProviderCard from './ProviderCard';
import { SavedCorridors, SaveCorridorButton } from './SavedCorridors';
import { ViewToggle, ResultsTable } from './ResultsTable';
import RateChart from './RateChart';

export default function ComparisonResults({
  queryParams,
  amount,
  forceRefresh,
  onCompareAgain,
  apiBaseUrl,
  isAutoScrolling,
  view,
  onViewChange,
  onSaveCorridor,
  isCorridorSaved
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
      <div className="mb-8 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {t('results.title', {
            amount: formattedAmount,
            country: queryParams.receive_country
          })}
        </h2>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {snapshotTime && (
            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
              <ClockIcon />
              <span>{t('results.snapshot', { time: snapshotTime.split(' ')[1] })}</span>
            </div>
          )}
          {savings > 0 && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 font-medium">
              <span>Save {savings.toLocaleString()} {queryParams.receive_currency}</span>
            </div>
          )}
        </div>

        <button
          onClick={onCompareAgain}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors -ml-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('results.compare_again')}
        </button>
      </div>

      {isLoading && (
        <div className="text-left py-12 w-full">
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

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-left w-full">
          <h3 className="text-lg font-bold text-red-700 mb-2">Unavailable</h3>
          <p className="text-red-600 text-sm mb-4">
            {error.type === 'empty'
              ? t('results.error_empty')
              : t('results.error_api', { message: error.message })}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-bold text-red-700 hover:text-red-800 underline"
          >
            {t('results.retry')}
          </button>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
            <p className="text-gray-900 font-bold text-lg">
              {results.length} Providers Found
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              {t('results.ranking_explanation', 'Ranked by Recipient Gets')}
            </div>
          </div>

          {/* RateChart removed */}

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
}
