import { useState } from 'react';
import Head from 'next/head';

// --- 아이콘 컴포넌트 (heroicons 대체) ---
const ChevronDownIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ArrowRightIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);


// --- Mock Data (API 응답 데이터라고 가정) ---
const mockResults = {
  best_rate_provider: { provider: 'Sentbe' },
  results: [
    {
      provider: 'Sentbe',
      receiveAmount: '1,021,000.62 VND',
      fee: '0 KRW',
      exchangeRate: '100 VND = 5.54 KRW',
      totalPay: '55,700 KRW',
      logo: '/logos/sentbe.png', // 로고 경로는 public 폴더 기준
    },
    {
      provider: 'Hanpass',
      receiveAmount: '1,020,000.23 VND',
      fee: '3,000 KRW',
      exchangeRate: '100 VND = 5.56 KRW',
      totalPay: '58,300 KRW',
      logo: '/logos/hanpass.png',
    },
    {
      provider: 'E9Pay',
      receiveAmount: '1,021,000.62 VND',
      fee: '3,000 KRW',
      exchangeRate: '100 VND = 5.59 KRW',
      totalPay: '58,700 KRW',
      logo: '/logos/e9pay.png',
    },
     {
      provider: 'GME',
      receiveAmount: '1,021,000.62 VND',
      fee: '3,000 KRW',
      exchangeRate: '100 VND = 5.59 KRW',
      totalPay: '58,700 KRW',
      logo: '/logos/gme.png',
    },
    {
      provider: 'Wirebarley',
      receiveAmount: '1,021,000.62 VND',
      fee: '5,000 KRW',
      exchangeRate: '100 VND = 5.59 KRW',
      totalPay: '58,700 KRW',
      logo: '/logos/wirebarley.png',
    },
  ],
};


// --- UI 컴포넌트 ---

// 개별 결과 카드
function ResultCard({ data, isBest }) {
  return (
    <div className={`relative border rounded-xl transition-all duration-300 ${isBest ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200' : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg'}`}>
      {isBest && (
        <div className="absolute -top-3 left-4 text-xs font-semibold text-white bg-emerald-600 px-3 py-1 rounded-full shadow-md">
          🏆 Best Rate to Vietnam
        </div>
      )}
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             <img src={data.logo} alt={`${data.provider} logo`} className="w-10 h-10 object-contain bg-white p-1 rounded-full shadow-sm" />
            <span className="font-bold text-lg text-gray-800">{data.provider}</span>
          </div>
          <ArrowRightIcon className="w-6 h-6 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
            <div >
                <p className="text-sm text-gray-500 mb-1">Receive Amount</p>
                <p className="font-bold text-lg text-emerald-700">{data.receiveAmount}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-1">Total You Pay</p>
                <p className="font-semibold text-gray-800">{data.totalPay}</p>
            </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-3">
            <span>Fee: {data.fee}</span>
            <span className="mx-2">|</span>
            <span>Exchange Rate: {data.exchangeRate}</span>
        </div>
      </div>
    </div>
  );
}


export default function SendhomeUIPage() {
  const [view, setView] = useState('input'); // 'input' or 'results'

  const handleFindRate = (e) => {
    e.preventDefault();
    // 로딩 상태 추가 후 API 호출
    setView('results');
  };

  const handleCompareAgain = () => {
    setView('input');
  }

  return (
    <>
      <Head>
        <title>SendHome - UI Demo</title>
      </Head>
      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="w-full max-w-md mx-auto p-4">
          
          {/* --- 헤더 --- */}
          <header className="flex items-center justify-center gap-2 py-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0 .75-.75v-.75M3.75 17.25v-.75A.75.75 0 0 0 3 16.5h-.75m0 0v.375c0 .621.504 1.125 1.125 1.125h14.25c.621 0 1.125-.504 1.125-1.125v-9.75c0-.621-.504-1.125-1.125-1.125h-14.25A1.125 1.125 0 0 0 3.75 6.375v.375m0 0h1.5m-1.5 0-1.5-1.5m1.5 1.5 1.5-1.5m0 0h.01M6.75 12h.01M9 12h.01M11.25 12h.01M13.5 12h.01M15.75 12h.01M18 12h.01M20.25 12h.01" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800">SendHome</h1>
          </header>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            
            {/* --- 입력 화면 --- */}
            {view === 'input' && (
              <form onSubmit={handleFindRate} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-700">How much should your family receive?</h2>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount to Receive</label>
                  <div className="mt-1 relative">
                    <input 
                      type="text" 
                      defaultValue="1,000,000"
                      className="w-full p-4 pr-24 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                       <button type="button" className="flex items-center gap-1 font-semibold text-gray-600 p-2 rounded-lg hover:bg-gray-100">
                         🇻🇳 VND <ChevronDownIcon className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 p-3 bg-gray-100 rounded-lg">
                  We'll find the best exchange rate for you: <span className="font-bold text-gray-700">VND → KRW</span>
                </div>
                
                <button type="submit" className="w-full bg-blue-600 text-white font-bold text-lg p-4 rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-105">
                  Find out the Best Rate
                </button>
              </form>
            )}

            {/* --- 결과 화면 --- */}
            {view === 'results' && (
              <div className="space-y-5">
                <div className="text-center">
                    <p className="text-gray-600">Amount to Receive</p>
                    <p className="text-2xl font-bold text-gray-800">1,000,000 <span className="text-lg font-semibold text-gray-500">VND</span></p>
                </div>
                
                <div className="border-t border-dashed my-4"></div>
                
                <p className="text-sm font-semibold text-center text-gray-600">Sorted by Most Receive Amount</p>
                
                <div className="space-y-4">
                  {mockResults.results.map((result, index) => (
                    <ResultCard 
                      key={index} 
                      data={result} 
                      isBest={result.provider === mockResults.best_rate_provider.provider}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={handleCompareAgain}
                  className="w-full bg-gray-700 text-white font-bold p-4 rounded-xl shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                >
                  Compare Again
                </button>
              </div>
            )}
            
          </div>
          
          <footer className="text-center text-xs text-gray-400 py-6">
            © {new Date().getFullYear()} SendHome. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
}