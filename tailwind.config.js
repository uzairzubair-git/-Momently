/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f7',
          100: '#ffe4e9',
          200: '#ffc9d4',
          300: '#ffa2b5',
          400: '#ff7092',
          500: '#fb4570',
          600: '#e82a5a',
          700: '#c31c48',
          800: '#a11a41',
          900: '#88193c',
        },
        sky: {
          50: '#f0f9ff',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
