import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Privacy() {
    const { t } = useTranslation('common');

    return (
        <>
            <Head>
                <title>Privacy Policy | RemitBuddy</title>
                <meta name="description" content="Privacy Policy for RemitBuddy" />
            </Head>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navigation />

                <main className="flex-grow pt-24 pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">Privacy Policy</h1>

                            <div className="prose prose-lg text-gray-600 max-w-none">
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
