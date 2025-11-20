import { useState } from 'react'
import Head from 'next/head'

// Country data
const COUNTRIES = [
  { code: 'VN', name: 'Vietnam', currency: 'VND', flag: '🇻🇳' },
  { code: 'NP', name: 'Nepal', currency: 'NPR', flag: '🇳🇵' },
  { code: 'PH', name: 'Philippines', currency: 'PHP', flag: '🇵🇭' },
  { code: 'TH', name: 'Thailand', currency: 'THB', flag: '🇹🇭' },
  { code: 'MM', name: 'Myanmar', currency: 'MMK', flag: '🇲🇲' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', flag: '🇮🇩' },
  { code: 'KH', name: 'Cambodia', currency: 'KHR', flag: '🇰🇭' },
  { code: 'UZ', name: 'Uzbekistan', currency: 'UZS', flag: '🇺🇿' },
  { code: 'LK', name: 'Sri Lanka', currency: 'LKR', flag: '🇱🇰' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT', flag: '🇧🇩' },
]

// Mock provider data
const PROVIDERS = [
  { id: 'hanpass', name: 'Hanpass', rate: 19250.50, fee: 3000, rating: 4.8 },
  { id: 'wirebarley', name: 'Wirebarley', rate: 19245.20, fee: 2500, rating: 4.7 },
  { id: 'themoin', name: 'The Moin', rate: 19240.00, fee: 3500, rating: 4.6 },
  { id: 'gmeremit', name: 'GME Remit', rate: 19235.80, fee: 4000, rating: 4.5 },
  { id: 'cross', name: 'Cross', rate: 19230.00, fee: 3200, rating: 4.4 },
]

export default function RedesignPage() {
  const [selectedCountry, setSelectedCountry] = useState('VN')
  const [amount, setAmount] = useState('1000000')
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0]

  const handleCompare = async () => {
    setLoading(true)
    setShowResults(false)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setLoading(false)
    setShowResults(true)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  const formatAmount = (value) => {
    const number = parseInt(value.replace(/[^0-9]/g, ''))
    return isNaN(number) ? '' : formatNumber(number)
  }

  return (
    <>
      <Head>
        <title>RemitBuddy - 가장 좋은 환율로 해외송금</title>
        <meta name="description" content="9개 이상의 송금 업체 환율을 실시간으로 비교하고 최대 5%까지 절약하세요" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Minimalist Navigation - Toss Style */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <div className="flex items-center justify-between h-14 md:h-16">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">R</span>
                </div>
                <span className="text-lg md:text-xl font-bold text-gray-900">RemitBuddy</span>
              </div>
              <button className="hidden md:block px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all">
                시작하기
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section - Toss Style: Bold Typography */}
        <main className="pt-14 md:pt-16">
          <section className="px-5 md:px-8 py-12 md:py-20">
            <div className="max-w-[1200px] mx-auto">
              {/* Mobile First Layout */}
              <div className="max-w-[480px] md:max-w-none mx-auto">
                {/* Hero Title */}
                <div className="mb-10 md:mb-16">
                  <h1 className="text-[32px] md:text-[56px] lg:text-[64px] font-bold leading-[1.2] tracking-tight text-gray-900 mb-4 md:mb-6">
                    해외송금,
                    <br />
                    <span className="text-blue-600">가장 좋은 환율</span>로
                    <br />
                    보내세요
                  </h1>
                  <p className="text-base md:text-xl text-gray-600 leading-relaxed">
                    9개 이상의 송금 업체 환율을 실시간으로 비교하고
                    <br className="hidden md:block" />
                    최대 5%까지 절약하세요.
                  </p>
                </div>

                {/* Comparison Card - Toss Style Enhanced */}
                <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 md:p-8 mb-8 md:mb-12 shadow-sm">
                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">보내는 금액</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatAmount(amount)}
                        onChange={(e) => {
                          const numbers = e.target.value.replace(/[^0-9]/g, '')
                          setAmount(numbers)
                        }}
                        placeholder="1,000,000"
                        className="w-full h-16 md:h-[72px] pl-5 pr-16 text-2xl md:text-3xl font-bold bg-white border-2 border-gray-300 rounded-[20px] focus:border-blue-600 focus:outline-none transition-colors"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">
                        원
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">최소 1만원 • 최대 500만원</p>
                  </div>

                  {/* Country Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">받는 나라</label>
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full h-16 md:h-[72px] px-5 bg-white border-2 border-gray-300 rounded-[20px] flex items-center justify-between transition-colors focus:border-blue-600 focus:outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{selectedCountryData.flag}</span>
                          <div className="text-left">
                            <div className="text-sm text-gray-500 mb-0.5">{selectedCountryData.code}</div>
                            <div className="font-semibold text-gray-900 text-lg">{selectedCountryData.name}</div>
                          </div>
                        </div>
                        <svg className={`w-6 h-6 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-[20px] shadow-xl overflow-hidden max-h-[320px] overflow-y-auto">
                            {COUNTRIES.map((country) => (
                              <button
                                key={country.code}
                                onClick={() => {
                                  setSelectedCountry(country.code)
                                  setDropdownOpen(false)
                                }}
                                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                              >
                                <span className="text-3xl">{country.flag}</span>
                                <div className="text-left flex-1">
                                  <div className="text-xs text-gray-500">{country.code}</div>
                                  <div className="font-medium text-gray-900">{country.name}</div>
                                </div>
                                <span className="text-sm text-gray-500">{country.currency}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CTA Button - Toss Style with more rounded corners */}
                  <button
                    onClick={handleCompare}
                    disabled={loading || !amount || parseInt(amount) < 10000}
                    className="w-full h-16 md:h-[72px] bg-blue-600 text-white text-lg md:text-xl font-bold rounded-[20px] hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>비교하는 중...</span>
                      </div>
                    ) : (
                      <>
                        <span>환율 비교하기</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Indicators - Toss Style */}
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-12 md:mb-16">
                  <div className="bg-blue-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">9+</div>
                    <div className="text-xs md:text-sm text-gray-600">송금업체</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">10</div>
                    <div className="text-xs md:text-sm text-gray-600">국가</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">5%</div>
                    <div className="text-xs md:text-sm text-gray-600">평균 절약</div>
                  </div>
                </div>
              </div>

              {/* Results Section - Toss Style */}
              {showResults && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="max-w-[800px] mx-auto">
                    <div className="mb-6 md:mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {selectedCountryData.name} 최고 환율
                      </h2>
                      <p className="text-sm md:text-base text-gray-600">
                        방금 업데이트됨 • 최고 환율순 정렬
                      </p>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      {PROVIDERS.map((provider, index) => {
                        const isBest = index === 0
                        const receiveAmount = Math.floor(parseInt(amount || '0') * provider.rate)

                        return (
                          <div
                            key={provider.id}
                            className={`relative overflow-hidden rounded-2xl transition-all hover:shadow-lg ${
                              isBest
                                ? 'border-2 border-blue-600 bg-blue-50/50'
                                : 'border border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            {isBest && (
                              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                최고 환율
                              </div>
                            )}

                            <div className="p-5 md:p-6">
                              <div className="flex items-start justify-between gap-4">
                                {/* Provider Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-3">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                      {provider.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                      <span className="text-xs md:text-sm">⭐</span>
                                      <span className="text-xs md:text-sm font-semibold text-gray-700">
                                        {provider.rating}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Mobile: Stack vertically */}
                                  <div className="block md:hidden space-y-2">
                                    <div>
                                      <div className="text-xs text-gray-500 mb-1">받는 금액</div>
                                      <div className="text-2xl font-bold text-gray-900">
                                        {formatNumber(receiveAmount)}
                                      </div>
                                      <div className="text-sm text-gray-600">{selectedCountryData.currency}</div>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-500">환율</span>
                                        <span className="ml-2 font-semibold text-gray-900">
                                          {provider.rate.toFixed(2)}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">수수료</span>
                                        <span className="ml-2 font-semibold text-gray-900">
                                          ₩{formatNumber(provider.fee)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Desktop: Horizontal layout */}
                                  <div className="hidden md:flex items-center gap-6">
                                    <div>
                                      <div className="text-xs text-gray-500 mb-1">받는 금액</div>
                                      <div className="text-3xl font-bold text-gray-900">
                                        {formatNumber(receiveAmount)}
                                      </div>
                                      <div className="text-sm text-gray-600">{selectedCountryData.currency}</div>
                                    </div>
                                    <div className="h-12 w-px bg-gray-200" />
                                    <div>
                                      <div className="text-xs text-gray-500">환율</div>
                                      <div className="font-semibold text-gray-900">
                                        {provider.rate.toFixed(2)}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500">수수료</div>
                                      <div className="font-semibold text-gray-900">
                                        ₩{formatNumber(provider.fee)}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* CTA Button */}
                                <button
                                  className={`shrink-0 px-5 md:px-6 py-3 md:py-3.5 rounded-xl font-bold text-sm md:text-base transition-all active:scale-95 ${
                                    isBest
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'bg-gray-900 text-white hover:bg-gray-800'
                                  }`}
                                >
                                  선택
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Savings Banner */}
                    <div className="mt-6 md:mt-8 bg-green-50 border border-green-200 rounded-2xl p-5 md:p-6">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 mb-1">
                            최고 환율로 약 ₩{formatNumber(15000)} 절약!
                          </div>
                          <div className="text-sm text-gray-600">
                            가장 낮은 환율 대비 절약되는 금액입니다
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Features - Toss Style: Clean & Minimal */}
          <section className="px-5 md:px-8 py-12 md:py-20 bg-gray-50">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
                왜 RemitBuddy인가요?
              </h2>
              <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-[480px] md:max-w-none mx-auto">
                <div className="bg-white rounded-3xl p-6 md:p-8">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                    실시간 환율 비교
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    9개 이상의 송금 업체 환율을 실시간으로 확인하고 가장 좋은 환율을 찾으세요.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                    안전한 송금
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    모든 업체는 금융당국의 정식 인가를 받은 안전한 송금 업체입니다.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                    무료 서비스
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    RemitBuddy는 100% 무료입니다. 숨겨진 수수료 없이 투명하게 비교하세요.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer - Toss Style: Minimal */}
          <footer className="px-5 md:px-8 py-12 md:py-16 bg-gray-900 text-white">
            <div className="max-w-[1200px] mx-auto">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-bold">RemitBuddy</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 max-w-md">
                해외송금 환율을 비교하고 최고의 환율로 송금하세요.
              </p>
              <div className="text-xs text-gray-500">
                © 2025 RemitBuddy. All rights reserved.
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  )
}
