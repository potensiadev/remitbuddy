import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon } from '../icons';

/**
 * Toss-style Select Component
 * A polished dropdown select component
 */
const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  // Container styles
  const containerStyles = 'w-full mb-6';

  // Label styles
  const labelStyles = `
    block text-base font-bold text-gray-900 mb-2
    ${required ? 'after:content-["*"] after:ml-1 after:text-error-500' : ''}
  `;

  // Select wrapper styles
  const wrapperStyles = `
    relative
    bg-gray-50 rounded-xl
    border-2 transition-all duration-200
    ${error ? 'border-error-500 bg-error-50' : 'border-gray-200'}
    ${!error && !disabled ? 'hover:border-gray-300 focus-within:border-brand-500 focus-within:bg-white focus-within:shadow-toss' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
  `;

  // Select styles
  const selectStyles = `
    w-full appearance-none bg-transparent
    px-4 py-3.5 pr-12
    text-base font-semibold text-gray-900
    outline-none cursor-pointer
    ${disabled ? 'cursor-not-allowed text-gray-400' : ''}
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

      {/* Select Wrapper */}
      <div className={wrapperStyles}>
        {/* Select Field */}
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectStyles}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDownIcon size={20} />
        </div>
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

Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Select;
