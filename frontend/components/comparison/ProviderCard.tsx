import React from 'react';
import { useTranslation } from 'next-i18next';
import { Quote } from '../../types';

interface ProviderCardProps {
  provider: Quote;
  isBest: boolean;
  index: number;
  onProviderClick: () => void;
  bestAmount: number;
  worstAmount: number;
  sendAmount: string | number;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  isBest,
  index,
  onProviderClick,
  bestAmount,
  worstAmount,
  sendAmount
}) => {
  const { t } = useTranslation('common');

  const displayName =
    provider.provider === 'JP Remit' ? 'JRF' : provider.provider === 'The Moin' ? 'Moin' : provider.provider;

  const formattedFeeInKRW = provider.fee.toLocaleString('en-US');

  return (
    <div
      className={`relative w-full rounded-2xl transition-all duration-300 md:mb-6 mb-3 ${isBest
        ? 'bg-white border-2 border-blue-500 shadow-xl z-10 mt-6 md:mt-0'
        : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
        } animate-fade-in-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Best Rate Badge - Tab Style */}
      {isBest && (
        <>
          <div className="absolute -top-8 left-[-2px] bg-blue-500 text-white px-6 py-1.5 rounded-t-xl font-bold text-sm shadow-sm md:flex hidden">
            {t('provider.best_rate_badge')}
          </div>
          <div className="absolute -top-6 left-0 right-0 bg-blue-500 text-white py-1 rounded-t-lg font-bold text-xs text-center shadow-sm flex md:hidden justify-center h-6 items-center">
            {t('provider.best_rate_badge')}
          </div>
        </>
      )}

      <div className="p-3.5 sm:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">

        {/* 1. Identity Column */}
        <div className="flex flex-col items-center justify-center md:w-[15%] md:min-h-full gap-0.5 md:gap-2 pt-1 md:pt-0">
          <h3 className={`font-black text-lg md:text-2xl ${isBest ? 'text-blue-600' : 'text-slate-700'}`}>
            {displayName}
          </h3>
        </div>

        {/* 2. Data Grid - The Core Info */}
        <div className="w-full md:w-[60%] grid grid-cols-1 gap-y-1.5 md:gap-y-3 pl-0 md:pl-8 md:border-l md:border-gray-100 border-t border-gray-100 md:border-t-0 pt-3 md:pt-0">

          {/* Row 1: Recipient Gets (Hero) */}
          <div className="flex justify-between items-center">
            <span className={`text-xs md:text-sm font-bold ${isBest ? 'text-blue-600' : 'text-gray-600'}`}>
              {t('provider.recipient_gets')}
            </span>
            <span className={`text-lg md:text-2xl font-black ${isBest ? 'text-blue-600' : 'text-slate-800'}`}>
              {provider.recipient_gets.toLocaleString('en-US', { maximumFractionDigits: 0 })} {provider.currency}
            </span>
          </div>

          {/* Row 2: You Pay */}
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-gray-400 font-medium">{t('provider.you_pay')}</span>
            <span className="text-gray-600 font-bold">
              {parseInt(String(sendAmount) || '0', 10).toLocaleString()} KRW
            </span>
          </div>

          {/* Row 3: Fee */}
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-gray-400 font-medium">{t('provider.fee')}</span>
            <span className="text-gray-600 font-bold">
              {formattedFeeInKRW === '0' ? '0 KRW' : `${formattedFeeInKRW} KRW`}
            </span>
          </div>

          {/* Row 4: Exchange Rate */}
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-gray-400 font-medium">{t('provider.exchange_rate')}</span>
            <span className="text-gray-500 font-medium">
              1 {provider.currency} = {(1 / provider.exchange_rate).toFixed(2)} KRW
            </span>
          </div>
        </div>

        {/* 3. CTA Column */}
        <div className="w-full md:w-[25%] flex justify-end items-center pt-1 md:pt-0">
          <a
            href={provider.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onProviderClick}
            className={`flex items-center justify-center gap-2 w-full py-2.5 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all transform active:scale-95
              ${isBest
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                : 'bg-white border-2 border-slate-800 text-slate-800 hover:bg-slate-50'
              }`}
          >
            {t('provider.go_to', { provider: displayName })}
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

      </div>

      {/* Regulatory Disclaimer - Financial Compliance */}
      <div className="px-4 pb-3 pt-0 md:px-5 md:pb-4 md:pt-0">
        <p className="text-[10px] text-gray-300 md:text-gray-400 text-center md:text-right leading-tight tracking-tight">
          {t('provider.disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default ProviderCard;
