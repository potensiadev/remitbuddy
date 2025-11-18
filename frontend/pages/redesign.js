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
const MOCK_PROVIDERS = [
  {
    id: 'hanpass',
    name: 'Hanpass',
    logo: '💳',
    rate: 19250.50,
    fee: 3000,
    feeCurrency: 1.56,
    total: 19248.94,
    rating: 4.8,
  },
  {
    id: 'wirebarley',
    name: 'Wirebarley',
    logo: '🔷',
    rate: 19245.20,
    fee: 2500,
    feeCurrency: 1.30,
    total: 19243.90,
    rating: 4.7,
  },
  {
    id: 'themoin',
    name: 'The Moin',
    logo: '🌟',
    rate: 19240.00,
    fee: 3500,
    feeCurrency: 1.82,
    total: 19238.18,
    rating: 4.6,
  },
  {
    id: 'gmeremit',
    name: 'GME Remit',
    logo: '🏦',
    rate: 19235.80,
    fee: 4000,
    feeCurrency: 2.08,
    total: 19233.72,
    rating: 4.5,
  },
  {
    id: 'cross',
    name: 'Cross',
    logo: '✨',
    rate: 19230.00,
    fee: 3200,
    feeCurrency: 1.66,
    total: 19228.34,
    rating: 4.4,
  },
]

