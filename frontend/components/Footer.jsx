import React from 'react';
import Image from 'next/image';

/**
 * Toss-style Footer Component
 * A polished footer with modern design and smooth interactions
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    service: [
      { label: '해외송금비교', href: '#compare' },
      { label: '이용 방법', href: '#how-it-works' },
      { label: '특징', href: '#features' },
    ],
    support: [
      { label: '자주 묻는 질문', href: '#faq' },
      { label: '개인정보처리방침', href: '#privacy' },
      { label: '이용약관', href: '#terms' },
    ],
    company: [
      { label: '회사 소개', href: '#about' },
      { label: '블로그', href: '#blog' },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-150">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 transition-transform duration-200 group-hover:scale-110">
                <Image
                  src="/logo.svg"
                  alt="RemitBuddy"
                  width={48}
                  height={48}
                  className="transition-opacity duration-200 group-hover:opacity-80"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                RemitBuddy
              </span>
            </div>
            <p className="text-gray-600 mb-8 max-w-md text-base leading-relaxed font-medium">
              해외송금을 더 쉽고 저렴하게.
              <br />
              10개 송금 업체의 수수료를 한번에 비교하세요.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-500 hover:shadow-toss transition-all duration-200 group"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-500 hover:shadow-toss transition-all duration-200 group"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-500 hover:shadow-toss transition-all duration-200 group"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Service Links */}
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-4">서비스</h3>
              <ul className="space-y-3">
                {footerLinks.service.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-brand-600 transition-colors duration-200 text-sm font-medium block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-4">지원</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-brand-600 transition-colors duration-200 text-sm font-medium block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-4">회사</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-brand-600 transition-colors duration-200 text-sm font-medium block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-12"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500">
            <p className="font-medium">
              © {currentYear} RemitBuddy. All Rights Reserved.
            </p>
            <span className="hidden md:block text-gray-300">•</span>
            <p className="font-medium">
              RemitBuddy는 비교 서비스이며 송금업체가 아닙니다.
            </p>
          </div>

          {/* Language Selector (Optional) */}
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-toss"
              aria-label="Change language"
            >
              한국어
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Element - Toss-style gradient accent */}
      <div className="h-1.5 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-600 shadow-toss-sm"></div>
    </footer>
  );
};

export default Footer;
