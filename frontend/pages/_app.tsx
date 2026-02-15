import { GoogleAnalytics } from "nextjs-google-analytics";
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import { initRetentionTracking } from '../utils/analytics';
import { queryClient } from '../lib/queryClient';
import { ErrorBoundary } from '../components';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
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
    <QueryClientProvider client={queryClient}>
      <GoogleAnalytics trackPageViews gaMeasurementId={measurementId} />

      {/* Google AdSense */}


      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>

      {/* React Query Devtools - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp);
