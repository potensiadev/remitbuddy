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
