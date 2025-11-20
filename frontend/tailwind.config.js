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
      // Toss-inspired color palette for professional, stable UI
      colors: {
        // Brand colors - Toss-style signature blue
        brand: {
          DEFAULT: '#3182F6',        // Toss signature blue
          50: '#EBF4FF',
          100: '#D1E9FF',
          200: '#B3DDFF',
          300: '#84C5FF',
          400: '#549DFF',
          500: '#3182F6',            // Primary
          600: '#1B6BE6',
          700: '#1557CF',
          800: '#1848A8',
          900: '#1A3D7C',
        },
        // Accent green - refined version
        accent: {
          DEFAULT: '#00C853',
          50: '#E8F9F0',
          100: '#C8F2DD',
          200: '#9EE7C5',
          300: '#6FD9AA',
          400: '#3FC98F',
          500: '#00C853',
          600: '#00B048',
          700: '#00983D',
          800: '#007F33',
          900: '#006629',
        },
        // Neutral grays - Toss-style
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          150: '#EBEDF0',           // Custom for borders
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Primary (kept for compatibility)
        primary: {
          50: '#EBF4FF',
          100: '#D1E9FF',
          200: '#B3DDFF',
          300: '#84C5FF',
          400: '#549DFF',
          500: '#3182F6',
          600: '#1B6BE6',
          700: '#1557CF',
          800: '#1848A8',
          900: '#1A3D7C',
        },
        success: {
          50: '#E8F9F0',
          100: '#C8F2DD',
          200: '#9EE7C5',
          300: '#6FD9AA',
          400: '#3FC98F',
          500: '#00C853',
          600: '#00B048',
          700: '#00983D',
          800: '#007F33',
          900: '#006629',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        }
      },
      // Toss-style professional animations
      animation: {
        // Fade animations
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-down': 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',

        // Slide animations
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',

        // Scale animations
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-up': 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',

        // Gentle pulsing
        'pulse-gentle': 'pulseGentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',

        // Shimmer effect for loading states
        'shimmer': 'shimmer 2s linear infinite',

        // Float animation for emphasis
        'float': 'float 3s ease-in-out infinite',

        // Bounce subtle
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
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
      // Toss-style consistent border radius
      borderRadius: {
        'sm': '8px',
        'DEFAULT': '12px',
        'md': '12px',
        'lg': '16px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
        'full': '9999px',
      },
      // Toss-style subtle shadows for depth
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        // 🎯 새로운 Toss-style shadows (하단 검정 착시 제거 버전)
        'toss-sm': '0 0 6px rgba(0, 0, 0, 0.05)',
        'toss': '0 0 12px rgba(0, 0, 0, 0.06)',
        'toss-lg': '0 0 20px rgba(0, 0, 0, 0.08)',
        'toss-xl': '0 0 32px rgba(0, 0, 0, 0.10)',

        // Card shadows
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        'card-best': '0 8px 24px 0 rgba(0, 200, 83, 0.16), 0 2px 8px 0 rgba(0, 200, 83, 0.08)',
        // Inner shadows
        'inner-sm': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
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
    function ({ addUtilities, theme }) {
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
