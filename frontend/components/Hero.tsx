import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="text-center px-4 pt-8 pb-8">
      <img
        src="/logo.svg"
        alt="RemitBuddy logo"
        className="mx-auto mb-8 h-10"
      />
      <h1 className="font-poppins font-extrabold text-[28px] lg:text-[56px] leading-[1.3] lg:leading-[1.2] text-[#0A0A0A]">
        One Click to Compare Fees and Amount
      </h1>
      <p className="font-poppins font-medium text-[16px] lg:text-[20px] text-[#666666] mt-3 lg:mt-4">
        Find the Best Exchange Rates in 3 Seconds
      </p>
    </div>
  );
};

export default Hero;
