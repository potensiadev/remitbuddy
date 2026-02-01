import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import Navigation from '../../components/Navigation';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getCurrencyPairs } from '../../lib/seo-data';
import { COUNTRIES } from '../../lib/constants';
import { generateSEOMeta } from '../../lib/seo-generator';

/**
 * Currency Pair Page - KRW to [Currency]
 * URL Pattern: /krw-to/vnd, /krw-to/php, /krw-to/usd
 * Generates 38 pages (19 currencies × 2 locales)
 */
export default function CurrencyPairPage({ currencyPair, seoMeta, locale }) {
    const { t } = useTranslation('common');
    const router = useRouter();

    if (!currencyPair) {
        return <div>Currency pair not found</div>;
    }

    const handleCompare = () => {
        router.push(`/send-to/${currencyPair.country.slug}`);
    };

    return (
        <>
            <Head>
                <title>{seoMeta.title}</title>
                <meta name="description" content={seoMeta.description} />
                <meta name="keywords" content={seoMeta.keywords} />
                <link rel="canonical" href={seoMeta.canonical} />

                <meta property="og:title" content={seoMeta.og.title} />
                <meta property="og:description" content={seoMeta.og.description} />
                <meta property="og:image" content={seoMeta.og.image} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(seoMeta.jsonLd) }}
                />
            </Head>

            <div className="min-h-screen bg-white">
                <Navigation />

                <section className="pt-24 pb-16 sm:pt-32">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
                            {locale === 'ko'
                                ? `KRW → ${currencyPair.to} 환율 비교`
                                : `KRW to ${currencyPair.to} Exchange Rate`}
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 text-center">
                            {locale === 'ko'
                                ? `원화를 ${currencyPair.country.name} ${currencyPair.to}로 환전할 때 최고 환율을 받으세요.`
                                : `Get the best rate when converting Korean Won to ${currencyPair.country.name} ${currencyPair.to}.`}
                        </p>

                        <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl p-8 mb-12">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-brand-600 mb-2">
                                    1 {currencyPair.to}
                                </div>
                                <div className="text-gray-600 mb-6">
                                    = ~ KRW
                                </div>
                                <button
                                    onClick={handleCompare}
                                    className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl"
                                >
                                    {t('Compare Live Rates', 'Compare Live Rates')}
                                </button>
                            </div>
                        </div>

                        {/* FAQ for this currency */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-6">
                                {locale === 'ko' ? '자주 묻는 질문' : 'FAQ'}
                            </h2>
                            <details className="bg-gray-50 rounded-lg p-4">
                                <summary className="font-semibold cursor-pointer">
                                    {locale === 'ko'
                                        ? `${currencyPair.to} 환율이 가장 좋은 업체는?`
                                        : `Which provider has the best ${currencyPair.to} rate?`}
                                </summary>
                                <p className="mt-2 text-gray-600">
                                    {locale === 'ko'
                                        ? `환율은 실시간으로 변동하며 업체마다 다릅니다. RemitBuddy에서 9개 업체를 비교해보세요.`
                                        : `Rates vary by provider and change in real-time. Compare 8 providers on RemitBuddy.`}
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

export async function getStaticPaths() {
    const currencyPairs = getCurrencyPairs();
    const paths = [];

    currencyPairs.forEach(pair => {
        paths.push({ params: { currency: pair.to.toLowerCase() }, locale: 'en' });
        paths.push({ params: { currency: pair.to.toLowerCase() }, locale: 'ko' });
    });

    return { paths, fallback: false };
}

export async function getStaticProps({ params, locale }) {
    const { currency } = params;
    const currencyPair = getCurrencyPairs().find(p => p.to.toLowerCase() === currency.toLowerCase());

    if (!currencyPair) {
        return { notFound: true };
    }

    const seoMeta = generateSEOMeta({
        pageType: 'currency-pair',
        country: currencyPair.country,
        currency: currencyPair.to,
        locale
    });

    return {
        props: {
            currencyPair,
            seoMeta,
            locale,
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        }
    };
}
