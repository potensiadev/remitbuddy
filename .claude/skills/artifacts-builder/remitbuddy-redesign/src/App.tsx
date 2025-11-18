import { useState, useEffect } from 'react'
import { Search, TrendingUp, Shield, Zap, ChevronDown, Check, ArrowRight, RefreshCw, Clock, Award, Users, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

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

function App() {
  const [selectedCountry, setSelectedCountry] = useState('VN')
  const [amount, setAmount] = useState('1000000')
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [providers, setProviders] = useState(MOCK_PROVIDERS)

  const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0]

  const handleCompare = async () => {
    setLoading(true)
    setShowResults(false)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setLoading(false)
    setShowResults(true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value)
  }

  const formatForeignCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + ' ' + currency
  }

  return (
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
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Compare Rates</a>
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">About</a>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all">
                Get Started
              </Button>
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
                <Award className="w-4 h-4 text-blue-600" />
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
            <Card className="bg-white shadow-2xl border-slate-200">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-slate-900">Compare Rates Now</CardTitle>
                <CardDescription className="text-slate-600">
                  Get instant quotes from multiple providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    You Send
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                      ₩
                    </div>
                    <Input
                      type="text"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        setAmount(value)
                      }}
                      className="pl-8 h-14 text-lg font-semibold border-2 focus:border-blue-500"
                      placeholder="1,000,000"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      KRW
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Min: ₩10,000 • Max: ₩5,000,000
                  </p>
                </div>

                {/* Country Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Recipient Country
                  </label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="h-14 text-base border-2 focus:border-blue-500">
                      <SelectValue>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{selectedCountryData.flag}</span>
                          <span className="font-medium">{selectedCountryData.name}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {selectedCountryData.currency}
                          </Badge>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{country.flag}</span>
                            <span>{country.name}</span>
                            <span className="text-slate-500 ml-auto text-sm">{country.currency}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Compare Button */}
                <Button
                  onClick={handleCompare}
                  disabled={loading || !amount || parseInt(amount) < 10000}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-lg hover:shadow-xl transition-all text-white"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Comparing Rates...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Compare Rates
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                  <Shield className="w-3.5 h-3.5" />
                  <span>100% free • Licensed providers only</span>
                </div>
              </CardContent>
            </Card>
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
                    <Clock className="w-4 h-4" />
                    Updated just now • Sorted by best rate
                  </p>
                </div>
                <Button variant="outline" onClick={handleCompare}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            )}

            {/* Provider Cards */}
            <div className="grid gap-4">
              {loading ? (
                // Loading Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-16 h-16 rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Skeleton className="h-8 w-40 ml-auto" />
                          <Skeleton className="h-4 w-32 ml-auto" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Provider Results
                providers.map((provider, index) => {
                  const isBest = index === 0
                  const receiveAmount = (parseInt(amount) * provider.total).toFixed(2)

                  return (
                    <Card
                      key={provider.id}
                      className={`
                        border-2 transition-all hover:shadow-lg cursor-pointer
                        ${isBest ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-slate-200 hover:border-blue-300'}
                      `}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          {/* Provider Info */}
                          <div className="flex items-center gap-4">
                            {isBest && (
                              <div className="absolute -top-3 left-6">
                                <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md">
                                  <Award className="w-3 h-3 mr-1" />
                                  Best Rate
                                </Badge>
                              </div>
                            )}

                            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-3xl shadow-sm">
                              {provider.logo}
                            </div>

                            <div className="space-y-1">
                              <h3 className="font-bold text-lg text-slate-900">{provider.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  ⭐ {provider.rating}
                                </span>
                                <span>•</span>
                                <span>Licensed Provider</span>
                              </div>
                            </div>
                          </div>

                          {/* Rate Info */}
                          <div className="flex items-center gap-6">
                            <div className="space-y-1">
                              <div className="text-xs text-slate-500 uppercase tracking-wide">You Get</div>
                              <div className="text-2xl font-bold text-slate-900">
                                {formatCurrency(parseInt(receiveAmount))}
                              </div>
                              <div className="text-sm text-slate-600">
                                {selectedCountryData.currency}
                              </div>
                            </div>

                            <Separator orientation="vertical" className="h-12 hidden sm:block" />

                            <div className="space-y-2 hidden sm:block">
                              <div className="text-xs text-slate-500">Exchange Rate</div>
                              <div className="font-semibold text-slate-900">
                                {provider.rate.toFixed(2)}
                              </div>
                            </div>

                            <div className="space-y-2 hidden sm:block">
                              <div className="text-xs text-slate-500">Fee</div>
                              <div className="font-semibold text-slate-900">
                                ₩{formatCurrency(provider.fee)}
                              </div>
                            </div>

                            <Button
                              className={`
                                ${isBest
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                                  : 'bg-slate-900 hover:bg-slate-800'
                                }
                              `}
                            >
                              Select
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>

            {/* Savings Alert */}
            {!loading && showResults && (
              <Alert className="bg-green-50 border-green-200">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>You could save ₩{formatCurrency(15000)}</strong> by choosing the best rate compared to the lowest option!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Why Choose RemitBuddy?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            The smartest way to send money internationally from Korea
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-slate-200 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Real-Time Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Get live exchange rates from 9+ providers in seconds. Always know you're getting the best deal.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">100% Safe & Licensed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                All providers are licensed by Korean financial authorities. Your money is always secure.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Multi-Language Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Available in 11 languages including Korean, English, Vietnamese, Nepali, and more.
              </p>
            </CardContent>
          </Card>
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

          <Separator className="my-8 bg-slate-800" />

          <div className="text-center text-sm text-slate-400">
            © 2025 RemitBuddy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
