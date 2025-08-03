import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const { locale } = this.props;
    
    return (
      <Html lang={locale}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no, viewport-fit=cover" />
          
          {/* Content Security Policy */}
          <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://sendhome-production.up.railway.app https://www.google-analytics.com; object-src 'none'; base-uri 'self'; form-action 'self';" />
          
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
          
          {/* External fonts with SRI would be added here if specific font files are loaded */}
          
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