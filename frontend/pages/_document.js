import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const { locale } = this.props;
    
    return (
      <Html lang={locale}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no, viewport-fit=cover" />
          
          {/* Basic SEO */}
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="theme-color" content="#4facfe" />
          <meta name="msapplication-TileColor" content="#4facfe" />
          
          {/* Google Search Console 인증 */}
          <meta name="google-site-verification" content="5hrs9JLWBmFrpyyg2B2quAHNcUJCH6dv" />
          
          {/* Preconnect to external domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          
          {/* Favicon */}
          <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
          <link rel="alternate icon" href="/vite.svg" type="image/svg+xml" />
          
          {/* PWA Manifest */}
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