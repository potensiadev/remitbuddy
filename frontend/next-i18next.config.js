// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',
      'ko',
      'vi',
      'tl',
      'km',
      'my',
      'th',
      'uz',
      'id',
      'si',
      'ne',
      'bn',
      'mn',
      'cn'
    ],
    localeDetection: false, // 브라?��? ?�어 감�? 비활?�화 (빌드 경고 ?�결)
  },
  react: {
    useSuspense: false,
  },
  // 개발 �?즉시 번역 반영???�요?�면:
  // reloadOnPrerender: process.env.NODE_ENV === 'development',
}

