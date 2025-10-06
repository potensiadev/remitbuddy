import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center">
      <h1 className="font-poppins font-extrabold text-[28px] lg:text-[56px] leading-[1.3] lg:leading-[1.2] text-brand">
        {title}
      </h1>
      <p className="font-poppins font-medium text-[16px] lg:text-[20px] text-brand mt-3 lg:mt-4">
        {subtitle}
      </p>
    </div>
  );
};

export default Hero;
