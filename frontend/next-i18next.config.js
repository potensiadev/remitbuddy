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
      // 'bn', // 준비되면 주석 해제 + locales/bn + hreflang + sitemap 동시 반영
      // 'mn', // 준비되면 주석 해제 + locales/mn + hreflang + sitemap 동시 반영
    ],
    localeDetection: false, // 성능 및 예측 가능성↑ (루트→/en 리다이렉트로 대체)
  },
  react: {
    useSuspense: false,
  },
  // 개발 중 즉시 번역 반영이 필요하면:
  // reloadOnPrerender: process.env.NODE_ENV === 'development',
}
