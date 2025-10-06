import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
  return (
    <section className="w-full bg-[#34C759] text-white text-center py-20 md:py-28 px-6 rounded-b-[40px] pb-16">
      <h1 className="font-poppins font-extrabold text-3xl md:text-5xl lg:text-6xl leading-tight">
        {title}
      </h1>
      <p className="font-poppins font-medium text-base md:text-xl text-white/90 mt-4">
        {subtitle}
      </p>
    </section>
  );
};

export default Hero;
