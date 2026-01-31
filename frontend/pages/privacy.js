import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Privacy() {
    const { t } = useTranslation('common');

    const { useRouter } = require('next/router');
    const { locale } = useRouter();

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
<<<<<<< HEAD
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
                                            이 개인정보처리방침에 대해 질문이 있는 경우 privacy@remitbuddy.com으로 문의하십시오: <a href="mailto:privacy@remitbuddy.com" className="text-brand-600 hover:underline">privacy@remitbuddy.com</a>
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
                                        <p>
                                            RemitBuddy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
                                        <p>
                                            We may collect usage data when you use our comparison tools. This data is used to improve our services.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
                                        <p>
                                            We use the information we collect to provider, maintain, and improve our services, to communicate with you, and to monitor and analyze trends and usage.
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
=======
                                <p className="mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
                                <p>
                                    RemitBuddy ("we," "our," or "us") respects your privacy. This Privacy Policy explains that we operate as a comparison service and do not execute financial transactions directly. We prioritize minimizing data collection.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Collection of Personal Information</h2>
                                <p className="font-semibold text-gray-800">We do NOT collect personal identification information for comparison purposes.</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><strong>No Sign-Up Required:</strong> You can use our comparison tool without creating an account.</li>
                                    <li><strong>Transaction Data:</strong> Since we do not process money transfers, we never see or store your bank account details, credit card numbers, or transaction history. All transfers happen on third-party provider websites.</li>
                                    <li><strong>Input Data:</strong> The amounts and countries you enter for comparison are used solely to generate real-time quotes and are not linked to your identity.</li>
                                </ul>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Information We Collect Automatically</h2>
                                <p>
                                    Like most websites, we may collect non-personal technical data to improve our service:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><strong>Usage Data:</strong> Pages visited, time spent, and click actions (e.g., clicking a "Go to Provider" button).</li>
                                    <li><strong>Device Information:</strong> Browser type, device type (mobile/desktop), and approximate location (country level) based on IP address.</li>
                                    <li><strong>Local Storage:</strong> We allow your browser to save your "Last Comparison" settings locally on your device for your convenience. This data never leaves your device.</li>
                                </ul>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Cookies and Analytics</h2>
                                <p>
                                    We use cookies and similar technologies (e.g., Google Analytics) to understand how users interact with our site. This helps us optimize the user experience. You can disable cookies in your browser settings at any time.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Third-Party Links</h2>
                                <p>
                                    RemitBuddy contains links to external remittance provider websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to read their privacy policies before providing any personal information.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Changes to This Policy</h2>
                                <p>
                                    We may update this policy periodically. Changes will be posted on this page with an updated date.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Contact Us</h2>
                                <p>
                                    If you have questions about our data practices, please contact us at: <a href="mailto:privacy@remitbuddy.com" className="text-brand-600 hover:underline">privacy@remitbuddy.com</a>
                                </p>
>>>>>>> 290518636de02a2a1b2996aab642d2d67f9ac1cf
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
