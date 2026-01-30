import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { ComparisonResults } from '../../components/comparison';
import {
  COUNTRIES,
  getCountryBySlug,
  getApiBaseUrl,
  DEFAULT_AMOUNT,
  MIN_AMOUNT,
  MAX_AMOUNT
} from '../../lib/constants';
import { generateComparisonSEO } from '../../lib/seo';

/**
 * Compare Page - /compare/[country]
 *
 * Dedicated page for comparison results.
 * Design Philosophy: "Invisible Complexity, Visible Clarity"
 *
 * Features:
 * - Shareable URLs with SEO optimization
 * - Server-side rendering for meta tags
 * - Quick amount selection
 * - Related countries navigation
 */
export default function ComparePage({ countryData, initialAmount, seoData }) {
  const { t } = useTranslation('common');
  const router = useRouter();

  const [amount, setAmount] = useState(initialAmount);
  const [savedCorridors, setSavedCorridors] = useState([]);
  const [isCorridorSaved, setIsCorridorSaved] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('https://remitbuddy.up.railway.app');
  const [forceRefresh, setForceRefresh] = useState(0);

  // Set API URL on client side
  useEffect(() => {
    setApiBaseUrl(getApiBaseUrl());
  }, []);

  // Sync amount with URL query parameter
  useEffect(() => {
    if (router.query.amount) {
      const queryAmount = parseInt(router.query.amount, 10);
      if (!isNaN(queryAmount) && queryAmount >= MIN_AMOUNT && queryAmount <= MAX_AMOUNT) {
        setAmount(queryAmount.toString());
      }
    }
  }, [router.query.amount]);

  // Load saved corridors from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedCorridors');
      if (saved) {
        setSavedCorridors(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved corridors:', e);
    }
  }, []);

  // Save corridor handler
  const handleSaveCorridor = () => {
    const newCorridor = {
      amount: amount,
      country: countryData.name,
      countryCode: countryData.code,
      currency: countryData.currency
    };

    const exists = savedCorridors.some(
      c => c.amount === newCorridor.amount && c.countryCode === newCorridor.countryCode
    );

    if (!exists) {
      const updated = [...savedCorridors, newCorridor].slice(-5);
      setSavedCorridors(updated);
      localStorage.setItem('savedCorridors', JSON.stringify(updated));
      setIsCorridorSaved(true);
      setTimeout(() => setIsCorridorSaved(false), 2000);
    }
  };

  // Navigate back to landing page with prefilled form
  const handleCompareAgain = () => {
    router.push({
      pathname: '/',
      query: {
        country: countryData.code,
        amount: amount
      }
    });
  };

  // Handle amount change and update URL
  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
    // Update URL without full page reload
    router.replace({
      pathname: `/compare/${countryData.slug}`,
      query: { amount: newAmount }
    }, undefined, { shallow: true });
    setForceRefresh(prev => prev + 1);
  };

  // Query params for API
  const queryParams = {
    receive_country: countryData.name,
    receive_currency: countryData.currency
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonicalUrl} />

        {/* Open Graph / Social Sharing */}
        <meta property="og:type" content={seoData.og.type} />
        <meta property="og:url" content={seoData.og.url} />
        <meta property="og:title" content={seoData.og.title} />
        <meta property="og:description" content={seoData.og.description} />
        <meta property="og:image" content={seoData.og.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={seoData.og.siteName} />

        {/* Twitter Card */}
        <meta name="twitter:card" content={seoData.twitter.card} />
        <meta name="twitter:title" content={seoData.twitter.title} />
        <meta name="twitter:description" content={seoData.twitter.description} />
        <meta name="twitter:image" content={seoData.twitter.image} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.jsonLd) }}
        />

        {/* Preconnect */}
        <link rel="preconnect" href="https://remitbuddy.up.railway.app" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
        <Navigation />

        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link
                href="/"
                className="text-neutral-500 hover:text-primary-600 transition-colors"
              >
                {t('nav.home', 'Home')}
              </Link>
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link
                href="/#hero"
                className="text-neutral-500 hover:text-primary-600 transition-colors"
              >
                {t('nav.compare', 'Compare')}
              </Link>
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-neutral-900 font-medium flex items-center gap-2">
                <img
                  src={countryData.flag}
                  alt={countryData.name}
                  className="w-5 h-5 rounded-full object-cover border border-neutral-200"
                />
                {countryData.name}
              </span>
            </nav>
          </div>
        </div>



        {/* Main Results Section */}
        <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ComparisonResults
              queryParams={queryParams}
              amount={amount}
              forceRefresh={forceRefresh}
              onCompareAgain={handleCompareAgain}
              apiBaseUrl={apiBaseUrl}
              isAutoScrolling={false}
              onSaveCorridor={handleSaveCorridor}
              isCorridorSaved={isCorridorSaved}
              countryData={countryData}
            />
          </div>
        </section>

        {/* Related Countries Section - Premium Cards */}
        <section className="py-10 sm:py-12 bg-neutral-50 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-6 tracking-tight">
              {t('compare.other_countries', 'Compare Remittance to Other Countries')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {COUNTRIES.filter(c => c.code !== countryData.code).slice(0, 6).map((country, index) => (
                <Link
                  key={country.code}
                  href={`/compare/${country.slug}?amount=${amount}`}
                  className="
                    flex items-center gap-2.5 p-3
                    bg-white rounded-xl
                    border border-neutral-200
                    hover:border-primary-300 hover:shadow-card
                    transition-all duration-200
                    group
                    animate-fade-in-up
                  "
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="
                      w-9 h-9 rounded-lg object-cover
                      border border-neutral-100
                      transition-transform duration-200
                      group-hover:scale-105
                    "
                  />
                  <div className="flex-1 min-w-0">
                    <span className="
                      block text-sm font-semibold
                      text-neutral-900 group-hover:text-primary-600
                      truncate transition-colors
                    ">
                      {country.name}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      {country.currency}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Countries CTA */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="
                  inline-flex items-center gap-2
                  px-5 py-2.5
                  text-sm font-semibold
                  text-primary-600 hover:text-primary-700
                  bg-primary-50 hover:bg-primary-100
                  rounded-xl
                  transition-all duration-200
                  hover:-translate-y-0.5
                "
              >
                {t('compare.view_all_countries', 'View All Countries')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

/**
 * Server-side props for SEO and initial data
 */
export async function getServerSideProps({ params, query, locale }) {
  const { country } = params;
  const amount = query.amount || DEFAULT_AMOUNT.toString();

  // Find country by slug
  const countryData = getCountryBySlug(country);

  // Return 404 if country not found
  if (!countryData) {
    return {
      notFound: true
    };
  }

  // Validate amount
  let validAmount = parseInt(amount, 10);
  if (isNaN(validAmount) || validAmount < MIN_AMOUNT) {
    validAmount = DEFAULT_AMOUNT;
  }
  if (validAmount > MAX_AMOUNT) {
    validAmount = MAX_AMOUNT;
  }

  // Generate SEO metadata
  const seoData = generateComparisonSEO(countryData, validAmount);

  return {
    props: {
      countryData,
      initialAmount: validAmount.toString(),
      seoData,
      ...(await serverSideTranslations('en', ['common']))
    }
  };
}
