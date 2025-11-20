import React from 'react';
import PropTypes from 'prop-types';

/**
 * Toss-style Button Component
 * A highly polished button component with multiple variants and sizes
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
  // Base styles - Toss design principles
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-bold rounded-2xl
    transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
    ${fullWidth ? 'w-full' : ''}
  `;

  // Variant styles - matching Toss color palette
  const variants = {
    primary: `
      bg-brand-500 hover:bg-brand-600 active:bg-brand-700
      text-white
      shadow-lg hover:shadow-xl
      focus-visible:ring-brand-200
      transform hover:scale-[1.02]
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 active:bg-gray-300
      text-gray-900
      shadow-sm hover:shadow-md
      focus-visible:ring-gray-200
    `,
    success: `
      bg-accent-500 hover:bg-accent-600 active:bg-accent-700
      text-white
      shadow-lg hover:shadow-xl
      focus-visible:ring-accent-200
      transform hover:scale-[1.02]
    `,
    outline: `
      bg-transparent hover:bg-gray-50 active:bg-gray-100
      text-brand-500 hover:text-brand-600
      border-2 border-brand-500 hover:border-brand-600
      focus-visible:ring-brand-200
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 active:bg-gray-200
      text-gray-700
      focus-visible:ring-gray-200
    `,
    danger: `
      bg-error-500 hover:bg-error-600 active:bg-error-700
      text-white
      shadow-lg hover:shadow-xl
      focus-visible:ring-error-200
      transform hover:scale-[1.02]
    `,
  };

  // Size styles - mobile-optimized
  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
    xl: 'h-16 px-10 text-xl',
  };

  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
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
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
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
