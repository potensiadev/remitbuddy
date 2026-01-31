/**
 * Type definitions for RemitBuddy frontend
 */

// Quote and Provider types
export interface Quote {
  provider: string;
  exchange_rate: number;
  fee: number;
  recipient_gets: number;
  link: string;
  currency?: string;
}

export interface QuoteResponse {
  results: Quote[];
  best_rate_provider: Quote | null;
}

// Country and Currency types
export interface Country {
  code: string;
  currency: string;
  name: string;
  slug: string;
  flag: string;
  popular?: boolean;
}

// Query parameters
export interface QueryParams {
  receive_country: string;
  receive_currency: string;
  send_amount?: number;
}

// Component Props types
export interface ComparisonResultsProps {
  queryParams: QueryParams;
  amount: string | number;
  forceRefresh: number;
  onCompareAgain: () => void;
  apiBaseUrl: string;
  isAutoScrolling?: boolean;
  view?: 'card' | 'table';
  onViewChange?: (view: 'card' | 'table') => void;
  onSaveCorridor?: () => void;
  isCorridorSaved?: boolean;
}

export interface ProviderCardProps {
  provider: Quote;
  isBest: boolean;
  index: number;
  onProviderClick: () => void;
  bestAmount: number;
  worstAmount: number;
  sendAmount: string | number;
}

export interface ResultsTableProps {
  results: Quote[];
  currency: string;
  onProviderClick: (provider: Quote, index: number) => void;
  bestAmount: number;
}

// Navigation types
export interface NavLink {
  label: string;
  href: string;
}

export interface MenuSection {
  title: string;
  links: NavLink[];
}

// Footer types
export interface FooterContactItem {
  label: string;
  value: string;
}

export interface FooterSection {
  title: string;
  links?: NavLink[];
  items?: FooterContactItem[];
}

// Analytics types
export interface AnalyticsEventParams {
  provider?: string;
  rank?: number;
  corridor?: string;
  rate_offered?: number;
  amount?: number;
  amount_range?: string;
  recipient_gets?: number;
  markup_spread?: number;
  provider_count?: number;
  best_provider?: string;
}
