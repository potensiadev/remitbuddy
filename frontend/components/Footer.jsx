import React from 'react';

/**
 * Toss-style Footer Component
 * Comprehensive footer with enhanced sections matching Toss design
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    service: {
      title: '서비스',
      links: [
        { label: '서비스 소개', href: '#about' },
        { label: '이용 방법', href: '#how-it-works' },
        { label: 'FAQ', href: '#faq' },
      ],
    },
    contact: {
      title: '문의',
      items: [
        { label: '사업제휴', value: 'business@remitbuddy.com' },
        { label: '고객센터', value: 'support@remitbuddy.com' },
      ],
    },
    customerService: {
      title: '고객센터',
      items: [
        { label: '이메일', value: 'support@remitbuddy.com' },
      ],
    },
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Service Section */}
          <div>
            <h3 className="text-gray-900 font-bold text-sm mb-4">
              {footerSections.service.title}
            </h3>
            <ul className="space-y-3 list-none">
              {footerSections.service.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-150 text-sm block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-gray-900 font-bold text-sm mb-4">
              {footerSections.contact.title}
            </h3>
            <ul className="space-y-3 list-none">
              {footerSections.contact.items.map((item, index) => (
                <li key={index}>
                  <div className="text-gray-600 text-sm">
                    <span className="block font-medium text-gray-700">
                      {item.label}
                    </span>
                    <a
                      href={`mailto:${item.value}`}
                      className="hover:text-brand-600 transition-colors duration-150"
                    >
                      {item.value}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Section */}
          <div>
            <h3 className="text-gray-900 font-bold text-sm mb-4">
              {footerSections.customerService.title}
            </h3>
            <ul className="space-y-3 list-none">
              {footerSections.customerService.items.map((item, index) => (
                <li key={index}>
                  <div className="text-gray-600 text-sm">
                    <span className="block font-medium text-gray-700">
                      {item.label}
                    </span>
                    <a
                      href={`mailto:${item.value}`}
                      className="hover:text-brand-600 transition-colors duration-150"
                    >
                      {item.value}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Brand and Description */}
        <div className="mb-8">
          <div className="mb-4">
            <span className="text-2xl font-bold text-gray-900">RemitBuddy</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
            해외송금을 더 쉽고 저렴하게. 8개 송금 업체의 수수료를 한번에 비교하세요.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Copyright and Legal Info */}
          <div className="text-xs text-gray-500 space-y-2">
            <p className="font-medium">
              © {currentYear} RemitBuddy. All Rights Reserved.
            </p>
            <p className="leading-relaxed max-w-2xl">
              RemitBuddy는 비교 서비스이며 송금업체가 아닙니다.
              실제 송금은 선택하신 제휴 업체를 통해 진행됩니다.
            </p>
            <p className="leading-relaxed max-w-2xl">
              제공되는 환율 및 수수료 정보는 실시간으로 변동될 수 있으며,
              최종 송금 시 업체별로 상이할 수 있습니다.
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow"
              aria-label="Change language"
            >
              한국어
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border - Toss Style */}
      <div className="h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-600"></div>
    </footer>
  );
};

export default Footer;
