import React from 'react';
import PropTypes from 'prop-types';

/**
 * RemitBuddy Badge Component
 *
 * Visual indicator for status, labels, and highlights.
 * Design Philosophy: "Invisible Complexity, Visible Clarity"
 *
 * Used to highlight best rates, featured providers, and status indicators.
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  uppercase = true,
  className = '',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center font-bold
    transition-all duration-200
    ${uppercase ? 'uppercase tracking-wide' : ''}
  `;

  // Variant styles with gradients for premium feel
  const variants = {
    // Neutral/default
    default: 'bg-neutral-100 text-neutral-700',

    // Primary brand color
    primary: 'bg-primary-100 text-primary-700',

    // Success/Best - Emerald with gradient
    success: 'bg-accent-100 text-accent-700',

    // Warning - Amber
    warning: 'bg-warning-100 text-warning-700',

    // Gold - Premium feature
    gold: 'bg-gold-100 text-gold-700',

    // Outlined variants
    outline: 'bg-transparent border border-neutral-300 text-neutral-600',
    'outline-primary': 'bg-transparent border border-primary-300 text-primary-600',
    'outline-accent': 'bg-transparent border border-accent-300 text-accent-600',

    // Gradient variants - Premium feel
    best: `
      bg-gradient-to-r from-accent-500 to-accent-600
      text-white
      shadow-sm shadow-accent-500/30
    `,
    featured: `
      bg-gradient-to-r from-gold-400 to-gold-500
      text-white
      shadow-sm shadow-gold-500/30
    `,
    brand: `
      bg-gradient-to-r from-primary-500 to-primary-600
      text-white
      shadow-sm shadow-primary-500/30
    `,
  };

  // Size configurations
  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded gap-1',
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-md gap-1.5',
    lg: 'text-sm px-3 py-1.5 rounded-lg gap-2',
  };

  const badgeClasses = `
    ${baseClasses}
    ${variants[variant] || variants.default}
    ${sizes[size] || sizes.md}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={badgeClasses} {...props}>
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'success',
    'warning',
    'gold',
    'outline',
    'outline-primary',
    'outline-accent',
    'best',
    'featured',
    'brand',
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  uppercase: PropTypes.bool,
  className: PropTypes.string,
};

// ============================================
// PRE-CONFIGURED BADGE VARIANTS
// ============================================

/**
 * Star icon for best rate badge
 */
const StarIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/**
 * Sparkles icon for featured badge
 */
const SparklesIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
  </svg>
);

/**
 * Lightning bolt icon for fast/instant badge
 */
const BoltIcon = ({ className = 'w-3 h-3' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

/**
 * BestRateBadge - Highlights the best rate provider
 */
export const BestRateBadge = ({ className = '', ...props }) => (
  <Badge
    variant="best"
    size="md"
    icon={<StarIcon />}
    className={className}
    {...props}
  >
    Best Rate
  </Badge>
);

BestRateBadge.propTypes = {
  className: PropTypes.string,
};

/**
 * FeaturedBadge - Highlights featured/promoted providers
 */
export const FeaturedBadge = ({ className = '', ...props }) => (
  <Badge
    variant="featured"
    size="md"
    icon={<SparklesIcon />}
    className={className}
    {...props}
  >
    Featured
  </Badge>
);

FeaturedBadge.propTypes = {
  className: PropTypes.string,
};

/**
 * FastBadge - Indicates instant/fast transfer
 */
export const FastBadge = ({ className = '', ...props }) => (
  <Badge
    variant="primary"
    size="sm"
    icon={<BoltIcon />}
    className={className}
    {...props}
  >
    Instant
  </Badge>
);

FastBadge.propTypes = {
  className: PropTypes.string,
};

/**
 * NewBadge - Indicates new providers or features
 */
export const NewBadge = ({ className = '', ...props }) => (
  <Badge
    variant="warning"
    size="sm"
    className={className}
    {...props}
  >
    New
  </Badge>
);

NewBadge.propTypes = {
  className: PropTypes.string,
};

/**
 * RankBadge - Shows provider ranking
 */
export const RankBadge = ({ rank, isBest = false, className = '', ...props }) => (
  <Badge
    variant={isBest ? 'best' : 'default'}
    size="sm"
    uppercase={false}
    className={className}
    {...props}
  >
    #{rank}
  </Badge>
);

RankBadge.propTypes = {
  rank: PropTypes.number.isRequired,
  isBest: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
