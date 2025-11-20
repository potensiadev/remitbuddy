import React from 'react';

/**
 * Toss-style Icon Components Library
 * Colorful, gradient-based icons matching Toss design language
 */

// Base icon wrapper with size control
const IconWrapper = ({ children, size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

// Checkmark Circle Icon (Success)
export const CheckCircleIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <circle cx="12" cy="12" r="10" fill="#10B981" />
    <path
      d="M8 12l2.5 2.5L16 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Clock Icon
export const ClockIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </IconWrapper>
);

// Shield Icon (Security)
export const ShieldIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <defs>
      <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3182F6" />
        <stop offset="100%" stopColor="#1B6BE6" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
      fill="url(#shield-gradient)"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Globe Icon (International)
export const GlobeIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </IconWrapper>
);

// Sparkles Icon (Premium/Special)
export const SparklesIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <defs>
      <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <path
      d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z"
      fill="url(#sparkle-gradient)"
    />
  </IconWrapper>
);

// Currency Icon (Money Exchange)
export const CurrencyIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <defs>
      <linearGradient id="currency-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#currency-gradient)" />
    <path
      d="M12 6v12M9 8h4.5a2 2 0 0 1 0 4H9m6 0h-4.5a2 2 0 0 0 0 4H15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Trending Up Icon (Growth)
export const TrendingUpIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <defs>
      <linearGradient id="trend-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>
    </defs>
    <path
      d="M23 6l-9.5 9.5-5-5L1 18"
      stroke="url(#trend-gradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 6h6v6"
      stroke="url(#trend-gradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Chevron Down Icon
export const ChevronDownIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Search Icon
export const SearchIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </IconWrapper>
);

// Arrow Right Icon
export const ArrowRightIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <path
      d="M5 12h14m-7-7l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Bell Icon (Notifications)
export const BellIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <defs>
      <linearGradient id="bell-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
      fill="url(#bell-gradient)"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Upload Icon
export const UploadIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <defs>
      <linearGradient id="upload-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#3182F6" />
        <stop offset="100%" stopColor="#60A5FA" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#upload-gradient)" />
    <path
      d="M8 14l4-4 4 4M12 10v8"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Heart Icon
export const HeartIcon = ({ size = 24, className = '', filled = false }) => (
  <IconWrapper size={size} className={className}>
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={filled ? "#EF4444" : "none"}
      stroke={filled ? "#EF4444" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Star Icon
export const StarIcon = ({ size = 24, className = '', filled = false }) => (
  <IconWrapper size={size} className={className}>
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={filled ? "#FBBF24" : "none"}
      stroke={filled ? "#FBBF24" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Loading Spinner Icon
export const LoadingIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={`animate-spin ${className}`}>
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </IconWrapper>
);

// X (Close) Icon
export const XIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Menu Icon
export const MenuIcon = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <path
      d="M3 12h18M3 6h18M3 18h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

export default {
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  GlobeIcon,
  SparklesIcon,
  CurrencyIcon,
  TrendingUpIcon,
  ChevronDownIcon,
  SearchIcon,
  ArrowRightIcon,
  BellIcon,
  UploadIcon,
  HeartIcon,
  StarIcon,
  LoadingIcon,
  XIcon,
  MenuIcon,
};
