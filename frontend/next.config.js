// next.config.js - SEO/보안/캐시 최적화 (권장 수정안)
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,

  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['www.remitbuddy.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  compress: true,
  poweredByHeader: false,

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    // 개발/프로덕션 CSP
    const devCSP = [
      "default-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://remitbuddy-production.up.railway.app https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ');

    const prodCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://remitbuddy-production.up.railway.app https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ');

    return [
      // 1) 모든 경로: 보안 헤더 (캐시는 제외!)
      {
        source: '/(.*)',
        headers: [
          // X-Frame-Options는 frame-ancestors와 중복 가능 → 하나만 써도 됨
          ...(!isDev ? [{ key: 'X-Frame-Options', value: 'DENY' }] : []),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: isDev ? devCSP : prodCSP },
          // ❗ HTML에 장기 캐시 절대 금지 (Next 기본값 유지 또는 짧게)
          { key: 'Cache-Control', value: isDev ? 'no-store, must-revalidate' : 'public, max-age=0, must-revalidate' },
        ],
      },
      // 2) 정적 자산: 장기 캐시
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/icons/(.*)',
        headers: [{ key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/logos/(.*)',
        headers: [{ key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable' }],
      },
    ]
  },

  async redirects() {
    return [
      // (B) naked → www 강제
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'remitbuddy.com' }],
        destination: 'https://www.remitbuddy.com/:path*',
        permanent: true,
      },
      // (C) 구버전 URL
      {
        source: '/compare',
        destination: '/en',
        permanent: true,
        locale: false,
      },
    ]
  },

  experimental: {
    esmExternals: true,
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendors', chunks: 'all' },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig
