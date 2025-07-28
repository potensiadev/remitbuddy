// 파일 위치: /frontend/pages/_app.js
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Script from 'next/script';
import '../styles/globals.css';
import { GA_TRACKING_ID, pageview } from '../lib/gtag';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-Z0SHT6SKJ3`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z0SHT6SKJ3', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);