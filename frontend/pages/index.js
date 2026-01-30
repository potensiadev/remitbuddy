import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import { useTranslation, Trans } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { trackEvent, ANALYTICS_EVENTS } from '../utils/analytics';

// Import shared constants
import {
  COUNTRIES,
  POPULAR_COUNTRIES,
  OTHER_COUNTRIES,
  FLAG_ASSETS,
  MAX_AMOUNT,
  MIN_AMOUNT,
  getCountryByCode,
  getApiBaseUrl
} from '../lib/constants';

// Import extracted comparison components
import ComparisonResults from '../components/comparison/ComparisonResults';
import { SavedCorridors } from '../components/comparison/SavedCorridors';
import { ChevronDownIcon } from '../components/comparison/Icons';
import HowItWorks from '../components/landing/HowItWorks';
import FAQ from '../components/landing/FAQ';

// Sub-components remaining in file (to be moved later if needed)
const PWAInstallPrompt = ({ onDismiss }) => {
  const { t } = useTranslation('common');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-fade-in-up m-safe-bottom">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">{t('pwa.install_title')}</h3>
            <p className="text-sm text-gray-600 mb-3">{t('pwa.install_desc')}</p>
            <div className="flex items-center gap-2">
              <button onClick={handleInstall} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-all">
                {t('pwa.install_button')}
              </button>
              <button onClick={() => { setShowPrompt(false); onDismiss?.(); }} className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-all">
                {t('pwa.later')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WelcomeBackBanner = ({ lastComparison, onUseLastComparison, onDismiss }) => {
  const { t } = useTranslation('common');
  if (!lastComparison) return null;
  const formattedAmount = parseInt(lastComparison.amount || 0, 10).toLocaleString();

  return (
    <div className="bg-white/80 backdrop-blur-md border border-primary-200 rounded-2xl p-4 sm:p-5 mb-6 animate-fade-in-up shadow-lg shadow-primary-500/5 ring-1 ring-primary-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{t('welcome_back.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('welcome_back.last_comparison')}: <span className="font-semibold text-gray-900">{formattedAmount} KRW</span> → {lastComparison.country}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onUseLastComparison} className="flex-1 sm:flex-none px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-primary-500/20">
            {t('welcome_back.compare_again', { amount: formattedAmount, country: lastComparison.country })}
          </button>
          <button onClick={onDismiss} className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { t } = useTranslation('common');
  const router = useRouter();

  const [amount, setAmount] = useState('1000000');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastComparison, setLastComparison] = useState(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [savedCorridors, setSavedCorridors] = useState([]);
  const [shakeInput, setShakeInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if (router.query.country) {
      const country = getCountryByCode(router.query.country);
      if (country) setSelectedCountry(country);
    }
    if (router.query.amount) {
      const queryAmount = parseInt(router.query.amount, 10);
      if (!isNaN(queryAmount) && queryAmount >= 10000 && queryAmount <= MAX_AMOUNT) {
        setAmount(queryAmount.toString());
      }
    }
  }, [router.query.country, router.query.amount]);

  useEffect(() => {
    try {
      const savedComparison = localStorage.getItem('lastComparison');
      if (savedComparison) {
        const parsed = JSON.parse(savedComparison);
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (parsed.timestamp && parsed.timestamp > sevenDaysAgo) {
          setLastComparison(parsed);
          setShowWelcomeBack(true);
        }
      }
    } catch (e) {
      console.error('Failed to load last comparison:', e);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedCorridors');
      if (saved) setSavedCorridors(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load saved corridors:', e);
    }
  }, []);

  const saveComparison = (compAmount, country) => {
    try {
      const comparisonData = {
        amount: compAmount,
        country: country.name,
        countryCode: country.code,
        currency: country.currency,
        timestamp: Date.now()
      };
      localStorage.setItem('lastComparison', JSON.stringify(comparisonData));
    } catch (e) {
      console.error('Failed to save comparison:', e);
    }
  };

  const handleUseLastComparison = () => {
    if (lastComparison) {
      setAmount(lastComparison.amount);
      const country = COUNTRIES.find(c => c.code === lastComparison.countryCode);
      if (country) setSelectedCountry(country);
      setShowWelcomeBack(false);
      setTimeout(() => {
        document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 100);
    }
  };

  const handleRemoveCorridor = (index) => {
    const updated = savedCorridors.filter((_, i) => i !== index);
    setSavedCorridors(updated);
    localStorage.setItem('savedCorridors', JSON.stringify(updated));
  };

  const handleSelectCorridor = (corridor) => {
    setAmount(corridor.amount);
    const country = COUNTRIES.find(c => c.code === corridor.countryCode);
    if (country) setSelectedCountry(country);
    setTimeout(() => {
      document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showDropdown ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showDropdown]);

  const handleAmountChange = (e) => {
    // 1. Get raw numeric value
    const rawValue = e.target.value.replace(/,/g, '').replace(/\D/g, '');

    // 2. Allow empty input
    if (rawValue === '') {
      setAmount('');
      return;
    }

    const numValue = parseInt(rawValue, 10);

    // 3. Strict Check: If greater than MAX_AMOUNT (5,000,000)
    if (numValue > MAX_AMOUNT) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);

      // If the user typed a massive number (pasted), clamp it.
      if (rawValue.length > MAX_AMOUNT.toString().length + 2) {
        setAmount(MAX_AMOUNT.toString());
      }
      // Otherwise, just ignore this input event (block the change)
      return;
    }

    // 4. Update state directly
    setAmount(rawValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCountry && amount) {
      setIsLoading(true); // Start loading
      const numericAmount = parseInt(amount.replace(/,/g, ''), 10) || 0;

      // Track Lead Gen Event
      trackEvent(ANALYTICS_EVENTS.SEARCH_RATES, {
        corridor: `KRW-${selectedCountry.currency}`,
        amount: numericAmount,
        target_country: selectedCountry.code
      });

      saveComparison(amount, selectedCountry);
      setShowWelcomeBack(false);
      router.push({
        pathname: `/compare/${selectedCountry.slug || selectedCountry.name.toLowerCase().replace(/\s+/g, '-')}`,
        query: { amount: numericAmount.toString() }
      });
      // Note: We don't set isLoading(false) because the page will navigate away.
    }
  };

  const formattedAmount = amount ? parseInt(amount, 10).toLocaleString('en-US') : '';

  return (
    <>
      <Head>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="keywords" content={t('seo.keywords')} />

        {/* Verification Tags */}
        <meta name="msvalidate.01" content="494B757ACE3C4582ECB2450FC6CEB3D4" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={t('seo.title')} />
        <meta property="og:description" content={t('seo.description')} />

        {/* Primary Image (Social - 1200x630) */}
        <meta property="og:image" content="https://www.remitbuddy.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />

        {/* Secondary Image (Messenger - 800x400) - For better visibility in small thumbnails */}
        <meta property="og:image" content="https://www.remitbuddy.com/og-messenger.png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="400" />
        <meta property="og:image:type" content="image/png" />

        <meta property="og:url" content="https://www.remitbuddy.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RemitBuddy" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.title')} />
        <meta name="twitter:description" content={t('seo.description')} />
        <meta name="twitter:image" content="https://www.remitbuddy.com/og-image.png" />

        <link rel="preconnect" href="https://www.remitbuddy.com" />
        {FLAG_ASSETS.map((flag) => (
          <link key={flag} rel="preload" as="image" href={flag} />
        ))}
        {/* Preload critical OG images for bots */}
        <link rel="preload" as="image" href="/og-image.png" />
      </Head>

      <div className="min-h-screen bg-white safe-top safe-bottom">
        <Navigation />

        {/* Hero Section */}
        <section ref={heroRef} id="hero" className="relative pt-24 sm:pt-32 lg:pt-32 pb-12 md:pb-24 overflow-visible">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white to-accent-50/30" />
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">


            <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
              {/* Left Column */}
              <div className="animate-fade-in-up text-center lg:text-left">
                <div className="hidden sm:inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-primary-700 px-3 py-1.5 rounded-full text-xs font-bold mb-4 border border-primary-100 shadow-sm">
                  <span>{t('hero.badge')}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-neutral-900 mb-1 leading-tight tracking-tight">
                  <span className="block mb-1">{t('hero.title_line1')}</span>
                  <span className="block bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent pb-1 lg:pb-3">
                    {t('hero.title_line2')}
                  </span>
                </h1>
                <p className="text-sm sm:text-lg md:text-xl text-neutral-600 mb-6 lg:mb-8 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                  {t('Compare 8 providers in 3 seconds.')}
                  <br className="block" />
                  {t('Users save an average of ₩32,000 per transfer.')}
                </p>

                {/* Social Proof Stats */}
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-3 lg:p-4 shadow-lg border border-white/60 w-fit mx-auto lg:mx-0 ring-1 ring-gray-100 mb-2 lg:mb-0">
                  <div className="grid grid-cols-4 gap-2 sm:gap-8 divide-x divide-gray-200/50">
                    {[
                      { val: '8', label: t('hero.stats_companies') },
                      { val: '18', label: t('hero.stats_countries') },
                      { val: '3s', label: t('hero.stats_seconds_label') },
                      { val: '₩32K', label: t('hero.stats_savings') }
                    ].map((stat, i) => (
                      <div key={i} className="text-center px-1">
                        <div className="text-lg sm:text-2xl md:text-3xl font-black text-primary-600 mb-0.5 lg:mb-1 leading-none">{stat.val}</div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-neutral-500 font-bold uppercase tracking-wider truncate">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="animate-fade-in-up w-full max-w-lg lg:max-w-none mx-auto relative shadow-buffer mt-6 lg:mt-0 px-4 sm:px-0">
                <div className="absolute -inset-8 bg-primary-100/10 blur-3xl -z-10 rounded-full" />

                {savedCorridors.length > 0 && (
                  <SavedCorridors
                    corridors={savedCorridors}
                    onSelectCorridor={handleSelectCorridor}
                    onRemoveCorridor={handleRemoveCorridor}
                  />
                )}

                <form onSubmit={handleSubmit} className="w-full bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 p-4 sm:p-8 shadow-2xl">
                  <h2 className="text-lg sm:text-2xl font-black text-neutral-900 mb-2">{t('form.title')}</h2>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Country Selector */}
                    <div className="relative z-20">
                      <label className="block text-xs sm:text-sm font-bold text-[#4e5968] mb-1.5 ml-1">{t('form.label_country')}</label>
                      <div ref={dropdownRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setShowDropdown(!showDropdown)}
                          className="w-full h-14 sm:h-16 px-4 sm:px-6 bg-white rounded-2xl border border-[#e5e8eb] flex items-center justify-between outline-none"
                        >
                          <div className="flex items-center gap-4">
                            <img src={selectedCountry.flag} alt="" className="w-10 h-10 rounded-full object-cover border border-[#e5e8eb]" />
                            <div className="text-left">
                              <span className="block text-lg font-bold text-[#191f28]">{selectedCountry.name}</span>
                              <span className="text-sm font-medium text-[#8b95a1]">{selectedCountry.currency}</span>
                            </div>
                          </div>
                          <div className={`transform transition-transform ${showDropdown ? 'rotate-180' : ''}`}><ChevronDownIcon /></div>
                        </button>

                        {showDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden z-30 border border-gray-100 ring-1 ring-black/5 animate-fade-in-up origin-top">
                            <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2">
                              {/* Popular Countries Group */}
                              <div className="px-3 py-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase border-b border-gray-100/50 mb-1">
                                {t('form.popular', 'Popular')}
                              </div>
                              {POPULAR_COUNTRIES.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setShowDropdown(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-3 border-b border-gray-50 last:border-0 transition-colors duration-150 group cursor-pointer hover:bg-blue-50 ${selectedCountry.code === country.code
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-transparent text-gray-700'
                                    }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={country.flag}
                                      alt={country.name}
                                      className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-gray-100 group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <span className={`text-base ${selectedCountry.code === country.code ? 'font-bold' : 'font-semibold text-gray-900 group-hover:text-blue-700'}`}>
                                      {country.name}
                                    </span>
                                  </div>
                                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${selectedCountry.code === country.code ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-white border-gray-100 text-gray-400 group-hover:border-blue-200 group-hover:bg-white group-hover:text-blue-600'}`}>
                                    {country.currency}
                                  </span>
                                </button>
                              ))}

                              {/* All Countries Group */}
                              <div className="px-3 py-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase bg-gray-50/30 mt-2 mb-1 rounded-lg">
                                {t('form.all_countries', 'All Countries')}
                              </div>
                              {OTHER_COUNTRIES.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setShowDropdown(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-3 border-b border-gray-50 last:border-0 transition-colors duration-150 group cursor-pointer hover:bg-blue-50 ${selectedCountry.code === country.code
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-transparent text-gray-700'
                                    }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={country.flag}
                                      alt={country.name}
                                      className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-gray-100 group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <span className={`text-base ${selectedCountry.code === country.code ? 'font-bold' : 'font-semibold text-gray-900 group-hover:text-blue-700'}`}>
                                      {country.name}
                                    </span>
                                  </div>
                                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${selectedCountry.code === country.code ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-white border-gray-100 text-gray-400 group-hover:border-blue-200 group-hover:bg-white group-hover:text-blue-600'}`}>
                                    {country.currency}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#4e5968] mb-1.5 ml-1">{t('form.label_amount')}</label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={amount ? parseInt(amount).toLocaleString() : ''}
                          onChange={handleAmountChange}
                          placeholder="1,000,000"
                          className={`w-full h-14 sm:h-16 pl-6 pr-16 bg-[#f2f4f6] rounded-2xl text-lg sm:text-xl font-bold text-[#1b1e26] placeholder-gray-400 outline-none transition-all duration-200 ${shakeInput ? 'ring-2 ring-red-400 bg-red-50' : 'focus:bg-white focus:ring-2 focus:ring-primary-500'}`}
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8b95a1]">KRW</span>
                      </div>
                      <div className="mt-2 ml-1 text-xs font-medium text-[#8b95a1]">
                        ₩{MIN_AMOUNT.toLocaleString()} — ₩{MAX_AMOUNT.toLocaleString()}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 sm:h-16 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-2xl text-base sm:text-lg font-bold transition-all duration-200 shadow-lg shadow-primary-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {t('form.submit')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />
        <FAQ />

        <Footer />
        <PWAInstallPrompt />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
