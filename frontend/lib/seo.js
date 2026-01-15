/**
 * SEO Metadata Generators for RemitBuddy
 *
 * Generates dynamic SEO metadata for comparison pages
 */

// Country names in Korean for SEO
const COUNTRY_NAMES_KO = {
  Vietnam: '베트남',
  Philippines: '필리핀',
  Nepal: '네팔',
  Cambodia: '캄보디아',
  Thailand: '태국',
  Myanmar: '미얀마',
  Uzbekistan: '우즈베키스탄',
  Indonesia: '인도네시아',
  SriLanka: '스리랑카',
  Bangladesh: '방글라데시',
  'United States': '미국',
  Canada: '캐나다',
  Singapore: '싱가포르',
  China: '중국',
  Malaysia: '말레이시아',
  Japan: '일본',
  'Hong Kong': '홍콩',
  'United Kingdom': '영국',
  Mongolia: '몽골'
};

/**
 * Generate SEO metadata for comparison page
 * @param {Object} country - Country data object
 * @param {string|number} amount - Send amount in KRW
 * @param {string} locale - Current locale (en/ko)
 * @returns {Object} SEO metadata object
 */
export const generateComparisonSEO = (country, amount, locale = 'ko') => {
  const formattedAmount = parseInt(amount).toLocaleString();
  const countryNameKo = COUNTRY_NAMES_KO[country.name] || country.name;
  const isKorean = locale === 'ko';

  // Title
  const title = isKorean
    ? `${countryNameKo} 송금 비교 | ${formattedAmount}원 → ${country.currency} | RemitBuddy`
    : `${country.name} Remittance Comparison | ₩${formattedAmount} → ${country.currency} | RemitBuddy`;

  // Description
  const description = isKorean
    ? `${countryNameKo}으로 ${formattedAmount}원 송금 시 최저 수수료 비교. 8개 송금사 실시간 환율 비교로 최대 32,000원 절약하세요. 한패스, 지머니트랜스, E9Pay, 센트비 등 한번에 비교!`
    : `Compare ${country.name} remittance rates for ₩${formattedAmount}. Real-time comparison of 8 providers including Hanpass, GMoney Trans, E9Pay, Sentbe. Save up to ₩32,000!`;

  // Keywords
  const keywords = isKorean
    ? `${countryNameKo} 송금, ${countryNameKo} 환율, ${countryNameKo} 송금 비교, ${countryNameKo} 송금 수수료, ${country.currency} 환율, 해외송금 비교, RemitBuddy`
    : `${country.name} remittance, ${country.name} exchange rate, ${country.name} transfer fee, ${country.currency} rate, international money transfer, RemitBuddy`;

  // Canonical URL
  const canonicalUrl = `https://www.remitbuddy.com/compare/${country.slug}?amount=${amount}`;

  // Open Graph
  const og = {
    title: isKorean
      ? `${countryNameKo} 송금 비교 결과 | RemitBuddy`
      : `${country.name} Remittance Comparison | RemitBuddy`,
    description: isKorean
      ? `₩${formattedAmount} → ${country.currency} 송금 시 최저 수수료 비교 결과입니다. 8개 송금사 실시간 비교!`
      : `Compare rates for ₩${formattedAmount} → ${country.currency}. Real-time comparison of 8 providers!`,
    image: `https://www.remitbuddy.com/og/compare-${country.slug}.png`,
    url: canonicalUrl,
    type: 'website',
    siteName: 'RemitBuddy'
  };

  // Twitter Card
  const twitter = {
    card: 'summary_large_image',
    title: og.title,
    description: og.description,
    image: og.image
  };

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: isKorean
      ? `${countryNameKo} 송금 비교`
      : `${country.name} Remittance Comparison`,
    description: description,
    provider: {
      '@type': 'Organization',
      name: 'RemitBuddy',
      url: 'https://www.remitbuddy.com'
    },
    areaServed: {
      '@type': 'Country',
      name: country.name
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KRW',
      price: amount,
      availability: 'https://schema.org/InStock'
    }
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    og,
    twitter,
    jsonLd,
    countryNameKo
  };
};

/**
 * Get all country slugs for static paths
 * @returns {Array} Array of country slugs
 */
export const getAllCountrySlugs = () => {
  return Object.keys(COUNTRY_NAMES_KO).map(name => {
    return name.toLowerCase().replace(/\s+/g, '-');
  });
};
