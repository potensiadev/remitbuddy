import React from 'react';
import { useTranslation } from 'next-i18next';
import { useLayoutMode } from '../hooks/useLayoutMode';

// Provider logo mapping
const PROVIDER_LOGO_MAP: Record<string, string | null> = {
  'Hanpass': '/logos/hanpass.png',
  'GmoneyTrans': '/logos/gmoneytrans.png',
  'E9Pay': '/logos/e9pay.png',
  'Finshot': null,
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

interface ProviderData {
  provider: string;
  recipient_gets: number;
  exchange_rate: number;
  fee: number;
  link: string;
}

interface ResultsViewProps {
  data: ProviderData[];
  loading: boolean;
  error?: string | null;
  amount: string;
  currency: string;
  country: string;
  onProviderClick?: (provider: string, link: string) => void;
}

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="space-y-3">
      <div>
        <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
        <div className="h-6 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

// Provider Card Component
const ProviderCard = ({ 
  providerData, 
  isBest, 
  currency, 
  onProviderClick 
}: { 
  providerData: ProviderData;
  isBest: boolean;
  currency: string;
  onProviderClick: (provider: string) => void;
}) => {
  const { t } = useTranslation('common');
  const { provider, recipient_gets, exchange_rate, fee } = providerData;
  
  // Normalize provider names for display
  const displayName = provider === 'JP Remit' ? 'JRF' : 
                     provider === 'The Moin' ? 'Moin' : provider;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onProviderClick(provider);
    window.open(providerData.link, '_blank', 'noopener,noreferrer');
  };

  // Calculate fee in target currency
  const feeInTargetCurrency = fee * exchange_rate;
  const formattedFeeInTarget = Math.round(feeInTargetCurrency).toLocaleString('en-US');
  const formattedFeeInKRW = fee.toLocaleString('en-US');
  
  return (
    <div 
      className={`bg-white rounded-xl border transition-all hover:shadow-lg cursor-pointer ${
        isBest 
          ? 'border-green-300 ring-2 ring-green-100 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {PROVIDER_LOGO_MAP[provider] ? (
                <img 
                  src={PROVIDER_LOGO_MAP[provider]!} 
                  alt={`${provider} logo`} 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement!;
                    parent.innerHTML = `<span class="text-xs font-semibold text-gray-600">${displayName.charAt(0)}</span>`;
                  }}
                />
              ) : (
                <span className="text-xs font-semibold text-gray-600">
                  {displayName.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{displayName}</div>
              {isBest && (
                <div className="text-xs text-green-600 font-medium">
                  {t('most_amount_receive') || 'Best Rate'}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">
              {t('amount_to_receive') || 'You get'}
            </div>
            <div className="font-bold text-lg text-gray-900">
              {Math.round(recipient_gets).toLocaleString('en-US')}
              <span className="text-sm ml-1 text-gray-600">{currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs mb-1">
              {t('exchange_rate') || 'Exchange Rate'}
            </div>
            <div className="font-medium text-gray-900">
              1 {currency.toUpperCase()} = {(1 / exchange_rate).toFixed(4)} KRW
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">
              {t('fee') || 'Fee'}
            </div>
            <div className="font-medium text-gray-900">
              {formattedFeeInTarget} {currency}
              <div className="text-xs text-gray-500">
                ({formattedFeeInKRW} KRW)
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-center text-blue-600 font-medium text-sm">
            <span>{t('provider_cta') || 'Send with'} {displayName}</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ResultsView({
  data,
  loading,
  error,
  amount,
  currency,
  country,
  onProviderClick
}: ResultsViewProps) {
  const { t } = useTranslation('common');
  const layoutMode = useLayoutMode();

  const handleProviderClick = (provider: string) => {
    if (onProviderClick) {
      // Find the provider data to get the link
      const providerData = data.find(p => p.provider === provider);
      if (providerData) {
        onProviderClick(provider, providerData.link);
      }
    }
  };

  const bestRateProvider = data && data.length > 0 ? data[0] : null;

  // Get grid classes based on layout mode
  const getGridClasses = () => {
    if (layoutMode === 'desktop') {
      return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4';
    }
    return 'grid grid-cols-1 gap-4';
  };

  return (
    <div 
      className="space-y-6"
      role="region" 
      aria-label="Remittance comparison results"
      aria-live="polite"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t('real_time_summary') || 'Real-time Comparison Results'}
        </h2>
        <div className="text-gray-600">
          <span className="font-semibold">
            {parseInt(amount).toLocaleString()} KRW
          </span>
          {' → '}
          <span className="font-semibold">
            {country}
          </span>
        </div>
        {loading && (
          <div className="mt-2 text-sm text-blue-600">
            {t('loading_text') || 'Loading latest rates...'}
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div 
          className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
          role="alert"
        >
          <div className="text-red-600 font-medium mb-2">
            {t('error_title') || 'Unable to load rates'}
          </div>
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('refresh') || 'Try Again'}
          </button>
        </div>
      )}

      {/* Results Grid */}
      <div className={getGridClasses()}>
        {loading ? (
          // Skeleton loading state
          Array(6).fill(0).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))
        ) : data && data.length > 0 ? (
          // Actual results
          data.map((provider, index) => (
            <ProviderCard 
              key={`${provider.provider}-${index}`}
              providerData={provider} 
              isBest={bestRateProvider?.provider === provider.provider}
              currency={currency}
              onProviderClick={handleProviderClick}
            />
          ))
        ) : !error && (
          // No results state
          <div className="col-span-full text-center py-8">
            <div className="text-gray-400 text-lg mb-2">📊</div>
            <div className="text-gray-600">
              {t('no_results') || 'No rates available at the moment'}
            </div>
          </div>
        )}
      </div>

      {/* Last Updated */}
      {data && data.length > 0 && !loading && (
        <div className="text-center text-xs text-gray-500">
          {t('last_updated') || 'Last updated:'} {new Date().toLocaleString('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })} KST
        </div>
      )}
    </div>
  );
}