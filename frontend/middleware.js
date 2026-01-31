import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, locale } = request.nextUrl;

  // --- CSP & Nonce Setup (Preserved from Origin) ---
  const nonce = crypto.randomUUID();
  const isDev = process.env.NODE_ENV === 'development';

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.vercel.app;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://api.fontshare.com;
    font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net https://api.fontshare.com;
    img-src 'self' data: https:;
    connect-src 'self' https://remitbuddy.up.railway.app https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  // Clone headers to pass nonce to the backend/SSR
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', cspHeader);

  // Helper: Attach CSP header to final response
  const withHeaders = (response) => {
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  };

  // --- i18n & Redirect Logic (From HEAD) ---

  // 1. Skip static assets
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/logos') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/fonts')
  ) {
    return NextResponse.next();
  }

  // 2. Stop loop if already localized
  if (locale === 'ko' || pathname.startsWith('/ko') || pathname.startsWith('/en')) {
    // Pass headers for CSP
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    return withHeaders(response);
  }

  // 3. User Preference Cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  if (localeCookie) {
    if (localeCookie.value === 'ko') {
      if (locale !== 'ko' && !pathname.startsWith('/ko')) {
        const url = request.nextUrl.clone();
        url.pathname = `/ko${pathname}`;
        return NextResponse.redirect(url);
      }
    }
    // Default (English) - Pass through with CSP
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    return withHeaders(response);
  }

  // 4. Browser Detection
  const acceptLanguage = (request.headers.get('accept-language') || '').toLowerCase();
  const isKorean = acceptLanguage.includes('ko');

  if (isKorean) {
    const url = request.nextUrl.clone();
    url.pathname = `/ko${pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set('NEXT_LOCALE', 'ko', {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  // 5. Default Fallback
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  return withHeaders(response);
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|images|logos|icons|fonts).*)'
  ],
};
