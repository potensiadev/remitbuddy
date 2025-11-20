import React from 'react';

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
            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-900">
                RemitBuddy
              </span>
            </div>
            <p className="text-gray-600 mb-8 max-w-md text-base leading-relaxed font-medium">
              해외송금을 더 쉽고 저렴하게.
              <br />
              10개 송금 업체의 수수료를 한번에 비교하세요.
            </p>
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
