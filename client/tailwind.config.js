/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['Roboto Condensed', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        pitch: {
          950: '#050709',
          900: '#0a0d12',
          800: '#111620',
          700: '#1a2133',
          600: '#232d42',
          500: '#2d3a52',
        },
        lime: {
          400: '#a3e635',
          500: '#84cc16',
          neon: '#c8ff00',
        },
        cyan: {
          neon: '#00f5ff',
          400: '#22d3ee',
        },
        ember: {
          500: '#f97316',
          600: '#ea580c',
        },
        ruby: {
          500: '#ef4444',
          600: '#dc2626',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      animation: {
        'pulse-live': 'pulse-live 1.5s ease-in-out infinite',
        'score-flash': 'score-flash 0.6s ease-out',
        'slide-in-top': 'slide-in-top 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.9)' },
        },
        'score-flash': {
          '0%': { backgroundColor: 'rgba(200, 255, 0, 0.4)', transform: 'scale(1.05)' },
          '100%': { backgroundColor: 'transparent', transform: 'scale(1)' },
        },
        'slide-in-top': {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(200, 255, 0, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(200, 255, 0, 0.7), 0 0 50px rgba(200, 255, 0, 0.3)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        'hero-gradient': 'linear-gradient(135deg, #0a0d12 0%, #111620 50%, #0a0d12 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(26,33,51,0.8) 0%, rgba(10,13,18,0.9) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        'live': '0 0 0 3px rgba(239,68,68,0.3)',
        'neon-lime': '0 0 20px rgba(200,255,0,0.4)',
        'neon-cyan': '0 0 20px rgba(0,245,255,0.4)',
      },
    },
  },
  plugins: [],
}
