import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Terms() {
    const { t } = useTranslation('common');

    return (
        <>
            <Head>
                <title>Terms of Service | RemitBuddy</title>
                <meta name="description" content="Terms of Service for RemitBuddy" />
            </Head>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navigation />

                <main className="flex-grow pt-24 pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">Terms of Service</h1>

                            <div className="prose prose-lg text-gray-600 max-w-none">
                                <p className="mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

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
