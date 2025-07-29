const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  i18n,
  experimental: {
    esmExternals: false
  },
  // Netlify 배포를 위한 설정
  distDir: '.next',
}

module.exports = nextConfig