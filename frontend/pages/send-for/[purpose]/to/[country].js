import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from '../../../../components/Footer';
import Navigation from '../../../../components/Navigation';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { generatePurposeCombinations, PURPOSES } from '../../../../lib/seo-data';
import { getCountryBySlug } from '../../../../lib/constants';
import { generateSEOMeta } from '../../../../lib/seo-generator';

/**
 * Purpose-based Landing Page
 * URL Pattern: /send-for/family-support/to/vietnam, /send-for/education/to/philippines
 * Generates 228 pages (6 purposes × 19 countries × 2 locales)
 */
export default function PurposePage({ purpose, country, seoMeta, locale }) {
    const { t } = useTranslation('common');
    const router = useRouter();

    if (!purpose || !country) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Page not found</p>
            </div>
        );
    }

    const handleCompare = () => {
        router.push(`/compare/${country.slug}`);
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

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <Navigation />

                {/* Hero Section */}
                <section className="pt-24 pb-16 sm:pt-32 bg-gradient-to-br from-brand-50 via-white to-brand-50/30">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-6">
                            <img
                                src={country.flag}
                                alt={`${country.name} flag`}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg border-4 border-white object-cover mx-auto"
                            />
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
                            {locale === 'ko'
                                ? `${country.name} ${purpose.name}`
                                : `${country.name} ${purpose.name}`}
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center">
                            {purpose.description}
                        </p>

                        <div className="text-center">
                            <button
                                onClick={handleCompare}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
                            >
                                {t('Compare Best Rates', 'Compare Best Rates')}
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Recommendations Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            {locale === 'ko'
                                ? `${purpose.name} 추천 금액대`
                                : `Recommended Amounts for ${purpose.name}`}
                        </h2>

                        <div className="grid sm:grid-cols-3 gap-4">
                            {[500000, 1000000, 2000000].map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => router.push(`/send/${amount}-to-${country.slug}`)}
                                    className="p-6 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-xl transition-all"
                                >
                                    <div className="text-2xl font-bold text-brand-600 mb-2">
                                        ₩{amount.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {locale === 'ko' ? '환율 비교' : 'Compare Rates'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold mb-6">
                            {locale === 'ko' ? '자주 묻는 질문' : 'FAQ'}
                        </h2>

                        <div className="space-y-4">
                            <details className="bg-white rounded-lg p-4 shadow-sm">
                                <summary className="font-semibold cursor-pointer">
                                    {locale === 'ko'
                                        ? `${country.name} ${purpose.name}에 필요한 서류는?`
                                        : `What documents are needed for ${purpose.name} to ${country.name}?`}
                                </summary>
                                <p className="mt-2 text-gray-600 text-sm">
                                    {locale === 'ko'
                                        ? '송금 목적에 따라 필요한 서류가 다릅니다. 일반적으로 신분증, 송금 목적 증빙서류가 필요하며, 업체별로 차이가 있을 수 있습니다.'
                                        : 'Required documents vary by purpose. Generally, you need ID and proof of purpose. Requirements may differ by provider.'}
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-4 shadow-sm">
                                <summary className="font-semibold cursor-pointer">
                                    {locale === 'ko'
                                        ? `${purpose.name} 최저 수수료는?`
                                        : `What's the lowest fee for ${purpose.name}?`}
                                </summary>
                                <p className="mt-2 text-gray-600 text-sm">
                                    {locale === 'ko'
                                        ? 'RemitBuddy에서 8개 업체를 비교하여 최저 수수료를 찾을 수 있습니다. 금액에 따라 최적의 업체가 다르므로 꼭 비교해보세요.'
                                        : 'Compare 8 providers on RemitBuddy to find the lowest fee. The best option varies by amount.'}
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
    const combinations = generatePurposeCombinations();
    const paths = combinations.map(combo => ({
        params: {
            purpose: combo.purpose.slug,
            country: combo.country.slug
        },
        locale: combo.locale
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params, locale }) {
    const { purpose: purposeSlug, country: countrySlug } = params;

    const purposeList = locale === 'ko' ? PURPOSES.ko : PURPOSES.en;
    const purpose = purposeList.find(p => p.slug === purposeSlug);
    const country = getCountryBySlug(countrySlug);

    if (!purpose || !country) {
        return { notFound: true };
    }

    const seoMeta = generateSEOMeta({
        pageType: 'purpose',
        purpose,
        country,
        locale
    });

    return {
        props: {
            purpose,
            country,
            seoMeta,
            locale,
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        }
    };
}
