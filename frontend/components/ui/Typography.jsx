import React from 'react';
import PropTypes from 'prop-types';

/**
 * RemitBuddy Typography Component
 *
 * Language-aware typography component that automatically applies
 * the correct font family based on the content language.
 *
 * Supports: Korean, Japanese, Vietnamese, Thai, Arabic (RTL), and Latin scripts.
 */

// Language to font family mapping
const languageFontMap = {
  ko: 'font-korean',   // Pretendard
  ja: 'font-japanese', // Noto Sans JP
  vi: 'font-vietnamese', // Be Vietnam Pro
  th: 'font-thai',     // Sarabun
  ar: 'font-arabic',   // IBM Plex Sans Arabic
  en: 'font-display',  // Satoshi
  default: 'font-display',
};

// RTL languages
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

/**
 * Get font class based on language
 */
const getFontClass = (lang) => {
  if (!lang) return languageFontMap.default;
  const baseLang = lang.split('-')[0].toLowerCase();
  return languageFontMap[baseLang] || languageFontMap.default;
};

/**
 * Check if language is RTL
 */
const isRtl = (lang) => {
  if (!lang) return false;
  const baseLang = lang.split('-')[0].toLowerCase();
  return rtlLanguages.includes(baseLang);
};

/**
 * Heading Component
 */
export const Heading = ({
  as: Component = 'h2',
  size = 'xl',
  weight = 'bold',
  color = 'default',
  lang,
  gradient,
  align,
  className = '',
  children,
  ...props
}) => {
  // Size styles
  const sizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
    '3xl': 'text-4xl',
    '4xl': 'text-5xl',
    '5xl': 'text-6xl',
  };

  // Weight styles
  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black',
  };

  // Color styles
  const colors = {
    default: 'text-neutral-900',
    muted: 'text-neutral-600',
    primary: 'text-primary-600',
    accent: 'text-accent-600',
    white: 'text-white',
  };

  // Gradient styles
  const gradients = {
    primary: 'text-gradient-primary',
    accent: 'text-gradient-accent',
  };

  // Text alignment
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const fontClass = getFontClass(lang);
  const isRtlLang = isRtl(lang);

  const headingClasses = `
    ${sizes[size] || sizes.xl}
    ${weights[weight] || weights.bold}
    ${gradient ? gradients[gradient] : colors[color] || colors.default}
    ${align ? alignments[align] : ''}
    ${fontClass}
    tracking-tight
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Component
      className={headingClasses}
      lang={lang}
      dir={isRtlLang ? 'rtl' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

Heading.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']),
  weight: PropTypes.oneOf(['normal', 'medium', 'semibold', 'bold', 'black']),
  color: PropTypes.oneOf(['default', 'muted', 'primary', 'accent', 'white']),
  lang: PropTypes.string,
  gradient: PropTypes.oneOf(['primary', 'accent']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

/**
 * Text Component for body text
 */
export const Text = ({
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'default',
  lang,
  leading = 'normal',
  align,
  className = '',
  children,
  ...props
}) => {
  // Size styles
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  // Weight styles
  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  // Color styles
  const colors = {
    default: 'text-neutral-700',
    muted: 'text-neutral-500',
    strong: 'text-neutral-900',
    primary: 'text-primary-600',
    accent: 'text-accent-600',
    error: 'text-error-600',
    white: 'text-white',
  };

  // Line height
  const leadings = {
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  };

  // Text alignment
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const fontClass = getFontClass(lang);
  const isRtlLang = isRtl(lang);

  const textClasses = `
    ${sizes[size] || sizes.base}
    ${weights[weight] || weights.normal}
    ${colors[color] || colors.default}
    ${leadings[leading] || leadings.normal}
    ${align ? alignments[align] : ''}
    ${fontClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Component
      className={textClasses}
      lang={lang}
      dir={isRtlLang ? 'rtl' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

Text.propTypes = {
  as: PropTypes.oneOf(['p', 'span', 'div', 'label']),
  size: PropTypes.oneOf(['xs', 'sm', 'base', 'lg', 'xl']),
  weight: PropTypes.oneOf(['normal', 'medium', 'semibold', 'bold']),
  color: PropTypes.oneOf(['default', 'muted', 'strong', 'primary', 'accent', 'error', 'white']),
  lang: PropTypes.string,
  leading: PropTypes.oneOf(['tight', 'snug', 'normal', 'relaxed', 'loose']),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

/**
 * Money Component - For displaying currency amounts
 */
export const Money = ({
  amount,
  currency,
  size = 'lg',
  showCurrency = true,
  locale,
  className = '',
  ...props
}) => {
  // Format the amount based on locale
  const formattedAmount = new Intl.NumberFormat(locale || 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  // Size styles
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl',
  };

  const currencySizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  return (
    <span
      className={`font-money font-black text-neutral-900 tabular-nums ${sizes[size]} ${className}`}
      {...props}
    >
      {formattedAmount}
      {showCurrency && currency && (
        <span className={`${currencySizes[size]} font-bold text-neutral-500 ml-1.5`}>
          {currency}
        </span>
      )}
    </span>
  );
};

Money.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl']),
  showCurrency: PropTypes.bool,
  locale: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Label Component
 */
export const Label = ({
  children,
  htmlFor,
  required = false,
  className = '',
  ...props
}) => (
  <label
    htmlFor={htmlFor}
    className={`
      block text-base font-bold text-neutral-900 mb-2
      ${required ? 'after:content-["*"] after:ml-1 after:text-error-500' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ')}
    {...props}
  >
    {children}
  </label>
);

Label.propTypes = {
  children: PropTypes.node.isRequired,
  htmlFor: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Caption Component - Small text for metadata, timestamps, etc.
 */
export const Caption = ({
  children,
  color = 'muted',
  className = '',
  ...props
}) => {
  const colors = {
    default: 'text-neutral-600',
    muted: 'text-neutral-500',
    primary: 'text-primary-600',
    accent: 'text-accent-600',
  };

  return (
    <span
      className={`text-xs font-medium ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Caption.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['default', 'muted', 'primary', 'accent']),
  className: PropTypes.string,
};

// Default export with all components
const Typography = {
  Heading,
  Text,
  Money,
  Label,
  Caption,
};

export default Typography;
