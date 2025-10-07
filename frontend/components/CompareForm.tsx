import React, { useState, useRef, useEffect } from 'react';

// Country data with supported currencies
const COUNTRIES = [
  { code: "VN", currency: "VND", name: "Vietnam", flag: "/images/flags/vn.png" },
  { code: 'NP', currency: 'NPR', name: 'Nepal', flag: '/images/flags/np.png' },
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
    <div className="w-full bg-white border-[3px] border-brand rounded-3xl shadow-lg p-8 lg:p-10">
      <form onSubmit={handleSubmit}>

        {/* Country Selector */}
        <div className="relative mb-6 lg:mb-8" ref={dropdownRef}>
          <label className="block text-lg lg:text-xl font-bold text-brand mb-3 lg:mb-4 text-left">
            Where are you sending to?
          </label>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-5 lg:px-6 py-3 border-2 border-gray-border rounded-full hover:border-brand transition-colors"
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <img
                src={selectedCountry.flag}
                alt={`${selectedCountry.name} flag`}
                className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover"
              />
              <span className="text-base lg:text-lg font-semibold text-gray-secondary">
                {selectedCountry.name} ({selectedCountry.currency})
              </span>
            </div>
            <svg
              className={`w-4 h-4 lg:w-5 lg:h-5 text-gray-secondary transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border-2 border-brand rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center gap-2 lg:gap-3 px-5 lg:px-6 py-3 lg:py-4 hover:bg-brand-light transition-colors text-left"
                >
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover"
                  />
                  <span className="text-base lg:text-lg font-medium text-gray-secondary">
                    {country.name} ({country.currency})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="mb-6 lg:mb-8">
          <label className="block text-lg lg:text-xl font-bold text-brand mb-3 lg:mb-4 text-left">
            How much do you want to send?
          </label>
          <input
            type="text"
            value={amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={handleAmountChange}
            className="w-full px-5 lg:px-6 py-3 border-2 border-gray-border rounded-full text-base lg:text-lg font-semibold text-gray-secondary text-right focus:border-brand focus:outline-none"
            placeholder="1,000,000 KRW"
          />
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 lg:py-4 bg-brand text-white text-lg lg:text-xl font-bold rounded-full hover:bg-[#00BD5F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Comparing...' : 'Compare the Best Rates'}
        </button>
      </form>
    </div>
  );
}
