// 파일 위치: /frontend/pages/_app.js
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Script from 'next/script';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Unregister Service Worker (PWA disabled)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
          console.log('Service Worker unregistered');
        });
      });
    }
  }, []);

  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-Z0SHT6SKJ3`}
        onLoad={() => {
          console.log('✅ GA 스크립트 로드 완료');
        }}
        onError={(e) => {
          console.error('❌ GA 스크립트 로드 실패:', e);
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
    </>
  );
}

export default appWithTranslation(MyApp);