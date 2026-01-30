import { GoogleAnalytics } from "nextjs-google-analytics";
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Script from 'next/script';
import '../styles/globals.css';
import { initRetentionTracking } from '../utils/analytics';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // Use the ID from env or fallback (User should update this)
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-Z0SHT6SKJ3';

  useEffect(() => {
    // Initialize retention tracking (counts visits, cohorts)
    initRetentionTracking();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
    }

    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => caches.delete(name));
      });
    }
  }, []);

  return (
    <>
      <GoogleAnalytics trackPageViews gaMeasurementId={measurementId} />

      {/* Google AdSense */}
      <Script
        strategy="lazyOnload"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8945839011287197"
        crossOrigin="anonymous"
      />

      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);