// frontend/middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;

  // 루트 URL일 경우 (언어 미지정)
  if (url.pathname === '/' || url.pathname === '') {
    url.pathname = '/en'; // defaultLocale로 리다이렉트
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 옵션: 미들웨어 적용 범위
export const config = {
  matcher: ['/'], // 루트 경로만 감시
};
