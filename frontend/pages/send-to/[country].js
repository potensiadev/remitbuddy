import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import Navigation from '../../components/Navigation';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Country data for SEO pages
const COUNTRY_DATA = {
  vietnam: {
    name: 'Vietnam',
    code: 'VN',
    currency: 'VND',
    flag: '/images/flags/vn.png',
    popularAmounts: ['500000', '1000000', '2000000', '5000000'],
    description: 'Send money to Vietnam with the best exchange rates. Compare VND rates from 8+ providers.',
  },
  philippines: {
    name: 'Philippines',
    code: 'PH',
    currency: 'PHP',
    flag: '/images/flags/ph.png',
    popularAmounts: ['500000', '1000000', '2000000', '3000000'],
    description: 'Send money to the Philippines with the best rates. Compare PHP rates from multiple providers.',
  },
  nepal: {
    name: 'Nepal',
    code: 'NP',
    currency: 'NPR',
    flag: '/images/flags/np.png',
    popularAmounts: ['500000', '1000000', '2000000'],
    description: 'Send money to Nepal with competitive rates. Compare NPR exchange rates instantly.',
  },
  cambodia: {
    name: 'Cambodia',
    code: 'KH',
    currency: 'KHR',
    flag: '/images/flags/kh.png',
    popularAmounts: ['500000', '1000000', '2000000'],
    description: 'Send money to Cambodia with the best KHR exchange rates. Compare providers instantly.',
  },
  thailand: {
    name: 'Thailand',
    code: 'TH',
    currency: 'THB',
    flag: '/images/flags/th.png',
    popularAmounts: ['500000', '1000000', '2000000'],
    description: 'Send money to Thailand with competitive THB rates. Compare multiple providers.',
  },
  indonesia: {
    name: 'Indonesia',
    code: 'ID',
    currency: 'IDR',
    flag: '/images/flags/id.png',
    popularAmounts: ['500000', '1000000', '2000000'],
    description: 'Send money to Indonesia with the best IDR exchange rates. Compare providers.',
  },
  'united-states': {
    name: 'United States',
    code: 'US',
    currency: 'USD',
    flag: '/images/flags/us.png',
    popularAmounts: ['1000000', '2000000', '5000000'],
    description: 'Send money to the United States with competitive USD rates. Compare providers.',
  },
  japan: {
    name: 'Japan',
    code: 'JP',
    currency: 'JPY',
    flag: '/images/flags/jp.png',
    popularAmounts: ['1000000', '2000000', '5000000'],
    description: 'Send money to Japan with the best JPY exchange rates. Compare providers.',
  },
  china: {
    name: 'China',
    code: 'CN',
    currency: 'CNY',
    flag: '/images/flags/cn.png',
    popularAmounts: ['1000000', '2000000', '5000000'],
    description: 'Send money to China with competitive CNY rates. Compare multiple providers.',
  },
};

export default function CountryPage({ countryData }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState(countryData?.popularAmounts?.[1] || '1000000');

  if (!countryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('country_page.not_found')}</p>
      </div>
    );
  }

  const handleCompare = (amount) => {
    router.push(`/?country=${countryData.code}&amount=${amount}`);
  };

  return (
    <>
      <Head>
        <title>Send Money to {countryData.name} | RemitBuddy</title>
        <meta name="description" content={countryData.description} />
        <meta name="keywords" content={`send money to ${countryData.name}, ${countryData.currency} exchange rate, Korea to ${countryData.name} transfer, remittance ${countryData.name}`} />
        <meta property="og:title" content={`Send Money to ${countryData.name} | RemitBuddy`} />
        <meta property="og:description" content={countryData.description} />
        <link rel="canonical" href={`https://www.remitbuddy.com/send-to/${countryData.name.toLowerCase().replace(' ', '-')}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation />

        {/* Hero Section */}
        <section className="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-gradient-to-br from-brand-50 via-white to-brand-50/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Country Flag */}
            <div className="inline-flex items-center justify-center mb-6">
              <img
                src={countryData.flag}
                alt={`${countryData.name} flag`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg border-4 border-white object-cover"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('country_page.title', 'Send Money to {{country}}').replace('{{country}}', countryData.name)}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('country_page.subtitle', 'Compare the best rates for {{currency}} transfers from Korea').replace('{{currency}}', countryData.currency)}
            </p>

            {/* Popular Amounts */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-500 mb-4">
                {t('country_page.popular_amounts', 'Popular amounts')}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {countryData.popularAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`px-5 py-3 rounded-xl font-semibold transition-all ${selectedAmount === amount
                        ? 'bg-brand-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-300 hover:bg-brand-50'
                      }`}
                  >
                    ₩{parseInt(amount).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleCompare(selectedAmount)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-200 transition-all hover:-translate-y-0.5"
            >
              {t('country_page.start_comparison', 'Compare Rates Now')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
              {t('country_page.why_choose', 'Why send to {{country}} with RemitBuddy?').replace('{{country}}', countryData.name)}
            </h2>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('country_page.benefit_1', 'Real-time rates from 8+ providers')}</h3>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {t('country_page.benefit_2', 'See exactly how much {{currency}} arrives').replace('{{currency}}', countryData.currency)}
                </h3>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('country_page.benefit_3', 'No hidden fees or surprises')}</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Other Countries */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-8">{t('country_page.other_destinations')}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(COUNTRY_DATA)
                .filter(([slug]) => slug !== router.query.country)
                .slice(0, 6)
                .map(([slug, data]) => (
                  <Link
                    key={slug}
                    href={`/send-to/${slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-brand-300 hover:bg-brand-50 transition-all"
                  >
                    <img src={data.flag} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-medium text-gray-700">{data.name}</span>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const paths = Object.keys(COUNTRY_DATA).map((country) => ({
    params: { country },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params, locale }) {
  const countryData = COUNTRY_DATA[params.country] || null;

  return {
    props: {
      countryData,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}
