/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0e1a',
          secondary: '#111827',
          tertiary: '#1f2937',
        },
        accent: {
          green: '#00d4a1',
          'green-dark': '#00a880',
          blue: '#3b82f6',
          amber: '#f59e0b',
          red: '#ef4444',
        },
        text: {
          primary: '#f9fafb',
          secondary: '#9ca3af',
          muted: '#6b7280',
        },
        border: {
          DEFAULT: '#1f2937',
          light: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.8125rem', { lineHeight: '1.1875rem' }],
        xs: ['0.875rem', { lineHeight: '1.3rem' }],
        sm: ['1rem', { lineHeight: '1.55rem' }],
        base: ['1.125rem', { lineHeight: '1.75rem' }],
        lg: ['1.5rem', { lineHeight: '2rem' }],
        xl: ['2rem', { lineHeight: '2.5rem' }],
        '2xl': ['3rem', { lineHeight: '3.5rem' }],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '16px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.6)',
        glow: '0 0 20px rgba(0, 212, 161, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
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
      },
    },
  },
  plugins: [],
}
