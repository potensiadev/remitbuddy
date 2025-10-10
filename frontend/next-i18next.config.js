module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en', 'ko', 'vi', 'tl', 'km', 'my', 'th', 'uz',
      'id', 'si', 'bn', 'ne', 'mn'
    ],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  react: { useSuspense: false },
};
