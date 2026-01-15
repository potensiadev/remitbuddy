import React from 'react';
import PropTypes from 'prop-types';

/**
 * RemitBuddy Skeleton Component
 *
 * Premium loading skeleton with smooth shimmer animation.
 * Design Philosophy: "Invisible Complexity, Visible Clarity"
 *
 * Provides visual continuity during data loading with
 * elegant animations that feel responsive and polished.
 */

/**
 * Base Skeleton - Building block for skeleton screens
 */
const Skeleton = ({
  width,
  height,
  variant = 'text',
  animation = 'shimmer',
  className = '',
  ...props
}) => {
  // Variant styles
  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    rounded: 'rounded-xl',
    card: 'rounded-2xl',
    button: 'rounded-xl',
  };

  // Animation styles
  const animations = {
    shimmer: 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]',
    pulse: 'animate-pulse-gentle bg-neutral-200',
    none: 'bg-neutral-200',
  };

  const baseClasses = `
    ${variants[variant] || variants.text}
    ${animations[animation] || animations.shimmer}
  `.trim().replace(/\s+/g, ' ');

  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
};

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(['text', 'circular', 'rectangular', 'rounded', 'card', 'button']),
  animation: PropTypes.oneOf(['shimmer', 'pulse', 'none']),
  className: PropTypes.string,
};

/**
 * SkeletonText - For text placeholder lines
 */
export const SkeletonText = ({
  lines = 1,
  gap = 'sm',
  lastLineWidth = '70%',
  className = '',
  ...props
}) => {
  const gaps = {
    xs: 'gap-1.5',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  return (
    <div className={`flex flex-col ${gaps[gap]} ${className}`} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          style={{
            width: index === lines - 1 && lines > 1 ? lastLineWidth : '100%',
          }}
        />
      ))}
    </div>
  );
};

SkeletonText.propTypes = {
  lines: PropTypes.number,
  gap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  lastLineWidth: PropTypes.string,
  className: PropTypes.string,
};

/**
 * SkeletonAvatar - For profile/logo placeholders
 */
export const SkeletonAvatar = ({
  size = 'md',
  className = '',
  ...props
}) => {
  // Support both preset sizes and custom numbers
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Handle numeric size for backwards compatibility
  if (typeof size === 'number') {
    return (
      <Skeleton
        variant="circular"
        width={size}
        height={size}
        className={className}
        {...props}
      />
    );
  }

  return (
    <Skeleton
      variant="circular"
      className={`${sizes[size] || sizes.md} ${className}`}
      {...props}
    />
  );
};

SkeletonAvatar.propTypes = {
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    PropTypes.number,
  ]),
  className: PropTypes.string,
};

/**
 * SkeletonButton - For button placeholders
 */
export const SkeletonButton = ({
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'h-9 w-20',
    md: 'h-11 w-28',
    lg: 'h-13 w-36',
    xl: 'h-14 w-44',
  };

  return (
    <Skeleton
      variant="button"
      className={`${sizes[size] || sizes.md} ${fullWidth ? '!w-full' : ''} ${className}`}
      {...props}
    />
  );
};

SkeletonButton.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * SkeletonCard - Generic card placeholder
 */
export const SkeletonCard = ({
  hasHeader = true,
  hasFooter = true,
  contentLines = 2,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 ${className}`}
      {...props}
    >
      {/* Header */}
      {hasHeader && (
        <div className="flex items-center gap-3 mb-5">
          <SkeletonAvatar size="lg" />
          <div className="flex-1">
            <Skeleton variant="text" className="h-5 w-32 mb-2" />
            <Skeleton variant="text" className="h-3 w-20" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mb-5">
        <Skeleton variant="rounded" height={48} className="mb-4" />
        <SkeletonText lines={contentLines} />
      </div>

      {/* Footer */}
      {hasFooter && (
        <div className="pt-4 border-t border-neutral-100">
          <SkeletonButton size="lg" fullWidth />
        </div>
      )}
    </div>
  );
};

SkeletonCard.propTypes = {
  hasHeader: PropTypes.bool,
  hasFooter: PropTypes.bool,
  contentLines: PropTypes.number,
  className: PropTypes.string,
};

/**
 * ProviderCardSkeleton - Specific skeleton for provider cards
 * Matches the ProviderCard component layout exactly
 */
export const ProviderCardSkeleton = ({
  isBest = false,
  index = 0,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-2xl overflow-hidden
        transition-all duration-300 animate-fade-in-up
        ${isBest
          ? 'border-2 border-accent-200 shadow-card-best'
          : 'border border-neutral-200 shadow-card'
        }
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={{ animationDelay: `${index * 80}ms` }}
      {...props}
    >
      {/* Best banner placeholder */}
      {isBest && (
        <div className="h-10 bg-gradient-to-r from-accent-300 via-accent-200 to-accent-300 animate-shimmer bg-[length:200%_100%]" />
      )}

      <div className="p-5 sm:p-6">
        {/* Provider header */}
        <div className="flex items-center gap-3 mb-5">
          <Skeleton variant="rounded" className="w-11 h-11 sm:w-12 sm:h-12" />
          <div className="flex-1">
            <Skeleton variant="text" className="h-5 w-28 mb-1.5" />
          </div>
        </div>

        {/* Amount section - Hero metric area */}
        <div className={`
          rounded-xl p-5 sm:p-6 mb-5 text-center
          ${isBest ? 'bg-accent-50/50 border border-accent-100' : 'bg-neutral-50 border border-neutral-100'}
        `}>
          <Skeleton variant="text" className="h-3 w-24 mx-auto mb-3" />
          <Skeleton variant="text" className="h-10 sm:h-12 w-52 mx-auto mb-4" />
          {/* Progress bar skeleton */}
          <div className="h-2.5 bg-neutral-200 rounded-full overflow-hidden">
            <Skeleton
              variant="rectangular"
              className={`h-full rounded-full ${isBest ? 'w-full' : 'w-3/4'}`}
              animation="none"
            />
          </div>
        </div>

        {/* Secondary details */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-5 py-2">
          <Skeleton variant="text" className="h-4 w-24" />
          <div className="w-px h-4 bg-neutral-200" />
          <Skeleton variant="text" className="h-4 w-24" />
        </div>

        {/* CTA button skeleton */}
        <Skeleton
          variant="button"
          className={`h-12 sm:h-14 w-full ${isBest ? 'bg-accent-100' : ''}`}
        />
      </div>
    </div>
  );
};

ProviderCardSkeleton.propTypes = {
  isBest: PropTypes.bool,
  index: PropTypes.number,
  className: PropTypes.string,
};

export default Skeleton;
