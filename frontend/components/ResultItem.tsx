import React from 'react';
import { useTranslation } from 'next-i18next';

// Provider logo mapping
const PROVIDER_LOGO_MAP: { [key: string]: string | null } = {
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

interface ResultItemProps {
  provider: {
    provider: string;
    recipient_gets: number;
    exchange_rate: number;
    fee: number;
    link: string;
  };
  isBest: boolean;
  currency: string;
  amount: string;
  receiveCountry: string;
}

export default function ResultItem({ 
  provider, 
  isBest, 
  currency, 
  amount, 
  receiveCountry 
}: ResultItemProps) {
  const { t } = useTranslation('common');
  
  // Normalize provider names for display
  const displayName = provider.provider === 'JP Remit' ? 'JRF' : 
                     provider.provider === 'The Moin' ? 'Moin' : provider.provider;

  // Calculate fee in target currency
  const feeInTargetCurrency = provider.fee * provider.exchange_rate;
  const formattedFeeInTarget = Math.round(feeInTargetCurrency).toLocaleString('en-US');
  const formattedFeeInKRW = provider.fee.toLocaleString('en-US');

  const handleClick = () => {
    // Analytics tracking would go here
    window.open(provider.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`
        relative bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-lg transform hover:-translate-y-1
        ${isBest 
          ? 'border-brand bg-gradient-to-br from-green-50 to-white shadow-lg shadow-green-100' 
          : 'border-gray-200 hover:border-brand/50'
        }
      `}
      onClick={handleClick}
    >
      {/* 리디자인 포인트: "Best Rate Provider" 배지 */}
      {isBest && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-brand text-white font-poppins font-bold text-xs px-4 py-1 rounded-full shadow-lg">
            🏆 Best Rate Provider
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Provider Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Provider Logo */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {PROVIDER_LOGO_MAP[provider.provider] ? (
                <img 
                  src={PROVIDER_LOGO_MAP[provider.provider]!} 
                  alt={`${provider.provider} logo`} 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        ${displayName.charAt(0)}
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-poppins font-bold text-lg">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Provider Name */}
            <div>
              <h3 className="font-poppins font-bold text-lg text-gray-900">
                {displayName}
              </h3>
              <p className="font-poppins text-sm text-gray-500">
                Licensed Provider
              </p>
            </div>
          </div>
        </div>

        {/* 리디자인 포인트: 수령 금액 강조 표시 */}
        <div className="mb-4">
          <p className="font-poppins text-sm text-gray-600 mb-1">You will receive</p>
          <div className="flex items-baseline space-x-2">
            <span className={`font-poppins font-bold text-2xl ${isBest ? 'text-brand' : 'text-gray-900'}`}>
              {Math.round(provider.recipient_gets).toLocaleString('en-US')}
            </span>
            <span className="font-poppins font-semibold text-lg text-gray-600">
              {currency.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Exchange Rate & Fee */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-poppins text-sm text-gray-600">Exchange Rate</span>
            <span className="font-poppins text-sm font-semibold text-gray-900">
              1 {currency.toUpperCase()} = {(1 / provider.exchange_rate).toFixed(4)} KRW
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-poppins text-sm text-gray-600">Transfer Fee</span>
            <span className="font-poppins text-sm font-semibold text-gray-900">
              {formattedFeeInTarget} {currency} ({formattedFeeInKRW} KRW)
            </span>
          </div>
        </div>

        {/* 리디자인 포인트: "Go to {provider}" 버튼 */}
        <button 
          className={`
            w-full py-3 px-4 rounded-lg font-poppins font-semibold text-sm transition-all duration-200 
            ${isBest 
              ? 'bg-brand text-white hover:bg-green-600 shadow-md hover:shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-brand hover:text-white group-hover:bg-brand group-hover:text-white'
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Go to {displayName} →
        </button>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
    </div>
  );
}