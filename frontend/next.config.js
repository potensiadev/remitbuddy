const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // Disable for i18n compatibility
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  i18n,
}

module.exports = nextConfig