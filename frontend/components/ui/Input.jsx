import React from 'react';
import PropTypes from 'prop-types';

/**
 * Toss-style Input Component
 * A polished input component with label, helper text, and error states
 */
const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  suffix,
  className = '',
  inputClassName = '',
  ...props
}) => {
  // Container styles
  const containerStyles = 'w-full mb-6';

  // Label styles
  const labelStyles = `
    block text-base font-bold text-gray-900 mb-2
    ${required ? 'after:content-["*"] after:ml-1 after:text-error-500' : ''}
  `;

  // Input wrapper styles
  const wrapperStyles = `
    relative flex items-center
    bg-gray-50 rounded-xl
    border-2 transition-all duration-200
    ${error ? 'border-error-500 bg-error-50' : 'border-gray-200'}
    ${!error && !disabled ? 'focus-within:border-brand-500 focus-within:bg-white focus-within:shadow-toss' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
  `;

  // Input styles
  const inputStyles = `
    flex-1 bg-transparent
    px-4 py-3.5
    text-base font-semibold text-gray-900
    placeholder:text-gray-400 placeholder:font-normal
    outline-none
    ${disabled ? 'cursor-not-allowed' : ''}
    ${icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${suffix ? 'pr-16' : ''}
    ${inputClassName}
  `.trim().replace(/\s+/g, ' ');

  // Helper text styles
  const helperStyles = `
    mt-2 text-sm
    ${error ? 'text-error-500 font-semibold' : 'text-gray-600'}
  `;

  return (
    <div className={`${containerStyles} ${className}`}>
      {/* Label */}
      {label && (
        <label className={labelStyles}>
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className={wrapperStyles}>
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputStyles}
          {...props}
        />

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 text-gray-400">
            {icon}
          </div>
        )}

        {/* Suffix (e.g., currency) */}
        {suffix && (
          <div className="absolute right-4 text-sm font-bold text-gray-600">
            {suffix}
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p className={helperStyles}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  suffix: PropTypes.node,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default Input;
