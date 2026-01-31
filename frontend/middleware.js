import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, locale } = request.nextUrl;

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
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|images|logos|icons|fonts).*)'
  ],
};
