import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from './LanguageSwitcher';

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
        { label: t('nav.service_faq'), href: '#faq' },
      ],
    }
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-smooth safe-top ${isScrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/20 border-b border-gray-100'
        : 'bg-white'
        }`}
    >
      <div className="max-w-7xl mx-auto safe-px sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-brand-600 transition-colors duration-200">
                {t('nav.brand')}
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="#hero" className="px-4 py-2 text-gray-700 font-semibold hover:text-brand-600 transition-colors duration-200 rounded-lg hover:bg-gray-50 uppercase text-xs tracking-wider">
              {t('nav.service_intro')}
            </Link>
            <Link href="#how-it-works" className="px-4 py-2 text-gray-700 font-semibold hover:text-brand-600 transition-colors duration-200 rounded-lg hover:bg-gray-50 uppercase text-xs tracking-wider">
              {t('nav.service_how')}
            </Link>
            <Link href="#faq" className="px-4 py-2 text-gray-700 font-semibold hover:text-brand-600 transition-colors duration-200 rounded-lg hover:bg-gray-50 uppercase text-xs tracking-wider">
              {t('nav.service_faq')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              aria-label={isMenuOpen ? t('nav.close') : t('nav.open')}
            >
              <div className="w-5 h-5 flex flex-col items-center justify-center">
                <span
                  className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'
                    }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'mb-1'
                    }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                    }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen
          ? 'opacity-100 visible'
          : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0'
            }`}
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 safe-top">
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
          <div className="overflow-y-auto h-full px-6 pb-24 safe-bottom">
            <div className="py-6 space-y-8">
              {Object.entries(menuItems).map(([key, section]) => (
                <div key={key}>
                  {/* Section Title */}
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">
                    {section.title}
                  </h3>

                  {/* Section Links */}
                  <div className="space-y-1">
                    {section.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(link.href);
                        }}
                        className="block px-4 py-3 text-lg font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary-600 rounded-xl transition-all duration-200"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              {/* Added FAQ Link specifically if it's separate, but it's in service menu already */}

              <div className="pt-6 border-t border-gray-100">
                <p className="px-2 text-xs text-gray-400 font-medium">
                  Need help? <a href="mailto:support@remitbuddy.com" className="text-primary-600">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

