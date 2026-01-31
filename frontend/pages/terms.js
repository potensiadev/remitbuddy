import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Terms() {
    const { t } = useTranslation('common');

    const { useRouter } = require('next/router');
    const { locale } = useRouter();

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
<<<<<<< HEAD
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
                                            본 약관은 국제사법 규정과 무관하게 대한민국 법률의 적용을 받습니다.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                                        <p>
                                            By accessing and using RemitBuddy, you accept and agree to be bound by the terms and provision of this agreement.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
                                        <p>
                                            RemitBuddy provides a comparison service for international money transfers. We do not transfer money ourselves but provide information to help users find the best providers.
                                        </p>

                                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Disclaimer of Warranties</h2>
                                        <p>
                                            The service is provided on an "as is" and "as available" basis. We do not guarantee the accuracy, completeness, or timeliness of the information provided. Exchange rates and fees are subject to change by the providers without notice.
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
=======
                                <p className="mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                                <p>
                                    By accessing and using RemitBuddy ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Nature of Service</h2>
                                <p>
                                    RemitBuddy is an <strong>information aggregation and comparison service</strong>, not a financial institution, bank, or money transfer provider.
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>We do not handle, hold, or transfer user funds at any point.</li>
                                    <li>We display exchange rates and fees provided by third-party remittance companies.</li>
                                    <li>All actual money transfer transactions are conducted on the respective provider's website or app, subject to their own terms and conditions.</li>
                                </ul>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Accuracy of Information</h2>
                                <p>
                                    While we strive to provide real-time and accurate data, exchange rates fluctuate seconds by second.
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><strong>Estimates Only:</strong> The rates, fees, and transfer times shown on RemitBuddy are estimates based on the latest data available to us. they may differ slightly from the final rate offered by the provider at the exact moment of your transaction.</li>
                                    <li><strong>No Guarantee:</strong> We do not guarantee that the rates shown on our site will be available at the time you leave our site to make a transfer. Always verify the final amount on the provider's official page before confirming payment.</li>
                                </ul>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Third-Party Services</h2>
                                <p>
                                    Our Service contains links to third-party web sites or services that are not owned or controlled by RemitBuddy.
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>RemitBuddy bas no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services.</li>
                                    <li>We are not responsible for any issues that arise during your transaction with a third-party provider, including but not limited to delayed transfers, lost funds, or account restrictions.</li>
                                    <li>You acknowledge and agree that RemitBuddy shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of any such content, goods or services available on or through any such web sites or services.</li>
                                </ul>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Intellectual Property</h2>
                                <p>
                                    The Service and its original content, features and functionality are and will remain the exclusive property of RemitBuddy and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of RemitBuddy.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
                                <p>
                                    In no event shall RemitBuddy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Changes to Terms</h2>
                                <p>
                                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Contact Us</h2>
                                <p>
                                    If you have any questions about these Terms, please contact us at: <a href="mailto:support@remitbuddy.com" className="text-brand-600 hover:underline">support@remitbuddy.com</a>
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
