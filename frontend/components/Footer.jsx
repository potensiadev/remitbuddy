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
      title: t('nav.service.title'),
      links: [
        { label: t('nav.service.about'), href: '#about' },
        { label: t('nav.service.how'), href: '#how-it-works' },
        { label: t('nav.service.faq'), href: '#faq' },
      ],
    },
    contact: {
      title: t('footer.contact.title'),
      items: [
        { label: t('footer.contact.business'), value: 'business@remitbuddy.com' },
        { label: t('footer.contact.support'), value: 'support@remitbuddy.com' },
      ],
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Empty Space (for large screens only) */}
          <div className="hidden lg:block"></div>

          {/* Service Section (Center) */}
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

          {/* Contact Section (Right) */}
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

        </div>

        {/* Brand and Description */}
        <div className="mb-8">
          <div className="mb-4">
            <span className="text-2xl font-bold text-gray-900">{t('brand.name')}</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
            {t('footer.description')}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Copyright and Legal Info */}
          <div className="text-xs text-gray-500 space-y-2">
            <p className="font-medium">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <p className="leading-relaxed max-w-2xl">
              {t('footer.legal_line1')}
            </p>
            <p className="leading-relaxed max-w-2xl">
              {t('footer.legal_line2')}
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
