/**
 * SEO Metadata Generator for Programmatic SEO
 * 
 * Generates optimized SEO metadata (title, description, keywords, OG, structured data)
 * for all page types based on keyword targeting strategy
 */

import { PROVIDERS, PURPOSES } from './seo-data';
import { formatAmount } from './constants';

/**
 * Generate comprehensive SEO metadata for any page type
 * @param {Object} options - Page configuration
 * @returns {Object} Complete SEO metadata object
 */
export function generateSEOMeta({
    pageType,
    country,
    amount,
    providers,
    purpose,
    locale = 'en',
    currency
}) {
    const isKorean = locale === 'ko';

    const metadata = {
        title: generateTitle({ pageType, country, amount, providers, purpose, locale, currency }),
        description: generateDescription({ pageType, country, amount, providers, purpose, locale, currency }),
        keywords: generateKeywords({ pageType, country, amount, providers, purpose, locale }),
        canonical: generateCanonicalUrl({ pageType, country, amount, providers, purpose }),
        og: generateOpenGraph({ pageType, country, amount, locale, currency }),
        jsonLd: generateStructuredData({ pageType, country, amount, providers, purpose })
    };

    return metadata;
}

/**
 * Generate page title optimized for SEO
 */
function generateTitle({ pageType, country, amount, providers, purpose, locale, currency }) {
    const isKorean = locale === 'ko';

    const templates = {
        'amount-country': {
            ko: amount ? `${formatAmount(amount)}원 ${country?.name} 송금 | 최저 수수료 비교 | RemitBuddy` : `${country?.name} 송금 비교 | RemitBuddy`,
            en: amount ? `Send ₩${formatAmount(amount)} to ${country?.name} | Best Rates | RemitBuddy` : `Send Money to ${country?.name} | RemitBuddy`
        },
        'currency-pair': {
            ko: `KRW ${currency} 환율 | 원화 ${country?.name} ${currency} 실시간 환율 비교`,
            en: `KRW to ${currency} Rate | Korean Won to ${country?.name} ${currency} Exchange`
        },
        'provider-comparison': {
            ko: `${providers?.[0]?.nameKo || providers?.[0]?.name} vs ${providers?.[1]?.nameKo || providers?.[1]?.name} 환율 비교 | 어디가 나아요?`,
            en: `${providers?.[0]?.name} vs ${providers?.[1]?.name} Rate Comparison | RemitBuddy`
        },
        'purpose': {
            ko: `${country?.name} ${purpose?.name} | 최저 수수료로 송금하기`,
            en: `${country?.name} ${purpose?.name} | Best Rates for Remittance`
        },
        'guide-how-to': {
            ko: `${country?.name} 송금 방법 | 초보자 완벽 가이드`,
            en: `How to Send Money to ${country?.name} | Complete Guide`
        },
        'guide-cheapest': {
            ko: `${country?.name} 가장 저렴한 송금 방법 | 수수료 비교`,
            en: `Cheapest Way to Send Money to ${country?.name} | Fee Comparison`
        },
        'guide-best-rate': {
            ko: `${currency} 최고 환율 받는 법 | 환율 비교 팁`,
            en: `Best ${currency} Exchange Rate | Rate Comparison Tips`
        }
    };

    return templates[pageType]?.[locale] || 'RemitBuddy - Compare Remittance Rates';
}

/**
 * Generate meta description optimized for CTR
 */
function generateDescription({ pageType, country, amount, providers, purpose, locale, currency }) {
    const isKorean = locale === 'ko';

    const templates = {
        'amount-country': {
            ko: amount
                ? `${formatAmount(amount)}원을 ${country?.name}로 송금하세요. 8개 업체 실시간 환율 비교로 최저 수수료 찾기. 평균 3만원 절약 가능!`
                : `${country?.name} 송금 최저 수수료 비교. 한패스, 센트비, 이나인페이 등 8개 업체 실시간 환율 확인.`,
            en: amount
                ? `Send ₩${formatAmount(amount)} to ${country?.name}. Compare rates from 8 providers instantly. Save up to ₩32,000 per transfer!`
                : `Compare ${country?.name} remittance rates from 8 providers. Find the best exchange rate and lowest fees.`
        },
        'currency-pair': {
            ko: `KRW ${currency} 실시간 환율 비교. 원화를 ${country?.name} ${currency}로 환전할 때 가장 좋은 환율을 제공하는 업체 찾기.`,
            en: `Live KRW to ${currency} exchange rate comparison. Find the best rate for converting Korean Won to ${country?.name} ${currency}.`
        },
        'provider-comparison': {
            ko: `${providers?.[0]?.nameKo || providers?.[0]?.name}와 ${providers?.[1]?.nameKo || providers?.[1]?.name} 환율, 수수료, 송금 속도 상세 비교. 어느 업체가 나은지 한눈에 확인하세요.`,
            en: `${providers?.[0]?.name} vs ${providers?.[1]?.name} detailed comparison. Compare exchange rates, fees, and transfer speed to find the best option.`
        },
        'purpose': {
            ko: `${country?.name} ${purpose?.name} 최적의 방법. 추천 금액대별 최저 수수료 업체, 필요 서류, 송금 절차 완벽 가이드.`,
            en: `Best way to send money to ${country?.name} for ${purpose?.name}. Recommended providers, required documents, and step-by-step guide.`
        },
        'guide-how-to': {
            ko: `${country?.name} 송금 방법 완벽 가이드. 초보자도 5분만에 따라하는 단계별 송금 절차, 필요 서류, 수수료 절약 팁까지!`,
            en: `Complete guide to sending money to ${country?.name}. Step-by-step instructions, required documents, and money-saving tips for beginners.`
        },
        'guide-cheapest': {
            ko: `${country?.name} 송금 가장 싸게 하는 방법! 8개 업체 수수료 비교로 평균 3만원 절약하는 꿀팁 공개.`,
            en: `Cheapest way to send money to ${country?.name}! Compare fees from 8 providers and save up to ₩32,000 per transfer.`
        },
        'guide-best-rate': {
            ko: `${currency} 최고 환율 받는 법. 실시간 환율 비교, 환전 타이밍, 수수료 절약 노하우까지 완벽 정리.`,
            en: `How to get the best ${currency} exchange rate. Real-time rate comparison, timing tips, and fee-saving strategies.`
        }
    };

    return templates[pageType]?.[locale] || 'Compare international money transfer rates and save on fees.';
}

