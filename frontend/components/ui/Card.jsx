import React from 'react';
import PropTypes from 'prop-types';

/**
 * RemitBuddy Card Component
 *
 * A versatile card component with multiple variants for
 * displaying provider information, features, and content.
 *
 * Design: Trustworthy Global Finance
 */
const Card = ({
  children,
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  padding = 'md',
  animate = false,
  animationDelay = 0,
  ...props
}) => {
  // Base styles
  const baseStyles = `
    bg-white rounded-2xl border
    transition-all duration-200 ease-out
    relative overflow-hidden
  `;

  // Variant styles
  const variants = {
    default: `
      border-neutral-200
      shadow-card
      ${hoverable || clickable ? 'hover:shadow-card-hover hover:border-neutral-300 hover:-translate-y-0.5' : ''}
    `,
    elevated: `
      border-transparent
      shadow-lg
      ${hoverable || clickable ? 'hover:shadow-xl hover:-translate-y-1' : ''}
    `,
    outlined: `
      border-neutral-300
      shadow-none bg-transparent
      ${hoverable || clickable ? 'hover:border-primary-400 hover:shadow-sm hover:bg-primary-50/30' : ''}
    `,
    // Best deal card - green accent with top border
    best: `
      border-accent-300
      bg-gradient-to-br from-accent-50/80 via-white to-white
      shadow-card-best
      ${hoverable || clickable ? 'hover:shadow-accent-lg hover:-translate-y-1 hover:border-accent-400' : ''}
    `,
    // Featured/promoted card - gold accent
    featured: `
      border-gold-300
      bg-gradient-to-br from-gold-50/60 via-white to-white
      shadow-card-featured
      ${hoverable || clickable ? 'hover:shadow-lg hover:-translate-y-1 hover:border-gold-400' : ''}
    `,
    // Primary branded card
    brand: `
      border-primary-200
      bg-gradient-to-br from-primary-50/60 via-white to-white
      shadow-primary-sm
      ${hoverable || clickable ? 'hover:shadow-primary hover:-translate-y-1 hover:border-primary-300' : ''}
    `,
    // Glass effect card
    glass: `
      border-white/20
      bg-white/80 backdrop-blur-lg
      shadow-lg
      ${hoverable || clickable ? 'hover:bg-white/90 hover:shadow-xl hover:-translate-y-1' : ''}
    `,
    // Subtle card for secondary content
    subtle: `
      border-neutral-100
      bg-neutral-50
      shadow-none
      ${hoverable || clickable ? 'hover:bg-neutral-100 hover:border-neutral-200' : ''}
    `,
  };

  // Padding styles
  const paddings = {
    none: 'p-0',
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10',
  };

  // Clickable styles
  const clickableStyles = clickable
    ? 'cursor-pointer active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
    : '';

  // Animation styles
  const animationStyles = animate ? 'animate-fade-in-up' : '';
  const animationDelayStyle = animate && animationDelay ? { animationDelay: `${animationDelay}ms` } : {};

  // Combine all styles
  const cardClasses = `
    ${baseStyles}
    ${variants[variant] || variants.default}
    ${paddings[padding] || paddings.md}
    ${clickableStyles}
    ${animationStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      onClick={clickable ? onClick : undefined}
      className={cardClasses}
      style={animationDelayStyle}
      {...props}
    >
      {/* Top accent bar for best/featured variants */}
      {variant === 'best' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400" />
      )}
      {variant === 'featured' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />
      )}
      {variant === 'brand' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400" />
      )}

      {children}
    </Component>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'default',
    'elevated',
    'outlined',
    'best',
    'featured',
    'brand',
    'glass',
    'subtle',
  ]),
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  animate: PropTypes.bool,
  animationDelay: PropTypes.number,
};

/**
 * Card Header Component
 */
export const CardHeader = ({ children, className = '', withBorder = false }) => (
  <div className={`${withBorder ? 'pb-4 mb-4 border-b border-neutral-150' : 'mb-4'} ${className}`}>
    {children}
  </div>
);

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  withBorder: PropTypes.bool,
};

/**
 * Card Title Component
 */
export const CardTitle = ({ children, className = '', size = 'md' }) => {
  const sizes = {
    sm: 'text-lg font-bold text-neutral-900',
    md: 'text-xl font-bold text-neutral-900',
    lg: 'text-2xl font-bold text-neutral-900',
  };

  return (
    <h3 className={`${sizes[size]} mb-1 ${className}`}>
      {children}
    </h3>
  );
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

/**
 * Card Description Component
 */
export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-base text-neutral-600 leading-relaxed ${className}`}>
    {children}
  </p>
);

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * Card Content Component
 */
export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * Card Footer Component
 */
export const CardFooter = ({ children, className = '', withBorder = true }) => (
  <div className={`${withBorder ? 'mt-5 pt-4 border-t border-neutral-150' : 'mt-4'} ${className}`}>
    {children}
  </div>
);

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  withBorder: PropTypes.bool,
};

/**
 * Card Badge Component - for labeling cards
 */
export const CardBadge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-primary-100 text-primary-700',
    accent: 'bg-accent-100 text-accent-700',
    gold: 'bg-gold-100 text-gold-700',
    best: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white',
    featured: 'bg-gradient-to-r from-gold-400 to-gold-500 text-white',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2.5 py-1
        text-xs font-bold uppercase tracking-wide
        rounded-full
        ${variants[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
};

CardBadge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'accent', 'gold', 'best', 'featured']),
  className: PropTypes.string,
};

/**
 * Provider Card - Specialized card for remittance providers
 */
export const ProviderCard = ({
  provider,
  amount,
  currency,
  exchangeRate,
  fee,
  deliveryTime,
  isBest = false,
  onClick,
  className = '',
}) => {
  return (
    <Card
      variant={isBest ? 'best' : 'default'}
      hoverable
      clickable
      onClick={onClick}
      className={`${className} ${isBest ? 'pt-5' : ''}`}
      padding="md"
    >
      {/* Provider Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {provider.logo ? (
            <div className="w-10 h-10 rounded-lg bg-neutral-50 p-1.5 flex items-center justify-center">
              <img
                src={provider.logo}
                alt={provider.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
              {provider.name.charAt(0)}
            </div>
          )}
          <span className="font-bold text-neutral-900 text-lg">{provider.name}</span>
        </div>
        {isBest && <CardBadge variant="best">Best Rate</CardBadge>}
      </div>

      {/* Amount */}
      <div className="mb-4">
        <p className="text-sm text-neutral-500 mb-1">Recipient gets</p>
        <p className="text-2xl font-black text-neutral-900 font-money">
          {amount.toLocaleString()}
          <span className="text-lg font-bold text-neutral-500 ml-2">{currency}</span>
        </p>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <span className="text-neutral-500">Rate:</span>
          <span className="ml-1.5 font-semibold text-neutral-700">{exchangeRate}</span>
        </div>
        <div>
          <span className="text-neutral-500">Fee:</span>
          <span className="ml-1.5 font-semibold text-neutral-700">{fee}</span>
        </div>
        <div>
          <span className="text-neutral-500">Delivery:</span>
          <span className="ml-1.5 font-semibold text-neutral-700">{deliveryTime}</span>
        </div>
      </div>
    </Card>
  );
};

ProviderCard.propTypes = {
  provider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo: PropTypes.string,
  }).isRequired,
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  exchangeRate: PropTypes.string.isRequired,
  fee: PropTypes.string.isRequired,
  deliveryTime: PropTypes.string.isRequired,
  isBest: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Card;
