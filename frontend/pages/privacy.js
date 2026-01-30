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
                                    RemitBuddy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.
                                </p>

                                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
                                <p>
                                    We collect information you provide directly to us, such as when you subscribe to our newsletter, contact us for support, or use our comparison tools. This may include your email address and usage data.
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
