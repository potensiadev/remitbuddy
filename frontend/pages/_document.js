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
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no, viewport-fit=cover"
          />

          {/* 🧭 기본 SEO / 검색엔진 접근 허용 */}
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />

          {/* 🎨 테마 색상 */}
          <meta name="theme-color" content="#00D26A" />
          <meta name="msapplication-TileColor" content="#00D26A" />

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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link rel="preconnect" href="https://www.googletagmanager.com" />

          {/* 🖼️ 파비콘 및 매니페스트 */}
          <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
          <link rel="alternate icon" href="/vite.svg" type="image/svg+xml" />
          <link rel="manifest" href="/manifest.json" />
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
