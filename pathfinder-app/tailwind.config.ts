import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // toggled by adding/removing .dark on <html> or <body>
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors (with alpha-value support for shadcn)
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",

        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },

        /* Optional */
        info: "hsl(var(--info) / <alpha-value>)",

        // Enhanced selection system
        selected: {
          DEFAULT: "hsl(var(--selected) / <alpha-value>)",
          foreground: "hsl(var(--selected-foreground) / <alpha-value>)",
          background: "hsl(var(--selected-bg) / <alpha-value>)",
        },
        
        // Interactive states
        hover: "hsl(var(--hover) / <alpha-value>)",
        active: "hsl(var(--active) / <alpha-value>)",
        
        // Enhanced card system
        "card-selected": {
          DEFAULT: "hsl(var(--card-selected) / <alpha-value>)",
          border: "hsl(var(--card-selected-border) / <alpha-value>)",
          "gradient-from": "hsl(var(--card-selected-gradient-from) / <alpha-value>)",
          "gradient-to": "hsl(var(--card-selected-gradient-to) / <alpha-value>)",
        },
        
        // Status system
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",

        // Unified popup theme system
        popup: {
          DEFAULT: "hsl(var(--popup-background) / <alpha-value>)",
          foreground: "hsl(var(--popup-foreground) / <alpha-value>)",
          muted: "hsl(var(--popup-muted) / <alpha-value>)",
          accent: "hsl(var(--popup-accent) / <alpha-value>)",
          border: "hsl(var(--popup-border) / <alpha-value>)",
        },

        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
        },

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
          500: '#B9A131', // Updated to match light theme ring color
          600: '#a68f2b',
          700: '#927419',
          800: '#785a1a',
          900: '#66481b',
        },
        olive: {
          50: '#f0f7f7',
          100: '#d9eceb',
          200: '#b6d7d5',
          300: '#8fbfbc',
          400: '#6ba5a1',
          500: '#2C6E6C', // Updated to match light theme accent color
          600: '#265a58',
          700: '#1f4847',
          800: '#1a3b3a',
          900: '#16302f',
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
        'selection-glow': 'selectionGlow 0.3s ease-out',
        'card-lift': 'cardLift 0.2s ease-out',
        'progress-fill': 'progressFill 0.5s ease-out',
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
        selectionGlow: {
          '0%': { boxShadow: '0 0 0 0 hsl(var(--selected) / 0.4)' },
          '100%': { boxShadow: '0 0 0 4px hsl(var(--selected) / 0.1)' },
        },
        cardLift: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-2px) scale(1.02)' },
        },
        progressFill: {
          '0%': { width: '0%', opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 14px rgba(0,0,0,.18)",
        card: "0 8px 24px rgba(0,0,0,.16)",
        'medium': '0 4px 25px -5px rgba(31, 58, 86, 0.12), 0 10px 30px -5px rgba(31, 58, 86, 0.08)',
        'large': '0 10px 40px -10px rgba(31, 58, 86, 0.15), 0 20px 50px -10px rgba(31, 58, 86, 0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
