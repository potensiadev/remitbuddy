import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Privacy() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { locale } = router;

    return (
        <>
            <Head>
                <title>{t('privacy.page_title')}</title>
                <meta name="description" content={t('privacy.meta_desc')} />
            </Head>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navigation />

                <main className="flex-grow pt-24 pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">{t('privacy.title')}</h1>

                            <div className="prose prose-lg text-gray-600 max-w-none">
                                <p className="mb-6">
                                    {locale === 'ko'
                                        ? `최종 업데이트: ${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}`
                                        : `Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
                                    }
                                </p>

                                {locale === 'ko' ? (
                                    <>
                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. 소개</h2>
                                        <p>
                                            RemitBuddy("우리", "당사")는 귀하의 개인정보 보호를 위해 최선을 다합니다. 이 개인정보처리방침은 귀하가 당사의 웹사이트와 서비스를 이용할 때 당사가 정보를 수집, 사용 및 공유하는 방법을 설명합니다.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. 수집하는 정보</h2>
                                        <p>
                                            당사는 비교 도구 사용 시 귀하의 사용 데이터를 수집할 수 있습니다. 이는 서비스 개선을 위해 사용됩니다.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. 정보 사용 방법</h2>
                                        <p>
                                            당사는 수집한 정보를 서비스 제공, 유지 및 개선, 귀하와의 소통, 추세 및 사용량 분석에 사용합니다.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. 쿠키 및 추적 기술</h2>
                                        <p>
                                            당사는 쿠키 및 유사한 추적 기술을 사용하여 서비스 활동을 추적하고 특정 정보를 보유합니다. 브라우저에서 모든 쿠키를 거부하거나 쿠키가 전송될 때 표시하도록 설정할 수 있습니다.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. 문의하기</h2>
                                        <p>
                                            개인정보 보호정책에 대해 궁금한 점이 있으시면 <a href="mailto:privacy@remitbuddy.com" className="text-brand-600 hover:underline">privacy@remitbuddy.com</a>으로 문의해 주세요.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
                                        <p>
                                            RemitBuddy ("us", "we", or "our") operates RemitBuddy (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Information Collection and Use</h2>
                                        <p>
                                            We collect several different types of information for various purposes to provide and improve our Service to you.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Types of Data Collected</h2>
                                        <p>
                                            We may collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
                                        <p>
                                            We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
                                        <p>
                                            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@remitbuddy.com" className="text-brand-600 hover:underline">privacy@remitbuddy.com</a>
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
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
