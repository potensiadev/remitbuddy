import React from 'react';

// Arrow Right Icon
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

interface ProviderCardProps {
  provider: {
    name: string;
    recipientGet: string;
    youPay: string;
    fee: string;
    exchangeRate: string;
    isBest?: boolean;
    link: string;
  };
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  return (
    <div className="bg-white border border-gray-border rounded-2xl p-5 lg:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-primary mb-3 lg:mb-4">
            {provider.name}
          </h3>
          <div className="grid grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-2">
            <span className="text-sm font-medium text-gray-secondary">Recipient Get</span>
            <span className="text-right text-base font-semibold text-gray-primary">
              {provider.recipientGet}
            </span>
            <span className="text-sm font-medium text-gray-secondary">You Pay</span>
            <span className="text-right text-base font-semibold text-gray-primary">
              {provider.youPay}
            </span>
            <span className="text-sm font-medium text-gray-secondary">Fee</span>
            <span className="text-right text-base font-semibold text-gray-primary">
              {provider.fee}
            </span>
            <span className="text-sm font-medium text-gray-secondary">Exchange Rate</span>
            <span className="text-right text-sm text-gray-secondary">
              {provider.exchangeRate}
            </span>
          </div>
        </div>
        <button className="mt-4 lg:mt-0 lg:ml-6 px-5 lg:px-6 py-3 bg-gray-button text-white font-bold rounded-lg hover:bg-[#4B5563] transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
          Go to {provider.name}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;
