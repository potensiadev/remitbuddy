module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { 
    extend: {
      // Fonts
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      // Container utilities
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
      // Color palette for remittance app
      colors: {
        brand: '#34C759',           // Primary green - EXACT HEX from Figma
        'brand-light': '#E8F9F0',   // Light green background
        'gray-primary': '#1F2937',  // Text primary (almost black)
        'gray-secondary': '#6B7280', // Text secondary
        'gray-button': '#6B7280',   // Gray buttons
        'gray-border': '#E5E7EB',   // Light gray borders
        'ad-bg': '#D1D5DB',         // AD section background
        'footer-dark': '#4B5563',   // Footer dark background
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      // Animation utilities
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      // Typography scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      // Spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Border radius
      borderRadius: {
        '4xl': '2rem',
      },
      // Box shadows for cards
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-best': '0 10px 15px -3px rgba(34, 197, 94, 0.1), 0 4px 6px -2px rgba(34, 197, 94, 0.05)',
      },
      // Breakpoints for layout mode detection
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px', // Layout mode breakpoint
        'xl': '1280px',
        '2xl': '1536px',
      },
    } 
  },
  plugins: [
    // Custom utilities plugin
    function({ addUtilities, theme }) {
      const utilities = {
        // Screen reader only class
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        '.sr-only-focusable:focus': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: 'initial',
          margin: 'initial',
          overflow: 'visible',
          clip: 'auto',
          whiteSpace: 'normal',
        },
        // Focus ring utilities
        '.focus-ring': {
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: `0 0 0 2px ${theme('colors.brand')}, 0 0 0 4px rgba(52, 199, 89, 0.1)`,
          },
        },
        '.focus-ring-error': {
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: `0 0 0 2px ${theme('colors.error.500')}, 0 0 0 4px ${theme('colors.error.100')}`,
          },
        },
        // Card utilities
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.card'),
          border: `1px solid ${theme('colors.gray.200')}`,
          transition: 'all 0.2s ease-in-out',
        },
        '.card:hover': {
          boxShadow: theme('boxShadow.card-hover'),
          borderColor: theme('colors.gray.300'),
        },
        '.card-best': {
          borderColor: theme('colors.success.300'),
          boxShadow: theme('boxShadow.card-best'),
          backgroundColor: theme('colors.success.50'),
        },
        // Button utilities
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: `0 0 0 2px ${theme('colors.primary.500')}, 0 0 0 4px ${theme('colors.primary.100')}`,
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.500'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.primary.600'),
          },
          '&:active:not(:disabled)': {
            backgroundColor: theme('colors.primary.700'),
          },
          '&:disabled': {
            backgroundColor: theme('colors.gray.300'),
            cursor: 'not-allowed',
          },
        },
        // Layout utilities
        '.container-responsive': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
        },
        '@screen sm': {
          '.container-responsive': {
            maxWidth: '640px',
          },
        },
        '@screen md': {
          '.container-responsive': {
            maxWidth: '768px',
          },
        },
        '@screen lg': {
          '.container-responsive': {
            maxWidth: '1024px',
            paddingLeft: theme('spacing.6'),
            paddingRight: theme('spacing.6'),
          },
        },
        '@screen xl': {
          '.container-responsive': {
            maxWidth: '1280px',
          },
        },
      };
      addUtilities(utilities);
    },
  ],
};
