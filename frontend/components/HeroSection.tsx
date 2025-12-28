import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function HeroSection() {
  const { t } = useTranslation('common');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const MIN_AMOUNT = 10000;
  const MAX_AMOUNT = 5000000;

  const formatNumber = (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);

    if (value === '') {
      setError('');
      return;
    }

    const numValue = parseInt(value, 10);

    if (numValue < MIN_AMOUNT) {
      setError(t('heroSection.errors.min'));
    } else if (numValue > MAX_AMOUNT) {
      setError(t('heroSection.errors.max'));
    } else {
      setError('');
    }
  };

  const handleCompare = () => {
    if (amount === '') {
      setError(t('heroSection.errors.empty'));
      return;
    }

    const numValue = parseInt(amount, 10);
    if (numValue < MIN_AMOUNT || numValue > MAX_AMOUNT) {
      return;
    }

    // TODO: Navigate to comparison page or trigger comparison logic
    console.log('Comparing amount:', numValue);
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600">{t('brand.name')}</Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">{t('nav.service.about')}</Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">{t('nav.service.how')}</Link>
              <Link href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">{t('nav.service.faq')}</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 md:px-6 md:py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm md:text-base">{t('cta.start')}</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="relative w-full max-w-full min-h-screen pt-20 md:pt-24 overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Circle - Desktop Only */}
        <div className="hidden md:block absolute top-20 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl -z-10" />
        <div className="hidden md:block absolute bottom-20 left-0 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl -z-10" />

        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
          {/* Hero Title & Subtitle */}
          <div className="text-center mb-12 md:mb-16 w-full max-w-3xl mx-auto px-2 sm:px-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mb-6 max-w-full">
              <span className="text-sm md:text-base text-blue-700 font-medium">{t('heroSection.badge')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              {t('hero.title_line1')} {t('hero.title_line2')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              {t('heroSection.subtitle')}
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 md:mb-16 w-full max-w-4xl mx-auto">
            <div className="flex w-full items-center justify-start sm:justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm md:text-base text-gray-700 font-medium">{t('hero.trust_1')}</span>
            </div>
            <div className="flex w-full items-center justify-start sm:justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm md:text-base text-gray-700 font-medium">{t('hero.trust_2')}</span>
            </div>
            <div className="flex w-full items-center justify-start sm:justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm md:text-base text-gray-700 font-medium">{t('hero.trust_3')}</span>
            </div>
          </div>

          {/* Key Stats Box */}
          <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-sm md:text-base text-gray-600">{t('hero.stats_companies')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">10</div>
                <div className="text-sm md:text-base text-gray-600">{t('hero.stats_countries')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{t('heroSection.stats_seconds_value')}</div>
                <div className="text-sm md:text-base text-gray-600">{t('hero.stats_seconds')}</div>
              </div>
            </div>

            {/* Amount Input & CTA */}
            <div className="w-full flex flex-col items-center mt-6 sm:mt-8 space-y-5">
              {/* Amount Input Field */}
              <div className="w-full max-w-xl">
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2.5 ml-1">
                  {t('form.label_amount')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="amount"
                    value={formatNumber(amount)}
                    onChange={handleAmountChange}
                    placeholder={t('heroSection.amount_placeholder')}
                    className={`w-full h-16 sm:h-[4.5rem] px-5 pr-16 text-xl sm:text-2xl font-bold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      error
                        ? 'border-2 border-red-300 focus:border-red-400 focus:ring-red-200 bg-red-50/50 text-red-900 placeholder-red-300'
                        : 'border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-200 bg-white text-gray-900 placeholder-gray-400'
                    }`}
                  />
                  <span className={`absolute right-5 top-1/2 -translate-y-1/2 text-xl sm:text-2xl font-bold transition-colors ${
                    error ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {t('currency.krw_symbol')}
                  </span>
                </div>

                {/* Error Message with Icon */}
                {error && (
                  <div className="flex items-start gap-2.5 mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-red-700 leading-relaxed">{error}</p>
                  </div>
                )}

                {/* Helper Text (when no error) */}
                {!error && amount === '' && (
                  <p className="mt-3 text-sm text-gray-500 ml-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>{t('heroSection.helper_text')}</span>
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <div className="w-full flex justify-center items-center">
                <button
                  onClick={handleCompare}
                  disabled={!!error && amount !== ''}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    error && amount !== ''
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      : 'text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] focus:ring-blue-300'
                  }`}
                >
                  <span className="whitespace-nowrap">{t('form.submit')}</span>
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                    error && amount !== '' ? 'bg-gray-400/30' : 'bg-white/20'
                  }`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-white"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>

              <p className="text-xs md:text-sm text-gray-500 text-center">{t('form.disclaimer')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
