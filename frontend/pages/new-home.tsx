import React from 'react';
import Head from 'next/head';
import Logo from '../components/Logo';
import Hero from '../components/Hero';
import CompareForm from '../components/CompareForm';
import Footer from '../components/Footer';

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
        <main className="flex-1">
          <div className="max-w-[1040px] mx-auto px-4 pt-8 md:pt-16 lg:pt-[120px] pb-12 md:pb-20">
            <div className="mb-8 md:mb-12">
              <Logo />
            </div>

            <div className="mb-10 md:mb-16">
              <Hero
                title="One Click to Compare Fees and Amount"
                subtitle="Find the Best Exchange Rates in 3 Seconds"
              />
            </div>

            <CompareForm onSubmit={handleCompareSubmit} />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
