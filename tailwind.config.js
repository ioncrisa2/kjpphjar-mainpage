/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

const rotateX = plugin(function ({ addUtilities }) {
  addUtilities({
    '.rotate-y-180': {
      transform: 'rotateY(180deg)',
    },
  })
})

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    screens: {
      xm: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1142px',
    },
    fontFamily: {
      mulish: ['Mulish', 'sans-serif'],
      reey: ['reey', 'sans-serif'],
    },
    extend: {
      colors: {
        black: '#08111F',
        primary: '#47BDFF',
        secondary: '#B476E5',
        gray: {
          DEFAULT: '#7780A1',
          dark: '#1C2331',
        },
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.3s ease',
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
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.DEFAULT'),
            fontSize: '1.125rem',
          },
        },
      }),
    },
  },
  plugins: [rotateX, require('@tailwindcss/typography')],
}
