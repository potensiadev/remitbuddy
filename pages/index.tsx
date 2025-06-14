import React, { useState } from "react";

// 국가/통화 리스트 예시
const countries = [
  { name: "Vietnam", code: "VND", flag: "🇻🇳" },
  { name: "Philippines", code: "PHP", flag: "🇵🇭" },
  { name: "Cambodia", code: "KHR", flag: "🇰🇭" },
  { name: "Nepal", code: "NPR", flag: "🇳🇵" },
  { name: "Myanmar", code: "MMK", flag: "🇲🇲" },
  { name: "Thailand", code: "THB", flag: "🇹🇭" },
  { name: "Uzbekistan", code: "UZS", flag: "🇺🇿" },
  { name: "Indonesia", code: "IDR", flag: "🇮🇩" },
  { name: "Sri Lanka", code: "LKR", flag: "🇱🇰" },
  { name: "Bangladesh", code: "BDT", flag: "🇧🇩" },
];

export default function Home() {
  const [amount, setAmount] = useState(1000000);
  const [country, setCountry] = useState(countries[0]); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 결과 페이지 이동 또는 API 호출 로직 추가
    alert(
      `${amount.toLocaleString()} ${country.code}를 받을 국가: ${country.name} 선택됨`
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      {/* 카드 */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Logo & Title */}
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2" />
          <span className="font-bold text-xl text-gray-800">SendHome</span>
        </div>
        <div className="text-center text-2xl font-extrabold mt-6 mb-6 text-gray-900 leading-snug">
          How much should your<br />family receive?
        </div>

        <form onSubmit={handleSubmit}>
          <div className="w-full mb-4">
            <label className="block text-gray-600 text-sm mb-1 font-medium">
              Amount to Receive
            </label>
            <div className="flex items-center rounded-xl bg-gray-100 px-2 py-2">
              <input
                className="flex-1 bg-transparent outline-none text-lg font-semibold px-2"
                type="number"
                value={amount}
                min={1}
                onChange={e => setAmount(Number(e.target.value))}
                required
              />
              <select
                className="bg-transparent outline-none font-semibold text-gray-800"
                value={country.code}
                onChange={e =>
                  setCountry(
                    countries.find(c => c.code === e.target.value) ||
                    countries[0]
                  )
                }
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-gray-500 text-sm mb-5">
            We'll find the best exchange rate for you
          </div>
          <div className="mb-5">
            <span className="bg-yellow-100 text-yellow-700 font-medium rounded-xl px-4 py-2 text-sm shadow-sm">
              {country.code} &rarr; KRW
            </span>
          </div>
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition text-white font-semibold rounded-xl py-3 text-lg shadow-md"
            type="submit"
          >
            Find out the Best Rate
          </button>
        </form>
      </div>
    </div>
  );
}
