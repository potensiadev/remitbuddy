import React, { useState } from "react";

// 국가 목록
const COUNTRIES = [
  { code: "VN", currency: "VND", name: "Vietnam", flag: "VN" },
  { code: "PH", currency: "PHP", name: "Philippines", flag: "PH" },
  { code: "KH", currency: "KHR", name: "Cambodia", flag: "KH" },
  { code: "MM", currency: "MMK", name: "Myanmar", flag: "MM" },
  { code: "TH", currency: "THB", name: "Thailand", flag: "TH" },
  { code: "UZ", currency: "UZS", name: "Uzbekistan", flag: "UZ" },
  { code: "ID", currency: "IDR", name: "Indonesia", flag: "ID" },
  { code: "LK", currency: "LKR", name: "SriLanka", flag: "LK" },
  { code: "BD", currency: "BDT", name: "Bangladesh", flag: "BD" }
];

export default function HomePage() {
  const [amount, setAmount] = useState("1,000,000");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  return (
    <div className="min-h-screen bg-[#F6F6FA] flex flex-col items-center justify-start py-8">
      {/* 헤더 */}
      <div className="w-full max-w-sm px-4 flex items-center mb-4">
        <svg width="32" height="32" viewBox="0 0 32 32" className="mr-2" fill="none">
          <polygon points="8,16 28,6 28,26" fill="#4338CA" />
        </svg>
        <span className="text-[2rem] font-extrabold text-[#232B3A]">SendHome</span>
      </div>

      {/* 카드 */}
      <div className="relative w-full max-w-sm">
        <div className="bg-white rounded-[28px] shadow-xl px-6 py-8 flex flex-col items-center">
          <div className="text-center text-[#232B3A] text-[2rem] font-extrabold mb-6 leading-tight">
            How much should your <br /> family receive?
          </div>

          <div className="w-full text-left font-semibold text-[#232B3A] mb-2">Amount to Receive</div>
          <div className="w-full flex mb-4 gap-2">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 h-12 rounded-xl bg-[#F3F6FA] border border-[#E1E5EA] px-4 text-[1.15rem] font-semibold"
            />
            <button
              type="button"
              className="flex items-center gap-1 px-3 h-12 bg-[#F3F6FA] border border-[#E1E5EA] rounded-xl min-w-[90px]"
              onClick={() => setShowDropdown(true)}
            >
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="ml-1 font-semibold">{selectedCountry.currency}</span>
              <svg width={18} height={18} fill="none"><path d="M6 8l4 4 4-4" stroke="#232B3A" strokeWidth={2} strokeLinecap="round" /></svg>
            </button>
          </div>

          <div className="text-[#7C8594] text-center text-[1rem] mb-2">
            We’ll find the best exchange rate for you
          </div>
          <div className="flex justify-center items-center mb-5">
            <span className="text-[#232B3A] font-semibold bg-[#F6EBCD] rounded-full py-1 px-5 text-[1rem]">
              {selectedCountry.currency} → KRW
            </span>
          </div>
          <button
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2E49F3] to-[#6959EF] text-white font-extrabold text-[1.13rem] shadow-lg"
          >
            Find out the Best Rate
          </button>
        </div>

        {/* === 드롭다운 오버레이 === */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-10 flex justify-center items-center"
            onClick={() => setShowDropdown(false)}
          >
            {/* 중앙에 고정된 패널 */}
            <div
              className="w-[263px] h-[516px] bg-white rounded-[15px] shadow-2xl flex flex-col overflow-y-auto"
              onClick={e => e.stopPropagation()} // 내부 클릭은 닫힘 방지
              style={{
                boxShadow: "0px 16px 40px rgba(0,0,0,0.09)",
                // (디자인시안 맞춤 그림자)
              }}
            >
              <div className="p-4 border-b font-bold text-lg text-[#232B3A]">Select Country</div>
              <div className="flex-1">
                {COUNTRIES.map(c => (
                  <div
                    key={c.code}
                    className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-[#F6F6FA] text-lg"
                    onClick={() => {
                      setSelectedCountry(c);
                      setShowDropdown(false);
                    }}
                  >
                    <span className="text-2xl">{c.flag}</span>
                    <div>
                      <div className="font-bold">{c.name}</div>
                      <div className="text-gray-500 text-xs">{c.currency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
