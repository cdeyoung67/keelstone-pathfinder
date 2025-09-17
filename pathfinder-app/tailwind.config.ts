import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Keel Stone Brand Colors
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1F3A56', // Primary Deep Navy
        },
        slate: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#5A6670', // Primary Slate Gray
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        gold: {
          50: '#fefcf0',
          100: '#fef7d3',
          200: '#feecaa',
          300: '#fddb70',
          400: '#fbc638',
          500: '#C9A45C', // Warm Gold
          600: '#b8941f',
          700: '#927419',
          800: '#785a1a',
          900: '#66481b',
        },
        olive: {
          50: '#f6f8f4',
          100: '#e9f0e4',
          200: '#d4e1ca',
          300: '#b6cca5',
          400: '#94b37c',
          500: '#708C69', // Olive Green
          600: '#5a7355',
          700: '#485a45',
          800: '#3c4a39',
          900: '#343e32',
        },
        sand: {
          50: '#fdfcfa',
          100: '#F9F9F6', // Soft White
          200: '#f0ede4',
          300: '#e6dfd1',
          400: '#D9CBB4', // Sand Beige
          500: '#c8b896',
          600: '#b5a082',
          700: '#9a8570',
          800: '#7f6e5d',
          900: '#695c4e',
        },
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Lora', 'serif'],
        'sans': ['Inter', 'Open Sans', 'system-ui', 'sans-serif'],
        'quote': ['Lora', 'Playfair Display', 'serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'title': ['1.875rem', { lineHeight: '1.3' }],
        'subtitle': ['1.25rem', { lineHeight: '1.4' }],
        'quote': ['1.125rem', { lineHeight: '1.6', fontStyle: 'italic' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'gentle-pulse': 'gentlePulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gentlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(31, 58, 86, 0.08), 0 10px 20px -2px rgba(31, 58, 86, 0.04)',
        'medium': '0 4px 25px -5px rgba(31, 58, 86, 0.12), 0 10px 30px -5px rgba(31, 58, 86, 0.08)',
        'large': '0 10px 40px -10px rgba(31, 58, 86, 0.15), 0 20px 50px -10px rgba(31, 58, 86, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
