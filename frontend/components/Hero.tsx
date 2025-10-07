import React from 'react';

const Hero: React.FC = () => {
  return (
    <>
      {/* RemitBuddy Logo - Outside of green section, on white background */}
      <header className="w-full bg-white px-4 md:px-8 py-4 md:py-6">
        <h1 className="text-[#00D26A] font-extrabold text-4xl md:text-5xl">
          RemitBuddy
        </h1>
      </header>

      {/* Green Hero Section - Full width, no rounded corners */}
      <section className="w-full bg-[#00D26A] pt-12 md:pt-16 pb-24 md:pb-32 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto text-center">
          {/* Main Heading - Large white text */}
          <h2 className="text-white font-extrabold text-4xl md:text-[56px] leading-tight md:leading-[68px] mb-3 md:mb-4">
            Find the Best Exchange Rates in 3 Seconds
          </h2>

          {/* Subheading - Medium white text */}
          <p className="text-white font-normal text-lg md:text-2xl leading-7 md:leading-8 mb-10 md:mb-12">
            One Click to Compare Fees and Amount
          </p>

          {/* White Input Card - This should be added here or passed as children */}
          {/* The card will float on the green background and overlap into white section below */}
        </div>
      </section>
    </>
  );
};

export default Hero;