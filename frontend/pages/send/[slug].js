import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import Navigation from '../../components/Navigation';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { generateAmountCountryCombinations } from '../../lib/seo-data';
import { getCountryBySlug, parseAmountFromSlug, extractCountrySlug, formatAmount } from '../../lib/constants';
import { generateSEOMeta } from '../../lib/seo-generator';
import { trackEvent, ANALYTICS_EVENTS } from '../../utils/analytics';

/**
 * Amount × Country Dynamic Page
 * 
 * URL Pattern: /send/1000000-to-vietnam, /send/500000-to-philippines
 * Generates 380 pages (10 amounts × 19 countries × 2 locales)
 */
export default function AmountCountryPage({ amount, country, seoMeta, locale }) {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [selectedAmount, setSelectedAmount] = useState(amount);

    useEffect(() => {
        // Track page view
        trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
            page_type: 'amount-country-seo',
            country: country.code,
            amount: amount
        });
    }, [amount, country.code]);

    const handleCompare = () => {
        router.push({
            pathname: `/compare/${country.slug}`,
            query: { amount: selectedAmount }
        });
    };

    if (!country || !amount) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Page not found</p>
            </div>
        );
    }

    const formattedAmount = formatAmount(amount);

    return (
        <>
            <Head>
                <title>{seoMeta.title}</title>
                <meta name="description" content={seoMeta.description} />
                <meta name="keywords" content={seoMeta.keywords} />
                <link rel="canonical" href={seoMeta.canonical} />

                {/* Open Graph */}
                <meta property="og:title" content={seoMeta.og.title} />
                <meta property="og:description" content={seoMeta.og.description} />
                <meta property="og:image" content={seoMeta.og.image} />
                <meta property="og:url" content={seoMeta.og.url} />
                <meta property="og:type" content={seoMeta.og.type} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoMeta.og.title} />
                <meta name="twitter:description" content={seoMeta.og.description} />
                <meta name="twitter:image" content={seoMeta.og.image} />

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(seoMeta.jsonLd) }}
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <Navigation />

                {/* Hero Section */}
                <section className="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-gradient-to-br from-brand-50 via-white to-brand-50/30">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Country Flag */}
                        <div className="inline-flex items-center justify-center mb-6">
                            <img
                                src={country.flag}
                                alt={`${country.name} flag`}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg border-4 border-white object-cover"
                            />
                        </div>

                        {/* H1 - Optimized for SEO */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
                            {locale === 'ko'
                                ? `₩${formattedAmount} → ${country.name} 송금`
                                : `Send ₩${formattedAmount} to ${country.name}`}
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center">
                            {locale === 'ko'
                                ? `9개 송금 업체의 실시간 환율을 비교하고 최저 수수료로 송금하세요.`
                                : `Compare real-time rates from 8 remittance providers and send with the lowest fees.`}
                        </p>

                        {/* Amount Display */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 max-w-md mx-auto">
                            <div className="text-center">
                                <div className="text-sm text-gray-500 mb-2">
                                    {t('form.label_amount', 'You Send')}
                                </div>
                                <div className="text-4xl font-bold text-brand-600 mb-4">
                                    ₩{formattedAmount}
                                </div>
                                <div className="text-sm text-gray-500 mb-2">
                                    {t('Recipient Gets', 'Recipient Gets')}
                                </div>
                                <div className="text-2xl font-semibold text-gray-700">
                                    ~ {country.currency}
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="text-center">
                            <button
                                onClick={handleCompare}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-200 transition-all hover:-translate-y-0.5"
                            >
                                {t('Compare 12 Providers Now', 'Compare 12 Providers Now')}
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
                            {locale === 'ko'
                                ? `왜 RemitBuddy로 ${country.name} 송금을 하나요?`
                                : `Why use RemitBuddy for ${country.name} transfers?`}
                        </h2>

                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">
                                    {locale === 'ko' ? '실시간 환율 비교' : 'Real-time Rate Comparison'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {locale === 'ko' ? '9개 업체의 환율을 3초만에 비교' : 'Compare rates from 8 providers in 3 seconds'}
                                </p>
                            </div>

                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">
                                    {locale === 'ko' ? '평균 ₩32,000 절약' : 'Save up to ₩32,000'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {locale === 'ko' ? '최저 수수료 업체로 큰 금액 절약' : 'Save big with the lowest fee provider'}
                                </p>
                            </div>

                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">
                                    {locale === 'ko' ? '안전하고 투명' : 'Safe & Transparent'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {locale === 'ko' ? '숨겨진 수수료 없이 모든 비용 공개' : 'No hidden fees, all costs disclosed'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section - for long-tail keyword targeting */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            {locale === 'ko' ? '자주 묻는 질문' : 'Frequently Asked Questions'}
                        </h2>

                        <div className="space-y-4">
                            <details className="bg-white rounded-lg p-4 shadow-sm">
                                <summary className="font-semibold text-gray-900 cursor-pointer">
                                    {locale === 'ko'
                                        ? `₩${formattedAmount}을 ${country.name}로 송금하면 수수료가 얼마인가요?`
                                        : `What's the fee for sending ₩${formattedAmount} to ${country.name}?`}
                                </summary>
                                <p className="mt-2 text-gray-600 text-sm">
                                    {locale === 'ko'
                                        ? `업체마다 수수료가 다릅니다. 평균적으로 ₩5,000~₩15,000 사이이며, RemitBuddy에서 9개 업체를 비교하여 최저 수수료 업체를 찾을 수 있습니다.`
                                        : `Fees vary by provider, typically ranging from ₩5,000 to ₩15,000. Use RemitBuddy to compare 8 providers and find the lowest fee.`}
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-4 shadow-sm">
                                <summary className="font-semibold text-gray-900 cursor-pointer">
                                    {locale === 'ko'
                                        ? `${country.name} 송금이 얼마나 빨리 도착하나요?`
                                        : `How fast will my transfer to ${country.name} arrive?`}
                                </summary>
                                <p className="mt-2 text-gray-600 text-sm">
                                    {locale === 'ko'
                                        ? `대부분의 송금은 몇 분에서 1영업일 이내에 도착합니다. 업체와 송금 방법에 따라 다르니 비교 페이지에서 확인하세요.`
                                        : `Most transfers arrive within minutes to 1 business day. Check our comparison page for specific provider transfer times.`}
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-4 shadow-sm">
                                <summary className="font-semibold text-gray-900 cursor-pointer">
                                    {locale === 'ko'
                                        ? `가장 저렴한 ${country.name} 송금 방법은?`
                                        : `What's the cheapest way to send money to ${country.name}?`}
                                </summary>
                                <p className="mt-2 text-gray-600 text-sm">
                                    {locale === 'ko'
                                        ? `한패스, 센트비, 이나인페이 등이 경쟁력 있는 환율과 낮은 수수료를 제공합니다. 금액대별로 최적의 업체가 다르므로 꼭 비교해보세요.`
                                        : `Providers like Hanpass, Sentbe, and E9Pay offer competitive rates and low fees. The best option varies by amount, so always compare.`}
                                </p>
                            </details>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}

/**
 * Generate static paths for all amount × country combinations
 * This creates 190 pages at build time (10 amounts × 19 countries)
 */
export async function getStaticPaths() {
    const combinations = generateAmountCountryCombinations();
    const paths = [];

    // Generate paths for both English and Korean locales
    combinations.forEach(combo => {
        paths.push({
            params: { slug: combo.slug },
            locale: 'en'
        });
        paths.push({
            params: { slug: combo.slug },
            locale: 'ko'
        });
    });

    return {
        paths,
        fallback: 'blocking' // Allow dynamic generation for new combinations
    };
}

/**
 * Generate props for each static page
 */
export async function getStaticProps({ params, locale }) {
    const { slug } = params;

    // Parse amount and country from slug
    const amount = parseAmountFromSlug(slug);
    const countrySlug = extractCountrySlug(slug);
    const country = getCountryBySlug(countrySlug);

    if (!country || !amount) {
        return { notFound: true };
    }

    // Generate SEO metadata
    const seoMeta = generateSEOMeta({
        pageType: 'amount-country',
        country,
        amount,
        locale
    });

    return {
        props: {
            amount,
            country,
            seoMeta,
            locale,
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        },
        revalidate: 3600 // Revalidate every hour
    };
}
