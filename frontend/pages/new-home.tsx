import React, { useState } from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import CompareForm from '../components/CompareForm';
import ProviderCard from '../components/ProviderCard';

// Mock provider data for display
const MOCK_PROVIDERS = [
  {
    name: "Wise",
    recipientGet: "23,456,789 VND",
    youPay: "1,050,000 KRW",
    fee: "5,000 KRW",
    exchangeRate: "1 KRW = 19.32 VND",
    isBest: true,
    link: "#"
  },
  {
    name: "Remitly",
    recipientGet: "23,234,567 VND",
    youPay: "1,055,000 KRW",
    fee: "8,500 KRW",
    exchangeRate: "1 KRW = 19.15 VND",
    isBest: false,
    link: "#"
  },
  {
    name: "Sentbe",
    recipientGet: "23,123,456 VND",
    youPay: "1,060,000 KRW",
    fee: "10,000 KRW",
    exchangeRate: "1 KRW = 19.05 VND",
    isBest: false,
    link: "#"
  },
  {
    name: "WorldRemit",
    recipientGet: "22,987,654 VND",
    youPay: "1,065,000 KRW",
    fee: "12,000 KRW",
    exchangeRate: "1 KRW = 18.92 VND",
    isBest: false,
    link: "#"
  },
];

// Arrow Right Icon
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default function NewHome() {
  const [showResults, setShowResults] = useState(true); // Show results by default for demo

  const handleCompareSubmit = (amount: string, country: any) => {
    console.log('Comparing rates for:', { amount, country });
    setShowResults(true);
  };

  const bestProvider = MOCK_PROVIDERS.find(p => p.isBest) || MOCK_PROVIDERS[0];
  const otherProviders = MOCK_PROVIDERS.filter(p => !p.isBest);

  return (
    <>
      <Head>
        <title>RemitBuddy - Find the Best Exchange Rates in 3 Seconds</title>
        <meta name="description" content="Compare exchange rates from multiple providers. Find the best deal in 3 seconds." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-white font-poppins">
        {/* Header */}
        <header className="px-4 lg:px-8 py-4 lg:py-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-brand">RemitBuddy</h1>
        </header>

        {/* Hero Section - Full width green background */}
        <section className="bg-brand pt-12 lg:pt-16 pb-24 lg:pb-32 px-4 lg:px-8">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-4xl leading-[44px] lg:text-[56px] lg:leading-[68px] font-extrabold text-white mb-3 lg:mb-4">
              Find the Best Exchange Rates in 3 Seconds
            </h2>
            <p className="text-lg leading-7 lg:text-2xl lg:leading-8 font-normal text-white mb-10 lg:mb-12">
              One Click to Compare Fees and Amount
            </p>

            {/* CompareForm */}
            <div className="max-w-[620px] mx-auto">
              <CompareForm onSubmit={handleCompareSubmit} />
            </div>
          </div>
        </section>

        {/* Results Section */}
        {showResults && (
          <section className="max-w-[1200px] mx-auto px-4 lg:px-8 -mt-12 lg:mt-16">
            {/* Best Rate Provider Card - GREEN BACKGROUND */}
            <div className="relative mb-4 lg:mb-6">
              <div className="absolute -top-2.5 lg:-top-3 left-4 lg:left-6 bg-brand text-white px-3 lg:px-4 py-0.5 lg:py-1 rounded-full text-xs lg:text-sm font-bold z-10">
                Best Rate Provider
              </div>
              <div className="bg-brand-light border-2 border-brand rounded-2xl p-5 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl font-semibold text-gray-primary mb-3 lg:mb-4">
                      {bestProvider.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-2">
                      <span className="text-sm font-medium text-gray-secondary">Recipient Get</span>
                      <span className="text-right text-base font-semibold text-gray-primary">
                        {bestProvider.recipientGet}
                      </span>
                      <span className="text-sm font-medium text-gray-secondary">You Pay</span>
                      <span className="text-right text-base font-semibold text-gray-primary">
                        {bestProvider.youPay}
                      </span>
                      <span className="text-sm font-medium text-gray-secondary">Fee</span>
                      <span className="text-right text-base font-semibold text-gray-primary">
                        {bestProvider.fee}
                      </span>
                      <span className="text-sm font-medium text-gray-secondary">Exchange Rate</span>
                      <span className="text-right text-sm text-gray-secondary">
                        {bestProvider.exchangeRate}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 lg:mt-0 lg:ml-6 px-6 lg:px-8 py-3 bg-brand text-white font-bold rounded-lg hover:bg-[#00BD5F] transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                    Go to {bestProvider.name}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Provider Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-10 lg:mb-12">
              {otherProviders.map((provider) => (
                <ProviderCard key={provider.name} provider={provider} />
              ))}
            </div>
          </section>
        )}

        {/* AD Section */}
        <section className="bg-ad-bg py-16 lg:py-24 flex items-center justify-center">
          <div className="text-5xl lg:text-6xl font-bold text-gray-primary">AD</div>
        </section>

        {/* Footer */}
        <footer className="bg-footer-dark text-white py-6 lg:py-8">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <p className="text-xs lg:text-sm">© 2025 Potensia Inc. All Rights Reserved</p>
              <div className="flex gap-4 lg:gap-6 text-xs lg:text-sm">
                <a href="#" className="hover:text-brand transition-colors">About</a>
                <a href="#" className="hover:text-brand transition-colors">Contact</a>
                <a href="#" className="hover:text-brand transition-colors">Privacy</a>
                <a href="#" className="hover:text-brand transition-colors">Advertise</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
