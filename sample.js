import React, { useState } from 'react';

const currencyList = [
  { code: 'VND', label: 'VND', icon: '🇻🇳' },
  // 다른 통화 추가 가능
];

export default function Home() {
  const [amount, setAmount] = useState('1000000');
  const [currency, setCurrency] = useState(currencyList[0].code);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleQuote = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/getRemittanceQuote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      alert('API 호출에 실패했습니다.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Card */}
      <div className="mt-10 w-full max-w-md p-8 rounded-2xl bg-white shadow-lg flex flex-col items-center">
        {/* Logo & Title */}
        <div className="w-full flex items-center mb-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2" />
          <span className="font-bold text-xl text-gray-800">SendHome</span>
        </div>
        {/* Main Title */}
        <div className="text-center text-2xl font-extrabold mt-6 mb-6 text-gray-900 leading-snug">
          How much should your<br />family receive?
        </div>
        {/* Input */}
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
              onChange={e => setAmount(e.target.value)}
            />
            <select
              className="bg-transparent outline-none font-semibold text-gray-800"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              {currencyList.map(cur => (
                <option key={cur.code} value={cur.code}>
                  {cur.icon} {cur.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Info */}
        <div className="text-gray-500 text-sm mb-5">
          We&apos;ll find the best exchange rate for you
        </div>
        {/* Arrow & currency */}
        <div className="mb-5">
          <span className="bg-yellow-100 text-yellow-700 font-medium rounded-xl px-4 py-2 text-sm shadow-sm">
            VND &rarr; KRW
          </span>
        </div>
        {/* Button */}
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition text-white font-semibold rounded-xl py-3 text-lg shadow-md"
          onClick={handleQuote}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Find out the Best Rate'}
        </button>

        {/* 결과 표시 (예시) */}
        {result && (
          <div className="mt-6 w-full text-center text-gray-800">
            <div className="font-semibold">환율: {result.rate}</div>
            <div>수수료 포함: {result.fee}</div>
            {/* 결과 형식에 맞게 자유롭게 표시 */}
          </div>
        )}
      </div>
    </div>
  );
}
