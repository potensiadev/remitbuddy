/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이 설정을 추가하여 정적 HTML로 결과물을 생성합니다.
  output: 'export',

  // 정적 내보내기 시 next/image 최적화 기능을 사용하지 않도록 설정합니다.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;