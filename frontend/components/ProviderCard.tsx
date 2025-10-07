import React from 'react';

interface ProviderCardProps {
  name: string;
  receivedAmount: number;
  exchangeRate: number;
  fee: number;
  isRecommended?: boolean;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ 
  name,
  receivedAmount,
  exchangeRate,
  fee,
  isRecommended = false
}) => {
  return (
    <div className={`
      bg-white border-2 rounded-2xl p-6 transition-all duration-300
      ${isRecommended 
        ? 'border-[#00D26A] bg-[#E8F9F0] shadow-lg' 
        : 'border-[#E5E7EB] hover:shadow-md'
      }
    `}>
      {/* Best Rate Badge */}
      {isRecommended && (
        <div className="mb-4">
          <span className="inline-block bg-[#00D26A] text-white text-xs font-bold px-3 py-1 rounded-full">
            Best Rate Provider
          </span>
        </div>
      )}

      {/* Provider Name */}
      <h3 className="text-xl font-semibold text-[#1F2937] mb-4">
        {name}
      </h3>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6">
        <span className="text-sm font-medium text-[#6B7280]">Recipient Get</span>
        <span className="text-right text-base font-semibold text-[#1F2937]">
          {receivedAmount.toLocaleString()}
        </span>

        <span className="text-sm font-medium text-[#6B7280]">Fee</span>
        <span className="text-right text-base font-semibold text-[#1F2937]">
          {fee.toLocaleString()}
        </span>

        <span className="text-sm font-medium text-[#6B7280]">Exchange Rate</span>
        <span className="text-right text-sm text-[#6B7280]">
          {exchangeRate.toFixed(4)}
        </span>
      </div>

      {/* CTA Button */}
      <button 
        className={`
          w-full py-3 font-bold rounded-lg transition-colors flex items-center justify-center gap-2
          ${isRecommended
            ? 'bg-[#00D26A] text-white hover:bg-[#00BD5F]'
            : 'bg-[#6B7280] text-white hover:bg-[#4B5563]'
          }
        `}
      >
        Go to {name}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ProviderCard;