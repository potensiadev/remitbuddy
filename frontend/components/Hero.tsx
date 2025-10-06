import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
  return (
    <section className="w-full bg-[#34C759] text-white min-h-[60vh] md:min-h-[70vh] py-24 md:py-36 px-6 rounded-b-[60px] flex flex-col items-center justify-center text-center">
      {/* RemitBuddy Logo */}
      <h1 className="text-3xl font-extrabold text-white mb-8">RemitBuddy</h1>

      {/* Hero Title */}
      <h2 className="font-poppins font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.25] mt-4">
        {title}
      </h2>

      {/* Hero Subtitle */}
      <p className="font-poppins font-medium text-base md:text-xl text-white/90 mt-6">
        {subtitle}
      </p>
    </section>
  );
};

export default Hero;
