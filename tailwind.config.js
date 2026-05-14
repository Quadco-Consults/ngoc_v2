/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NUIMS branding colors
        primary: {
          DEFAULT: '#00AD51',
          50: '#E6F7EF',
          100: '#CCEFDF',
          200: '#99DFBF',
          300: '#66CF9F',
          400: '#33BF7F',
          500: '#00AD51',
          600: '#008A41',
          700: '#006831',
          800: '#004521',
          900: '#002310',
        },
        secondary: {
          DEFAULT: '#00246B',
          50: '#E6EAF2',
          100: '#CCD5E5',
          200: '#99ABCB',
          300: '#6681B1',
          400: '#335797',
          500: '#00246B',
          600: '#001D56',
          700: '#001640',
          800: '#000E2B',
          900: '#000715',
        },
        accent: {
          DEFAULT: '#0D5EBA',
          50: '#E8F1FC',
          100: '#D1E3F9',
          200: '#A3C7F3',
          300: '#75ABED',
          400: '#478FE7',
          500: '#0D5EBA',
          600: '#0A4B95',
          700: '#083870',
          800: '#05254A',
          900: '#031225',
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        nuims: {
          'primary': '#00AD51',
          'secondary': '#00246B',
          'accent': '#0D5EBA',
          'neutral': '#2a323c',
          'base-100': '#ffffff',
          'info': '#3abff8',
          'success': '#36d399',
          'warning': '#fbbd23',
          'error': '#f87272',
        },
      },
    ],
  },
}
