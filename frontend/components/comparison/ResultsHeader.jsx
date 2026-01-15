import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import ShareButton from './ShareButton';

/**
 * ResultsHeader Component
 *
 * Premium header section for comparison results page.
 * Design Philosophy: "Invisible Complexity, Visible Clarity"
 *
 * Displays country info, amount, last updated time, and share functionality
 * with Apple-inspired visual hierarchy and micro-interactions.
 */
export default function ResultsHeader({
  country,
  amount,
  lastUpdated,
  providerCount,
  savings,
  onBack,
  className = '',
}) {
  const { t } = useTranslation('common');

  // Format amount with Korean locale
  const formatAmount = (value) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? '0' : num.toLocaleString('ko-KR');
  };

  // Format relative time
  const formatLastUpdated = (date) => {
    if (!date) return t('results.just_now', '방금 전');
    const now = new Date();
    const updated = new Date(date);
    const diffMs = now - updated;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return t('results.just_now', '방금 전');
    if (diffMins < 60) return t('results.minutes_ago', '{{minutes}}분 전').replace('{{minutes}}', diffMins);
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return t('results.hours_ago', '{{hours}}시간 전').replace('{{hours}}', diffHours);
    return updated.toLocaleDateString('ko-KR');
  };

  // Generate share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/compare/${country?.slug}?amount=${amount}`
    : '';

  return (
    <header
      className={`
        bg-white rounded-2xl border border-neutral-200
        shadow-card overflow-hidden
        animate-fade-in-up
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {/* Main Header Content */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Side - Country Info */}
          <div className="flex items-center gap-4">
            {/* Back Button - Mobile Only */}
            {onBack && (
              <button
                onClick={onBack}
                className="
                  sm:hidden flex items-center justify-center
                  w-10 h-10 rounded-xl
                  bg-neutral-100 hover:bg-neutral-200
                  transition-all duration-200
                  active:scale-95
                "
                aria-label={t('nav.back', '뒤로 가기')}
              >
                <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Country Flag & Name */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative group">
                <img
                  src={country?.flag}
                  alt={country?.name}
                  className="
                    w-12 h-12 sm:w-14 sm:h-14
                    rounded-xl sm:rounded-2xl
                    object-cover
                    border-2 border-neutral-100
                    shadow-sm
                    transition-transform duration-200
                    group-hover:scale-105
                  "
                />
                {/* Currency Badge */}
                <span className="
                  absolute -bottom-1 -right-1
                  px-2 py-0.5
                  bg-primary-600 text-white
                  text-[10px] sm:text-xs font-bold
                  rounded-md shadow-sm
                ">
                  {country?.currency}
                </span>
              </div>
              <div>
                <h1 className="
                  text-lg sm:text-xl md:text-2xl
                  font-bold text-neutral-900
                  tracking-tight
                ">
                  {country?.nameKo || country?.name} {t('compare.title_suffix', '송금')}
                </h1>
                <p className="text-sm text-neutral-500 font-medium">
                  {t('compare.subtitle', '실시간 환율 비교')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Share */}
          <div className="flex items-center gap-3">
            <ShareButton
              country={country?.name}
              amount={amount}
              currency={country?.currency}
              savings={savings}
            />
          </div>
        </div>

        {/* Amount Display */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
          {/* Amount Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-baseline gap-2">
              <span className="
                text-2xl sm:text-3xl md:text-4xl
                font-black text-neutral-900
                tracking-tight font-money
              ">
                ₩{formatAmount(amount)}
              </span>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="
                text-xl sm:text-2xl md:text-3xl
                font-bold text-primary-600
              ">
                {country?.currency}
              </span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatLastUpdated(lastUpdated)}</span>
            </div>
            {providerCount > 0 && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>
                  {t('results.providers_compared', '{{count}}개 송금사 비교').replace('{{count}}', providerCount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Savings Tip Banner */}
      {savings > 0 ? (
        <div className="
          px-5 sm:px-6 py-3
          bg-gradient-to-r from-accent-50 to-accent-100
          border-t border-accent-200
        ">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">💰</span>
            <span className="text-accent-700 font-semibold">
              {t('results.savings_message', '최대 ₩{{savings}} 절약 가능!').replace('{{savings}}', savings.toLocaleString())}
            </span>
          </div>
        </div>
      ) : (
        <div className="
          px-5 sm:px-6 py-3
          bg-gradient-to-r from-primary-50 to-primary-100/50
          border-t border-primary-100
        ">
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-5 h-5 text-primary-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-primary-700 font-medium">
              {t('results.tip', '환율과 수수료를 비교해서 최대 절약하세요')}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}

ResultsHeader.propTypes = {
  country: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    nameKo: PropTypes.string,
    currency: PropTypes.string,
    flag: PropTypes.string,
    slug: PropTypes.string,
  }),
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  providerCount: PropTypes.number,
  savings: PropTypes.number,
  onBack: PropTypes.func,
  className: PropTypes.string,
};

ResultsHeader.defaultProps = {
  providerCount: 0,
  savings: 0,
  className: '',
};
