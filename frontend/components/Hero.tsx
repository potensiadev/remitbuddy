import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
}

const Hero: React.FC<HeroProps> = ({ 
  title = "Find the Best Exchange Rates in 3 Seconds",
  subtitle = "One Click to Compare Fees and Amount"
}) => {
  return (
    <>
      {/* RemitBuddy Logo */}
      <header className="w-full bg-white px-4 md:px-8 py-4 md:py-6">
        <h1 className="text-[#00D26A] font-extrabold text-4xl md:text-5xl">
          RemitBuddy
        </h1>
      </header>

      {/* Green Hero Section */}
      <section className="w-full bg-[#00D26A] h-[40vh] flex flex-col items-center justify-center px-4 md:px-8">
        <div className="max-w-[1200px] text-center">
          <h2 className="text-white font-extrabold text-4xl md:text-[56px] leading-tight md:leading-[68px] mb-2 md:mb-2">
            {title}
          </h2>
          <p className="text-white font-normal text-lg md:text-2xl leading-7 md:leading-8">
            {subtitle}
          </p>
        </div>
      </section>
    </>
  );
};

export default Hero;