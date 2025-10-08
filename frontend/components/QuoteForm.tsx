import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

// ✅ Icons
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
  >
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.33301 8H12.6663"
    />
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 3.33331L12.6667 7.99998L8 12.6666"
    />
  </svg>
);

// ✅ Country Data
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

interface Country {
  code: string;
  currency: string;
  name: string;
  flag: string;
}

interface QuoteFormData {
  amount: string;
  country: Country;
}

interface QuoteFormProps {
  onSubmit: (data: QuoteFormData) => void;
  isLoading?: boolean;
  hasCompared?: boolean;
}

// ✅ CountryDropdown (브랜드 컬러 적용 완료)
const CountryDropdown = ({
  onSelect,
  onClose,
  dropdownRef,
}: {
  onSelect: (country: Country) => void;
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}) => {
  const { t } = useTranslation("common");

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 w-full min-w-[280px] lg:min-w-[320px] max-h-[60vh] bg-white rounded-2xl shadow-lg border-2 border-brand flex flex-col overflow-hidden z-50 animate-slide-down"
    >
      <div className="flex-1 overflow-y-auto">
        {COUNTRIES.map((country) => (
          <button
            key={country.code}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(country);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-5 lg:px-6 py-3 lg:py-4 text-left hover:bg-brand/10 transition-colors focus-ring"
          >
            <img
              src={country.flag}
              alt={`${country.name} flag`}
              className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover"
            />
            <div className="flex flex-col text-gray-700">
              <span className="font-semibold text-base lg:text-lg">
                {country.name}
              </span>
              <span className="text-sm text-gray-500">{country.currency}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ✅ QuoteForm Main Component
export default function QuoteForm({
  onSubmit,
  isLoading = false,
  hasCompared = false,
}: QuoteFormProps) {
  const { t } = useTranslation("common");
  const [amount, setAmount] = useState("1000000");
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [amountError, setAmountError] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        formRef.current &&
        !formRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(value)) && value.length <= 10) {
      setAmount(value);

      const numValue = parseInt(value) || 0;
      if (numValue > 0 && numValue < 10000) {
        setAmountError(t("amount_min_error") || "Minimum amount is ₩10,000");
      } else if (numValue > 5000000) {
        setAmountError(t("amount_max_error") || "Maximum amount is ₩5,000,000");
      } else if (amountError) {
        setAmountError("");
      }
    }
  };

  const handleAmountBlur = () => {
    const numValue = parseInt(amount) || 0;

    if (numValue > 0 && numValue < 10000) {
      setAmountError(t("amount_min_error") || "Minimum amount is ₩10,000");
    } else if (numValue > 5000000) {
      setAmountError(t("amount_max_error") || "Maximum amount is ₩5,000,000");
    } else {
      setAmountError("");
    }
  };

  const isAmountValid = () => {
    const numValue = parseInt(amount) || 0;
    return numValue >= 10000 && numValue <= 5000000;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCountry && amount && isAmountValid()) {
      onSubmit({
        amount,
        country: selectedCountry,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">RB</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">RemitBuddy</h1>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {t("main_title") || "Compare Remittance Rates"}
        </h2>
        <p className="text-sm text-gray-600">
          {t("main_subtitle") || "Find the best exchange rates in seconds"}
        </p>
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("amount_label") || "Send Amount"}
          </label>
          <p className="text-xs text-gray-500 mb-3">
            {t("amount_helper") ||
              "Enter amount between ₩10,000 - ₩5,000,000"}
          </p>
          <div className="relative">
            <input
              type="text"
              value={amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
              placeholder="1,000,000"
              className={`w-full px-4 py-3 pr-16 rounded-xl border-2 text-lg font-semibold ${
                amountError
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              } focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30`}
              disabled={isLoading}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              KRW
            </span>
          </div>
          {amountError && (
            <div className="mt-2 text-sm text-red-600">{amountError}</div>
          )}
        </div>

        {/* ✅ Country Selection (브랜드 컬러 반영) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("country_label") || "Destination Country"}
          </label>
          <p className="text-xs text-gray-500 mb-3">
            {t("country_helper") || "Select where you want to send money"}
          </p>
          <div className="relative">
            <button
              type="button"
              className="w-full px-4 py-3 rounded-xl border-2 border-brand bg-white hover:bg-brand/5 focus:outline-none focus-ring flex items-center justify-between transition-all"
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={isLoading}
              aria-expanded={showDropdown}
              aria-haspopup="listbox"
            >
              <div className="flex items-center gap-3">
                <img
                  src={selectedCountry.flag}
                  alt={`${selectedCountry.name} flag`}
                  width="28"
                  height="20"
                  className="rounded-full"
                />
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {selectedCountry.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedCountry.currency}
                  </div>
                </div>
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showDropdown && (
              <CountryDropdown
                onSelect={setSelectedCountry}
                onClose={() => setShowDropdown(false)}
                dropdownRef={dropdownRef}
              />
            )}
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
            !isAmountValid() || isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-brand hover:bg-[#00BD5F] shadow-lg hover:shadow-xl"
          }`}
          disabled={!isAmountValid() || isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{t("loading_text") || "Loading..."}</span>
            </>
          ) : (
            <>
              <ArrowRightIcon className="w-5 h-5" />
              <span>
                {hasCompared
                  ? t("compare_again_button") || "Compare Again"
                  : t("compare_button") || "Compare Rates"}
              </span>
            </>
          )}
        </button>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center">
          {t("cta_helper") ||
            "Free comparison • Real-time rates • Secure service"}
        </div>
      </form>
    </div>
  );
}
