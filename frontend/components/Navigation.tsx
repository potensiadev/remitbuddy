import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface NavLink {
  label: string;
  href: string;
}

interface MenuSection {
  title: string;
  links: NavLink[];
}

/**
 * Toss-style Navigation Component
 * Mobile: Hamburger menu with full-screen overlay
 * Desktop: Horizontal navigation bar
 */
const Navigation: React.FC = () => {
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navigation background
  useEffect(() => {
    const handleScroll = (): void => {
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

  const menuItems: { service: MenuSection } = {
    service: {
      title: t('nav.service'),
      links: [
        { label: t('nav.service_intro'), href: '#hero' },
        { label: t('nav.service_how'), href: '#how-it-works' },
        { label: t('nav.service_faq'), href: '#faq' },
      ],
    }
  };

  const handleLinkClick = (href: string): void => {
    setIsMenuOpen(false);

    if (window.location.pathname === '/') {
      const element = document.querySelector(href.replace('/', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
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
            <Link href="/#hero" className="px-4 py-2 text-gray-700 font-semibold hover:text-brand-600 transition-colors duration-200 rounded-lg hover:bg-gray-50 uppercase text-xs tracking-wider">
              {t('nav.service_intro')}
            </Link>
            <Link href="/#how-it-works" className="px-4 py-2 text-gray-700 font-semibold hover:text-brand-600 transition-colors duration-200 rounded-lg hover:bg-gray-50 uppercase text-xs tracking-wider">
              {t('nav.service_how')}
            </Link>
            <Link href="/#faq" className="px-4 py-2 text-gray-700 font-semibold hover:text-brand-600 transition-colors duration-200 rounded-lg hover:bg-gray-50 uppercase text-xs tracking-wider">
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

      {/* Mobile Menu Overlay (Full Screen Premium) */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-500 ${isMenuOpen
          ? 'opacity-100 visible'
          : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        {/* Immersive Background */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl" />

        <div className="relative h-full flex flex-col p-6 safe-top safe-bottom">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-2xl font-bold text-gray-900">{t('nav.brand')}</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center focus:outline-none active:scale-95"
              aria-label={t('nav.close')}
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Card-style Navigation Links */}
          <div className="flex-1 overflow-y-auto space-y-4">
            <a
              href="/#hero"
              onClick={(e) => { e.preventDefault(); handleLinkClick('/#hero'); }}
              className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100 active:scale-[0.98] transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{t('nav.service_intro')}</h3>
                <p className="text-sm font-medium text-gray-500">Find the best rates instantly</p>
              </div>
            </a>

            <a
              href="/#how-it-works"
              onClick={(e) => { e.preventDefault(); handleLinkClick('/#how-it-works'); }}
              className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100 active:scale-[0.98] transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{t('nav.service_how')}</h3>
                <p className="text-sm font-medium text-gray-500">Simple 3-step process</p>
              </div>
            </a>

            <a
              href="/#faq"
              onClick={(e) => { e.preventDefault(); handleLinkClick('/#faq'); }}
              className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100 active:scale-[0.98] transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{t('nav.service_faq')}</h3>
                <p className="text-sm font-medium text-gray-500">Frequently asked questions</p>
              </div>
            </a>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-center text-sm font-medium text-gray-400">© 2024 RemitBuddy</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
