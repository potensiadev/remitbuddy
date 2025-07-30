module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',  // English (default)
      'ko',  // Korean 
      'vi',  // Vietnamese
      'tl',  // Filipino/Tagalog (Philippines)
      'km',  // Khmer (Cambodia)
      'my',  // Burmese (Myanmar)
      'th',  // Thai (Thailand)
      'uz',  // Uzbek (Uzbekistan)
      'id',  // Indonesian (Indonesia)
      'si',  // Sinhala (Sri Lanka)
      'bn',  // Bengali (Bangladesh)
      'ne',  // Nepali (Nepal)
      'mn',  // Mongolian (Mongolia)
    ],
    localeDetection: true,  // ✅ 브라우저 언어 감지 활성화
  },
  react: {
    useSuspense: false,
  },
};