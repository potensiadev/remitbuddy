import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600">RemitBuddy</Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">이용방법</Link>
              <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">특징</Link>
              <Link href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 md:px-6 md:py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm md:text-base">시작하기</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full max-w-full min-h-screen pt-20 md:pt-24 overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Circle - Desktop Only */}
        <div className="hidden md:block absolute top-20 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl -z-10" />
        <div className="hidden md:block absolute bottom-20 left-0 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl -z-10" />

        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
          {/* Hero Title & Subtitle */}
          <div className="text-center mb-12 md:mb-16 w-full max-w-3xl mx-auto px-2 sm:px-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mb-6 max-w-full">
              <span className="text-sm md:text-base text-blue-700 font-medium">안전하고 투명한 비교 서비스</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              해외송금 더 똑똑하게
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              10개의 해외송금 업체의 환율과 수수료를 단 3초만에 비교하고 최대 OO만원 절약하세요
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 md:mb-16 w-full max-w-4xl mx-auto">
            <div className="flex w-full items-center justify-start sm:justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm md:text-base text-gray-700 font-medium">실시간 환율 정보</span>
            </div>
            <div className="flex w-full items-center justify-start sm:justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm md:text-base text-gray-700 font-medium">숨은 수수료 없음</span>
            </div>
            <div className="flex w-full items-center justify-start sm:justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm md:text-base text-gray-700 font-medium">100% 무료 비교</span>
            </div>
          </div>

          {/* Key Stats Box */}
          <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-sm md:text-base text-gray-600">송금업체</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">10</div>
                <div className="text-sm md:text-base text-gray-600">개국 송금 가능</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">3초</div>
                <div className="text-sm md:text-base text-gray-600">비교 완료</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 text-center w-full">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-base md:text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">최저 환율 비교하기</button>
              <p className="mt-4 text-xs md:text-sm text-gray-500">비교는 무료이며 개인정보를 요구하지 않아요</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
