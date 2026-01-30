import React from 'react';
import { useTranslation } from 'next-i18next';

/**
 * Toss-style Footer Component
 * Comprehensive footer with enhanced sections matching Toss design
 */
const Footer = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const footerSections = {
    service: {
      title: t('nav.service'),
      links: [
        { label: t('nav.service_intro'), href: '#hero' },
        { label: t('nav.service_how'), href: '#how-it-works' },
        { label: t('nav.service_faq'), href: '#faq' },
      ],
    },
    contact: {
      title: t('footer.contact'),
      items: [
        { label: t('footer.contact_business'), value: 'business@remitbuddy.com' },
        { label: t('footer.contact_support'), value: 'support@remitbuddy.com' },
      ],
    },
    legal: {
      title: t('footer.legal', 'Legal'),
      links: [
        { label: t('footer.privacy'), href: '/privacy' },
        { label: t('footer.terms'), href: '/terms' },
      ],
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand and Description (Span 1 or 2 if needed) */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">{t('footer.title')}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Service Section */}
          <div>
            <h3 className="text-gray-900 font-bold text-sm mb-4">
              {footerSections.service.title}
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
              {footerSections.service.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-brand-600 transition-colors duration-150 text-sm block"
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
            <ul className="space-y-3 list-none p-0 m-0">
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

          {/* Legal Section */}
          <div>
            <h3 className="text-gray-900 font-bold text-sm mb-4">
              {footerSections.legal.title}
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
              {footerSections.legal.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-brand-600 transition-colors duration-150 text-sm block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Copyright and Legal Info */}
          <div className="text-xs text-gray-400 space-y-2">
            <p className="font-medium text-gray-500">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <p className="leading-relaxed max-w-2xl">
              {t('footer.disclaimer_1')}
            </p>
            <p className="leading-relaxed max-w-2xl">
              {t('footer.disclaimer_2')}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border - Toss Style */}
      <div className="h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-600"></div>
    </footer>
  );
};

export default Footer;
