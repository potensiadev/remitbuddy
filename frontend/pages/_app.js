// 파일 위치: /frontend/pages/_app.js
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Script from 'next/script';
import '../styles/globals.css';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <ErrorBoundary>
      {/* Google Analytics with SRI */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-Z0SHT6SKJ3`}
        integrity="sha384-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
        onLoad={() => {
          console.log('🔧 GA 스크립트 로드 완료');
        }}
        onError={() => {
          console.error('⚠️ GA 스크립트 로드 실패 - SRI 검증 실패 가능성');
        }}
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
              send_page_view: false,  // 🔥 page_view 자동 수집 비활성화
              page_path: window.location.pathname,
            });
            
            // GA 로딩 완료 확인
            console.log('🔧 Google Analytics 초기화 완료 (page_view 자동 수집 비활성화)');
            console.log('🔧 window.gtag 사용 가능:', typeof window.gtag !== 'undefined');
          `,
        }}
      />
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default appWithTranslation(MyApp);