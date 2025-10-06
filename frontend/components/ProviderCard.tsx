import React from 'react';

interface ProviderCardProps {
  name: string;
  exchangeRate: number;
  fee: number;
  receivedAmount: number;
  isRecommended?: boolean;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  name,
  exchangeRate,
  fee,
  receivedAmount,
  isRecommended = false,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-6 relative ${
        isRecommended ? 'ring-2 ring-brand' : ''
      }`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-brand text-white font-poppins font-semibold text-xs px-4 py-1 rounded-full">
            Recommended
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-poppins font-bold text-xl text-[#0A0A0A]">{name}</h3>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-poppins text-sm text-gray-600">Exchange Rate:</span>
          <span className="font-poppins font-semibold text-[#0A0A0A]">
            {exchangeRate.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-poppins text-sm text-gray-600">Transfer Fee:</span>
          <span className="font-poppins font-semibold text-[#0A0A0A]">
            ₩{fee.toLocaleString()}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="font-poppins text-sm font-medium text-gray-700">
              You Receive:
            </span>
            <span className="font-poppins font-bold text-lg text-brand">
              {receivedAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button className="w-full bg-brand hover:bg-green-500 text-white font-poppins font-semibold py-3 rounded-xl transition-colors duration-200">
        Choose {name}
      </button>
    </div>
  );
};

export default ProviderCard;
