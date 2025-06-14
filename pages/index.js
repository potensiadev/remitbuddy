import { useState } from 'react';

const countries = [
  { name: 'Vietnam', code: 'VND', flag: '🇻🇳' },
  { name: 'Philippines', code: 'PHP', flag: '🇵🇭' },
  { name: 'Cambodia', code: 'KHR', flag: '🇰🇭' },
  { name: 'Nepal', code: 'NPR', flag: '🇳🇵' },
  { name: 'Myanmar', code: 'MMK', flag: '🇲🇲' },
  { name: 'Thailand', code: 'THB', flag: '🇹🇭' },
  { name: 'Uzbekistan', code: 'UZS', flag: '🇺🇿' },
  { name: 'Indonesia', code: 'IDR', flag: '🇮🇩' },
  { name: 'Sri Lanka', code: 'LKR', flag: '🇱🇰' },
  { name: 'Bangladesh', code: 'BDT', flag: '🇧🇩' },
];

export default function Home() {
  const [amount, setAmount] = useState(1000000);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    console.log('Finding best rate for', selectedCountry.name, 'with amount', amount);
    // API 호출 나중에 여기에!
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">How much should your family receive?</h1>
        <div className="mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount to Receive"
          />
        </div>
        <div className="relative mb-6">
          <button
            onClick={toggleDropdown}
            className="w-full p-3 border rounded-lg flex justify-between items-center bg-white focus:outline-none"
          >
            <span>{selectedCountry.flag} {selectedCountry.name}</span>
            <span>{selectedCountry.code}</span>
          </button>
          {showDropdown && (
            <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => selectCountry(country)}
                  className="w-full flex justify-between p-3 hover:bg-gray-100"
                >
                  <span>{country.flag} {country.name}</span>
                  <span>{country.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Find out the Best Rate
        </button>
      </div>
    </div>
  );
}
