import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

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
  onSubmit: (amount: string, country: any) => void;
  isLoading?: boolean;
}

export default function CompareForm({ onSubmit, isLoading = false }: CompareFormProps) {
  const { t } = useTranslation('common');
  const [amount, setAmount] = useState("1000000");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [amountError, setAmountError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          formRef.current && !formRef.current.contains(event.target as Node)) {
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
      
      const numValue = parseInt(value) || 0;
      if (numValue > 0 && numValue < 10000) {
        setAmountError("최소 10,000원 이상 입력해주세요");
      } else if (numValue > 5000000) {
        setAmountError("최대 5,000,000원까지 입력 가능합니다");
      } else {
        if (amountError) setAmountError("");
      }
    }
  };

  const isAmountValid = () => {
    const numValue = parseInt(amount) || 0;
    return numValue >= 10000 && numValue <= 5000000;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAmountValid() && !isLoading) {
      onSubmit(amount, selectedCountry);
    }
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      {/* 리디자인 포인트: 제목과 서브타이틀 */}
      <div className="text-center mb-8">
        <h2 className="font-poppins text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Compare the Best Rates
        </h2>
        <p className="font-poppins text-gray-600">
          Get instant quotes from 9+ trusted remittance providers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 리디자인 포인트: 반응형 그리드 레이아웃 (모바일: col, 데스크톱: row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="font-poppins text-sm font-semibold text-gray-700 block">
              Send Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl font-poppins text-lg font-semibold text-gray-900 bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200 outline-none"
                placeholder="1,000,000"
                min="10000"
                max="5000000"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 font-poppins text-sm font-medium text-gray-500">
                KRW
              </span>
            </div>
            {amountError && (
              <p className="font-poppins text-sm text-red-500 font-medium">{amountError}</p>
            )}
          </div>

          {/* Country Selector */}
          <div className="space-y-2" ref={formRef}>
            <label className="font-poppins text-sm font-semibold text-gray-700 block">
              To Country
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl font-poppins text-lg font-semibold text-gray-900 bg-gray-50 hover:bg-white focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200 outline-none flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
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
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto"
                >
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 font-poppins text-left"
                    >
                      <img
                        src={country.flag}
                        alt={`${country.name} flag`}
                        className="w-6 h-4 object-cover rounded"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{country.name}</div>
                        <div className="text-sm text-gray-500">{country.currency}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 리디자인 포인트: CTA 버튼 (brand 색상) */}
        <button
          type="submit"
          disabled={!isAmountValid() || isLoading}
          className="w-full bg-brand hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-poppins font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-brand/20 outline-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Comparing Rates...</span>
            </div>
          ) : (
            "Compare the Best Rates"
          )}
        </button>

        <p className="font-poppins text-center text-sm text-gray-500">
          Free to use • No hidden fees • Secure comparison
        </p>
      </form>
    </div>
  );
}