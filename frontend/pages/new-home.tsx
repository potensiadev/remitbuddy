import { useState } from 'react';
import Head from 'next/head';

// Country data
const COUNTRIES = [
  { code: "VN", currency: "VND", name: "Vietnam", flag: "🇻🇳" },
  { code: "PH", currency: "PHP", name: "Philippines", flag: "🇵🇭" },
  { code: "KH", currency: "KHR", name: "Cambodia", flag: "🇰🇭" },
  { code: "NP", currency: "NPR", name: "Nepal", flag: "🇳🇵" },
  { code: "MM", currency: "MMK", name: "Myanmar", flag: "🇲🇲" },
  { code: "TH", currency: "THB", name: "Thailand", flag: "🇹🇭" },
  { code: "UZ", currency: "UZS", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "ID", currency: "IDR", name: "Indonesia", flag: "🇮🇩" },
  { code: "LK", currency: "LKR", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "BD", currency: "BDT", name: "Bangladesh", flag: "🇧🇩" },
];

export default function NewHome() {
  const [amount, setAmount] = useState("1000000");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      setAmount(value);
    }
  };

  const formatNumber = (num: string) => {
    return Number(num).toLocaleString('en-US');
  };

  return (
    <>
      <Head>
        <title>RemitBuddy - Find the Best Exchange Rates in 3 Seconds</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* Full Page Layout - NO popup style */}
      <div className="min-h-screen bg-white font-poppins">

        {/* Header with Logo */}
        <header className="px-4 md:px-8 py-4 md:py-6 bg-white">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#00D26A]">
            RemitBuddy
          </h1>
        </header>

        {/* Hero Section - Full Width Green Background */}
        <section className="bg-[#00D26A] pt-12 md:pt-16 pb-24 md:pb-32 px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto">

            {/* Hero Title - White Text */}
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-4xl md:text-[56px] leading-tight md:leading-[68px] font-extrabold text-white mb-3 md:mb-4">
                Find the Best Exchange Rates in 3 Seconds
              </h2>
              <p className="text-lg md:text-2xl leading-7 md:leading-8 font-normal text-white">
                One Click to Compare Fees and Amount
              </p>
            </div>

            {/* White Input Card - Floating on Green Background */}
            <div className="max-w-[620px] mx-auto bg-white rounded-3xl border-[3px] border-[#00D26A] p-8 md:p-10 shadow-2xl">

              {/* Country Selector */}
              <div className="mb-6 md:mb-8">
                <label className="block text-lg md:text-xl font-bold text-[#00D26A] mb-3 md:mb-4 text-left">
                  Where are you sending to?
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    type="button"
                    className="w-full flex items-center justify-between px-5 md:px-6 py-3 border-2 border-[#E5E7EB] rounded-full hover:border-[#00D26A] transition-colors"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-2xl">{selectedCountry.flag}</span>
                      <span className="text-base md:text-lg font-semibold text-[#6B7280]">
                        {selectedCountry.name} ({selectedCountry.currency})
                      </span>
                    </div>
                    <svg className={`w-5 h-5 text-[#6B7280] transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-[#00D26A] rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
                      {COUNTRIES.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 hover:bg-[#E8F9F0] transition-colors text-left"
                        >
                          <span className="text-2xl">{country.flag}</span>
                          <span className="text-base md:text-lg font-medium text-[#6B7280]">
                            {country.name} ({country.currency})
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6 md:mb-8">
                <label className="block text-lg md:text-xl font-bold text-[#00D26A] mb-3 md:mb-4 text-left">
                  How much do you want to send?
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formatNumber(amount)}
                    onChange={handleAmountChange}
                    className="w-full px-5 md:px-6 py-3 border-2 border-[#E5E7EB] rounded-full text-base md:text-lg font-semibold text-[#6B7280] text-right focus:border-[#00D26A] focus:outline-none"
                    placeholder="1,000,000"
                    style={{ paddingRight: '4.5rem' }}
                  />
                  <span className="absolute right-5 md:right-6 text-base md:text-lg font-semibold text-[#6B7280] pointer-events-none">
                    KRW
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                className="w-full py-3.5 md:py-4 bg-[#00D26A] text-white text-lg md:text-xl font-bold rounded-full hover:bg-[#00BD5F] transition-colors border-0 outline-none focus:outline-none active:outline-none"
                style={{ border: 'none !important', outline: 'none !important', boxShadow: 'none' }}
              >
                Compare the Best Rates
              </button>
            </div>

          </div>
        </section>

        {/* AD Section */}
        <section className="bg-[#D1D5DB] py-16 md:py-24 flex items-center justify-center">
          <div className="text-5xl md:text-6xl font-bold text-[#1F2937]">AD</div>
        </section>

        {/* Footer */}
        <footer className="bg-[#4B5563] text-white py-6 md:py-8 px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs md:text-sm">© 2025 Potensia Inc. All Rights Reserved</p>
              <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
                <a href="#" className="hover:text-[#00D26A] transition-colors">About</a>
                <a href="#" className="hover:text-[#00D26A] transition-colors">Contact</a>
                <a href="#" className="hover:text-[#00D26A] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[#00D26A] transition-colors">Advertise</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
