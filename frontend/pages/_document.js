// 📄 /frontend/pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const { locale } = this.props;

    return (
      <Html lang={locale || 'en'}>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />

          {/* 🧭 기본 SEO / 검색엔진 접근 허용 */}
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />

          {/* 🎨 테마 색상 */}
          <meta name="theme-color" content="#00D26A" />
          <meta name="msapplication-TileColor" content="#00D26A" />

          {/* 🚫 앱 모드 비활성화 */}
          <meta name="apple-mobile-web-app-capable" content="no" />
          <meta name="mobile-web-app-capable" content="no" />

          {/* 🔍 Google Search Console 인증 */}
          <meta
            name="google-site-verification"
            content="5hrs9JLWBmFrpyyg2B2quAHNcUJCH6dv"
          />

          {/* 🔍 Naver Search Console 인증 */}
          <meta
            name="naver-site-verification"
            content="4b4c8a0547f2a3248db54db903f10c9fc140d0f8"
          />

          {/* ⚡️ 사전 연결 (성능 최적화) */}
          <link rel="preconnect" href="https://remitbuddynew.up.railway.app" />
          <link rel="dns-prefetch" href="https://remitbuddynew.up.railway.app" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
          <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* 🖼️ 파비콘 (캐시 무효화 - 여러 형식 제공) */}
          <link rel="icon" href="/icons/favicon.png?v=3" type="image/png" sizes="512x512" />
          <link rel="icon" href="/icons/icon.svg?v=3" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/icons/favicon.png?v=3" />

          {/* Manifest to override cached PWA settings */}
          <link rel="manifest" href="/manifest.json?v=3" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
