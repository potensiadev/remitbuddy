import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

/**
 * Toss-style Navigation Component
 * Mobile: Hamburger menu with full-screen overlay
 * Desktop: Horizontal navigation bar
 */
const Navigation = () => {
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navigation background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const menuItems = {
    service: {
      title: t('nav.service'),
      links: [
        { label: t('nav.service_intro'), href: '#hero' },
        { label: t('nav.service_how'), href: '#how-it-works' },
       // { label: '블로그', href: '#blog' },
        { label: t('nav.service_faq'), href: '#faq' },
      ],
    }
    // contact: {
    //    title: '문의',
    //    links: [
    //      { label: '사업제휴', href: '#partnership' },
    //      { label: '고객센터', href: '#support' },
    // //    // { label: '광고 문의', href: '#advertising' },
    //    ],
    //  },
  };

  const handleLinkClick = (href) => {
    setIsMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto safe-px sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-brand-600 transition-colors duration-200">
                {t('nav.brand')}
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {Object.entries(menuItems).map(([key, section]) => (
              <div key={key} className="relative group">
                <button className="px-4 py-2 text-gray-700 font-semibold hover:text-brand-600 transition-colors duration-200 rounded-lg hover:bg-gray-50">
                  {section.title}
                </button>
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden">
                    {section.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(link.href);
                        }}
                        className="block px-5 py-3 text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-all duration-150 font-medium"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            aria-label={isMenuOpen ? t('nav.close') : t('nav.open')}
          >
            <div className="w-5 h-5 flex flex-col items-center justify-center">
              <span
                className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'mb-1'
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <span className="text-xl font-bold text-gray-900">{t('nav.menu')}</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
              aria-label={t('nav.close')}
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div className="overflow-y-auto h-full pb-24">
            {Object.entries(menuItems).map(([key, section], sectionIndex) => (
              <div key={key} className="py-4">
                {/* Section Title */}
                <div className="px-6 py-2">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>

                {/* Section Links */}
                <div className="mt-2">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }}
                      className="block px-6 py-4 text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-all duration-150 font-medium text-base border-l-4 border-transparent hover:border-brand-600"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                {/* Divider (except for last section) */}
                {sectionIndex < Object.keys(menuItems).length - 1 && (
                  <div className="mt-4 mx-6 border-t border-gray-200"></div>
                )}
              </div>
            ))}

            {/* Language Selector in Mobile Menu */}
            {/* <div className="px-6 py-6 mt-4">
              <button className="w-full px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 text-sm font-semibold">
                한국어
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
