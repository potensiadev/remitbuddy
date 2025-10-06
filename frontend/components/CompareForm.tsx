import React, { useState, useRef, useEffect } from 'react';

// Country data with supported currencies
const COUNTRIES = [
  { code: "VN", currency: "VND", name: "Vietnam", flag: "/images/flags/vn.png" },
  { code: 'NP', name: 'Nepal', currency: 'NPR', flag: '/images/flags/np.png' },
  { code: "PH", currency: "PHP", name: "Philippines", flag: "/images/flags/ph.png" },
  { code: "KH", currency: "KHR", name: "Cambodia", flag: "/images/flags/kh.png" },
  { code: "MM", currency: "MMK", name: "Myanmar", flag: "/images/flags/mm.png" },
  { code: "TH", currency: "THB", name: "Thailand", flag: "/images/flags/th.png" },
  { code: "UZ", currency: "UZS", name: "Uzbekistan", flag: "/images/flags/uz.png" },
  { code: "ID", currency: "IDR", name: "Indonesia", flag: "/images/flags/id.png" },
  { code: "LK", currency: "LKR", name: "SriLanka", flag: "/images/flags/lk.png" },
  { code: "BD", currency: "BDT", name: "Bangladesh", flag: "/images/flags/bd.png" },
];

interface CompareFormProps {
  onSubmit?: (amount: string, country: any) => void;
  isLoading?: boolean;
}

export default function CompareForm({ onSubmit, isLoading = false }: CompareFormProps) {
  const [amount, setAmount] = useState("1000000");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(value)) && value.length <= 10) {
      setAmount(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && onSubmit) {
      onSubmit(amount, selectedCountry);
    }
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-[#34C759] rounded-2xl shadow-md p-6 md:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Country Selector */}
        <div className="relative" ref={dropdownRef}>
          <label className="block font-semibold text-sm text-gray-800 mb-2">
            Where are you sending to?
          </label>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full h-[50px] px-3 bg-white border border-gray-300 rounded-lg font-poppins text-sm text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-brand/20 transition-all outline-none flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <img
                src={selectedCountry.flag}
                alt={`${selectedCountry.name} flag`}
                className="w-6 h-4 object-cover rounded"
              />
              <span>{selectedCountry.name}</span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#34C759] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full px-4 py-2 flex items-center gap-2 rounded-md cursor-pointer hover:bg-[rgba(52,199,89,0.3)] focus:bg-[rgba(52,199,89,0.3)] focus:outline-none transition-colors duration-150 ease-in-out font-poppins text-left text-sm backdrop-filter-none"
                >
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{country.name}</div>
                    <div className="text-xs text-gray-500">{country.currency}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block font-semibold text-sm text-gray-800 mb-2">
            How much do you want to send?
          </label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full h-[50px] px-3 pr-16 bg-white border border-gray-300 rounded-lg font-poppins text-sm text-gray-900 focus:ring-2 focus:ring-brand/20 transition-all outline-none"
              placeholder="Enter amount (KRW)"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-poppins text-[14px] text-gray-500">
              KRW
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full lg:w-[220px] h-12 bg-[#34C759] hover:bg-[#2EB84F] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-poppins font-semibold text-base rounded-xl transition-all duration-200 focus:ring-2 focus:ring-brand/40 outline-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Comparing...</span>
            </div>
          ) : (
            "Compare the Best Rates"
          )}
        </button>
      </form>

      {/* Trust Indicators */}
      <div className="flex justify-center gap-4 text-gray-500 text-xs mt-3">
        <span>✅ Free to use</span>
        <span>🔒 Secure comparison</span>
        <span>🟢 No hidden fees</span>
      </div>
    </div>
  );
}
