import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;

  // 루트 또는 '/'로 끝나는 경우 모두 리다이렉트
  if (url.pathname === '/' || url.pathname === '') {
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|static|public|favicon.ico).*)'],
};
