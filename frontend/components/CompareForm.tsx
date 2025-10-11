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

  /* 외부 클릭/탭 시 드롭다운 닫기 */
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

  /* ESC 키로 드롭다운 닫기 */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDropdown(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* 드롭다운 열릴 때 body scroll 잠금 */
  useEffect(() => {
    document.body.style.overflow = showDropdown ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDropdown]);

  /* 금액 입력 */
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
    <div className="w-full bg-white border-[3px] border-brand rounded-3xl shadow-lg p-8 lg:p-10 transition-colors">
      <form onSubmit={handleSubmit}>
        {/* Country Selector */}
        <div className="relative mb-6 lg:mb-8" ref={dropdownRef}>
          <label className="block text-lg lg:text-xl font-bold text-brand mb-3 lg:mb-4 text-left">
            Where are you sending to?
          </label>

          {/* ✅ 흔들림 없는 스타일 */}
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-expanded={showDropdown}
            className="
              w-full flex items-center justify-between px-5 lg:px-6 py-3
              border border-transparent rounded-full bg-white
              shadow-[inset_0_0_0_2px_rgba(209,213,219,1)]
              hover:shadow-[inset_0_0_0_2px_var(--brand-color,#34C759)]
              focus:shadow-[inset_0_0_0_2px_var(--brand-color,#34C759)]
              focus:outline-none transition-shadow duration-200
            "
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <img
                src={selectedCountry.flag}
                alt={`${selectedCountry.name} flag`}
                className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover"
              />
              <span className="text-base lg:text-lg font-semibold text-gray-800">
                {selectedCountry.name} ({selectedCountry.currency})
              </span>
            </div>
            <svg
              className={`w-4 h-4 lg:w-5 lg:h-5 text-gray-500 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border-2 border-brand rounded-2xl shadow-xl z-50 max-h-[60vh] overflow-y-auto overscroll-contain">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  autoFocus={country.code === selectedCountry.code}
                  className="w-full flex items-center gap-3 px-5 lg:px-6 py-3 hover:bg-brand/10 transition-colors text-left focus:bg-brand/10 focus:outline-none"
                >
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover"
                  />
                  <span className="text-base lg:text-lg font-medium text-gray-800">
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

          <div className="relative">
            {/* ✅ 흔들림 없는 input */}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={displayAmount}
              onChange={handleAmountChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={`
                w-full px-5 lg:px-6 py-3 pr-16 rounded-full text-base lg:text-lg font-semibold text-gray-800 text-right
                border border-transparent
                shadow-[inset_0_0_0_2px_rgba(209,213,219,1)]
                hover:shadow-[inset_0_0_0_2px_var(--brand-color,#34C759)]
                focus:shadow-[inset_0_0_0_2px_var(--brand-color,#34C759)]
                focus:outline-none transition-shadow duration-200
                ${!isAmountValid ? "shadow-[inset_0_0_0_2px_rgb(248,113,113)]" : ""}
              `}
              placeholder="1,000,000"
            />
            <span className="absolute right-5 lg:right-6 top-1/2 -translate-y-1/2 text-base lg:text-lg font-semibold text-gray-800">
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
          className="
            w-full py-3.5 lg:py-4 bg-brand text-white text-lg lg:text-xl font-bold rounded-full
            transition-colors hover:enabled:bg-[#00BD5F]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isLoading ? "Comparing..." : "Compare the Best Rates"}
        </button>
      </form>
    </div>
  );
}
