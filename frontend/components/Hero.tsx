import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface HeroProps {
  title?: string;
  subtitle?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Find the Best Exchange Rates in 3 Seconds",
  subtitle = "One Click to Compare Fees and Amount"
}) => {
  const router = useRouter();
  const { locale } = router;

  return (
    <>
      {/* RemitBuddy Logo */}
      <header className="w-full bg-white px-4 py-4">
        <Link href={`/${locale}`} locale={locale}>
          <h1 className="text-[#00D26A] font-extrabold text-4xl cursor-pointer hover:opacity-80 transition-opacity">
            RemitBuddy
          </h1>
        </Link>
      </header>

      {/* Green Hero Section */}
      <section className="w-full bg-[#00D26A] h-[40vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-[1200px] text-center">
          <h2 className="text-white font-extrabold text-4xl leading-tight mb-2">
            {title}
          </h2>
          <p className="text-white font-normal text-lg leading-7">
            {subtitle}
          </p>
        </div>
      </section>
    </>
  );
};

export default Hero;