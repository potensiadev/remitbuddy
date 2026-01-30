import { NextResponse } from 'next/server';

const locales = ['en'];

export function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // If it has 'en' locale, keep it
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect root or paths without locale to /en
  if (pathname === '/' || pathname === '') {
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|static|public|favicon.ico).*)'],
};
