import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Logo from '../components/Logo';
import Hero from '../components/Hero';
import ProviderCard from '../components/ProviderCard';
import Footer from '../components/Footer';

export default function Results() {
  const router = useRouter();
  const { country, amount } = router.query;

  const numAmount = Number(amount) || 1000000;

  // Mock provider data
  const providers = [
    {
      name: "Wise",
      exchangeRate: 19.25,
      fee: 5000,
      isRecommended: true,
    },
    {
      name: "Remitly",
      exchangeRate: 19.15,
      fee: 3000,
    },
    {
      name: "WorldRemit",
      exchangeRate: 19.10,
      fee: 4500,
    },
    {
      name: "Western Union",
      exchangeRate: 19.05,
      fee: 7000,
    },
    {
      name: "MoneyGram",
      exchangeRate: 19.00,
      fee: 6000,
    },
    {
      name: "Xoom",
      exchangeRate: 18.95,
      fee: 5500,
    },
  ].map((provider) => ({
    ...provider,
    receivedAmount: Math.floor((numAmount - provider.fee) * provider.exchangeRate),
  }));

  return (
    <>
      <Head>
        <title>Best Rates - RemitBuddy</title>
        <meta name="description" content="Compare the best remittance rates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1">
          <div className="max-w-[1040px] mx-auto px-4 pt-8 md:pt-16 pb-12 md:pb-20">
            <div className="mb-8 md:mb-12">
              <Logo />
            </div>

            <Link
              href="/new-home"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-brand transition-colors mb-6 font-poppins text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Search
            </Link>

            <div className="mb-10 md:mb-12">
              <Hero
                title="Best Rate Providers"
                subtitle={`Sending ₩${numAmount.toLocaleString()} to ${country || 'your destination'}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <ProviderCard key={provider.name} {...provider} />
              ))}
            </div>

            {/* Ad Space */}
            <div className="mt-10 bg-gray-100 rounded-2xl h-24 flex items-center justify-center">
              <p className="text-gray-400 text-sm font-poppins">Advertisement Space</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
