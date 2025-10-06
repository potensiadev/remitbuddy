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
    <div className="mt-8 bg-white shadow-md rounded-2xl p-5 lg:shadow-lg lg:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-end">

        {/* Country Selector */}
        <div className="flex-1 relative" ref={dropdownRef}>
          <label className="block font-poppins font-medium text-[14px] text-[#0A0A0A] mb-2">
            Where are you sending to?
          </label>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full h-12 lg:h-14 px-3 lg:px-4 bg-white rounded-lg font-poppins text-[14px] text-[#0A0A0A] hover:bg-gray-50 focus:ring-2 focus:ring-brand/20 transition-all outline-none flex items-center justify-between shadow-sm"
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
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors duration-150 font-poppins text-left text-sm"
                >
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-6 h-4 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{country.name}</div>
                    <div className="text-xs text-gray-500">{country.currency}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="flex-1">
          <label className="block font-poppins font-medium text-[14px] text-[#0A0A0A] mb-2">
            How much do you want to send?
          </label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full h-12 lg:h-14 px-3 lg:px-4 pr-16 bg-white rounded-lg font-poppins text-[14px] text-[#0A0A0A] focus:ring-2 focus:ring-brand/20 transition-all outline-none shadow-sm"
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
          className="w-full lg:w-[220px] h-12 lg:h-14 bg-brand hover:bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-poppins font-semibold text-[16px] lg:text-[18px] rounded-xl transition-all duration-200 focus:ring-2 focus:ring-brand/40 outline-none"
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
    </div>
  );
}
