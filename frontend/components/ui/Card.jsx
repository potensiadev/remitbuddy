import React from 'react';
import PropTypes from 'prop-types';

/**
 * Toss-style Card Component
 * A versatile card component with hover effects and variants
 */
const Card = ({
  children,
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  padding = 'md',
  ...props
}) => {
  // Base styles - Toss design principles
  const baseStyles = `
    bg-white rounded-2xl border
    transition-all duration-200 ease-out
  `;

  // Variant styles
  const variants = {
    default: `
      border-gray-200
      shadow-card
      ${hoverable || clickable ? 'hover:shadow-card-hover hover:border-gray-300' : ''}
    `,
    elevated: `
      border-transparent
      shadow-lg
      ${hoverable || clickable ? 'hover:shadow-xl hover:-translate-y-1' : ''}
    `,
    outlined: `
      border-gray-300
      shadow-none
      ${hoverable || clickable ? 'hover:border-brand-500 hover:shadow-sm' : ''}
    `,
    success: `
      border-accent-300
      bg-gradient-to-br from-accent-50 to-success-50
      shadow-card-best
      ${hoverable || clickable ? 'hover:shadow-xl hover:-translate-y-1' : ''}
    `,
    brand: `
      border-brand-300
      bg-gradient-to-br from-brand-50 to-blue-50
      shadow-toss-lg
      ${hoverable || clickable ? 'hover:shadow-toss-xl hover:-translate-y-1' : ''}
    `,
  };

  // Padding styles
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  // Clickable styles
  const clickableStyles = clickable ? 'cursor-pointer active:scale-[0.98]' : '';

  // Combine all styles
  const cardClasses = `
    ${baseStyles}
    ${variants[variant] || variants.default}
    ${paddings[padding] || paddings.md}
    ${clickableStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      onClick={clickable ? onClick : undefined}
      className={cardClasses}
      {...props}
    >
      {children}
    </Component>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'success', 'brand']),
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
};

/**
 * Card Header Component
 */
export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * Card Title Component
 */
export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-bold text-gray-900 mb-2 ${className}`}>
    {children}
  </h3>
);

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * Card Description Component
 */
export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-base text-gray-600 ${className}`}>
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
export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-gray-150 ${className}`}>
    {children}
  </div>
);

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
