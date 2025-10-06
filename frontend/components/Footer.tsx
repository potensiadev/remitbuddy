import React from 'react';
import { useTranslation } from 'next-i18next';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 리디자인 포인트: 로고와 브랜드 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="font-poppins text-xl font-bold text-gray-900">RemitBuddy</span>
            </div>
            <p className="font-poppins text-gray-600 text-sm leading-relaxed mb-4">
              Korea's most trusted remittance comparison platform. Compare rates from 9+ licensed providers 
              and save up to 5% on your international money transfers.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="font-poppins text-sm text-gray-600 ml-2">4.9/5 (2,000+ reviews)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/supported-countries" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                  Supported Countries
                </a>
              </li>
              <li>
                <a href="/faq" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-poppins font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="/contact" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/advertise" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                  About Advertise
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Supported Countries */}
        <div className="mb-8">
          <h3 className="font-poppins font-semibold text-gray-900 mb-4">Supported Destinations</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Vietnam', flag: '🇻🇳' },
              { name: 'Nepal', flag: '🇳🇵' },
              { name: 'Philippines', flag: '🇵🇭' },
              { name: 'Thailand', flag: '🇹🇭' },
              { name: 'Myanmar', flag: '🇲🇲' },
              { name: 'Indonesia', flag: '🇮🇩' },
              { name: 'Cambodia', flag: '🇰🇭' },
              { name: 'Uzbekistan', flag: '🇺🇿' },
              { name: 'Sri Lanka', flag: '🇱🇰' },
              { name: 'Bangladesh', flag: '🇧🇩' }
            ].map((country) => (
              <div key={country.name} className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                <span className="text-lg">{country.flag}</span>
                <span className="font-poppins text-sm text-gray-700">{country.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mb-8 p-6 bg-white rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-poppins font-semibold text-gray-900 mb-1">100% Secure</h4>
              <p className="font-poppins text-sm text-gray-600">All providers are licensed and regulated</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="font-poppins font-semibold text-gray-900 mb-1">Always Free</h4>
              <p className="font-poppins text-sm text-gray-600">No fees for using our comparison service</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-poppins font-semibold text-gray-900 mb-1">Real-time Rates</h4>
              <p className="font-poppins text-sm text-gray-600">Live exchange rates updated every minute</p>
            </div>
          </div>
        </div>

        {/* 리디자인 포인트: Copyright 및 추가 링크 */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="font-poppins text-sm text-gray-600">
              © 2025 Potensia Inc. All Rights Reserved
            </p>
            <div className="flex items-center space-x-6">
              <a href="/contact" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                Contact
              </a>
              <span className="text-gray-300">|</span>
              <a href="/privacy" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                Privacy
              </a>
              <span className="text-gray-300">|</span>
              <a href="/advertise" className="font-poppins text-sm text-gray-600 hover:text-brand transition-colors">
                About Advertise
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}