import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Terms() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { locale } = router;

    return (
        <>
            <Head>
                <title>{t('terms.page_title')}</title>
                <meta name="description" content={t('terms.meta_desc')} />
            </Head>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navigation />

                <main className="flex-grow pt-24 pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">{t('terms.title')}</h1>

                            <div className="prose prose-lg text-gray-600 max-w-none">
                                <p className="mb-6">
                                    {locale === 'ko'
                                        ? `최종 업데이트: ${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}`
                                        : `Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
                                    }
                                </p>

                                {locale === 'ko' ? (
                                    <>
                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. 약관의 승인</h2>
                                        <p>
                                            RemitBuddy에 접속하고 사용함으로써 귀하는 본 계약의 약관 및 조항을 수락하고 동의하게 됩니다.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. 서비스 설명</h2>
                                        <p>
                                            RemitBuddy는 해외 송금 비교 서비스를 제공합니다. 당사는 직접 송금 서비스를 제공하지 않으며, 사용자가 최고의 업체를 찾을 수 있도록 정보를 제공합니다.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. 보증의 부인</h2>
                                        <p>
                                            서비스는 "있는 그대로" 및 "이용 가능한 대로" 제공됩니다. 당사는 제공된 정보의 정확성, 완전성 또는 적시성을 보장하지 않습니다. 환율 및 수수료는 업체에 의해 예고 없이 변경될 수 있습니다.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. 책임의 제한</h2>
                                        <p>
                                            RemitBuddy는 어떠한 경우에도 수익 손실, 데이터 손실, 사용 손실, 영업권 손실 또는 기타 무형의 손실을 포함한 간접적, 부수적, 특별, 결과적 또는 징벌적 손해에 대해 책임을 지지 않습니다.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. 준거법</h2>
                                        <p>
                                            본 약관은 대한민국 법률에 따라 규율되고 해석됩니다.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                                        <p>
                                            By accessing and using RemitBuddy, you accept and agree to be bound by the terms and provisions of this agreement.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
                                        <p>
                                            RemitBuddy provides a comparison service for international money transfers. We do not provide money transfer services directly but provide information to help users find the best provider.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Disclaimer of Warranties</h2>
                                        <p>
                                            The service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not guarantee the accuracy, completeness, or timeliness of the information provided. Rates and fees are subject to change by providers without notice.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Limitation of Liability</h2>
                                        <p>
                                            In no event shall RemitBuddy be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Governing Law</h2>
                                        <p>
                                            These Terms shall be governed and construed in accordance with the laws of South Korea, without regard to its conflict of law provisions.
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
