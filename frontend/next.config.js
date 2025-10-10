// next.config.js - SEO / 보안 / 캐시 / 빌드 안정화 최적화 (Netlify 완전 정적 대응)
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🖼 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['www.remitbuddy.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ⚙️ 빌드 안정화
  compress: true,
  poweredByHeader: false,

  // 🚫 TypeScript 및 ESLint 검사 완전 비활성화
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // 📦 보안 및 캐시 헤더 설정
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

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
      "upgrade-insecure-requests",
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
      "upgrade-insecure-requests",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          ...(!isDev ? [{ key: 'X-Frame-Options', value: 'DENY' }] : []),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: isDev ? devCSP : prodCSP },
          {
            key: 'Cache-Control',
            value: isDev
              ? 'no-store, must-revalidate'
              : 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/icons/(.*)',
        headers: [
          { key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/logos/(.*)',
        headers: [
          { key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // 🌍 리다이렉트 설정
  async redirects() {
    return [
      { source: '/', destination: '/en', permanent: true, locale: false },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'remitbuddy.com' }],
        destination: 'https://www.remitbuddy.com/:path*',
        permanent: true,
      },
      { source: '/compare', destination: '/en', permanent: true, locale: false },
    ];
  },

  // ⚙️ Webpack 최적화
  experimental: { esmExternals: true },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },

  // ✅ 정적 Export 활성화 (i18n 제거 후)
  output: 'export',
};

module.exports = nextConfig;
