// next.config.js - SEO/Security/Cache optimization (Recommended version)
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

    // Dev/Prod CSP
    const devCSP = [
      "default-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://remitbuddynew.up.railway.app https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
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
      "connect-src 'self' https://remitbuddynew.up.railway.app https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ');

    return [
      // 1) All paths: Security headers (excluding cache!)
      {
        source: '/(.*)',
        headers: [
          // X-Frame-Options can overlap with frame-ancestors -> only one is needed
          ...(!isDev ? [{ key: 'X-Frame-Options', value: 'DENY' }] : []),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: isDev ? devCSP : prodCSP },
          // ❗ Long-term cache absolutely prohibited for HTML (keep Next default or keep short)
          { key: 'Cache-Control', value: isDev ? 'no-store, must-revalidate' : 'public, max-age=0, must-revalidate' },
        ],
      },
      // 2) Static assets: Long-term cache
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable, stale-while-revalidate=604800' }],
      },
      {
        source: '/icons/(.*)',
        headers: [{ key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable, stale-while-revalidate=604800' }],
      },
      {
        source: '/logos/(.*)',
        headers: [{ key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable, stale-while-revalidate=604800' }],
      },
      {
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable, stale-while-revalidate=604800' }],
      },
    ]
  },

  async redirects() {
    return [
      // (B) naked -> www forced
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'remitbuddy.com' }],
        destination: 'https://www.remitbuddy.com/:path*',
        permanent: true,
      },
      // (C) Legacy URLs
      {
        source: '/compare',
        destination: '/en',
        permanent: true,
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
