import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="w-full bg-[#34C759] text-white min-h-[40vh] md:min-h-[50vh] py-12 md:py-20 px-6 rounded-b-[60px] flex flex-col items-center justify-center text-center">
      {/* RemitBuddy Logo */}
      <h1 className="text-white font-extrabold text-2xl mb-4">RemitBuddy</h1>

      {/* Main Heading */}
      <h2 className="text-white font-semibold text-lg mb-4">
        Find the Best Exchange Rates in 3 Seconds
      </h2>

      {/* Subheading */}
      <p className="text-white/90 font-medium text-base">
        One Click to Compare Fees and Amount
      </p>
    </section>
  );
};

export default Hero;
