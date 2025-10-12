import React from 'react';
import { useTranslation } from 'next-i18next';
import ResultItem from './ResultItem';

interface ResultListProps {
  results: any[];
  isLoading: boolean;
  error: string | null;
  amount: string;
  currency: string;
  receiveCountry: string;
}

export default function ResultList({ 
  results, 
  isLoading, 
  error, 
  amount, 
  currency, 
  receiveCountry 
}: ResultListProps) {
  const { t } = useTranslation('common');

  // 로딩 스켈레톤 컴포넌트
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-32 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-36"></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12">
        {/* 리디자인 포인트: 로딩 헤더 */}
        <div className="text-center mb-8">
          <h2 className="font-poppins text-2xl font-bold text-gray-900 mb-2">
            Finding the Best Rates...
          </h2>
          <div className="flex items-center justify-center space-x-2 text-brand">
            <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="font-poppins text-gray-600 mt-2">
            {parseInt(amount).toLocaleString()} KRW → {receiveCountry}
          </p>
        </div>
        
        {/* 스켈레톤 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="font-poppins text-xl font-bold text-red-800 mb-2">
            Comparison Failed
          </h3>
          <p className="font-poppins text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white font-poppins font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-8a9 9 0 11-8 8" />
            </svg>
          </div>
          <h3 className="font-poppins text-xl font-bold text-gray-700 mb-2">
            No Results Found
          </h3>
          <p className="font-poppins text-gray-600">
            No exchange rate providers available for this destination.
          </p>
        </div>
      </div>
    );
  }

  // 최고 환율 제공업체 찾기
  const bestProvider = results[0];

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      {/* 리디자인 포인트: 결과 헤더 */}
      <div className="text-center mb-8">
        <h2 className="font-poppins text-2xl font-bold text-gray-900 mb-2">
          Compare Results
        </h2>
        <p className="font-poppins text-lg text-gray-600 mb-4">
          {parseInt(amount).toLocaleString()} KRW → {receiveCountry}
        </p>
        <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full font-poppins text-sm font-medium">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {results.length} providers found
        </div>
      </div>

      {/* 리디자인 포인트: 카드형 그리드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((provider, index) => (
          <ResultItem
            key={provider.provider}
            provider={provider}
            isBest={index === 0}
            currency={currency}
            amount={amount}
            receiveCountry={receiveCountry}
          />
        ))}
      </div>

      {/* 리디자인 포인트: 하단 정보 */}
      <div className="mt-12 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-poppins text-lg font-semibold text-blue-800">
              Important Information
            </h3>
          </div>
          <p className="font-poppins text-blue-700 text-sm leading-relaxed">
            Rates shown are estimates and may vary. Final rates are determined by each provider. 
            Please verify the exact amount before completing your transfer.
          </p>
        </div>
      </div>
    </div>
  );
}