export default function RedesignPage() {
  const [selectedCountry, setSelectedCountry] = useState('VN')
  const [amount, setAmount] = useState('1000000')
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)

  const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0]

  const handleCompare = async () => {
    setLoading(true)
    setShowResults(false)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setLoading(false)
    setShowResults(true)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ko-KR').format(value)
  }

  return (
    <>
      <Head>
        <title>RemitBuddy - Compare Money Transfer Rates (New Design)</title>
        <meta name="description" content="Compare remittance rates from multiple providers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                  R
                </div>
                <span className="text-xl font-bold text-blue-600">
                  RemitBuddy
                </span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a href="/" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Original Version</a>
                <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">How It Works</a>
                <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">About</a>
                <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-cyan-500/5 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Hero Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-700">Trusted by 100,000+ users</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-slate-900">Find the Best</span>
                  <span className="block bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    Money Transfer Rates
                  </span>
                  <span className="text-slate-900">in Real-Time</span>
                </h1>

                <p className="text-lg text-slate-600 leading-relaxed">
                  Compare rates from 9+ licensed Korean remittance providers instantly.
                  Save up to 5% on every transfer with real-time rate comparison.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <div className="text-2xl font-bold text-blue-600">9+</div>
                    <div className="text-sm text-slate-600 mt-1">Providers</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <div className="text-2xl font-bold text-blue-600">10</div>
                    <div className="text-sm text-slate-600 mt-1">Countries</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <div className="text-2xl font-bold text-blue-600">5%</div>
                    <div className="text-sm text-slate-600 mt-1">Avg. Savings</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Comparison Card */}
              <div className="bg-white shadow-2xl border border-slate-200 rounded-xl">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900">Compare Rates Now</h2>
                  <p className="text-slate-600 mt-1">Get instant quotes from multiple providers</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">You Send</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₩</div>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          setAmount(value)
                        }}
                        className="w-full pl-8 pr-16 h-14 text-lg font-semibold border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="1,000,000"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">KRW</div>
                    </div>
                    <p className="text-xs text-slate-500">Min: ₩10,000 • Max: ₩5,000,000</p>
                  </div>

                  {/* Country Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Recipient Country</label>
                    <div className="relative">
                      <button
                        onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                        className="w-full h-14 px-4 text-base border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-left flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{selectedCountryData.flag}</span>
                          <span className="font-medium">{selectedCountryData.name}</span>
                          <span className="ml-auto px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                            {selectedCountryData.currency}
                          </span>
                        </div>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {countryDropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {COUNTRIES.map((country) => (
                            <button
                              key={country.code}
                              onClick={() => {
                                setSelectedCountry(country.code)
                                setCountryDropdownOpen(false)
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3"
                            >
                              <span className="text-xl">{country.flag}</span>
                              <span>{country.name}</span>
                              <span className="text-slate-500 ml-auto text-sm">{country.currency}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compare Button */}
                  <button
                    onClick={handleCompare}
                    disabled={loading || !amount || parseInt(amount) < 10000}
                    className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Comparing Rates...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Compare Rates
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>100% free • Licensed providers only</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {(loading || showResults) && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-6">
              {/* Results Header */}
              {!loading && showResults && (
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                      Best Rates for {selectedCountryData.name}
                    </h2>
                    <p className="text-slate-600 mt-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Updated just now • Sorted by best rate
                    </p>
                  </div>
                  <button
                    onClick={handleCompare}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              )}

              {/* Provider Cards */}
              <div className="grid gap-4">
                {loading ? (
                  // Loading Skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="border-2 border-slate-200 rounded-xl p-6 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-200 rounded-xl animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
                            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="h-8 w-40 bg-slate-200 rounded animate-pulse ml-auto"></div>
                          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse ml-auto"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Provider Results
                  MOCK_PROVIDERS.map((provider, index) => {
                    const isBest = index === 0
                    const receiveAmount = (parseInt(amount) * provider.total).toFixed(2)

                    return (
                      <div
                        key={provider.id}
                        className={`relative border-2 rounded-xl p-6 transition-all hover:shadow-lg cursor-pointer ${
                          isBest ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        {isBest && (
                          <div className="absolute -top-3 left-6">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-full shadow-md">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Best Rate
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-3xl shadow-sm">
                              {provider.logo}
                            </div>

                            <div className="space-y-1">
                              <h3 className="font-bold text-lg text-slate-900">{provider.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="flex items-center gap-1">⭐ {provider.rating}</span>
                                <span>•</span>
                                <span>Licensed Provider</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="space-y-1">
                              <div className="text-xs text-slate-500 uppercase tracking-wide">You Get</div>
                              <div className="text-2xl font-bold text-slate-900">
                                {formatCurrency(parseInt(receiveAmount))}
                              </div>
                              <div className="text-sm text-slate-600">{selectedCountryData.currency}</div>
                            </div>

                            <div className="hidden sm:block w-px h-12 bg-slate-200"></div>

                            <div className="space-y-2 hidden sm:block">
                              <div className="text-xs text-slate-500">Exchange Rate</div>
                              <div className="font-semibold text-slate-900">{provider.rate.toFixed(2)}</div>
                            </div>

                            <div className="space-y-2 hidden sm:block">
                              <div className="text-xs text-slate-500">Fee</div>
                              <div className="font-semibold text-slate-900">₩{formatCurrency(provider.fee)}</div>
                            </div>

                            <button
                              className={`px-6 py-2 text-white font-semibold rounded-lg flex items-center gap-2 ${
                                isBest
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                                  : 'bg-slate-900 hover:bg-slate-800'
                              }`}
                            >
                              Select
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Savings Alert */}
              {!loading && showResults && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-green-800">
                    <strong>You could save ₩{formatCurrency(15000)}</strong> by choosing the best rate compared to the lowest option!
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Why Choose RemitBuddy?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The smartest way to send money internationally from Korea
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl p-6 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Comparison</h3>
              <p className="text-slate-600">
                Get live exchange rates from 9+ providers in seconds. Always know you're getting the best deal.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl p-6 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">100% Safe & Licensed</h3>
              <p className="text-slate-600">
                All providers are licensed by Korean financial authorities. Your money is always secure.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl p-6 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-Language Support</h3>
              <p className="text-slate-600">
                Available in 11 languages including Korean, English, Vietnamese, Nepali, and more.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                    R
                  </div>
                  <span className="text-lg font-bold">RemitBuddy</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Compare remittance rates and save money on every transfer.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition">Compare Rates</a></li>
                  <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition">Disclaimer</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
              © 2025 RemitBuddy. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
