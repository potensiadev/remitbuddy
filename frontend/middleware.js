import { NextResponse } from 'next/server';

const locales = ['en'];

export function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // CSP Config
  const isDev = process.env.NODE_ENV === 'development';
  // Note: We are now avoiding unsafe-inline where possible by using nonces.
  // 'unsafe-eval' is still often needed in dev mode for hot reloading.

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://remitbuddynew.up.railway.app https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Clone headers to pass nonce to the backend/SSR
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', cspHeader);

  // If it has 'en' locale, keep it
  if (pathnameHasLocale) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  }

  // Redirect root or paths without locale to /en
  if (pathname === '/' || pathname === '') {
    url.pathname = '/en';
    const response = NextResponse.redirect(url);
    // Redirects technically don't need CSP but good practice? 
    // Usually browser just follows redirect. We can skip CSP on redirect strictly speaking.
    return response;
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|static|public|favicon.ico).*)'],
};
