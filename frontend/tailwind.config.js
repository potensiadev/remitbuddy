/**
 * RemitBuddy Tailwind Configuration
 *
 * Design Direction: "Trustworthy Global Finance"
 * Premium design system optimized for international remittance services
 * with multilingual support across Latin, CJK, and RTL scripts.
 */

module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        // Display font - bold, confident headers
        'display': ['Satoshi', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        // Body font - readable, clean
        'body': ['Satoshi', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        // Korean
        'korean': ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
        // Japanese
        'japanese': ['Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
        // Vietnamese
        'vietnamese': ['Be Vietnam Pro', '-apple-system', 'sans-serif'],
        // Thai
        'thai': ['Sarabun', 'Tahoma', 'sans-serif'],
        // Arabic/RTL
        'arabic': ['IBM Plex Sans Arabic', 'Arial', 'sans-serif'],
        // Monospace for numbers
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // Typography Scale (Modular Scale 1.25)
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
        // Special sizes for money display
        'money-sm': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.02em' }],
        'money-md': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        'money-lg': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        'money-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
      },

      // ============================================
      // COLOR PALETTE
      // ============================================
      colors: {
        // Brand Primary - Deep Ocean Blue (Trust, Stability)
        primary: {
          50: '#EEF4FF',
          100: '#D9E6FF',
          200: '#B8D0FF',
          300: '#85AEFF',
          400: '#4D7FFF',
          500: '#2563EB',   // Main
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
          950: '#0F172A',
        },

        // Accent - Emerald (Success, Growth, Money)
        accent: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',   // Main
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },

        // Gold - Premium, Savings highlight
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',   // Main
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // Neutral - Sophisticated grays
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F5F5F5',
          150: '#EEEEEE',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },

        // Semantic aliases
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
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
        },
        info: {
          50: '#EEF4FF',
          100: '#D9E6FF',
          200: '#B8D0FF',
          300: '#85AEFF',
          400: '#4D7FFF',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },

        // Legacy support (keeping old names working)
        brand: {
          DEFAULT: '#2563EB',
          50: '#EEF4FF',
          100: '#D9E6FF',
          200: '#B8D0FF',
          300: '#85AEFF',
          400: '#4D7FFF',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
          950: '#0F172A',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          150: '#EEEEEE',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },

      // ============================================
      // SPACING & LAYOUT
      // ============================================
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1.5': '0.375rem',  // 6px
        '2.5': '0.625rem',  // 10px
        '3.5': '0.875rem',  // 14px
        '18': '4.5rem',     // 72px
        '22': '5.5rem',     // 88px
        '26': '6.5rem',     // 104px
        '30': '7.5rem',     // 120px
        '88': '22rem',
        '128': '32rem',
      },

      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        'none': '0',
        'sm': '0.375rem',   // 6px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.75rem',    // 12px
        'lg': '1rem',       // 16px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '2rem',      // 32px
        'full': '9999px',
      },

      // ============================================
      // SHADOWS - Layered depth system
      // ============================================
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'DEFAULT': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'md': '0 6px 12px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'xl': '0 16px 32px rgba(0, 0, 0, 0.12)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.16)',
        '3xl': '0 32px 64px rgba(0, 0, 0, 0.2)',

        // Colored shadows
        'primary-sm': '0 2px 8px rgba(37, 99, 235, 0.2)',
        'primary': '0 4px 14px rgba(37, 99, 235, 0.25)',
        'primary-lg': '0 8px 24px rgba(37, 99, 235, 0.3)',

        'accent-sm': '0 2px 8px rgba(16, 185, 129, 0.2)',
        'accent': '0 4px 14px rgba(16, 185, 129, 0.25)',
        'accent-lg': '0 8px 24px rgba(16, 185, 129, 0.3)',

        'gold-sm': '0 2px 8px rgba(245, 158, 11, 0.2)',
        'gold': '0 4px 14px rgba(245, 158, 11, 0.25)',

        // Card shadows
        'card': '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)',
        'card-best': '0 8px 24px rgba(16, 185, 129, 0.16), 0 2px 8px rgba(16, 185, 129, 0.08)',
        'card-featured': '0 8px 24px rgba(245, 158, 11, 0.16), 0 2px 8px rgba(245, 158, 11, 0.08)',

        // Inner shadow
        'inner-sm': 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
        'inner': 'inset 0 2px 6px rgba(0, 0, 0, 0.06)',

        'none': 'none',
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        // Fade
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-down': 'fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',

        // Slide
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',

        // Scale
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-up': 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',

        // Continuous
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
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
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },

      // ============================================
      // TRANSITIONS
      // ============================================
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },

      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      // ============================================
      // BREAKPOINTS
      // ============================================
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Special breakpoints
        'mobile': { max: '767px' },
        'tablet': { min: '768px', max: '1023px' },
        'desktop': { min: '1024px' },
      },

      // ============================================
      // ASPECT RATIOS
      // ============================================
      aspectRatio: {
        'auto': 'auto',
        'square': '1 / 1',
        'video': '16 / 9',
        'card': '4 / 3',
        'portrait': '3 / 4',
        'wide': '21 / 9',
      },

      // ============================================
      // BACKDROP BLUR
      // ============================================
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },

  plugins: [
    // Custom utilities plugin
    function ({ addUtilities, addComponents, theme }) {
      // ============================================
      // UTILITY CLASSES
      // ============================================
      const utilities = {
        // Screen reader only
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

        // Focus ring
        '.focus-ring': {
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: `0 0 0 2px ${theme('colors.primary.500')}, 0 0 0 4px rgba(37, 99, 235, 0.1)`,
          },
        },

        // Text gradient
        '.text-gradient-primary': {
          background: `linear-gradient(135deg, ${theme('colors.primary.500')}, ${theme('colors.primary.700')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },

        '.text-gradient-accent': {
          background: `linear-gradient(135deg, ${theme('colors.accent.500')}, ${theme('colors.accent.700')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },

        // Money display
        '.font-money': {
          fontFamily: theme('fontFamily.display'),
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: theme('letterSpacing.tight'),
        },

        // Glass effect
        '.glass': {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
        },

        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
        },

        // Safe area
        '.safe-top': {
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
        },

        '.safe-bottom': {
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        },

        '.safe-x': {
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        },

        // Animation delays for staggered effects
        '.delay-75': { animationDelay: '75ms' },
        '.delay-100': { animationDelay: '100ms' },
        '.delay-150': { animationDelay: '150ms' },
        '.delay-200': { animationDelay: '200ms' },
        '.delay-250': { animationDelay: '250ms' },
        '.delay-300': { animationDelay: '300ms' },
        '.delay-400': { animationDelay: '400ms' },
        '.delay-500': { animationDelay: '500ms' },
      };

      // ============================================
      // COMPONENT CLASSES
      // ============================================
      const components = {
        // Button base
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.2'),
          fontFamily: theme('fontFamily.body'),
          fontWeight: theme('fontWeight.semibold'),
          borderRadius: theme('borderRadius.xl'),
          transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.primary.500')}`,
            outlineOffset: '2px',
          },
          '&:active:not(:disabled)': {
            transform: 'scale(0.98)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },

        '.btn-primary': {
          background: `linear-gradient(135deg, ${theme('colors.primary.500')} 0%, ${theme('colors.primary.600')} 100%)`,
          color: 'white',
          boxShadow: theme('boxShadow.primary'),
          '&:hover:not(:disabled)': {
            background: `linear-gradient(135deg, ${theme('colors.primary.600')} 0%, ${theme('colors.primary.700')} 100%)`,
            boxShadow: theme('boxShadow.primary-lg'),
            transform: 'translateY(-1px)',
          },
        },

        '.btn-accent': {
          background: `linear-gradient(135deg, ${theme('colors.accent.500')} 0%, ${theme('colors.accent.600')} 100%)`,
          color: 'white',
          boxShadow: theme('boxShadow.accent'),
          '&:hover:not(:disabled)': {
            background: `linear-gradient(135deg, ${theme('colors.accent.600')} 0%, ${theme('colors.accent.700')} 100%)`,
            boxShadow: theme('boxShadow.accent-lg'),
            transform: 'translateY(-1px)',
          },
        },

        '.btn-secondary': {
          background: theme('colors.neutral.100'),
          color: theme('colors.neutral.800'),
          '&:hover:not(:disabled)': {
            background: theme('colors.neutral.200'),
          },
        },

        '.btn-ghost': {
          background: 'transparent',
          color: theme('colors.neutral.700'),
          '&:hover:not(:disabled)': {
            background: theme('colors.neutral.100'),
          },
        },

        '.btn-outline': {
          background: 'transparent',
          color: theme('colors.primary.600'),
          border: `2px solid ${theme('colors.primary.500')}`,
          '&:hover:not(:disabled)': {
            background: theme('colors.primary.50'),
            borderColor: theme('colors.primary.600'),
          },
        },

        // Button sizes
        '.btn-sm': {
          height: '36px',
          padding: '0 16px',
          fontSize: theme('fontSize.sm')[0],
        },

        '.btn-md': {
          height: '44px',
          padding: '0 20px',
          fontSize: theme('fontSize.base')[0],
        },

        '.btn-lg': {
          height: '52px',
          padding: '0 24px',
          fontSize: theme('fontSize.lg')[0],
        },

        '.btn-xl': {
          height: '60px',
          padding: '0 32px',
          fontSize: theme('fontSize.xl')[0],
        },

        // Card
        '.card': {
          background: theme('colors.white'),
          borderRadius: theme('borderRadius.2xl'),
          border: `1px solid ${theme('colors.neutral.200')}`,
          boxShadow: theme('boxShadow.card'),
          transition: 'all 200ms ease-out',
        },

        '.card-hover': {
          '&:hover': {
            boxShadow: theme('boxShadow.card-hover'),
            borderColor: theme('colors.neutral.300'),
            transform: 'translateY(-2px)',
          },
        },

        '.card-best': {
          borderColor: theme('colors.accent.300'),
          background: `linear-gradient(135deg, ${theme('colors.accent.50')} 0%, white 100%)`,
          boxShadow: theme('boxShadow.card-best'),
        },

        '.card-featured': {
          borderColor: theme('colors.gold.300'),
          background: `linear-gradient(135deg, ${theme('colors.gold.50')} 0%, white 100%)`,
          boxShadow: theme('boxShadow.card-featured'),
        },

        // Input
        '.input': {
          width: '100%',
          height: '52px',
          padding: '0 16px',
          fontFamily: theme('fontFamily.body'),
          fontSize: theme('fontSize.base')[0],
          fontWeight: theme('fontWeight.medium'),
          color: theme('colors.neutral.900'),
          background: theme('colors.neutral.50'),
          border: `2px solid ${theme('colors.neutral.200')}`,
          borderRadius: theme('borderRadius.xl'),
          transition: 'all 150ms ease',
          outline: 'none',
          '&::placeholder': {
            color: theme('colors.neutral.400'),
          },
          '&:hover': {
            borderColor: theme('colors.neutral.300'),
          },
          '&:focus': {
            borderColor: theme('colors.primary.500'),
            background: 'white',
            boxShadow: `0 0 0 3px rgba(37, 99, 235, 0.1)`,
          },
        },

        '.input-error': {
          borderColor: theme('colors.error.500'),
          '&:focus': {
            boxShadow: `0 0 0 3px rgba(239, 68, 68, 0.1)`,
          },
        },

        '.input-lg': {
          height: '60px',
          fontSize: theme('fontSize.xl')[0],
          fontWeight: theme('fontWeight.bold'),
        },

        // Badge
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 12px',
          fontSize: theme('fontSize.xs')[0],
          fontWeight: theme('fontWeight.bold'),
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderRadius: theme('borderRadius.full'),
        },

        '.badge-primary': {
          background: theme('colors.primary.100'),
          color: theme('colors.primary.700'),
        },

        '.badge-accent': {
          background: theme('colors.accent.100'),
          color: theme('colors.accent.700'),
        },

        '.badge-gold': {
          background: theme('colors.gold.100'),
          color: theme('colors.gold.700'),
        },

        '.badge-best': {
          background: `linear-gradient(135deg, ${theme('colors.accent.500')}, ${theme('colors.accent.600')})`,
          color: 'white',
        },
      };

      addUtilities(utilities);
      addComponents(components);
    },
  ],
};
