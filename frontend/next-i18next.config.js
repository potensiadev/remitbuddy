// next-i18next.config.js
const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    localeDetection: false,
  },
  // Absolute path is required for production (Railway/Docker/Vercel)
  localePath: path.resolve('./public/locales'),
  react: {
    useSuspense: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
