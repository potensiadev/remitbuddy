import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import Navigation from '../../components/Navigation';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { generateGuidePages, GUIDE_TEMPLATES } from '../../lib/seo-data';
import { COUNTRIES } from '../../lib/constants';
import { generateSEOMeta } from '../../lib/seo-generator';

/**
 * Guide Pages
 * URL Pattern: /guides/how-to-vietnam, /guides/cheapest-philippines
 * Generates 114 pages (3 templates × 19 countries × 2 locales)
 */
export default function GuidePage({ guide, seoMeta, locale }) {
    const { t } = useTranslation('common');
    const router = useRouter();

    if (!guide) {
        return <div>Guide not found</div>;
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

                <article className="pt-24 pb-16 sm:pt-32">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={guide.country.flag}
                                    alt={guide.country.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        {locale === 'ko' ? '가이드' : 'Guide'}
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {guide.title}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none">
                            {guide.template === 'how-to' && (
                                <>
                                    <h2>{locale === 'ko' ? '단계별 송금 방법' : 'Step-by-Step Guide'}</h2>
                                    <ol>
                                        <li>
                                            <strong>{locale === 'ko' ? 'RemitBuddy에서 환율 비교' : 'Compare rates on RemitBuddy'}</strong>
                                            <p>{locale === 'ko' ? '9개 업체의 실시간 환율을 한눈에 비교하세요.' : 'Compare live rates from 8 providers at a glance.'}</p>
                                        </li>
                                        <li>
                                            <strong>{locale === 'ko' ? '최적의 업체 선택' : 'Choose the best provider'}</strong>
                                            <p>{locale === 'ko' ? '금액과 환율을 고려해 가장 저렴한 업체를 선택하세요.' : 'Select the cheapest provider based on amount and rate.'}</p>
                                        </li>
                                        <li>
                                            <strong>{locale === 'ko' ? '송금 진행' : 'Complete transfer'}</strong>
                                            <p>{locale === 'ko' ? '선택한 업체 사이트에서 송금을 진행하세요.' : 'Proceed with the transfer on the selected provider\'s website.'}</p>
                                        </li>
                                    </ol>
                                </>
                            )}

                            {guide.template === 'cheapest' && (
                                <>
                                    <h2>{locale === 'ko' ? '최저 수수료 비교' : 'Fee Comparison'}</h2>
                                    <p>
                                        {locale === 'ko'
                                            ? `${guide.country.name} 송금 시 업체별로 수수료와 환율이 다릅니다. RemitBuddy에서 실시간으로 비교하면 평균 ₩32,000를 절약할 수 있습니다.`
                                            : `Fees and rates vary by provider for ${guide.country.name} transfers. Compare in real-time on RemitBuddy to save up to ₩32,000.`}
                                    </p>

                                    <h3>{locale === 'ko' ? '추천 업체' : 'Recommended Providers'}</h3>
                                    <ul>
                                        <li>한패스 (Hanpass) - {locale === 'ko' ? '경쟁력 있는 환율' : 'Competitive rates'}</li>
                                        <li>센트비 (Sentbe) - {locale === 'ko' ? '낮은 수수료' : 'Low fees'}</li>
                                        <li>이나인페이 (E9Pay) - {locale === 'ko' ? '빠른 송금' : 'Fast transfers'}</li>
                                    </ul>
                                </>
                            )}

                            {guide.template === 'best-rate' && (
                                <>
                                    <h2>{locale === 'ko' ? '최고 환율 받는 법' : 'How to Get the Best Rate'}</h2>
                                    <p>
                                        {locale === 'ko'
                                            ? `${guide.country.currency} 환율은 실시간으로 변동합니다. 다음 팁으로 최고 환율을 받으세요:`
                                            : `${guide.country.currency} rates fluctuate in real-time. Follow these tips to get the best rate:`}
                                    </p>

                                    <ul>
                                        <li>{locale === 'ko' ? '여러 업체 비교하기' : 'Compare multiple providers'}</li>
                                        <li>{locale === 'ko' ? '환율 변동 모니터링' : 'Monitor rate fluctuations'}</li>
                                        <li>{locale === 'ko' ? '큰 금액은 환율 우대' : 'Larger amounts get better rates'}</li>
                                    </ul>
                                </>
                            )}

                            {/* CTA */}
                            <div className="not-prose mt-12 p-6 bg-brand-50 rounded-xl text-center">
                                <h3 className="text-xl font-bold mb-4">
                                    {locale === 'ko' ? '지금 바로 비교하기' : 'Compare Now'}
                                </h3>
                                <button
                                    onClick={() => router.push(`/compare/${guide.country.slug}`)}
                                    className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl"
                                >
                                    {locale === 'ko' ? '환율 비교' : 'Compare Rates'}
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                <Footer />
            </div>
        </>
    );
}

export async function getStaticPaths() {
    const guides = generateGuidePages();
    const paths = guides.map(guide => ({
        params: { slug: guide.slug },
        locale: guide.locale
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params, locale }) {
    const { slug } = params;
    const guides = generateGuidePages();
    const guide = guides.find(g => g.slug === slug && g.locale === locale);

    if (!guide) {
        return { notFound: true };
    }

    const seoMeta = generateSEOMeta({
        pageType: `guide-${guide.template}`,
        country: guide.country,
        currency: guide.country.currency,
        locale
    });

    return {
        props: {
            guide,
            seoMeta,
            locale,
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        }
    };
}
