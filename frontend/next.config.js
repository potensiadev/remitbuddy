// next.config.js - SEO 성능 최적화
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 다국어 설정
  i18n,
  
  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['www.remitbuddy.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 압축 및 최적화
  compress: true,
  poweredByHeader: false,
  
  // SEO 헤더 최적화
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 보안 헤더
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://remitbuddy-production.up.railway.app https://www.google-analytics.com; object-src 'none'; base-uri 'self'; form-action 'self';"
          },
          // 캐싱 최적화
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // 정적 자산 캐싱
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // 폰트 최적화
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control', 
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  // 리다이렉트 설정
  async redirects() {
    return [
      // www 리다이렉트
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'remitbuddy.com'
          }
        ],
        destination: 'https://www.remitbuddy.com/:path*',
        permanent: true
      },
      // 구버전 URL 리다이렉트 (필요시)
      {
        source: '/compare',
        destination: '/',
        permanent: true
      }
    ]
  },
  
  // 실험적 기능들
  experimental: {
    // 더 빠른 빌드
    esmExternals: true,
    // 메타데이터 최적화 - 빌드 오류로 인해 임시 비활성화
    // optimizeCss: true,
  },
  
  // Webpack 최적화
  webpack: (config, { dev, isServer }) => {
    // 프로덕션 최적화
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
      }
    }
    
    return config
  }
}

module.exports = nextConfig