/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 기본 경로 설정 (필요한 경우)
  // basePath: '',
  // assetPrefix: '',
}

module.exports = nextConfig