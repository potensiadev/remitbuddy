import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import Navigation from '../../components/Navigation';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { generateProviderPairs, PROVIDERS } from '../../lib/seo-data';
import { generateSEOMeta } from '../../lib/seo-generator';

/**
 * Provider Comparison Page  
 * URL Pattern: /providers/hanpass-vs-sentbe, /providers/wirebarley-vs-e9pay
 * Generates 110 pages (55 provider pairs × 2 locales)
 */
export default function ProviderComparisonPage({ provider1, provider2, seoMeta, locale }) {
    const { t } = useTranslation('common');
    const router = useRouter();

    if (!provider1 || !provider2) {
        return <div>Comparison not found</div>;
    }

    return (
        <>
            <Head>
                <title>{seoMeta.title}</title>
                <meta name="description" content={seoMeta.description} />
                <meta name="keywords" content={seoMeta.keywords} />
                <link rel="canonical" href={seoMeta.canonical} />

                <meta property="og:title" content={seoMeta.og.title} />
                <meta property="og:description" content={seoMeta.og.description} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(seoMeta.jsonLd) }}
                />
            </Head>

            <div className="min-h-screen bg-white">
                <Navigation />

                <section className="pt-24 pb-16 sm:pt-32">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
                            {locale === 'ko'
                                ? `${provider1.nameKo} vs ${provider2.nameKo}`
                                : `${provider1.name} vs ${provider2.name}`}
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 text-center">
                            {locale === 'ko'
                                ? '환율, 수수료, 송금 속도를 상세 비교하세요.'
                                : 'Compare exchange rates, fees, and transfer speed in detail.'}
                        </p>

                        {/* Comparison Table */}
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-brand-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-brand-600 mb-4 text-center">
                                    {locale === 'ko' ? provider1.nameKo : provider1.name}
                                </h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{t('Competitive rates', 'Competitive exchange rates')}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{t('Fast transfers', 'Fast transfer times')}</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={() => router.push(`/?provider=${provider1.slug}`)}
                                    className="w-full mt-6 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl"
                                >
                                    {t('Check Rates', 'Check Rates')}
                                </button>
                            </div>

                            <div className="bg-accent-50 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-accent-600 mb-4 text-center">
                                    {locale === 'ko' ? provider2.nameKo : provider2.name}
                                </h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{t('Low fees', 'Low transfer fees')}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{t('Wide coverage', 'Wide country coverage')}</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={() => router.push(`/?provider=${provider2.slug}`)}
                                    className="w-full mt-6 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-xl"
                                >
                                    {t('Check Rates', 'Check Rates')}
                                </button>
                            </div>
                        </div>

                        {/* Bottom CTA */}
                        <div className="text-center bg-gray-50 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold mb-4">
                                {locale === 'ko'
                                    ? '두 업체 모두 비교하고 싶으신가요?'
                                    : 'Want to compare both providers?'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {locale === 'ko'
                                    ? 'RemitBuddy에서 실시간 환율을 확인하고 최저가를 찾아보세요.'
                                    : 'Check live rates on RemitBuddy and find the best deal.'}
                            </p>
                            <button
                                onClick={() => router.push('/')}
                                className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl"
                            >
                                {t('Compare All Providers', 'Compare All Providers')}
                            </button>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}

export async function getStaticPaths() {
    const pairs = generateProviderPairs();
    const paths = [];

    pairs.forEach(pair => {
        paths.push({ params: { slug: pair.slug }, locale: 'en' });
        paths.push({ params: { slug: pair.slug }, locale: 'ko' });
    });

    return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params, locale }) {
    const { slug } = params;
    const [slug1, , slug2] = slug.split('-'); // Split "hanpass-vs-sentbe"

    const provider1 = PROVIDERS.find(p => p.slug === slug1);
    const provider2 = PROVIDERS.find(p => p.slug === slug2);

    if (!provider1 || !provider2) {
        return { notFound: true };
    }

    const seoMeta = generateSEOMeta({
        pageType: 'provider-comparison',
        providers: [provider1, provider2],
        locale
    });

    return {
        props: {
            provider1,
            provider2,
            seoMeta,
            locale,
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        }
    };
}
