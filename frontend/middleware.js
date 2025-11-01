import { NextResponse } from 'next/server';

const locales = ['en', 'ko', 'vi', 'tl', 'km', 'my', 'th', 'uz', 'id', 'si', 'ne'];

export function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // locale 경로인지 확인
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // locale 경로는 그대로 유지
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 루트 경로만 /en으로 리다이렉트
  if (pathname === '/' || pathname === '') {
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|static|public|favicon.ico).*)'],
};
