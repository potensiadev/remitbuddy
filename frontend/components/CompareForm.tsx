import React, { useState, useRef, useEffect } from "react";

const COUNTRIES = [
  { code: "VN", currency: "VND", name: "Vietnam", flag: "/images/flags/vn.png" },
  { code: "NP", currency: "NPR", name: "Nepal", flag: "/images/flags/np.png" },
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
  const [displayAmount, setDisplayAmount] = useState("1,000,000");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  /* Close dropdown on ESC key */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDropdown(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* Lock body scroll when dropdown is open */
  useEffect(() => {
    document.body.style.overflow = showDropdown ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDropdown]);

  /* Amount input handler */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue) && rawValue.length <= 10) {
      setAmount(rawValue);
      setDisplayAmount(rawValue);
    }
  };

  const handleBlur = () => {
    if (!amount) return;
    const numericValue = Number(amount);
    setDisplayAmount(numericValue.toLocaleString());
  };

  const handleFocus = () => {
    setDisplayAmount(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = Number(amount);
    if (numericValue < 10000 || numericValue > 5000000) return;
    if (!isLoading && onSubmit) {
      onSubmit(amount, selectedCountry);
    }
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    setShowDropdown(false);
  };

  const isAmountValid =
    Number(amount) >= 10000 && Number(amount) <= 5000000 && amount !== "";

  return (
    <div className="w-full bg-white border-[3px] border-[#5FBF73] rounded-[32px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-10 transition-colors">
      <form onSubmit={handleSubmit}>
        {/* Country Selector */}
        <div className="relative mb-8" ref={dropdownRef}>
          <label className="block text-[22px] font-bold text-[#5FBF73] mb-5 text-left tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Where are you sending to?
          </label>

          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-expanded={showDropdown}
            className="w-full flex items-center justify-between px-7 py-5 border-[2.5px] border-gray-300 rounded-[50px] bg-white hover:border-[#5FBF73] focus:border-[#5FBF73] focus:outline-none transition-colors duration-200"
          >
            <img
              src={selectedCountry.flag}
              alt={`${selectedCountry.name} flag`}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />

            <span className="flex-1 text-center mx-4 text-[20px] font-semibold text-gray-700">
              {selectedCountry.name} ({selectedCountry.currency})
            </span>

            <svg
              className={`w-6 h-6 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                showDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 w-full mt-3 bg-white border-[2.5px] border-[#5FBF73] rounded-[28px] shadow-xl z-50 max-h-[60vh] overflow-y-auto overscroll-contain animate-fadeIn dropdown-scroll">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center justify-between px-7 py-3.5 text-left hover:bg-[#5FBF73]/10 focus:bg-[#5FBF73]/10 transition-colors focus:outline-none first:rounded-t-[28px] last:rounded-b-[28px]"
                >
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />

                  <span className="flex-1 text-center mx-4 text-[18px] font-semibold text-gray-700">
                    {country.name} ({country.currency})
                  </span>

                  <div className="w-6 flex-shrink-0"></div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="mb-8">
          <label className="block text-[22px] font-bold text-[#5FBF73] mb-5 text-left tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            How much do you want to send?
          </label>

          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={displayAmount}
              onChange={handleAmountChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={`w-full pl-7 pr-[90px] py-5 rounded-[50px] text-[20px] font-semibold text-gray-700 text-right bg-white border-[3px] ${
                !isAmountValid ? 'border-red-400' : 'border-[#5FBF73]'
              } hover:border-[#4CAF60] focus:border-[#4CAF60] focus:outline-none transition-all duration-200 shadow-sm`}
              placeholder="1,000,000"
            />
            <span className="absolute right-7 top-1/2 -translate-y-1/2 translate-y-[2px] text-[20px] font-semibold text-gray-700 pointer-events-none">
              KRW
            </span>
          </div>

          {!isAmountValid && (
            <p className="text-red-500 text-sm mt-2 text-left">
              Please enter between ₩10,000 and ₩5,000,000
            </p>
          )}
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          disabled={isLoading || !isAmountValid}
          className="w-full h-[60px] bg-[#5FBF73] text-white text-[22px] font-bold rounded-[50px] transition-colors hover:enabled:bg-[#4DA65F] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Comparing..." : "Compare the Best Rates"}
        </button>
      </form>
    </div>
  );
}
