/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이 설정을 추가하여 정적 HTML로 결과물을 생성합니다.
  output: 'export',

  // next/image를 사용하지 않으므로 이 설정은 비활성화하거나 제거합니다.
  // images: {
  //   unoptimized: true,
  // },
};

module.exports = nextConfig;