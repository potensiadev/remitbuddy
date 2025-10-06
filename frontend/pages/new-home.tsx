import React from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import CompareForm from '../components/CompareForm';

export default function NewHome() {
  const handleCompareSubmit = (amount: string, country: any) => {
    console.log('Comparing rates for:', { amount, country });
    // TODO: Navigate to results page
  };

  return (
    <>
      <Head>
        <title>RemitBuddy - Compare the Best Exchange Rates</title>
        <meta name="description" content="Find the best exchange rates in 3 seconds. Compare fees and amounts from trusted remittance providers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 bg-white">
          {/* Hero Section with green background */}
          <Hero />

          {/* CompareForm overlapping Hero */}
          <div className="w-full px-4 -mt-[60px] relative z-10">
            <CompareForm onSubmit={handleCompareSubmit} />
          </div>

          {/* AD Placeholder */}
          <div className="w-full px-4 mt-10">
            <div className="max-w-md mx-auto bg-gray-100 text-gray-500 text-center py-10 rounded-md">
              AD
            </div>
          </div>

          {/* Spacer */}
          <div className="pb-20"></div>
        </main>
      </div>
    </>
  );
}
