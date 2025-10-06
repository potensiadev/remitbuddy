import React from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import CompareForm from '../components/CompareForm';

export default function NewHome() {
  const handleCompareSubmit = (amount: string, country: any) => {
    console.log('Comparing rates for:', { amount, country });
    // TODO: Implement rate comparison logic
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

      <main className="min-h-screen bg-white">
        <div className="w-full max-w-[390px] lg:max-w-[1040px] mx-auto px-4 py-8">
          <Hero />
          <CompareForm onSubmit={handleCompareSubmit} />
        </div>
      </main>
    </>
  );
}
