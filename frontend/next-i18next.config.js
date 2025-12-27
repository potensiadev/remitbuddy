// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    // locales: ['en', 'vi', 'ko', 'id', 'km', 'bn', 'mn', 'my', 'ne', 'si', 'th', 'tl', 'uz', 'cn'],
    localeDetection: true, // 브라우저 언어 감지 비활성화 (빌드 경고 해결)
  },
  react: {
    useSuspense: false,
  },
  // 개발 중 즉시 번역 반영이 필요하면:
  // reloadOnPrerender: process.env.NODE_ENV === 'development',
}
