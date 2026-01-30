import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * RemitBuddy Input Component
 *
 * A polished input component with label, helper text, error states,
 * and support for various input types including currency amounts.
 *
 * Design: Trustworthy Global Finance
 */
const Input = forwardRef(({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  suffix,
  prefix,
  size = 'md',
  variant = 'default',
  className = '',
  inputClassName = '',
  id,
  name,
  autoComplete,
  ...props
}, ref) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`;

  // Size configurations
  const sizes = {
    sm: {
      wrapper: 'h-10',
      input: 'text-sm px-3 py-2',
      label: 'text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      wrapper: 'h-13',
      input: 'text-base px-4 py-3',
      label: 'text-base',
      icon: 'w-5 h-5',
    },
    lg: {
      wrapper: 'h-15',
      input: 'text-lg px-4 py-4 font-bold',
      label: 'text-lg',
      icon: 'w-6 h-6',
    },
    xl: {
      wrapper: 'h-16',
      input: 'text-xl px-5 py-4 font-bold font-money',
      label: 'text-xl',
      icon: 'w-6 h-6',
    },
  };

  const sizeConfig = sizes[size] || sizes.md;

  // Label styles
  const labelStyles = `
    block font-bold text-neutral-900 mb-2
    ${sizeConfig.label}
    ${required ? 'after:content-["*"] after:ml-1 after:text-error-500' : ''}
  `.trim().replace(/\s+/g, ' ');

  // Wrapper base styles
  const getWrapperStyles = () => {
    const base = `
      relative flex items-center
      rounded-xl
      border-2
      transition-all duration-200 ease-out
      ${sizeConfig.wrapper}
    `;

    const stateStyles = error
      ? 'border-error-500 bg-error-50'
      : disabled
      ? 'border-neutral-200 bg-neutral-100 cursor-not-allowed opacity-60'
      : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus-within:border-primary-500 focus-within:bg-white focus-within:shadow-md';

    return `${base} ${stateStyles}`.trim().replace(/\s+/g, ' ');
  };

  // Input styles
  const getInputStyles = () => {
    const base = `
      flex-1 w-full
      bg-transparent
      text-neutral-900
      placeholder:text-neutral-400 placeholder:font-normal
      outline-none
      ${sizeConfig.input}
      ${disabled ? 'cursor-not-allowed' : ''}
    `;

    const paddingAdjust = `
      ${icon && iconPosition === 'left' ? 'pl-11' : ''}
      ${icon && iconPosition === 'right' ? 'pr-11' : ''}
      ${prefix ? 'pl-12' : ''}
      ${suffix ? 'pr-14' : ''}
    `;

    return `${base} ${paddingAdjust} ${inputClassName}`.trim().replace(/\s+/g, ' ');
  };

  // Helper text styles
  const helperStyles = `
    mt-2 text-sm leading-tight
    ${error ? 'text-error-600 font-medium' : 'text-neutral-500'}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={labelStyles}>
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className={getWrapperStyles()}>
        {/* Prefix (e.g., currency symbol) */}
        {prefix && (
          <div className="absolute left-4 text-base font-semibold text-neutral-500 pointer-events-none">
            {prefix}
          </div>
        )}

        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className={`absolute left-4 text-neutral-400 ${sizeConfig.icon}`}>
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={getInputStyles()}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText || error ? `${inputId}-helper` : undefined}
          {...props}
        />

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <div className={`absolute right-4 text-neutral-400 ${sizeConfig.icon}`}>
            {icon}
          </div>
        )}

        {/* Suffix (e.g., currency code) */}
        {suffix && (
          <div className="absolute right-4 text-sm font-bold text-neutral-500 pointer-events-none">
            {suffix}
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p id={`${inputId}-helper`} className={helperStyles} role={error ? 'alert' : undefined}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  suffix: PropTypes.node,
  prefix: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['default', 'filled', 'outlined']),
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  autoComplete: PropTypes.string,
};

/**
 * Amount Input - Specialized for currency/money input
 */
export const AmountInput = forwardRef(({
  currency = 'KRW',
  currencySymbol = '₩',
  ...props
}, ref) => (
  <Input
    ref={ref}
    type="text"
    inputMode="decimal"
    prefix={currencySymbol}
    suffix={currency}
    size="xl"
    placeholder="0"
    autoComplete="off"
    {...props}
  />
));

AmountInput.displayName = 'AmountInput';

AmountInput.propTypes = {
  currency: PropTypes.string,
  currencySymbol: PropTypes.string,
};

/**
 * Search Input - With search icon
 */
export const SearchInput = forwardRef((props, ref) => {
  const SearchIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  return (
    <Input
      ref={ref}
      type="search"
      icon={<SearchIcon />}
      iconPosition="left"
      placeholder="Search..."
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

export default Input;
