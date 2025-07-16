/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // 이 줄 주석 처리 또는 제거
  trailingSlash: true,
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig