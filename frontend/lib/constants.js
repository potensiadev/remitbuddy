/**
 * RemitBuddy Shared Constants
 *
 * This file contains all shared constants used across the application.
 * Centralized here for easy maintenance and consistency.
 */

// Country data with popular flag and slug for URL routing
export const COUNTRIES = [
  { code: 'VN', currency: 'VND', name: 'Vietnam', slug: 'vietnam', flag: '/images/flags/vn.png', popular: true },
  { code: 'PH', currency: 'PHP', name: 'Philippines', slug: 'philippines', flag: '/images/flags/ph.png', popular: true },
  { code: 'NP', name: 'Nepal', currency: 'NPR', slug: 'nepal', flag: '/images/flags/np.png', popular: true },
  { code: 'KH', currency: 'KHR', name: 'Cambodia', slug: 'cambodia', flag: '/images/flags/kh.png', popular: true },
  { code: 'TH', currency: 'THB', name: 'Thailand', slug: 'thailand', flag: '/images/flags/th.png', popular: true },
  { code: 'MM', currency: 'MMK', name: 'Myanmar', slug: 'myanmar', flag: '/images/flags/mm.png' },
  { code: 'UZ', currency: 'UZS', name: 'Uzbekistan', slug: 'uzbekistan', flag: '/images/flags/uz.png' },
  { code: 'ID', currency: 'IDR', name: 'Indonesia', slug: 'indonesia', flag: '/images/flags/id.png' },
  { code: 'LK', currency: 'LKR', name: 'SriLanka', slug: 'srilanka', flag: '/images/flags/lk.png' },
  { code: 'BD', currency: 'BDT', name: 'Bangladesh', slug: 'bangladesh', flag: '/images/flags/bd.png' },
  { code: 'US', currency: 'USD', name: 'United States', slug: 'united-states', flag: '/images/flags/us.png' },
  { code: 'CA', currency: 'CAD', name: 'Canada', slug: 'canada', flag: '/images/flags/ca.png' },
  { code: 'SG', currency: 'SGD', name: 'Singapore', slug: 'singapore', flag: '/images/flags/sg.png' },
  { code: 'CN', currency: 'CNY', name: 'China', slug: 'china', flag: '/images/flags/cn.png' },
  { code: 'MY', currency: 'MYR', name: 'Malaysia', slug: 'malaysia', flag: '/images/flags/my.png' },
  { code: 'JP', currency: 'JPY', name: 'Japan', slug: 'japan', flag: '/images/flags/jp.png' },
  { code: 'HK', currency: 'HKD', name: 'Hong Kong', slug: 'hong-kong', flag: '/images/flags/hk.png' },
  { code: 'GB', currency: 'GBP', name: 'United Kingdom', slug: 'united-kingdom', flag: '/images/flags/gb.png' },
  { code: 'MN', currency: 'MNT', name: 'Mongolia', slug: 'mongolia', flag: '/images/flags/mn.png' }
];

// Separate popular and other countries for dropdown
export const POPULAR_COUNTRIES = COUNTRIES.filter(c => c.popular);
export const OTHER_COUNTRIES = COUNTRIES.filter(c => !c.popular);

// Flag assets for preloading
export const FLAG_ASSETS = Array.from(new Set(COUNTRIES.map((country) => country.flag)));

// Provider logo mapping
export const PROVIDER_LOGO_MAP = {
  Hanpass: '/logos/hanpass.png',
  GmoneyTrans: '/logos/gmoneytrans.png',
  E9Pay: '/logos/e9pay.png',
  Finshot: null,
  Coinshot: '/logos/coinshot.png',
  Cross: '/logos/cross.png',
  'GME Remit': '/logos/gme.png',
  JRF: '/logos/JRF.png',
  'JP Remit': '/logos/JRF.png',
  Wirebarley: '/logos/wirebarley.png',
  Moin: '/logos/themoin.png',
  'The Moin': '/logos/themoin.png',
  Sentbe: '/logos/sentbe.png'
};

// Amount validation
export const MIN_AMOUNT = 10000;
export const MAX_AMOUNT = 5000000;
export const DEFAULT_AMOUNT = 1000000;

// Helper functions
export const getCountryBySlug = (slug) => {
  return COUNTRIES.find(c => c.slug === slug.toLowerCase());
};

export const getCountryByCode = (code) => {
  return COUNTRIES.find(c => c.code === code.toUpperCase());
};

export const getCountryByName = (name) => {
  return COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase());
};

// Normalize provider name for display
export const normalizeProviderName = (name) => {
  if (name === 'JP Remit') return 'JRF';
  if (name === 'The Moin') return 'Moin';
  return name;
};

// API Configuration
export const getApiBaseUrl = () => {
  // 1. Check for explicit environment variable (highest priority)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. In browser, detect if running locally and construct URL
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Local development: use same hostname with port 8000
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    ) {
      return `${protocol}//${hostname}:8000`;
    }
  }

  // 3. Production fallback
  return 'https://remitbuddy.up.railway.app';
};

/**
 * SEO Utility Functions
 */

// Generate SEO-friendly slug from any text
export const generateSEOSlug = (text) => {
  return text.toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Get all currency pairs for SEO pages
export const getCurrencyPairs = () => {
  return COUNTRIES.map(c => ({
    from: 'KRW',
    to: c.currency,
    slug: `krw-to-${c.currency.toLowerCase()}`,
    country: c
  }));
};

// Format amount for display
export const formatAmount = (amount) => {
  return parseInt(amount).toLocaleString('en-US');
};

// Parse amount from slug (e.g., "1000000-to-vietnam" -> 1000000)
export const parseAmountFromSlug = (slug) => {
  const match = slug.match(/^(\d+)-to-/);
  return match ? parseInt(match[1]) : null;
};

// Extract country slug from compound slug
export const extractCountrySlug = (slug) => {
  const match = slug.match(/-to-(.+)$/);
  return match ? match[1] : null;
};

