import { useState } from 'react';

const countries = [
  { code: "VN", currency: "VND", name: "Vietnam", emoji: "🇻🇳" },
  { code: "NP", currency: "NPR", name: "Nepal", emoji: "🇳🇵" },
  { code: "PH", currency: "PHP", name: "Philippines", emoji: "🇵🇭" },
  { code: "KH", currency: "KHR", name: "Cambodia", emoji: "🇰🇭" },
  { code: "MM", currency: "MMK", name: "Myanmar", emoji: "🇲🇲" },
  { code: "TH", currency: "THB", name: "Thailand", emoji: "🇹🇭" },
  { code: "UZ", currency: "UZS", name: "Uzbekistan", emoji: "🇺🇿" },
  { code: "ID", currency: "IDR", name: "Indonesia", emoji: "🇮🇩" },
  { code: "LK", currency: "LKR", name: "SriLanka", emoji: "🇱🇰" },
  { code: "BD", currency: "BDT", name: "Bangladesh", emoji: "🇧🇩" },
];

export default function CountrySelect({ country, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-20 sm:w-24">
      <button
        className="w-full h-14 sm:h-12 bg-[#34C759] rounded-lg sm:rounded-xl flex items-center justify-center gap-1 font-semibold text-[#232B3A] text-sm sm:text-base"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm sm:text-base">{countries.find(c => c.code === country.code)?.emoji}</span>
        <span className="text-xs sm:text-sm">{country.currency}</span>
        <svg width="16" height="16" className="ml-1 sm:w-[18px] sm:h-[18px]" fill="none" viewBox="0 0 20 20">
          <path d="M6 8l4 4 4-4" stroke="#232B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 left-0 top-[110%] w-40 sm:w-44 max-h-48 overflow-y-auto bg-white shadow-xl rounded-lg sm:rounded-xl py-2 border border-gray-100">
          {countries.map(c => (
            <div
              key={c.code}
              className="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
            >
              <span className="text-sm sm:text-base">{c.emoji}</span>
              <span className="font-medium text-sm sm:text-base">{c.name}</span>
              <span className="ml-auto text-xs text-gray-500">{c.currency}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
