import React from 'react';
import PropTypes from 'prop-types';

/**
 * RemitBuddy Button Component
 *
 * A premium button component with gradient backgrounds,
 * smooth animations, and excellent accessibility.
 *
 * Design: Trustworthy Global Finance
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold
    rounded-xl
    transition-all duration-200 ease-smooth
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98]
    relative overflow-hidden
    ${fullWidth ? 'w-full' : ''}
  `;

  // Variant styles with gradients and colored shadows
  const variants = {
    primary: `
      bg-gradient-to-br from-primary-500 to-primary-600
      hover:from-primary-600 hover:to-primary-700
      text-white
      shadow-primary hover:shadow-primary-lg
      hover:-translate-y-0.5
      focus-visible:ring-primary-500
    `,
    accent: `
      bg-gradient-to-br from-accent-500 to-accent-600
      hover:from-accent-600 hover:to-accent-700
      text-white
      shadow-accent hover:shadow-accent-lg
      hover:-translate-y-0.5
      focus-visible:ring-accent-500
    `,
    secondary: `
      bg-neutral-100 hover:bg-neutral-200
      text-neutral-800
      shadow-sm hover:shadow-md
      focus-visible:ring-neutral-400
    `,
    outline: `
      bg-transparent hover:bg-primary-50
      text-primary-600 hover:text-primary-700
      border-2 border-primary-500 hover:border-primary-600
      focus-visible:ring-primary-500
    `,
    'outline-accent': `
      bg-transparent hover:bg-accent-50
      text-accent-600 hover:text-accent-700
      border-2 border-accent-500 hover:border-accent-600
      focus-visible:ring-accent-500
    `,
    ghost: `
      bg-transparent hover:bg-neutral-100
      text-neutral-700 hover:text-neutral-900
      focus-visible:ring-neutral-400
    `,
    danger: `
      bg-gradient-to-br from-error-500 to-error-600
      hover:from-error-600 hover:to-error-700
      text-white
      shadow-md hover:shadow-lg
      hover:-translate-y-0.5
      focus-visible:ring-error-500
    `,
    gold: `
      bg-gradient-to-br from-gold-400 to-gold-500
      hover:from-gold-500 hover:to-gold-600
      text-white
      shadow-gold hover:shadow-gold-sm
      hover:-translate-y-0.5
      focus-visible:ring-gold-500
    `,
  };

  // Size styles - touch-friendly
  const sizes = {
    xs: 'h-8 px-3 text-xs rounded-lg',
    sm: 'h-9 px-4 text-sm rounded-lg',
    md: 'h-11 px-5 text-base rounded-xl',
    lg: 'h-13 px-6 text-lg rounded-xl',
    xl: 'h-14 px-8 text-xl rounded-2xl',
  };

  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Loading spinner with smooth animation
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {/* Shine effect overlay */}
      <span
        className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <span className="relative inline-flex items-center gap-2">
        {loading && <LoadingSpinner />}
        {!loading && icon && iconPosition === 'left' && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="inline-flex shrink-0">{icon}</span>
        )}
      </span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'accent',
    'secondary',
    'outline',
    'outline-accent',
    'ghost',
    'danger',
    'gold',
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button;
