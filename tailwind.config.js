/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#faf9f6',
          100: '#f4f1ea',
          200: '#e8e1d3',
        },
        ink: {
          900: '#1a1a2e',
          800: '#2d2d44',
          600: '#4a4a6a',
          400: '#7a7a9a',
        },
        gold: {
          400: '#d4a843',
          500: '#c49b3c',
          600: '#b08935',
        },
        stage: {
          red: '#c0392b',
          blue: '#2980b9',
        },
      },
      boxShadow: {
        soft: '0 2px 15px rgba(0,0,0,0.06)',
        card: '0 4px 24px rgba(0,0,0,0.08)',
        lifted: '0 8px 32px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse_gentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out forwards',
        'pulse-gentle': 'pulse_gentle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