/**
 * Generate meta keywords (still relevant for some search engines)
 */
function generateKeywords({ pageType, country, amount, providers, purpose, locale }) {
    const isKorean = locale === 'ko';

    const baseKeywords = {
        ko: ['해외송금', '환율비교', '송금수수료', 'RemitBuddy'],
        en: ['international money transfer', 'exchange rate', 'remittance', 'RemitBuddy']
    };

    const specificKeywords = [];

    if (country) {
        specificKeywords.push(
            isKorean ? `${country.name} 송금` : `send money to ${country.name}`,
            isKorean ? `${country.currency} 환율` : `${country.currency} rate`
        );
    }

    if (amount) {
        specificKeywords.push(
            isKorean ? `${formatAmount(amount)}원 송금` : `send ${formatAmount(amount)} won`
        );
    }

    if (providers && providers.length) {
        providers.forEach(p => {
            specificKeywords.push(isKorean ? p.nameKo : p.name);
        });
    }

    return [...specificKeywords, ...baseKeywords[locale]].filter(Boolean).join(', ');
}

/**
 * Generate canonical URL
 */
function generateCanonicalUrl({ pageType, country, amount, providers, purpose }) {
    const baseUrl = 'https://www.remitbuddy.com';

    const urlMap = {
        'amount-country': amount && country ? `/send/${amount}-to-${country.slug}` : `/send-to/${country?.slug}`,
        'currency-pair': country ? `/krw-to/${country.currency.toLowerCase()}` : '/',
        'provider-comparison': providers?.length === 2 ? `/providers/${providers[0].slug}-vs-${providers[1].slug}` : '/providers',
        'purpose': purpose && country ? `/send-for/${purpose.slug}/to/${country.slug}` : '/',
        'guide-how-to': country ? `/guides/how-to-${country.slug}` : '/guides',
        'guide-cheapest': country ? `/guides/cheapest-${country.slug}` : '/guides',
        'guide-best-rate': country ? `/guides/best-rate-${country.currency.toLowerCase()}` : '/guides'
    };

    return `${baseUrl}${urlMap[pageType] || '/'}`;
}

/**
 * Generate Open Graph metadata for social sharing
 */
function generateOpenGraph({ pageType, country, amount, locale, currency }) {
    const isKorean = locale === 'ko';

    return {
        title: generateTitle({ pageType, country, amount, locale, currency }),
        description: generateDescription({ pageType, country, amount, locale, currency }),
        image: `https://www.remitbuddy.com/og/${pageType}-${country?.slug || 'default'}.png`,
        url: generateCanonicalUrl({ pageType, country, amount }),
        type: 'website',
        siteName: 'RemitBuddy',
        locale: locale === 'ko' ? 'ko_KR' : 'en_US'
    };
}

/**
 * Generate JSON-LD structured data for rich snippets
 */
function generateStructuredData({ pageType, country, amount, providers, purpose }) {
    const baseData = {
        '@context': 'https://schema.org',
        provider: {
            '@type': 'Organization',
            name: 'RemitBuddy',
            url: 'https://www.remitbuddy.com'
        }
    };

    // Different structured data for different page types
    const structuredDataMap = {
        'amount-country': {
            ...baseData,
            '@type': 'FinancialProduct',
            name: `${country?.name} Remittance Service`,
            description: `Send money to ${country?.name} with competitive rates`,
            areaServed: {
                '@type': 'Country',
                name: country?.name
            },
            offers: amount ? {
                '@type': 'Offer',
                priceCurrency: 'KRW',
                price: amount,
                availability: 'https://schema.org/InStock'
            } : undefined
        },
        'provider-comparison': providers?.length === 2 ? {
            ...baseData,
            '@type': 'ComparisonTable',
            name: `${providers[0].name} vs ${providers[1].name} Comparison`,
            about: [
                { '@type': 'Organization', name: providers[0].name },
                { '@type': 'Organization', name: providers[1].name }
            ]
        } : baseData,
        'guide-how-to': {
            ...baseData,
            '@type': 'HowTo',
            name: `How to Send Money to ${country?.name}`,
            step: [
                {
                    '@type': 'HowToStep',
                    position: 1,
                    name: 'Compare Rates',
                    text: 'Use RemitBuddy to compare rates from multiple providers'
                },
                {
                    '@type': 'HowToStep',
                    position: 2,
                    name: 'Choose Provider',
                    text: 'Select the provider with the best rate for your transfer'
                },
                {
                    '@type': 'HowToStep',
                    position: 3,
                    name: 'Complete Transfer',
                    text: 'Follow the provider\'s instructions to complete your transfer'
                }
            ]
        }
    };

    return structuredDataMap[pageType] || baseData;
}

/**
 * Generate hreflang tags for multilingual SEO
 */
export function generateHreflangTags({ pathname, locales = ['en', 'ko'] }) {
    return locales.map(locale => ({
        rel: 'alternate',
        hreflang: locale === 'ko' ? 'ko-KR' : 'en',
        href: `https://www.remitbuddy.com/${locale === 'en' ? '' : `${locale}/`}${pathname}`
    }));
}
