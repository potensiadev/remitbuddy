import React from 'react';
import { useTranslation } from 'next-i18next';
import { PROVIDER_LOGO_MAP } from '../../lib/constants';
import { SparklesIcon } from './Icons';

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

  // Calculate comparison bar percentage (relative to best)
  const range = bestAmount - worstAmount;
  const barPercentage = range > 0
    ? Math.round(((provider.recipient_gets - worstAmount) / range) * 100)
    : 100;

  // Calculate difference from best
  const diffFromBest = bestAmount - provider.recipient_gets;

  // Premium card styles using design system
  const cardStyles = isBest
    ? 'border-2 border-accent-400 bg-gradient-to-br from-accent-50 via-white to-accent-50/30 shadow-card-best'
    : 'border border-neutral-200 bg-white shadow-card hover:shadow-card-hover hover:border-neutral-300 hover:-translate-y-0.5';

  return (
    <div
      className={`relative block w-full rounded-2xl transition-all duration-300 overflow-hidden ${cardStyles} animate-fade-in-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Best Deal Banner - Premium gradient */}
      {isBest && (
        <div className="bg-gradient-to-r from-accent-600 via-accent-500 to-accent-600 px-4 py-2.5 flex items-center justify-center gap-2">
          <SparklesIcon />
          <span className="text-white font-bold text-sm tracking-wide">{t('results.best_choice', 'Best Choice')} — {t('results.you_receive', 'Your recipient gets the most')}</span>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Provider Info Row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {PROVIDER_LOGO_MAP[provider.provider] ? (
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-50 border border-neutral-100 p-1.5 flex items-center justify-center shadow-sm">
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
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-base sm:text-lg font-bold text-white shadow-primary-sm">
                {displayName.charAt(0)}
              </div>
            )}
            <div>
              <span className="text-base sm:text-lg font-bold text-neutral-900">{displayName}</span>
              <span
                className={`ml-2 inline-flex items-center rounded-full text-xs font-bold px-2.5 py-0.5 ${isBest ? 'bg-accent-100 text-accent-700' : 'bg-neutral-100 text-neutral-500'
                  }`}
              >
                #{index + 1}
              </span>
            </div>
          </div>
        </div>

        {/* HERO METRIC - Amount Received */}
        <div
          className={`rounded-xl px-5 py-5 sm:px-6 sm:py-6 mb-5 text-center ${isBest
              ? 'bg-gradient-to-br from-accent-50 to-accent-100/50 border border-accent-200'
              : 'bg-neutral-50 border border-neutral-100'
            }`}
        >
          <div className="text-xs sm:text-sm font-bold text-neutral-500 mb-2 uppercase tracking-wider">
            {t('provider.recipient_gets', 'Recipient Gets')}
          </div>
          <div className="flex items-baseline justify-center gap-2">
            <span
              className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-money ${isBest ? 'text-accent-600' : 'text-neutral-900'
                }`}
            >
              {provider.recipient_gets.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </span>
            <span className={`text-base sm:text-lg font-bold ${isBest ? 'text-accent-400' : 'text-neutral-400'}`}>
              {provider.currency}
            </span>
          </div>

          {/* Visual Comparison Bar - Premium gradient */}
          <div className="mt-4">
            <div className="h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${isBest
                    ? 'bg-gradient-to-r from-accent-500 via-accent-400 to-accent-500'
                    : 'bg-gradient-to-r from-neutral-400 to-neutral-300'
                  }`}
                style={{ width: `${barPercentage}%` }}
              />
            </div>
            {!isBest && diffFromBest > 0 && (
              <div className="mt-2.5 text-xs font-semibold text-error-500 flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                {diffFromBest.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {provider.currency} less than best
              </div>
            )}
            {isBest && (
              <div className="mt-2.5 text-xs font-bold text-accent-600 flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Best rate available
              </div>
            )}
          </div>
        </div>

        {/* Secondary Info - Rate & Fee */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm text-neutral-500 mb-5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{t('provider.exchange_rate', 'Rate')}:</span>
            <span className="font-bold text-neutral-700">{formattedRate}</span>
            {isBest && (
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Best
              </span>
            )}
          </div>
          <div className="w-px h-4 bg-neutral-200" />
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{t('provider.fee', 'Fee')}:</span>
            <span className="font-bold text-neutral-700">₩{formattedFeeInKRW}</span>
          </div>
        </div>

        {/* CTA Button - Premium styling */}
        <a
          href={provider.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onProviderClick}
          className={`flex w-full items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${isBest
              ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-accent hover:shadow-accent-lg'
              : 'bg-gradient-to-r from-neutral-800 to-neutral-900 text-white hover:from-neutral-900 hover:to-black shadow-lg hover:shadow-xl'
            }`}
        >
          {t('provider.cta', 'Send with {{provider}}').replace('{{provider}}', displayName)}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ProviderCard;
