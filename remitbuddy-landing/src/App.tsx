import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Menu } from 'lucide-react'

function App() {
  const [selectedCountry, setSelectedCountry] = useState('Vietnam')
  const [amount, setAmount] = useState('1,000,000')
  const [menuOpen, setMenuOpen] = useState(false)

  const countries = [
    { code: 'VN', name: 'Vietnam', currency: 'VND', flagColor: 'bg-red-600' },
    { code: 'PH', name: 'Philippines', currency: 'PHP', flagColor: 'bg-blue-600' },
    { code: 'KH', name: 'Cambodia', currency: 'KHR', flagColor: 'bg-red-700' },
    { code: 'NP', name: 'Nepal', currency: 'NPR', flagColor: 'bg-red-600' },
    { code: 'MM', name: 'Myanmar', currency: 'MMK', flagColor: 'bg-yellow-400' },
    { code: 'TH', name: 'Thailand', currency: 'THB', flagColor: 'bg-blue-800' },
    { code: 'UZ', name: 'Uzbekistan', currency: 'UZS', flagColor: 'bg-blue-400' },
    { code: 'ID', name: 'Indonesia', currency: 'IDR', flagColor: 'bg-red-600' },
    { code: 'LK', name: 'Sri Lanka', currency: 'LKR', flagColor: 'bg-orange-600' },
    { code: 'BD', name: 'Bangladesh', currency: 'BDT', flagColor: 'bg-green-700' },
    { code: 'US', name: 'United States', currency: 'USD', flagColor: 'bg-blue-700' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 sm:px-6 py-5 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-[#00D26A]">RemitBuddy</h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-xl font-semibold text-[#00D26A] hover:opacity-80">About</a>
            <a href="#" className="text-xl font-semibold text-[#00D26A] hover:opacity-80">Blog</a>
            <a href="#" className="text-xl font-semibold text-[#00D26A] hover:opacity-80">Contact</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
          >
            <Menu className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-3 px-4">
            <a href="#" className="text-lg font-semibold text-[#00D26A] hover:opacity-80 py-2">About</a>
            <a href="#" className="text-lg font-semibold text-[#00D26A] hover:opacity-80 py-2">Blog</a>
            <a href="#" className="text-lg font-semibold text-[#00D26A] hover:opacity-80 py-2">Contact</a>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-[#00D26A] pt-6 sm:pt-8 md:pt-10 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Find the Best Exchange Rates in 3 seconds
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium">
              One Click to Compare Fees and Amount
            </p>
          </div>

          {/* Input Card */}
          <div className="max-w-md sm:max-w-lg md:max-w-2xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border-2 sm:border-3 md:border-4 border-[#00D26A] -mb-12 sm:-mb-16 md:-mb-20 relative z-10">
            <div className="space-y-5 sm:space-y-6 md:space-y-8">
              {/* Country Select */}
              <div>
                <label className="block text-base sm:text-lg md:text-xl font-bold text-[#00D26A] mb-3 sm:mb-4">
                  Where are you sending to?
                </label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry} modal={false}>
                  <SelectTrigger className="w-full h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-300 rounded-full px-4 sm:px-6 bg-white hover:border-[#00D26A] focus:border-[#00D26A] focus:ring-0">
                    <SelectValue>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${countries.find(c => c.name === selectedCountry)?.flagColor} flex items-center justify-center shadow-md`}>
                          <span className="text-white text-xs font-bold">
                            {countries.find(c => c.name === selectedCountry)?.code}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-700 text-sm sm:text-base">
                          {selectedCountry} ({countries.find(c => c.name === selectedCountry)?.currency})
                        </span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white max-h-[400px] overflow-y-auto rounded-3xl border-2 border-[#00D26A] shadow-lg"
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={5}
                    avoidCollisions={false}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    {countries.map((country) => (
                      <SelectItem
                        key={country.code}
                        value={country.name}
                        className="text-base py-3 px-4 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${country.flagColor} flex items-center justify-center shadow-md`}>
                            <span className="text-white text-xs font-bold">{country.code}</span>
                          </div>
                          <span className="font-normal text-gray-600">
                            {country.name} ({country.currency})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-base sm:text-lg md:text-xl font-bold text-[#00D26A] mb-3 sm:mb-4">
                  How much do you want to send?
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-12 sm:h-14 text-lg sm:text-xl text-right font-semibold border-2 border-gray-300 rounded-full px-4 sm:px-6 pr-16 sm:pr-20 focus:border-[#00D26A] focus:ring-0"
                  />
                  <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-lg sm:text-xl font-semibold text-gray-700">
                    KRW
                  </span>
                </div>
              </div>

              {/* Compare Button */}
              <Button
                className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold bg-[#00D26A] hover:bg-[#00B359] text-white rounded-full shadow-lg"
              >
                Compare the Best Rates
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* White Background Section */}
      <section className="bg-white pt-16 sm:pt-20 md:pt-24 pb-16">
        {/* Future content can go here */}
      </section>
    </div>
  )
}

export default App
