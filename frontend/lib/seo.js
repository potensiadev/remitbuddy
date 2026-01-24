/**
 * SEO Metadata Generators for RemitBuddy
 *
 * Generates dynamic SEO metadata for comparison pages
 */

// SEO Metadata for RemitBuddy - English Only


/**
 * Generate SEO metadata for comparison page
 * @param {Object} country - Country data object
 * @param {string|number} amount - Send amount in KRW
 * @param {string} locale - Current locale (en/ko)
 * @returns {Object} SEO metadata object
 */
export const generateComparisonSEO = (country, amount) => {
  const formattedAmount = parseInt(amount).toLocaleString();

  // Title
  const title = `${country.name} Remittance Comparison | ₩${formattedAmount} → ${country.currency} | RemitBuddy`;

  // Description
  const description = `Compare ${country.name} remittance rates for ₩${formattedAmount}. Real-time comparison of 8 providers including Hanpass, GMoney Trans, E9Pay, Sentbe. Save up to ₩32,000!`;

  // Keywords
  const keywords = `${country.name} remittance, ${country.name} exchange rate, ${country.name} transfer fee, ${country.currency} rate, international money transfer, RemitBuddy`;

  // Canonical URL
  const canonicalUrl = `https://www.remitbuddy.com/en/compare/${country.slug}?amount=${amount}`;

  // Open Graph
  const og = {
    title: `${country.name} Remittance Comparison | RemitBuddy`,
    description: `Compare rates for ₩${formattedAmount} → ${country.currency}. Real-time comparison of 8 providers!`,
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
    name: `${country.name} Remittance Comparison`,
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
    jsonLd
  };
};

/**
 * Get all country slugs for static paths
 * @returns {Array} Array of country slugs
 */
export const getAllCountrySlugs = () => {
  const COUNTRIES = [
    'Vietnam', 'Philippines', 'Nepal', 'Cambodia', 'Thailand', 'Myanmar',
    'Uzbekistan', 'Indonesia', 'SriLanka', 'Bangladesh', 'United States',
    'Canada', 'Singapore', 'China', 'Malaysia', 'Japan', 'Hong Kong',
    'United Kingdom', 'Mongolia'
  ];
  return COUNTRIES.map(name => {
    return name.toLowerCase().replace(/\s+/g, '-');
  });
};
