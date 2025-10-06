import React from 'react';
import { useTranslation } from 'next-i18next';

export default function Hero() {
  const { t } = useTranslation('common');

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* 리디자인 포인트: Poppins 폰트, 중앙 정렬, brand 색상 강조 */}
        <h1 className="font-poppins text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          <span className="text-brand">One Click</span> to Compare<br />
          Fees and Amount
        </h1>
        
        <p className="font-poppins text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Find the Best Exchange Rates in 3 Seconds
        </p>
        
        {/* 리디자인 포인트: Clean하고 Minimal한 디자인, Trustworthy한 느낌 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">Best Rates</h3>
            <p className="font-poppins text-gray-600 text-center">Compare rates from 9+ trusted providers instantly</p>
          </div>
          
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">3 Seconds</h3>
            <p className="font-poppins text-gray-600 text-center">Get real-time comparison results lightning fast</p>
          </div>
          
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">Trusted</h3>
            <p className="font-poppins text-gray-600 text-center">100% secure comparison with licensed providers</p>
          </div>
        </div>
        
        {/* 리디자인 포인트: Accessible한 디자인 */}
        <div className="mt-16 text-center">
          <p className="font-poppins text-sm text-gray-500">
            Trusted by thousands of remitters across Korea
          </p>
          <div className="flex justify-center items-center mt-4 space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="font-poppins text-sm text-gray-600 ml-2">4.9/5 from 2,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}