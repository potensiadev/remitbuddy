import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, locale } = request.nextUrl;

<<<<<<< HEAD
  // 1. Skip static assets (Safety check)
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next();
  }

  // 2. IMPORTANT: Stop loop if we are already on the correct locale
  // If the URL already has /ko, Next.js sets locale to 'ko'
  if (locale === 'ko') {
    return NextResponse.next();
  }

  // Also check explicit pathname just in case
  if (pathname.startsWith('/ko') || pathname.startsWith('/en')) {
    return NextResponse.next();
  }

  // 3. User Preference (Cookie)
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  if (localeCookie) {
    if (localeCookie.value === 'ko') {
      // Avoid redirect loop: only redirect if we are NOT already on /ko
      if (locale !== 'ko' && !pathname.startsWith('/ko')) {
        const url = request.nextUrl.clone();
        url.pathname = `/ko${pathname}`;
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // 4. Browser Language Detection
  const acceptLanguage = (request.headers.get('accept-language') || '').toLowerCase();
  const isKorean = acceptLanguage.includes('ko');

  if (isKorean) {
    const url = request.nextUrl.clone();
    url.pathname = `/ko${pathname}`;
    const response = NextResponse.redirect(url);

    // Set cookie
    response.cookies.set('NEXT_LOCALE', 'ko', {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  // 5. Default
  return NextResponse.next();
=======
export function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // Use standard crypto.randomUUID() which is supported in Edge Runtime
  const nonce = crypto.randomUUID();

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
>>>>>>> 290518636de02a2a1b2996aab642d2d67f9ac1cf
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|images|logos|icons|fonts).*)'
  ],
};
