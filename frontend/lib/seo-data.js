/**
 * SEO Data Models for Programmatic SEO
 * 
 * This file contains all data structures needed to generate 1,100+ SEO pages
 */

import { COUNTRIES } from './constants';

// Popular amounts for country × amount pages (10 tiers)
export const POPULAR_AMOUNTS = [
    100000,   // ₩100k
    200000,   // ₩200k
    300000,   // ₩300k
    500000,   // ₩500k
    700000,   // ₩700k
    1000000,  // ₩1M
    1500000,  // ₩1.5M
    2000000,  // ₩2M
    3000000,  // ₩3M
    5000000   // ₩5M
];

// Provider slugs for comparison pages (7 active providers)
export const PROVIDERS = [
    { slug: 'hanpass', name: 'Hanpass', nameKo: '한패스' },
    { slug: 'gmoney-trans', name: 'GMoney Trans', nameKo: '지머니트랜스' },
    { slug: 'e9pay', name: 'E9Pay', nameKo: '이나인페이' },
    { slug: 'gme-remit', name: 'GME Remit', nameKo: 'GME 송금' },
    { slug: 'jrf', name: 'JRF', nameKo: 'JRF' },
    { slug: 'moin', name: 'Moin', nameKo: '모인' },
    { slug: 'coinshot', name: 'Coinshot', nameKo: '코인샷' }
];

// Remittance purposes for purpose-based pages
export const PURPOSES = {
    en: [
        { slug: 'family-support', name: 'Family Support', description: 'Send money to support your family' },
        { slug: 'education', name: 'Education', description: 'Pay for tuition and education expenses' },
        { slug: 'business', name: 'Business', description: 'Transfer funds for business purposes' },
        { slug: 'medical', name: 'Medical', description: 'Send money for medical expenses' },
        { slug: 'savings', name: 'Savings', description: 'Transfer money to savings abroad' },
        { slug: 'investment', name: 'Investment', description: 'Send funds for investment purposes' }
    ],
    ko: [
        { slug: 'family-support', name: '가족송금', description: '가족을 위한 송금' },
        { slug: 'education', name: '학비송금', description: '학비 및 교육비 송금' },
        { slug: 'business', name: '사업송금', description: '사업 목적 송금' },
        { slug: 'medical', name: '의료비송금', description: '의료비 송금' },
        { slug: 'savings', name: '저축송금', description: '해외 저축 송금' },
        { slug: 'investment', name: '투자송금', description: '투자 목적 송금' }
    ]
};

// Guide templates for how-to pages
export const GUIDE_TEMPLATES = {
    'how-to': {
        ko: '{{country}}로 송금하는 방법',
        en: 'How to Send Money to {{country}}'
    },
    'cheapest': {
        ko: '{{country}} 가장 저렴한 송금 방법',
        en: 'Cheapest Way to Send Money to {{country}}'
    },
    'best-rate': {
        ko: '{{currency}} 최고 환율 받는 법',
        en: 'Best Exchange Rate for {{currency}}'
    }
};

/**
 * Generate all provider pairs for VS comparison pages
 * @returns {Array} Array of provider pair objects with slug
 */
export function generateProviderPairs() {
    const pairs = [];

    for (let i = 0; i < PROVIDERS.length; i++) {
        for (let j = i + 1; j < PROVIDERS.length; j++) {
            pairs.push({
                provider1: PROVIDERS[i],
                provider2: PROVIDERS[j],
                slug: `${PROVIDERS[i].slug}-vs-${PROVIDERS[j].slug}`
            });
        }
    }

    return pairs; // Returns 55 unique pairs (11 choose 2)
}

/**
 * Generate all amount × country combinations
 * @returns {Array} Array of combination objects
 */
export function generateAmountCountryCombinations() {
    const combinations = [];

    POPULAR_AMOUNTS.forEach(amount => {
        COUNTRIES.forEach(country => {
            combinations.push({
                amount,
                country,
                slug: `${amount}-to-${country.slug}`
            });
        });
    });

    return combinations; // 10 amounts × 19 countries = 190 combinations
}

/**
 * Generate all currency pair data
 * @returns {Array} Array of currency pair objects
 */
export function getCurrencyPairs() {
    return COUNTRIES.map(c => ({
        from: 'KRW',
        to: c.currency,
        slug: `krw-to-${c.currency.toLowerCase()}`,
        country: c
    }));
}

/**
 * Generate all purpose × country combinations
 * @returns {Array} Array of purpose-country objects for both locales
 */
export function generatePurposeCombinations() {
    const combinations = [];

    // English combinations
    PURPOSES.en.forEach(purpose => {
        COUNTRIES.forEach(country => {
            combinations.push({
                purpose,
                country,
                locale: 'en',
                slug: `${purpose.slug}/to/${country.slug}`
            });
        });
    });

    // Korean combinations
    PURPOSES.ko.forEach(purpose => {
        COUNTRIES.forEach(country => {
            combinations.push({
                purpose,
                country,
                locale: 'ko',
                slug: `${purpose.slug}/to/${country.slug}`
            });
        });
    });

    return combinations; // 6 purposes × 19 countries × 2 locales = 228 combinations
}

/**
 * Generate all guide page data
 * @returns {Array} Array of guide objects
 */
export function generateGuidePages() {
    const guides = [];
    const templates = Object.keys(GUIDE_TEMPLATES);

    templates.forEach(template => {
        COUNTRIES.forEach(country => {
            // English guide
            guides.push({
                template,
                country,
                locale: 'en',
                slug: `${template}-${country.slug}`,
                title: GUIDE_TEMPLATES[template].en.replace('{{country}}', country.name).replace('{{currency}}', country.currency)
            });

            // Korean guide
            guides.push({
                template,
                country,
                locale: 'ko',
                slug: `${template}-${country.slug}`,
                title: GUIDE_TEMPLATES[template].ko.replace('{{country}}', country.name).replace('{{currency}}', country.currency)
            });
        });
    });

    return guides; // 3 templates × 19 countries × 2 locales = 114 guides
}

/**
 * Get total page count
 * @returns {Object} Breakdown of page counts by type
 */
export function getTotalPageCount() {
    return {
        amountCountry: generateAmountCountryCombinations().length * 2, // × 2 for locales
        currencyPairs: getCurrencyPairs().length * 2,
        providerComparisons: generateProviderPairs().length * 2,
        purposes: generatePurposeCombinations().length,
        guides: generateGuidePages().length,
        get total() {
            return this.amountCountry + this.currencyPairs + this.providerComparisons + this.purposes + this.guides;
        }
    };
}
